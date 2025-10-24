/**
 * Open Product Database API
 * 
 * Free, community-driven product database
 * Uses multiple open sources:
 * - Open Product Data (https://openproductdata.org/)
 * - Product Open Data (community catalog)
 * 
 * No API key required - completely free
 */

interface OpenProductSearchParams {
  keywords: string;
  category?: string;
  maxResults?: number;
}

interface OpenProduct {
  id: string;
  title: string;
  brand?: string;
  model?: string;
  price?: number;
  imageUrl?: string;
  detailPageUrl?: string;
  features?: string[];
  source: string;
}

class OpenProductAPI {
  private baseUrl = 'https://api.openproductdata.org/v1';

  isConfigured(): boolean {
    return true; // Always available - no API key needed
  }

  /**
   * Search for products by keywords
   */
  async searchProducts(params: OpenProductSearchParams): Promise<OpenProduct[]> {
    try {
      // Search our internal catalog first
      const internalResults = await this.searchInternalCatalog(params);
      
      // Then try external open sources
      const externalResults = await this.searchExternalSources(params);
      
      // Combine and deduplicate
      const combined = [...internalResults, ...externalResults];
      const unique = this.deduplicateResults(combined);
      
      return unique.slice(0, params.maxResults || 10);
    } catch (error) {
      console.error('Open Product API error:', error);
      return [];
    }
  }

  /**
   * Search internal community catalog
   * This searches equipment that other teams have added
   */
  private async searchInternalCatalog(params: OpenProductSearchParams): Promise<OpenProduct[]> {
    // This would query our equipment_catalog table
    // For now, return empty array - will be implemented when catalog is populated
    return [];
  }

  /**
   * Search external open product databases
   */
  private async searchExternalSources(params: OpenProductSearchParams): Promise<OpenProduct[]> {
    try {
      // Try Open Product Data API
      const queryParams = new URLSearchParams({
        q: params.keywords,
        limit: (params.maxResults || 10).toString()
      });

      if (params.category) {
        queryParams.set('category', params.category);
      }

      const response = await fetch(`${this.baseUrl}/products/search?${queryParams}`, {
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'CosPlan-Equipment-Search/1.0'
        }
      });

      if (!response.ok) {
        // If external API fails, return empty array (graceful degradation)
        return [];
      }

      const data = await response.json();
      return this.parseSearchResponse(data);
    } catch (error) {
      // Graceful degradation - don't throw, just return empty
      console.warn('External product search unavailable:', error);
      return [];
    }
  }

  private parseSearchResponse(data: any): OpenProduct[] {
    const products = data.products || data.results || [];
    
    return products.map((item: any) => ({
      id: item.id || item.sku || item.barcode,
      title: item.name || item.title,
      brand: item.brand || item.manufacturer,
      model: item.model || item.modelNumber,
      price: item.price,
      imageUrl: item.image || item.imageUrl,
      detailPageUrl: item.url,
      features: item.features || item.description ? [item.description] : [],
      source: 'open-product-data'
    }));
  }

  private deduplicateResults(products: OpenProduct[]): OpenProduct[] {
    const seen = new Set<string>();
    return products.filter(product => {
      const key = `${product.brand}-${product.model}`.toLowerCase();
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
  }

  /**
   * Create a manual entry for the catalog
   * This allows users to contribute to the community database
   */
  createManualEntry(product: Partial<OpenProduct>): OpenProduct {
    return {
      id: crypto.randomUUID(),
      title: product.title || '',
      brand: product.brand,
      model: product.model,
      price: product.price,
      imageUrl: product.imageUrl,
      features: product.features || [],
      source: 'manual-entry'
    };
  }
}

export const openProductAPI = new OpenProductAPI();
export type { OpenProduct, OpenProductSearchParams };
