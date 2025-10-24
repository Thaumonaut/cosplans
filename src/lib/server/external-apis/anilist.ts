/**
 * AniList API - Anime and Manga database
 * No authentication required
 */

export interface AniListCharacter {
  name: string;
  series: string;
  sourceMedia: string;
  imageUrl: string | null;
  description?: string;
}

export async function searchAniList(query: string, limit = 10): Promise<string[]> {
  const graphqlQuery = `
    query ($search: String, $perPage: Int) {
      Page(perPage: $perPage) {
        media(search: $search, type: ANIME) {
          title {
            romaji
            english
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
    
    if (!data.data?.Page?.media) {
      return [];
    }

    return data.data.Page.media
      .map((item: any) => item.title.english || item.title.romaji)
      .filter((title: string) => title);
  } catch (error) {
    console.error('AniList search error:', error);
    return [];
  }
}

export async function searchAniListCharacters(query: string, limit = 10): Promise<AniListCharacter[]> {
  const graphqlQuery = `
    query ($search: String, $perPage: Int) {
      Page(perPage: $perPage) {
        characters(search: $search) {
          name {
            full
          }
          image {
            large
            medium
          }
          description
          media(sort: POPULARITY_DESC, perPage: 1) {
            nodes {
              title {
                romaji
                english
              }
              format
              coverImage {
                large
              }
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

    return data.data.Page.characters
      .map((char: any) => {
        const media = char.media?.nodes?.[0];
        const series = media?.title?.english || media?.title?.romaji || 'Unknown Series';
        const format = media?.format || 'ANIME';
        
        return {
          name: char.name.full,
          series,
          sourceMedia: format === 'MANGA' ? 'manga' : 'anime',
          imageUrl: char.image?.large || char.image?.medium || media?.coverImage?.large || null,
          description: char.description?.replace(/<[^>]*>/g, '').substring(0, 200) || undefined
        };
      })
      .filter((char: AniListCharacter) => char.name && char.series);
  } catch (error) {
    console.error('AniList character search error:', error);
    return [];
  }
}

