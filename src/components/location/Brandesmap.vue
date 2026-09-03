<template>
  <div class="coffich-app">
    <header class="mobile-header">
      <div class="brand">
        <div class="cup-icon-wrap">
          <svg class="cup-icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M2 21h18v-2H2v2zm2-4h14V5H4v12zm15-9h2a2 2 0 012 2v3a2 2 0 01-2 2h-2V8z"/>
          </svg>
        </div>
        <div class="brand-info">
          <h2>Coffich</h2>
          <span>Интерактивная карта филиалов</span>
        </div>
      </div>

      <div class="view-toggle">
        <button 
          :class="{ active: activeMobileView === 'map' }" 
          @click="switchMobileView('map')"
        >
          📍 Карта
        </button>
        <button 
          :class="{ active: activeMobileView === 'list' }" 
          @click="switchMobileView('list')"
        >
          📋 Список ({{ filteredBranches.length }})
        </button>
      </div>
    </header>

    <div class="main-content" :class="activeMobileView">
      <aside class="sidebar-panel">
        <div class="search-box">
          <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="11" cy="11" r="8" stroke-width="2"/>
            <path d="M21 21l-4.35-4.35" stroke-width="2" stroke-linecap="round"/>
          </svg>
          <input 
            v-model="searchQuery" 
            type="text" 
            placeholder="Поиск филиала или адреса..." 
          />
          <button v-if="searchQuery" class="clear-btn" @click="searchQuery = ''">✕</button>
        </div>

        <div class="branches-scroll">
          <div 
            v-for="branch in filteredBranches" 
            :key="branch.id" 
            class="branch-card"
            :class="{ active: selectedBranchId === branch.id }"
            @click="selectBranch(branch, true)"
          >
            <div class="card-head">
              <span class="title">{{ branch.name }}</span>
              <span class="status-badge" :class="{ open: branch.isOpen }">
                <span class="status-dot"></span>
                {{ branch.isOpen ? 'Открыто' : 'Закрыто' }}
              </span>
            </div>

            <p class="address">📍 {{ branch.address }}</p>
            
            <div class="meta-info">
              <span v-if="branch.rating" class="rating">⭐ {{ branch.rating }} ({{ branch.reviewsCount }})</span>
              <span v-else class="rating">⭐ Новый</span>
              <span v-if="branch.phone" class="phone">📞 {{ branch.phone }}</span>
            </div>

            <div class="card-foot">
              <span class="time">🕒 {{ branch.workHours }}</span>
              <span class="action-text">Показать ➔</span>
            </div>
          </div>
          
          <div v-if="filteredBranches.length === 0" class="no-results">
            Филиалы Coffich не найдены ☕
          </div>
        </div>
      </aside>

      <main class="map-panel">
        <div class="map-type-selector">
          <button 
            :class="{ active: mapType === 'm' }" 
            @click="changeMapType('m')"
          >
            🗺️ Карта
          </button>
          <button 
            :class="{ active: mapType === 'y' }" 
            @click="changeMapType('y')"
          >
            🛰️ Гибрид
          </button>
          <button 
            :class="{ active: mapType === 's' }" 
            @click="changeMapType('s')"
          >
            📷 Спутник
          </button>
        </div>

        <div ref="mapElement" class="leaflet-map"></div>

        <button class="geo-btn" @click="locateUser" title="Мое местоположение">
          🎯
        </button>

        <div v-if="selectedBranch && activeMobileView === 'map'" class="mobile-selected-card">
          <button class="close-sheet-btn" @click="selectedBranchId = null">✕</button>
          <div class="card-info" @click="openGoogleMapsDirections(selectedBranch)">
            <div class="sheet-indicator"></div>
            <h4>{{ selectedBranch.name }}</h4>
            <p>{{ selectedBranch.address }}</p>
            <div class="sub-details">
              <span class="time-badge">🕒 {{ selectedBranch.workHours }}</span>
              <span v-if="selectedBranch.phone" class="phone-badge">📞 {{ selectedBranch.phone }}</span>
            </div>
          </div>
          <button class="route-btn" @click="openGoogleMapsDirections(selectedBranch)">
            Маршрут 🚗
          </button>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const mapElement = ref(null)
let map = null
let currentTileLayer = null
let markersGroup = null
let userMarker = null

const searchQuery = ref('')
const selectedBranchId = ref(1)
const activeMobileView = ref('map')
const mapType = ref('m')

