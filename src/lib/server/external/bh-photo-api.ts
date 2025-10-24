/**
 * B&H Photo API Integration
 * 
 * Provides product search for photography and video equipment
 * Requires: B&H API key (business partnership required)
 * 
 * Setup:
 * 1. Contact B&H for API access: https://www.bhphotovideo.com/find/api.jsp
 * 2. Add credentials to .env:
 *    - BH_API_KEY
 *    - BH_AFFILIATE_ID (optional)
 */

interface BHProductSearchParams {
  keywords: string;
  category?: string;
  maxResults?: number;
}

interface BHProduct {
  sku: string;
  title: string;
  brand?: string;
  model?: string;
  price?: number;
  imageUrl?: string;
  detailPageUrl: string;
  features?: string[];
  inStock?: boolean;
}

class BHPhotoAPI {
  private apiKey: string;
  private affiliateId: string;
  private baseUrl = 'https://www.bhphotovideo.com/api/v1';

  constructor() {
    this.apiKey = process.env.BH_API_KEY || '';
    this.affiliateId = process.env.BH_AFFILIATE_ID || '';
  }

  isConfigured(): boolean {
    return !!this.apiKey;
  }

  /**
   * Search for products by keywords
   */
  async searchProducts(params: BHProductSearchParams): Promise<BHProduct[]> {
    if (!this.isConfigured()) {
      console.warn('B&H Photo API not configured');
      return [];
    }

    try {
      const queryParams = new URLSearchParams({
        apiKey: this.apiKey,
        search: params.keywords,
        pageSize: (params.maxResults || 10).toString()
      });

      if (params.category) {
        queryParams.set('category', this.mapCategory(params.category));
      }

      const response = await fetch(`${this.baseUrl}/search?${queryParams}`, {
        headers: {
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`B&H API error: ${response.statusText}`);
      }

      const data = await response.json();
      return this.parseSearchResponse(data);
    } catch (error) {
      console.error('B&H Photo API error:', error);
      return [];
    }
  }

  /**
   * Get detailed product information by SKU
   */
  async getProductDetails(sku: string): Promise<BHProduct | null> {
    if (!this.isConfigured()) {
      return null;
    }

    try {
      const response = await fetch(`${this.baseUrl}/product/${sku}?apiKey=${this.apiKey}`, {
        headers: {
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`B&H API error: ${response.statusText}`);
      }

      const data = await response.json();
      return this.parseProduct(data);
    } catch (error) {
      console.error('B&H Photo API error:', error);
      return null;
    }
  }

  private mapCategory(category: string): string {
    const categoryMap: Record<string, string> = {
      'camera': 'Cameras',
      'lens': 'Lenses',
      'lighting': 'Lighting & Studio',
      'audio': 'Audio',
      'tripod': 'Tripods & Support',
      'backdrop': 'Backgrounds & Backdrops'
    };

    return categoryMap[category] || '';
  }

  private parseSearchResponse(data: any): BHProduct[] {
    const products = data.products || [];
    return products.map((item: any) => this.parseProduct(item));
  }

  private parseProduct(item: any): BHProduct {
    const affiliateUrl = this.affiliateId 
      ? `${item.url}?BI=${this.affiliateId}`
      : item.url;

    return {
      sku: item.sku,
      title: item.name || item.title,
      brand: item.manufacturer || item.brand,
      model: item.modelNumber || item.model,
      price: item.price?.amount,
      imageUrl: item.images?.[0]?.url || item.imageUrl,
      detailPageUrl: affiliateUrl,
      features: item.features || [],
      inStock: item.availability?.inStock
    };
  }
}

export const bhPhotoAPI = new BHPhotoAPI();
export type { BHProduct, BHProductSearchParams };
