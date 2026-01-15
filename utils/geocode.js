async function geocodeLocation(location) {
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}`;

  const response = await fetch(url, {
    headers: {
      "User-Agent": "your-app-name" 
    }
  });

  const data = await response.json();

  if (data.length === 0) {
    throw new Error("Location not found");
  }

  return {
    lat: data[0].lat,
    lng: data[0].lon
  };
}

module.exports = geocodeLocation;