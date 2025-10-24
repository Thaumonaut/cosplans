/**
 * Unified Product Search Service
 * 
 * Aggregates results from multiple product APIs:
 * - Amazon Product Advertising API
 * - B&H Photo API
 * - Open Product Database
 * 
 * Allows users to choose their preferred source or search all
 */

import { amazonProductAPI, type AmazonProduct } from './amazon-product-api';
import { bhPhotoAPI, type BHProduct } from './bh-photo-api';
import { openProductAPI, type OpenProduct } from './open-product-api';

export type ProductSource = 'amazon' | 'bh-photo' | 'open' | 'all';

export interface UnifiedProduct {
  source: string;
  sourceId: string;
  name: string;
  brand?: string;
  model?: string;
  price?: number;
  imageUrl?: string;
  purchaseUrl?: string;
  features?: string[];
  inStock?: boolean;
}

interface ProductSearchParams {
  keywords: string;
  category?: string;
  source?: ProductSource;
  maxResults?: number;
}

class ProductSearchService {
  /**
   * Search for products across one or all sources
   */
  async search(params: ProductSearchParams): Promise<UnifiedProduct[]> {
    const source = params.source || 'all';
    const maxPerSource = params.maxResults || 10;

    try {
      if (source === 'all') {
        return await this.searchAllSources(params, maxPerSource);
      }

      return await this.searchSingleSource(source, params, maxPerSource);
    } catch (error) {
      console.error('Product search error:', error);
      return [];
    }
  }

  /**
   * Get available sources and their status
   */
  getAvailableSources(): Array<{ id: ProductSource; name: string; available: boolean; description: string }> {
    return [
      {
        id: 'amazon',
        name: 'Amazon',
        available: amazonProductAPI.isConfigured(),
        description: 'Broad selection, competitive pricing, affiliate earnings'
      },
      {
        id: 'bh-photo',
        name: 'B&H Photo',
        available: bhPhotoAPI.isConfigured(),
        description: 'Professional photo/video equipment, expert reviews'
      },
      {
        id: 'open',
        name: 'Open Database',
        available: openProductAPI.isConfigured(),
        description: 'Free community catalog, no API key needed'
      },
      {
        id: 'all',
        name: 'All Sources',
        available: true,
        description: 'Search all available sources simultaneously'
      }
    ];
  }

  private async searchAllSources(params: ProductSearchParams, maxPerSource: number): Promise<UnifiedProduct[]> {
    const searches = await Promise.allSettled([
      this.searchAmazon(params, maxPerSource),
      this.searchBHPhoto(params, maxPerSource),
      this.searchOpenDB(params, maxPerSource)
    ]);

    const results: UnifiedProduct[] = [];
    
    searches.forEach(result => {
      if (result.status === 'fulfilled') {
        results.push(...result.value);
      }
    });

    // Deduplicate and sort by relevance
    return this.deduplicateAndSort(results).slice(0, params.maxResults || 30);
  }

  private async searchSingleSource(
    source: ProductSource,
    params: ProductSearchParams,
    maxResults: number
  ): Promise<UnifiedProduct[]> {
    switch (source) {
      case 'amazon':
        return this.searchAmazon(params, maxResults);
      case 'bh-photo':
        return this.searchBHPhoto(params, maxResults);
      case 'open':
        return this.searchOpenDB(params, maxResults);
      default:
        return [];
    }
  }

  private async searchAmazon(params: ProductSearchParams, maxResults: number): Promise<UnifiedProduct[]> {
    if (!amazonProductAPI.isConfigured()) {
      return [];
    }

    const products = await amazonProductAPI.searchProducts({
      keywords: params.keywords,
      category: params.category,
      maxResults
    });

    return products.map(p => this.normalizeAmazonProduct(p));
  }

  private async searchBHPhoto(params: ProductSearchParams, maxResults: number): Promise<UnifiedProduct[]> {
    if (!bhPhotoAPI.isConfigured()) {
      return [];
    }

    const products = await bhPhotoAPI.searchProducts({
      keywords: params.keywords,
      category: params.category,
      maxResults
    });

    return products.map(p => this.normalizeBHProduct(p));
  }

  private async searchOpenDB(params: ProductSearchParams, maxResults: number): Promise<UnifiedProduct[]> {
    const products = await openProductAPI.searchProducts({
      keywords: params.keywords,
      category: params.category,
      maxResults
    });

    return products.map(p => this.normalizeOpenProduct(p));
  }

  private normalizeAmazonProduct(product: AmazonProduct): UnifiedProduct {
    return {
      source: 'Amazon',
      sourceId: product.asin,
      name: product.title,
      brand: product.brand,
      model: product.model,
      price: product.price,
      imageUrl: product.imageUrl,
      purchaseUrl: product.detailPageUrl,
      features: product.features
    };
  }

  private normalizeBHProduct(product: BHProduct): UnifiedProduct {
    return {
      source: 'B&H Photo',
      sourceId: product.sku,
      name: product.title,
      brand: product.brand,
      model: product.model,
      price: product.price,
      imageUrl: product.imageUrl,
      purchaseUrl: product.detailPageUrl,
      features: product.features,
      inStock: product.inStock
    };
  }

  private normalizeOpenProduct(product: OpenProduct): UnifiedProduct {
    return {
      source: 'Open Database',
      sourceId: product.id,
      name: product.title,
      brand: product.brand,
      model: product.model,
      price: product.price,
      imageUrl: product.imageUrl,
      purchaseUrl: product.detailPageUrl,
      features: product.features
    };
  }

  private deduplicateAndSort(products: UnifiedProduct[]): UnifiedProduct[] {
    // Deduplicate by brand + model
    const seen = new Map<string, UnifiedProduct>();
    
    products.forEach(product => {
      const key = `${product.brand || ''}-${product.model || ''}`.toLowerCase();
      
      if (!seen.has(key)) {
        seen.set(key, product);
      } else {
        // Keep the one with more information
        const existing = seen.get(key)!;
        if (this.scoreProduct(product) > this.scoreProduct(existing)) {
          seen.set(key, product);
        }
      }
    });

    return Array.from(seen.values()).sort((a, b) => {
      // Prioritize products with images and prices
      return this.scoreProduct(b) - this.scoreProduct(a);
    });
  }

  private scoreProduct(product: UnifiedProduct): number {
    let score = 0;
    if (product.imageUrl) score += 2;
    if (product.price) score += 2;
    if (product.brand) score += 1;
    if (product.model) score += 1;
    if (product.features && product.features.length > 0) score += 1;
    return score;
  }
}

export const productSearchService = new ProductSearchService();
