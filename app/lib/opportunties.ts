export async function fetchOpportunities(apiKey: string) {
  try {
    const res = await fetch(
      "https://genie.entrepreneurscircle.org/v2/location/KJN4DBbti7aORk3MpgnU/opportunities/list",
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
      }
    );
    if (!res.ok) {
      console.warn("⚠️ fetchOpportunities returned status", res.status);
      return [];
    }
    const data = await res.json();
    return data.opportunities || [];
  } catch (err) {
    console.error("❌ Failed to fetch opportunities:", err);
    return [];
  }
}
