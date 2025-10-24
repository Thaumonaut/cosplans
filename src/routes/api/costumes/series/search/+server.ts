import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { costumeService } from '$lib/server/resources/costume-service';
import { searchAniList } from '$lib/server/external-apis/anilist';
import { searchRAWG } from '$lib/server/external-apis/rawg';
import { searchTMDB } from '$lib/server/external-apis/tmdb';
import { searchGoogleBooks } from '$lib/server/external-apis/google-books';

export const GET: RequestHandler = async ({ url, locals }) => {
  const { session } = await locals.safeGetSession();
  
  if (!session) {
    return json({ error: 'Unauthorized' }, { status: 401 });
  }

  const query = url.searchParams.get('q') || '';
  const limit = parseInt(url.searchParams.get('limit') || '10');

  if (query.length < 2) {
    return json({ results: [] });
  }

  try {
    // Get unique series from existing costumes (higher priority)
    const existingSeries = await costumeService.searchSeries(query, Math.ceil(limit / 2));
    
    // Search external APIs in parallel (lower priority, fill remaining slots)
    const remainingSlots = limit - existingSeries.length;
    
    if (remainingSlots > 0) {
      const externalSearches = await Promise.allSettled([
        searchAniList(query, 5),
        searchRAWG(query, 5),
        searchTMDB(query, 5),
        searchGoogleBooks(query, 5)
      ]);

      const externalResults: string[] = [];
      const seenLower = new Set(existingSeries.map(s => s.toLowerCase()));

      for (const result of externalSearches) {
        if (result.status === 'fulfilled') {
          for (const series of result.value) {
            const lowerSeries = series.toLowerCase();
            if (!seenLower.has(lowerSeries)) {
              externalResults.push(series);
              seenLower.add(lowerSeries);
              
              if (externalResults.length >= remainingSlots) break;
            }
          }
        }
        if (externalResults.length >= remainingSlots) break;
      }

      return json({
        results: [...existingSeries, ...externalResults],
        sources: ['database', 'anilist', 'rawg', 'tmdb', 'google-books']
      });
    }
    
    return json({
      results: existingSeries,
      sources: ['database']
    });
  } catch (error) {
    console.error('Series search error:', error);
    return json({ error: 'Failed to search series' }, { status: 500 });
  }
};

