export async function getPlayerImage(playerName: string): Promise<string | null> {
  try {
    // Using TheSportsDB (free tier)
    const response = await fetch(
      `https://www.thesportsdb.com/api/v1/json/3/searchplayers.php?p=${encodeURIComponent(playerName)}`
    );
    
    if (!response.ok) {
      // Handle rate limits
      if (response.status === 429) {
        console.warn('Rate limit exceeded for TheSportsDB API');
        return null;
      }
      throw new Error(`API responded with status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Check if player was found and has an image
    if (data.player && data.player.length > 0) {
      // Find the NFL player (there might be players with the same name in different sports)
      const nflPlayer = data.player.find((p: any) => 
        p.strSport === "American Football" || p.strTeam?.includes("NFL")
      );
      
      if (nflPlayer && nflPlayer.strThumb) {
        return nflPlayer.strThumb;
      } else if (data.player[0].strThumb) {
        // Fallback to first player if no explicit NFL player found
        return data.player[0].strThumb;
      }
    }
    
    return null; // No image found
  } catch (error) {
    console.error('Error fetching player image:', error);
    return null;
  }
} 