/**
 * TMDB API - Movies and TV Shows Database
 * Free API key required: https://www.themoviedb.org/settings/api
 * Set TMDB_API_KEY in environment variables
 */

function getAPIKey(): string | undefined {
  try {
    return process.env.TMDB_API_KEY;
  } catch {
    return undefined;
  }
}

export async function searchTMDB(query: string, limit = 10): Promise<string[]> {
  const TMDB_API_KEY = getAPIKey();
  
  if (!TMDB_API_KEY) {
    return [];
  }

  try {
    const params = new URLSearchParams({
      api_key: TMDB_API_KEY,
      query: query,
      page: '1'
    });

    // Search both movies and TV shows
    const [moviesResponse, tvResponse] = await Promise.all([
      fetch(`https://api.themoviedb.org/3/search/movie?${params}`),
      fetch(`https://api.themoviedb.org/3/search/tv?${params}`)
    ]);

    const results: string[] = [];

    if (moviesResponse.ok) {
      const moviesData = await moviesResponse.json();
      results.push(
        ...moviesData.results
          .slice(0, Math.ceil(limit / 2))
          .map((movie: any) => movie.title)
          .filter((title: string) => title)
      );
    }

    if (tvResponse.ok) {
      const tvData = await tvResponse.json();
      results.push(
        ...tvData.results
          .slice(0, Math.ceil(limit / 2))
          .map((show: any) => show.name)
          .filter((name: string) => name)
      );
    }

    return results.slice(0, limit);
  } catch (error) {
    console.error('TMDB search error:', error);
    return [];
  }
}