const branches = ref([
  {
    id: 1,
    name: 'Coffich - Media Park',
    address: 'г. Бухара, ул. Хамза 5D',
    rating: 4.8,
    reviewsCount: 34,
    phone: '+998978650010',
    workHours: 'Круглосуточно (24/7)',
    isOpen: true,
    lat: 39.770,
    lng: 64.4285
  },
  {
    id: 2,
    name: 'Coffich - Gor Bolnitsa',
    address: 'г. Бухара, ул. Б. Накшбанди',
    rating: 4.9,
    reviewsCount: 28,
    phone: '+998978690010',
    workHours: '08:00 – 02:00',
    isOpen: true,
    lat: 39.7689,
    lng: 64.4524
  },
  {
    id: 3,
    name: 'Coffich - Samarkandski',
    address: 'г. Бухара, ул. Гиждувон',
    rating: 4.9,
    reviewsCount: 15,
    phone: '+998936566699',
    workHours: '08:00 – 02:00',
    isOpen: true,
    lat: 39.7888,
    lng: 64.4195
  },
  {
    id: 4,
    name: 'Coffich - AN Najot',
    address: 'г. Бухара, ул. Ал-Хорезми',
    rating: 4.5,
    reviewsCount: 19,
    phone: '+998978610010',
    workHours: '08:00 – 02:00',
    isOpen: true,
    lat: 39.7558,
    lng: 64.4262
  },
  {
    id: 5,
    name: 'Coffich - Navoiy maktab',
    address: 'г. Бухара, ул. Ислама Каримова',
    rating: 4.7,
    reviewsCount: 22,
    phone: '+998978620010',
    workHours: '07:00 – 02:00',
    isOpen: true,
    lat: 39.7772,
    lng: 64.431
  },
  {
    id: 6,
    name: 'Coffich - 5-й микрорайон',
    address: 'г. Бухара, 5-й микрорайон',
    rating: 5.0,
    reviewsCount: 8,
    phone: '+998931323069',
    workHours: '08:00 – 00:00',
    isOpen: true,
    lat: 39.7489,
    lng: 64.4085
  },
  {
    id: 7,
    name: 'Coffich - Kogon Vokzal',
    address: 'г. Каган, Железнодорожный вокзал',
    rating: 5.0,
    reviewsCount: 24,
    phone: '+998912441701',
    workHours: '08:00 – 23:00',
    isOpen: true,
    lat: 39.7223,
    lng: 64.5469
  },
  {
    id: 8,
    name: 'Coffich - Zarmed',
    address: 'г. Бухара, Зармед',
    rating: 5.0,
    reviewsCount: 24,
    phone: '+998978640010',
    workHours: '08:00 – 23:00',
    isOpen: true,
    lat: 39.755969,
    lng: 64.417147
  }
])

const filteredBranches = computed(() => {
  if (!searchQuery.value.trim()) return branches.value
  const q = searchQuery.value.toLowerCase()
  return branches.value.filter(b => 
    b.name.toLowerCase().includes(q) || 
    b.address.toLowerCase().includes(q)
  )
})

const selectedBranch = computed(() => {
  return branches.value.find(b => b.id === selectedBranchId.value)
})

const switchMobileView = (view) => {
  activeMobileView.value = view
  if (view === 'map' && map) {
    nextTick(() => {
      setTimeout(() => {
        map.invalidateSize()
      }, 200)
    })
  }
}

const createPinIcon = (isSelected) => {
  const pinBg = isSelected ? '#C19A6C' : '#0A2218'
  const iconColor = isSelected ? '#0A2218' : '#F8F6F1'

  const html = `
    <div class="coffich-pin-container ${isSelected ? 'selected' : ''}">
      <div class="pin-badge" style="background-color: ${pinBg};">
        <svg viewBox="0 0 24 24" fill="${iconColor}" width="18" height="18">
          <path d="M2 21h18v-2H2v2zm2-4h14V5H4v12zm15-9h2a2 2 0 012 2v3a2 2 0 01-2 2h-2V8z"/>
        </svg>
      </div>
      <div class="pin-pulse"></div>
    </div>
  `
  return L.divIcon({
    html: html,
    className: 'custom-leaflet-marker',
    iconSize: [44, 44],
    iconAnchor: [22, 22]
  })
}

const updateGoogleTileLayer = (type) => {
  if (!map) return
  if (currentTileLayer) map.removeLayer(currentTileLayer)

  currentTileLayer = L.tileLayer(`https://mt1.google.com/vt/lyrs=${type}&x={x}&y={y}&z={z}`, {
    maxZoom: 20,
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
    attribution: '© Google Maps'
  })
  
  currentTileLayer.addTo(map)
}

const changeMapType = (type) => {
  mapType.value = type
  updateGoogleTileLayer(type)
}

