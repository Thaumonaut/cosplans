import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

interface CharacterResult {
  name: string;
  series?: string;
  sourceMedia?: string;
  imageUrl?: string;
}

async function searchAniListCharacters(query: string, limit = 5): Promise<CharacterResult[]> {
  const graphqlQuery = `
    query ($search: String, $perPage: Int) {
      Page(perPage: $perPage) {
        characters(search: $search) {
          name {
            full
          }
          image {
            medium
          }
          media(perPage: 1, sort: POPULARITY_DESC) {
            nodes {
              title {
                romaji
                english
              }
              type
            }
          }
        }
      }
    }
  `;

  try {
    const response = await fetch('https://graphql.anilist.co', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        query: graphqlQuery,
        variables: { 
          search: query,
          perPage: limit 
        }
      })
    });

    if (!response.ok) {
      console.error('AniList API error:', response.status);
      return [];
    }

    const data = await response.json();
    
    if (!data.data?.Page?.characters) {
      return [];
    }

    return data.data.Page.characters.map((char: any) => {
      const media = char.media?.nodes?.[0];
      return {
        name: char.name.full,
        series: media ? (media.title.english || media.title.romaji) : undefined,
        sourceMedia: media?.type === 'ANIME' ? 'anime' : media?.type === 'MANGA' ? 'manga' : undefined,
        imageUrl: char.image?.medium
      };
    }).filter((char: CharacterResult) => char.name);
  } catch (error) {
    console.error('AniList character search error:', error);
    return [];
  }
}

async function searchRAWGCharacters(query: string, limit = 5): Promise<CharacterResult[]> {
  const RAWG_API_KEY = process.env.RAWG_API_KEY;
  
  if (!RAWG_API_KEY) {
    return [];
  }

  try {
    // Search for games matching the character name
    const params = new URLSearchParams({
      key: RAWG_API_KEY,
      search: query,
      page_size: limit.toString()
    });

    const response = await fetch(`https://api.rawg.io/api/games?${params}`);

    if (!response.ok) {
      return [];
    }

    const data = await response.json();
    
    if (!data.results) {
      return [];
    }

    // For video games, often the character name IS the game name (e.g., "Sonic", "Mario")
    return data.results.slice(0, 3).map((game: any) => ({
      name: query, // Use searched character name
      series: game.name,
      sourceMedia: 'video-game',
      imageUrl: game.background_image
    }));
  } catch (error) {
    console.error('RAWG character search error:', error);
    return [];
  }
}

async function searchTMDBCharacters(query: string, limit = 5): Promise<CharacterResult[]> {
  const TMDB_API_KEY = process.env.TMDB_API_KEY;
  
  if (!TMDB_API_KEY) {
    return [];
  }

  try {
    const params = new URLSearchParams({
      api_key: TMDB_API_KEY,
      query: query
    });

    // Search for people/characters
    const response = await fetch(`https://api.themoviedb.org/3/search/person?${params}`);

    if (!response.ok) {
      return [];
    }

    const data = await response.json();
    
    if (!data.results) {
      return [];
    }

    return data.results.slice(0, limit).map((person: any) => {
      const knownFor = person.known_for?.[0];
      return {
        name: person.name,
        series: knownFor ? (knownFor.title || knownFor.name) : undefined,
        sourceMedia: knownFor?.media_type === 'movie' ? 'movie' : knownFor?.media_type === 'tv' ? 'tv-show' : undefined,
        imageUrl: person.profile_path ? `https://image.tmdb.org/t/p/w185${person.profile_path}` : undefined
      };
    }).filter((char: CharacterResult) => char.name);
  } catch (error) {
    console.error('TMDB character search error:', error);
    return [];
  }
}

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
    // Search external APIs in parallel
    const externalSearches = await Promise.allSettled([
      searchAniListCharacters(query, 5),
      searchRAWGCharacters(query, 3),
      searchTMDBCharacters(query, 4)
    ]);

    const allResults: CharacterResult[] = [];
    const seenNames = new Set<string>();

    for (const result of externalSearches) {
      if (result.status === 'fulfilled') {
        for (const character of result.value) {
          const lowerName = character.name.toLowerCase();
          if (!seenNames.has(lowerName)) {
            allResults.push(character);
            seenNames.add(lowerName);
            
            if (allResults.length >= limit) break;
          }
        }
      }
      if (allResults.length >= limit) break;
    }

    return json({
      results: allResults,
      sources: ['anilist', 'rawg', 'tmdb']
    });
  } catch (error) {
    console.error('Character search error:', error);
    return json({ error: 'Failed to search characters' }, { status: 500 });
  }
};

