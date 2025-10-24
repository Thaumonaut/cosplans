/**
 * Amazon Product Advertising API Integration
 * 
 * Provides product search and details for equipment
 * Requires: Amazon Associates account and API credentials
 * 
 * Setup:
 * 1. Sign up for Amazon Associates: https://affiliate-program.amazon.com/
 * 2. Request Product Advertising API access
 * 3. Add credentials to .env:
 *    - AMAZON_ACCESS_KEY
 *    - AMAZON_SECRET_KEY
 *    - AMAZON_ASSOCIATE_TAG
 */

import crypto from 'crypto';

interface AmazonProductSearchParams {
  keywords: string;
  category?: string;
  maxResults?: number;
}

interface AmazonProduct {
  asin: string;
  title: string;
  brand?: string;
  model?: string;
  price?: number;
  imageUrl?: string;
  detailPageUrl: string;
  features?: string[];
}

class AmazonProductAPI {
  private accessKey: string;
  private secretKey: string;
  private associateTag: string;
  private region = 'us-east-1';
  private host = 'webservices.amazon.com';
  private endpoint = '/paapi5/searchitems';

  constructor() {
    this.accessKey = process.env.AMAZON_ACCESS_KEY || '';
    this.secretKey = process.env.AMAZON_SECRET_KEY || '';
    this.associateTag = process.env.AMAZON_ASSOCIATE_TAG || '';
  }

  isConfigured(): boolean {
    return !!(this.accessKey && this.secretKey && this.associateTag);
  }

  /**
   * Search for products by keywords
   */
  async searchProducts(params: AmazonProductSearchParams): Promise<AmazonProduct[]> {
    if (!this.isConfigured()) {
      console.warn('Amazon Product API not configured');
      return [];
    }

    try {
      // Map equipment categories to Amazon search indexes
      const searchIndex = this.mapCategoryToSearchIndex(params.category);
      
      const requestBody = {
        Keywords: params.keywords,
        SearchIndex: searchIndex,
        ItemCount: params.maxResults || 10,
        PartnerTag: this.associateTag,
        PartnerType: 'Associates',
        Resources: [
          'Images.Primary.Large',
          'ItemInfo.Title',
          'ItemInfo.ByLineInfo',
          'ItemInfo.Features',
          'Offers.Listings.Price'
        ]
      };

      const response = await this.makeRequest(requestBody);
      return this.parseSearchResponse(response);
    } catch (error) {
      console.error('Amazon Product API error:', error);
      return [];
    }
  }

  /**
   * Get detailed product information by ASIN
   */
  async getProductDetails(asin: string): Promise<AmazonProduct | null> {
    if (!this.isConfigured()) {
      return null;
    }

    try {
      const requestBody = {
        ItemIds: [asin],
        PartnerTag: this.associateTag,
        PartnerType: 'Associates',
        Resources: [
          'Images.Primary.Large',
          'ItemInfo.Title',
          'ItemInfo.ByLineInfo',
          'ItemInfo.Features',
          'ItemInfo.TechnicalInfo',
          'Offers.Listings.Price'
        ]
      };

      const response = await this.makeRequest(requestBody, '/paapi5/getitems');
      const products = this.parseSearchResponse(response);
      return products[0] || null;
    } catch (error) {
      console.error('Amazon Product API error:', error);
      return null;
    }
  }

  private mapCategoryToSearchIndex(category?: string): string {
    const categoryMap: Record<string, string> = {
      'camera': 'Electronics',
      'lens': 'Electronics',
      'lighting': 'Electronics',
      'audio': 'Electronics',
      'tripod': 'Electronics',
      'backdrop': 'ArtsAndCrafts',
      'other': 'All'
    };

    return categoryMap[category || 'other'] || 'All';
  }

  private async makeRequest(body: any, endpoint?: string): Promise<any> {
    const url = `https://${this.host}${endpoint || this.endpoint}`;
    const timestamp = new Date().toISOString();
    
    // Amazon requires AWS Signature Version 4
    const signature = this.generateSignature(body, timestamp, endpoint || this.endpoint);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Amz-Date': timestamp,
        'Authorization': signature,
        'X-Amz-Target': 'com.amazon.paapi5.v1.ProductAdvertisingAPIv1.SearchItems',
        'Content-Encoding': 'amz-1.0'
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      throw new Error(`Amazon API error: ${response.statusText}`);
    }

    return response.json();
  }

  private generateSignature(body: any, timestamp: string, endpoint: string): string {
    // AWS Signature Version 4 signing process
    // This is a simplified version - full implementation needed for production
    const bodyHash = crypto
      .createHash('sha256')
      .update(JSON.stringify(body))
      .digest('hex');

    const canonicalRequest = [
      'POST',
      endpoint,
      '',
      `host:${this.host}`,
      `x-amz-date:${timestamp}`,
      '',
      'host;x-amz-date',
      bodyHash
    ].join('\n');

    const stringToSign = [
      'AWS4-HMAC-SHA256',
      timestamp,
      `${timestamp.split('T')[0]}/${this.region}/ProductAdvertisingAPI/aws4_request`,
      crypto.createHash('sha256').update(canonicalRequest).digest('hex')
    ].join('\n');

    // Generate signing key
    const kDate = crypto.createHmac('sha256', `AWS4${this.secretKey}`).update(timestamp.split('T')[0]).digest();
    const kRegion = crypto.createHmac('sha256', kDate).update(this.region).digest();
    const kService = crypto.createHmac('sha256', kRegion).update('ProductAdvertisingAPI').digest();
    const kSigning = crypto.createHmac('sha256', kService).update('aws4_request').digest();

    const signature = crypto.createHmac('sha256', kSigning).update(stringToSign).digest('hex');

    return `AWS4-HMAC-SHA256 Credential=${this.accessKey}/${timestamp.split('T')[0]}/${this.region}/ProductAdvertisingAPI/aws4_request, SignedHeaders=host;x-amz-date, Signature=${signature}`;
  }

  private parseSearchResponse(response: any): AmazonProduct[] {
    const items = response.SearchResult?.Items || response.ItemsResult?.Items || [];
    
    return items.map((item: any) => ({
      asin: item.ASIN,
      title: item.ItemInfo?.Title?.DisplayValue || '',
      brand: item.ItemInfo?.ByLineInfo?.Brand?.DisplayValue,
      model: item.ItemInfo?.ByLineInfo?.Model?.DisplayValue,
      price: item.Offers?.Listings?.[0]?.Price?.Amount,
      imageUrl: item.Images?.Primary?.Large?.URL,
      detailPageUrl: item.DetailPageURL || `https://www.amazon.com/dp/${item.ASIN}?tag=${this.associateTag}`,
      features: item.ItemInfo?.Features?.DisplayValues || []
    }));
  }
}

export const amazonProductAPI = new AmazonProductAPI();
export type { AmazonProduct, AmazonProductSearchParams };
