/**
 * RAWG API - Video Game Database
 * Free API key required: https://rawg.io/apidocs
 * Set RAWG_API_KEY in environment variables
 */

function getAPIKey(): string | undefined {
  try {
    return process.env.RAWG_API_KEY;
  } catch {
    return undefined;
  }
}

export async function searchRAWG(query: string, limit = 10): Promise<string[]> {
  const RAWG_API_KEY = getAPIKey();
  
  if (!RAWG_API_KEY) {
    return [];
  }

  try {
    const params = new URLSearchParams({
      key: RAWG_API_KEY,
      search: query,
      page_size: limit.toString(),
      ordering: '-relevance'
    });

    const response = await fetch(`https://api.rawg.io/api/games?${params}`);

    if (!response.ok) {
      console.error('RAWG API error:', response.status);
      return [];
    }

    const data = await response.json();
    
    if (!data.results) {
      return [];
    }

    return data.results
      .map((game: any) => game.name)
      .filter((name: string) => name);
  } catch (error) {
    console.error('RAWG search error:', error);
    return [];
  }
}

