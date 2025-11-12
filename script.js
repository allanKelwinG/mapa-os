// Inicializa o mapa centralizado em Bragança Paulista
const map = L.map('map').setView([-22.9531, -46.5446], 13);

// Adiciona camada base do OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Função para buscar coordenadas via Nominatim
async function getCoords(endereco) {
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(endereco)}`;
  const res = await fetch(url);
  const data = await res.json();
  if (data && data.length > 0) {
    return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
  }
  return null;
}

// Carrega as ordens de serviço do arquivo local
fetch('ordens.json')
  .then(res => res.json())
  .then(async ordens => {
    for (const os of ordens) {
      const coords = await getCoords(os.endereco);
      if (coords) {
        const marker = L.marker(coords).addTo(map);
        marker.bindPopup(`<b>${os.cliente}</b><br>${os.tipo}<br><b>Técnico:</b> ${os.tecnico}<br><small>${os.endereco}</small>`);
      } else {
        console.warn('Endereço não localizado:', os.endereco);
      }
    }
  });