onMounted(() => {
  if (!mapElement.value) return

  map = L.map(mapElement.value, {
    zoomControl: false
  }).setView([39.7680, 64.4300], 13)

  L.control.zoom({ position: 'topright' }).addTo(map)
  updateGoogleTileLayer(mapType.value)

  markersGroup = L.layerGroup().addTo(map)
  renderMarkers()
})

onUnmounted(() => {
  if (map) {
    map.remove()
    map = null
  }
})

const renderMarkers = () => {
  if (!markersGroup) return
  markersGroup.clearLayers()

  branches.value.forEach((b) => {
    const isSelected = b.id === selectedBranchId.value
    const marker = L.marker([b.lat, b.lng], {
      icon: createPinIcon(isSelected)
    })

    marker.on('click', () => selectBranch(b, false))
    markersGroup.addLayer(marker)
  })
}

watch(selectedBranchId, () => {
  renderMarkers()
})

const selectBranch = (branch, switchTabOnMobile = false) => {
  selectedBranchId.value = branch.id

  if (map) {
    map.flyTo([branch.lat, branch.lng], 16, { duration: 0.8 })
  }

  if (switchTabOnMobile && window.innerWidth <= 768) {
    switchMobileView('map')
  }
}

const openGoogleMapsDirections = (branch) => {
  const url = `https://www.google.com/maps/dir/?api=1&destination=${branch.lat},${branch.lng}`
  window.open(url, '_blank')
}

