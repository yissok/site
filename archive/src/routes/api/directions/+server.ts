export async function GET({ url }: { url: URL }) {
  const queryString = url.searchParams.toString();
  const googleMapsUrl = `https://maps.googleapis.com/maps/api/directions/json?${queryString}`;
  try {
    const response = await fetch(googleMapsUrl);
    const data = JSON.stringify(await response.json(), null, 2);
    const options: ResponseInit = {
      status: 200,
      headers: {
        X: "Gon give it to ya",
        "Content-Type": "application/json",
      },
    };
    return new Response(data, options);
  } catch (error) {
    const options: ResponseInit = {
      status: 551,
      headers: {
        X: "Gon give it to ya",
      },
    };
    return new Response("'Error fetching directions'", options);
  }
}
