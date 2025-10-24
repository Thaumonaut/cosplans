/**
 * AniList API - Anime and Manga database
 * No authentication required
 */

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