const locateUser = () => {
  if (!navigator.geolocation) {
    alert("Ваш браузер не поддерживает геолокацию")
    return
  }

  navigator.geolocation.getCurrentPosition((position) => {
    const lat = position.coords.latitude
    const lng = position.coords.longitude

    if (map) {
      map.setView([lat, lng], 15)
      if (userMarker) map.removeLayer(userMarker)
      
      userMarker = L.circleMarker([lat, lng], {
        radius: 9,
        fillColor: '#C19A6C',
        color: '#0A2218',
        weight: 3,
        fillOpacity: 1
      }).addTo(map).bindPopup("Вы здесь").openPopup()
    }
  }, () => {
    alert("Не удалось определить местоположение.")
  })
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

.coffich-app {
  display: flex;
  flex-direction: column;
  background-color: #0A2218;
  width: 100%;
  max-width: 1320px;
  height: 85vh;
  margin: 60px auto 20px auto;
  border-radius: 32px;
  font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
  overflow: hidden;
  box-shadow: 0 30px 60px rgba(0, 0, 0, 0.45);
  box-sizing: border-box;
  border: 1px solid rgba(193, 154, 108, 0.2);
  margin-top: 100px;
}

/* Header va Z-Index */
.mobile-header {
  background: rgba(10, 34, 24, 0.95);
  backdrop-filter: blur(15px);
  padding: 16px 28px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(193, 154, 108, 0.15);
  z-index: 100; /* Leaflet ustida turishi uchun */
  position: relative;
}

.brand {
  display: flex;
  align-items: center;
  gap: 14px;
}

.cup-icon-wrap {
  background: linear-gradient(135deg, #C19A6C 0%, #A37E52 100%);
  color: #0A2218;
  padding: 10px;
  border-radius: 14px;
  display: flex;
  box-shadow: 0 4px 15px rgba(193, 154, 108, 0.4);
}

.cup-icon {
  width: 22px;
  height: 22px;
}

.brand-info h2 {
  margin: 0;
  font-size: 1.3rem;
  font-weight: 800;
  color: #F8F6F1;
  letter-spacing: 0.5px;
}

.brand-info span {
  font-size: 0.72rem;
  color: #C19A6C;
  font-weight: 600;
  letter-spacing: 0.5px;
  text-transform: uppercase;
}

.view-toggle {
  display: none;
  background-color: rgba(0, 0, 0, 0.3);
  padding: 4px;
  border-radius: 14px;
  gap: 4px;
}

.view-toggle button {
  background: none;
  border: none;
  color: #A3B8B0;
  padding: 8px 14px;
  border-radius: 10px;
  font-size: 0.8rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.25s ease;
}

.view-toggle button.active {
  background-color: #C19A6C;
  color: #0A2218;
  box-shadow: 0 2px 10px rgba(193, 154, 108, 0.3);
}

/* Asosiy Content Layout */
.main-content {
  display: flex;
  flex-grow: 1;
  position: relative;
  overflow: hidden;
}

.sidebar-panel {
  width: 410px;
  background-color: #0A2218;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 18px;
  flex-shrink: 0;
  z-index: 0;
  border-right: 1px solid rgba(193, 154, 108, 0.15);
  box-sizing: border-box;
}

/* Qidiruv Box */
.search-box {
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 16px;
  width: 18px;
  height: 18px;
  color: #C19A6C;
}

.search-box input {
  width: 100%;
  padding: 14px 40px 14px 46px;
  border-radius: 18px;
  border: 1px solid rgba(193, 154, 108, 0.25);
  background-color: rgba(255, 255, 255, 0.05);
  font-size: 0.9rem;
  outline: none;
  color: #F8F6F1;
  font-weight: 600;
  box-sizing: border-box;
  transition: all 0.3s ease;
}

.search-box input::placeholder {
  color: #7A8B82;
}

.search-box input:focus {
  border-color: #C19A6C;
  background-color: rgba(255, 255, 255, 0.08);
  box-shadow: 0 0 15px rgba(193, 154, 108, 0.2);
}

.clear-btn {
  position: absolute;
  right: 14px;
  background: transparent;
  border: none;
  color: #A3B8B0;
  cursor: pointer;
  font-size: 1rem;
}

/* Card Ro'yxati */
.branches-scroll {
  display: flex;
  flex-direction: column;
  gap: 14px;
  overflow-y: auto;
  height: 100%;
  padding-right: 4px;
}

.branches-scroll::-webkit-scrollbar {
  width: 5px;
}
.branches-scroll::-webkit-scrollbar-thumb {
  background: rgba(193, 154, 108, 0.3);
  border-radius: 10px;
}

.branch-card {
  background: rgba(255, 255, 255, 0.03);
  padding: 18px;
  border-radius: 20px;
  cursor: pointer;
  border: 1px solid rgba(193, 154, 108, 0.15);
  transition: all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1);
}

.branch-card:hover {
  transform: translateY(-3px);
  background: rgba(255, 255, 255, 0.06);
  border-color: rgba(193, 154, 108, 0.4);
}

.branch-card.active {
  border-color: #C19A6C;
  background: linear-gradient(135deg, rgba(193, 154, 108, 0.15) 0%, rgba(10, 34, 24, 0.8) 100%);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
}

.card-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.title {
  font-weight: 800;
  font-size: 1rem;
  color: #F8F6F1;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.72rem;
  font-weight: 700;
  color: #A3B8B0;
  background: rgba(255, 255, 255, 0.06);
  padding: 4px 10px;
  border-radius: 99px;
}

.status-badge.open { 
  color: #4ADE80; 
  background: rgba(74, 222, 128, 0.12);
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: #999;
}

.status-badge.open .status-dot {
  background-color: #4ADE80;
  box-shadow: 0 0 8px #4ADE80;
}

.address {
  margin: 10px 0;
  font-size: 0.84rem;
  color: #D0DED5;
  line-height: 1.4;
  font-weight: 500;
}

.meta-info {
  display: flex;
  justify-content: space-between;
  font-size: 0.8rem;
  margin-bottom: 10px;
}

.rating { font-weight: 800; color: #C19A6C; }
.phone { font-weight: 600; color: #A3B8B0; }

.card-foot {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.78rem;
  color: #A3B8B0;
  font-weight: 600;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  padding-top: 10px;
}

.action-text { color: #C19A6C; font-weight: 700; }

.no-results {
  text-align: center;
  color: #A3B8B0;
  padding: 40px 10px;
  font-size: 0.95rem;
}

/* Xarita Paneli va Z-Index Fixes */
.map-panel {
  flex-grow: 1;
  position: relative;
  height: 100%;
  z-index: 1;
}

.leaflet-map {
  width: 100%;
  height: 100%;
  z-index: 1;
}

/* Leaflet ustida turuvchi control tugmalar (Z-INDEX FIX) */
.map-type-selector {
  position: absolute;
  top: 20px;
  left: 20px;
  z-index: 1005; /* Leaflet pane snapshotlaridan baland */
  display: flex;
  gap: 6px;
  background: rgba(10, 34, 24, 0.85);
  backdrop-filter: blur(16px);
  padding: 6px;
  border-radius: 16px;
  border: 1px solid rgba(193, 154, 108, 0.3);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
}

.map-type-selector button {
  background: transparent;
  border: none;
  padding: 8px 14px;
  border-radius: 10px;
  font-size: 0.78rem;
  font-weight: 700;
  color: #A3B8B0;
  cursor: pointer;
  transition: all 0.25s ease;
}

.map-type-selector button.active {
  background: #C19A6C;
  color: #0A2218;
  box-shadow: 0 2px 10px rgba(193, 154, 108, 0.4);
}

.geo-btn {
  position: absolute;
  bottom: 30px;
  right: 20px;
  background: #0A2218;
  border: 1px solid rgba(193, 154, 108, 0.4);
  color: #F8F6F1;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  font-size: 1.3rem;
  cursor: pointer;
  z-index: 1005; /* Leaflet ustida */
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.25s ease;
}

.geo-btn:hover {
  transform: scale(1.1);
  background: #C19A6C;
  color: #0A2218;
}

/* Mobil Tanlangan Karta Sheet (Z-INDEX FIX) */
.mobile-selected-card {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(10, 34, 24, 0.95);
  backdrop-filter: blur(20px);
  border-top: 1px solid rgba(193, 154, 108, 0.3);
  padding: 20px 24px 28px 24px;
  border-top-left-radius: 30px;
  border-top-right-radius: 30px;
  box-shadow: 0 -15px 35px rgba(0, 0, 0, 0.6);
  z-index: 1010; /* Xaritadagi hamma narsadan ustun */
  display: flex;
  justify-content: space-between;
  align-items: center;
  animation: slideUp 0.35s cubic-bezier(0.165, 0.84, 0.44, 1);
}

.close-sheet-btn {
  position: absolute;
  top: 14px;
  right: 16px;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  font-size: 0.8rem;
  color: #F8F6F1;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

@keyframes slideUp {
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
}

.sheet-indicator {
  width: 44px;
  height: 4px;
  background-color: rgba(193, 154, 108, 0.4);
  border-radius: 2px;
  margin: 0 auto 12px auto;
}

.card-info {
  flex-grow: 1;
  cursor: pointer;
  padding-right: 14px;
}

.card-info h4 {
  margin: 0 0 4px 0;
  font-size: 1.1rem;
  color: #F8F6F1;
  font-weight: 800;
}

.card-info p {
  margin: 0 0 10px 0;
  font-size: 0.85rem;
  color: #D0DED5;
}

.sub-details {
  display: flex;
  gap: 14px;
  font-size: 0.78rem;
}

.time-badge { font-weight: 700; color: #C19A6C; }
.phone-badge { color: #A3B8B0; font-weight: 700; }

.route-btn {
  background: linear-gradient(135deg, #C19A6C 0%, #A37E52 100%);
  color: #0A2218;
  border: none;
  padding: 14px 22px;
  border-radius: 16px;
  font-weight: 800;
  font-size: 0.88rem;
  cursor: pointer;
  white-space: nowrap;
  box-shadow: 0 8px 20px rgba(193, 154, 108, 0.35);
  transition: all 0.25s ease;
}

.route-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 25px rgba(193, 154, 108, 0.5);
}

/* Leaflet Custom Marker Styling */
:deep(.custom-leaflet-marker) {
  background: transparent;
  border: none;
}

:deep(.coffich-pin-container) {
  position: relative;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
}

:deep(.pin-badge) {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 20px rgba(0,0,0,0.5);
  border: 2px solid #F8F6F1;
  z-index: 2;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

:deep(.coffich-pin-container.selected .pin-badge) {
  transform: scale(1.3);
  box-shadow: 0 0 25px rgba(193, 154, 108, 0.9);
}

:deep(.pin-pulse) {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: rgba(193, 154, 108, 0.5);
  animation: markerPulse 2s infinite ease-out;
  z-index: 1;
}

@keyframes markerPulse {
  0% { transform: scale(1); opacity: 1; }
  100% { transform: scale(2.4); opacity: 0; }
}

/* Leaflet Zoom control postion fix */
:deep(.leaflet-top.leaflet-right) {
  top: 20px;
  right: 20px;
  z-index: 1000;
}

:deep(.leaflet-control-zoom-in), :deep(.leaflet-control-zoom-out) {
  background: rgba(10, 34, 24, 0.85) !important;
  color: #F8F6F1 !important;
  border-color: rgba(193, 154, 108, 0.3) !important;
  backdrop-filter: blur(10px);
}

/* Responsive (Mobil moslashuvchanlik) */
@media (max-width: 768px) {
  .coffich-app {
    width: 100%;
    height: 100dvh;
    margin: 0;
    border-radius: 0;
    border: none;
  }

  .view-toggle {
    display: flex;
  }

  .sidebar-panel {
    width: 100%;
    height: 100%;
    padding: 16px;
    border-right: none;
  }

  .main-content.map .sidebar-panel {
    display: none;
  }

  .main-content.list .map-panel {
    display: none;
  }

  .geo-btn {
    bottom: 125px;
  }
}
</style>