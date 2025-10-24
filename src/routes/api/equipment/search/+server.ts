import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { productSearchService, type ProductSource } from '$lib/server/external/product-search-service';

/**
 * Equipment Search API Endpoint
 * 
 * Searches for equipment using multiple external APIs:
 * - Amazon Product Advertising API
 * - B&H Photo API
 * - Open Product Database
 * 
 * Query params:
 * - q: search query (required)
 * - category: equipment category (optional)
 * - source: amazon | bh-photo | open | all (default: all)
 * - limit: max results (default: 10)
 */
export const GET: RequestHandler = async ({ url, locals }) => {
  // Verify authentication
  const { session } = await locals.safeGetSession();
  if (!session) {
    return json({ error: 'Unauthorized' }, { status: 401 });
  }

  const query = url.searchParams.get('q');
  const category = url.searchParams.get('category') || undefined;
  const source = (url.searchParams.get('source') || 'all') as ProductSource;
  const limit = parseInt(url.searchParams.get('limit') || '10');

  if (!query || query.trim().length < 2) {
    return json({ error: 'Query must be at least 2 characters' }, { status: 400 });
  }

  try {
    // Search using unified product search service
    const products = await productSearchService.search({
      keywords: query,
      category,
      source,
      maxResults: limit
    });

    // Transform to equipment-friendly format
    const results = products.map(product => ({
      source: product.source,
      sourceId: product.sourceId,
      name: product.name,
      brand: product.brand,
      model: product.model,
      estimatedPurchasePrice: product.price,
      imageUrl: product.imageUrl,
      purchaseUrl: product.purchaseUrl,
      inStock: product.inStock,
      specifications: {
        features: product.features
      }
    }));

    return json({
      results,
      count: results.length,
      query,
      category,
      source
    });
  } catch (error) {
    console.error('Equipment search error:', error);
    return json(
      { error: 'Failed to search equipment' },
      { status: 500 }
    );
  }
};
