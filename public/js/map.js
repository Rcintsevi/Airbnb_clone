document.addEventListener("DOMContentLoaded", () => {
  const mapDiv = document.getElementById("map");
  if (!mapDiv) return;

  const lat = parseFloat(mapDiv.dataset.lat);
  const lng = parseFloat(mapDiv.dataset.lng);

  if (isNaN(lat) || isNaN(lng)) return;

  const map = L.map("map").setView([lat, lng], 12);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: "© OpenStreetMap contributors"
  }).addTo(map);

  L.marker([lat, lng]).addTo(map);
});
