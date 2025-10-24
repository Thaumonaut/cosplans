/**
 * Google Books API - Book series and titles
 * No API key required for basic searches, but recommended for higher quotas
 * Optional: Set GOOGLE_BOOKS_API_KEY in environment variables
 */

function getAPIKey(): string | undefined {
  try {
    return process.env.GOOGLE_BOOKS_API_KEY;
  } catch {
    return undefined;
  }
}

export async function searchGoogleBooks(query: string, limit = 10): Promise<string[]> {
  const GOOGLE_BOOKS_API_KEY = getAPIKey();
  
  try {
    const params = new URLSearchParams({
      q: query,
      maxResults: limit.toString(),
      printType: 'books'
    });

    if (GOOGLE_BOOKS_API_KEY) {
      params.set('key', GOOGLE_BOOKS_API_KEY);
    }

    const response = await fetch(`https://www.googleapis.com/books/v1/volumes?${params}`);

    if (!response.ok) {
      console.error('Google Books API error:', response.status);
      return [];
    }

    const data = await response.json();
    
    if (!data.items) {
      return [];
    }

    // Extract unique series names and book titles
    const titles = new Set<string>();

    for (const item of data.items) {
      const volumeInfo = item.volumeInfo;
      
      // Prefer series name if available
      if (volumeInfo.seriesInfo?.bookDisplayName) {
        titles.add(volumeInfo.seriesInfo.bookDisplayName);
      } else if (volumeInfo.title) {
        titles.add(volumeInfo.title);
      }

      if (titles.size >= limit) break;
    }

    return Array.from(titles);
  } catch (error) {
    console.error('Google Books search error:', error);
    return [];
  }
}

