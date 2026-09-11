  <template>
    <div class="coffich-app">
      <!-- Mobil moslashuvchan tepa panel -->
      <header class="coffich-header">
        <div class="brand-section">
          <div class="logo-wrapper">
            <svg class="coffee-cup-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M2 21h18v-2H2v2zm2-4h14V5H4v12zm15-9h2a2 2 0 012 2v3a2 2 0 01-2 2h-2V8z"/>
            </svg>
          </div>
          <div class="brand-details">
            <div class="title-row">
              <h2>Coffich</h2>
              <span class="badge-premium">Bukhara</span>
            </div>
            <p class="subtitle">Интерактивная карта филиалов</p>
          </div>
        </div>

        <!-- Mobil ko'rinish rejimini almashtirgich (iOS Segmented Control uslubida) -->
        <div class="mobile-toggle-group">
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

      <!-- Asosiy ishchi zona -->
      <div class="main-layout" :class="activeMobileView">
        <!-- Ro'yxat paneli (Mobil va Desktop) -->
        <aside class="sidebar-container">
          <div class="controls-wrapper">
            <!-- Qidiruv maydoni -->
            <div class="search-input-box">
              <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="11" cy="11" r="8" stroke-width="2"/>
                <path d="M21 21l-4.35-4.35" stroke-width="2" stroke-linecap="round"/>
              </svg>
              <input 
                v-model="searchQuery" 
                type="text" 
                placeholder="Поиск по названию или адресу..." 
              />
              <button v-if="searchQuery" class="clear-search-btn" @click="searchQuery = ''">✕</button>
            </div>

            <!-- Tezkor filtlar (Gorizontal skroll) -->
            <div class="filter-chips">
              <button 
                class="chip" 
                :class="{ active: activeFilter === 'all' }" 
                @click="activeFilter = 'all'"
              >
                Все ({{ branches.length }})
              </button>
              <button 
                class="chip" 
                :class="{ active: activeFilter === 'open' }" 
                @click="activeFilter = 'open'"
              >
                🟢 Открыты
              </button>
              <button 
                class="chip" 
                :class="{ active: activeFilter === '24/7' }" 
                @click="activeFilter = '24/7'"
              >
                ⚡ 24/7
              </button>
            </div>
          </div>

          <!-- Kartochkalar ro'yxati -->
          <div class="branches-list">
            <div 
              v-for="branch in filteredBranches" 
              :key="branch.id" 
              :id="'branch-card-' + branch.id"
              class="branch-card"
              :class="{ active: selectedBranchId === branch.id }"
              @click="selectBranch(branch, true)"
            >
              <div class="card-header">
                <span class="card-title">{{ branch.name }}</span>
                <span class="status-badge" :class="{ open: branch.isOpen }">
                  <span class="pulse-dot"></span>
                  {{ branch.isOpen ? 'Открыто' : 'Закрыто' }}
                </span>
              </div>

              <p class="card-address">📍 {{ branch.address }}</p>

              <div class="card-meta">
                <span class="meta-rating">⭐ {{ branch.rating }} ({{ branch.reviewsCount }})</span>
                <span class="meta-hours">🕒 {{ branch.workHours }}</span>
              </div>

              <div class="card-actions">
                <button class="btn-action btn-route" @click.stop="openGoogleMapsDirections(branch)">
                  🧭 Маршрут
                </button>
                <a v-if="branch.phone" :href="'tel:' + branch.phone" class="btn-action btn-call" @click.stop>
                  📞 Позвонить
                </a>
              </div>
            </div>

            <div v-if="filteredBranches.length === 0" class="empty-state">
              <div class="empty-icon">☕</div>
              <p class="empty-title">Ничего не найдено</p>
              <button class="reset-filter-btn" @click="resetFilters">Сбросить поиск</button>
            </div>
          </div>
        </aside>

        <!-- Xarita paneli -->
        <main class="map-container">
          <!-- Rejim tugmalari (Карта/Гибрид/Спутник) -->
          <div class="map-layer-controls">
            <button :class="{ active: mapType === 'm' }" @click="changeMapType('m')">🗺️ Карта</button>
            <button :class="{ active: mapType === 'y' }" @click="changeMapType('y')">🛰️ Гибрид</button>
            <button :class="{ active: mapType === 's' }" @click="changeMapType('s')">📷 Спутник</button>
          </div>

          <div ref="mapElement" class="leaflet-canvas"></div>

          <!-- Геолокация tugmasi -->
          <button class="geolocation-btn" @click="locateUser" title="Мое местоположение">
            🎯
          </button>

          <!-- Mobil pastki Bottom Sheet (Tanlangan filial kartasi) -->
          <transition name="slide-up">
            <div v-if="selectedBranch && activeMobileView === 'map'" class="mobile-bottom-sheet">
              <div class="sheet-handle"></div>
              <button class="close-sheet-btn" @click="selectedBranchId = null">✕</button>

              <div class="sheet-content">
                <div class="sheet-head">
                  <h3>{{ selectedBranch.name }}</h3>
                  <span class="status-badge" :class="{ open: selectedBranch.isOpen }">
                    {{ selectedBranch.isOpen ? 'Открыто' : 'Закрыто' }}
                  </span>
                </div>
                <p class="sheet-address">📍 {{ selectedBranch.address }}</p>
                
                <div class="sheet-pills">
                  <span class="pill">🕒 {{ selectedBranch.workHours }}</span>
                  <span class="pill gold">⭐ {{ selectedBranch.rating }}</span>
                </div>

                <div class="sheet-actions">
                  <button class="sheet-btn-main" @click="openGoogleMapsDirections(selectedBranch)">
                    🚗 Построить маршрут
                  </button>
                  <a v-if="selectedBranch.phone" :href="'tel:' + selectedBranch.phone" class="sheet-btn-icon">
                    📞
                  </a>
                </div>
              </div>
            </div>
          </transition>
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
  const activeFilter = ref('all')
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
      is24: true,
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
      is24: false,
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
      is24: false,
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
      is24: false,
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
      is24: false,
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
      is24: false,
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
      is24: false,
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
      is24: false,
      lat: 39.755969,
      lng: 64.417147
    }
  ])

  const filteredBranches = computed(() => {
    return branches.value.filter(b => {
      const matchesSearch = !searchQuery.value.trim() || 
        b.name.toLowerCase().includes(searchQuery.value.toLowerCase()) || 
        b.address.toLowerCase().includes(searchQuery.value.toLowerCase())

      let matchesFilter = true
      if (activeFilter.value === 'open') matchesFilter = b.isOpen
      if (activeFilter.value === '24/7') matchesFilter = b.is24

      return matchesSearch && matchesFilter
    })
  })

  const selectedBranch = computed(() => {
    return branches.value.find(b => b.id === selectedBranchId.value)
  })

  const resetFilters = () => {
    searchQuery.value = ''
    activeFilter.value = 'all'
  }

  const switchMobileView = (view) => {
    activeMobileView.value = view
    if (view === 'map' && map) {
      nextTick(() => {
        setTimeout(() => {
          map.invalidateSize()
        }, 150)
      })
    }
  }

  const createPinIcon = (isSelected) => {
    const pinBg = isSelected ? '#C19A6C' : '#0A2218'
    const iconColor = isSelected ? '#0A2218' : '#F8F6F1'
    const strokeColor = isSelected ? '#FFFFFF' : '#C19A6C'

    const html = `
      <div class="coffich-pin-wrapper ${isSelected ? 'is-active' : ''}">
        <div class="pin-head" style="background-color: ${pinBg}; border-color: ${strokeColor};">
          <svg viewBox="0 0 24 24" fill="${iconColor}" width="20" height="20">
            <path d="M2 21h18v-2H2v2zm2-4h14V5H4v12zm15-9h2a2 2 0 012 2v3a2 2 0 01-2 2h-2V8z"/>
          </svg>
        </div>
        <div class="pin-pulse-ring"></div>
      </div>
    `
    return L.divIcon({
      html: html,
      className: 'custom-coffich-marker',
      iconSize: [46, 46],
      iconAnchor: [23, 23]
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

    nextTick(() => {
      const el = document.getElementById(`branch-card-${branch.id}`)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
      }
    })

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
      alert("Ваш браузер не поддерживает геопозиционирование")
      return
    }

    navigator.geolocation.getCurrentPosition((position) => {
      const lat = position.coords.latitude
      const lng = position.coords.longitude

      if (map) {
        map.setView([lat, lng], 15)
        if (userMarker) map.removeLayer(userMarker)
        
        userMarker = L.circleMarker([lat, lng], {
          radius: 10,
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

/* Global o'zgaruvchilar va Z-Index tizimi */
.coffich-app {
  --bg-dark: #0A2218;
  --bg-card: rgba(255, 255, 255, 0.04);
  --bg-card-hover: rgba(255, 255, 255, 0.08);
  --accent-gold: #C19A6C;
  --accent-gold-light: #E0C39E;
  --text-cream: #F8F6F1;
  --text-muted: #A3B8B0;
  --border-color: rgba(193, 154, 108, 0.2);
  --status-green: #4ADE80;

  /* Z-INDEX TIZIMI (Qatlamlar iyerarxiyasi) */
  --z-pin-ring: 1;
  --z-pin-head: 2;
  --z-map-ui: 100;
  --z-sidebar: 200;
  --z-header: 300;
  --z-bottom-sheet: 400;

  display: flex;
  flex-direction: column;
  background-color: var(--bg-dark);
  width: 100%;
  max-width: 1360px;
  height: 88vh;
  margin: 100px auto 20px auto;
  border-radius: 28px;
  font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
  overflow: hidden;
  box-shadow: 0 35px 70px rgba(0, 0, 0, 0.5);
  border: 1px solid var(--border-color);
  box-sizing: border-box;
  -webkit-tap-highlight-color: transparent;
  position: relative;
}

/* Tepa Panel Header */
.coffich-header {
  background: rgba(10, 34, 24, 0.96);
  backdrop-filter: blur(16px);
  padding: 16px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--border-color);
  z-index: var(--z-header);
  position: relative;
}

.brand-section {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo-wrapper {
  background: linear-gradient(135deg, var(--accent-gold) 0%, #A37E52 100%);
  color: var(--bg-dark);
  padding: 8px;
  border-radius: 12px;
  display: flex;
  box-shadow: 0 4px 15px rgba(193, 154, 108, 0.35);
}

.coffee-cup-icon {
  width: 22px;
  height: 22px;
}

.brand-details {
  display: flex;
  flex-direction: column;
}

.title-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.title-row h2 {
  margin: 0;
  font-size: 1.3rem;
  font-weight: 800;
  color: var(--text-cream);
}

.badge-premium {
  font-size: 0.6rem;
  font-weight: 700;
  text-transform: uppercase;
  color: var(--accent-gold);
  background: rgba(193, 154, 108, 0.15);
  padding: 2px 6px;
  border-radius: 6px;
}

.subtitle {
  margin: 0;
  font-size: 0.75rem;
  color: var(--text-muted);
}

/* Mobil Переключатель Вида */
.mobile-toggle-group {
  display: none;
  background-color: rgba(0, 0, 0, 0.4);
  padding: 4px;
  border-radius: 12px;
  gap: 4px;
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.mobile-toggle-group button {
  background: none;
  border: none;
  color: var(--text-muted);
  padding: 8px 14px;
  border-radius: 8px;
  font-size: 0.8rem;
  font-weight: 700;
  cursor: pointer;
  touch-action: manipulation;
  transition: all 0.2s ease;
}

.mobile-toggle-group button.active {
  background-color: var(--accent-gold);
  color: var(--bg-dark);
  box-shadow: 0 2px 8px rgba(193, 154, 108, 0.3);
}

/* Asosiy Ishchi Hudud */
.main-layout {
  display: flex;
  flex-grow: 1;
  position: relative;
  overflow: hidden;
  z-index: 1;
}

/* Sidebar / List Panel */
.sidebar-container {
  width: 410px;
  background-color: var(--bg-dark);
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  flex-shrink: 0;
  position: relative;
  z-index: var(--z-sidebar);
  border-right: 1px solid var(--border-color);
  box-sizing: border-box;
}

.controls-wrapper {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.search-input-box {
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 14px;
  width: 18px;
  height: 18px;
  color: var(--accent-gold);
}

.search-input-box input {
  width: 100%;
  padding: 12px 36px 12px 42px;
  border-radius: 14px;
  border: 1px solid var(--border-color);
  background-color: rgba(255, 255, 255, 0.04);
  font-size: 0.88rem;
  outline: none;
  color: var(--text-cream);
  transition: all 0.25s ease;
}

.search-input-box input:focus {
  border-color: var(--accent-gold);
  background-color: rgba(255, 255, 255, 0.07);
}

.clear-search-btn {
  position: absolute;
  right: 12px;
  background: transparent;
  border: none;
  color: var(--text-muted);
  font-size: 1rem;
  cursor: pointer;
}

.filter-chips {
  display: flex;
  gap: 6px;
  overflow-x: auto;
  padding-bottom: 2px;
  -webkit-overflow-scrolling: touch;
}

.filter-chips::-webkit-scrollbar { display: none; }

.chip {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: var(--text-muted);
  padding: 8px 14px;
  border-radius: 99px;
  font-size: 0.75rem;
  font-weight: 600;
  white-space: nowrap;
  cursor: pointer;
  touch-action: manipulation;
}

.chip.active {
  background: var(--accent-gold);
  color: var(--bg-dark);
  border-color: var(--accent-gold);
}

.branches-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  overflow-y: auto;
  height: 100%;
  padding-right: 4px;
  -webkit-overflow-scrolling: touch;
}

.branches-list::-webkit-scrollbar { width: 4px; }
.branches-list::-webkit-scrollbar-thumb {
  background: rgba(193, 154, 108, 0.2);
  border-radius: 10px;
}

.branch-card {
  background: var(--bg-card);
  padding: 16px;
  border-radius: 16px;
  cursor: pointer;
  border: 1px solid rgba(255, 255, 255, 0.06);
  transition: all 0.25s ease;
}

.branch-card:active {
  transform: scale(0.98);
}

.branch-card.active {
  border-color: var(--accent-gold);
  background: linear-gradient(135deg, rgba(193, 154, 108, 0.15) 0%, rgba(10, 34, 24, 0.9) 100%);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.35);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-title {
  font-weight: 700;
  font-size: 0.95rem;
  color: var(--text-cream);
}

.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 0.7rem;
  font-weight: 700;
  color: var(--text-muted);
  background: rgba(255, 255, 255, 0.05);
  padding: 3px 8px;
  border-radius: 99px;
}

.status-badge.open {
  color: var(--status-green);
  background: rgba(74, 222, 128, 0.1);
}

.pulse-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: #888;
}

.status-badge.open .pulse-dot {
  background-color: var(--status-green);
  box-shadow: 0 0 8px var(--status-green);
}

.card-address {
  margin: 6px 0 10px 0;
  font-size: 0.82rem;
  color: #C0D0C8;
}

.card-meta {
  display: flex;
  justify-content: space-between;
  font-size: 0.76rem;
  margin-bottom: 12px;
  color: var(--text-muted);
}

.meta-rating {
  font-weight: 700;
  color: var(--accent-gold);
}

.card-actions {
  display: flex;
  gap: 8px;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  padding-top: 10px;
}

.btn-action {
  flex: 1;
  padding: 10px;
  border-radius: 10px;
  font-size: 0.78rem;
  font-weight: 700;
  text-align: center;
  text-decoration: none;
  border: none;
  cursor: pointer;
  touch-action: manipulation;
}

.btn-route {
  background: rgba(193, 154, 108, 0.15);
  color: var(--accent-gold-light);
  border: 1px solid rgba(193, 154, 108, 0.3);
}

.btn-call {
  background: rgba(255, 255, 255, 0.06);
  color: var(--text-cream);
}

.empty-state {
  text-align: center;
  padding: 30px 10px;
  color: var(--text-muted);
}

.empty-icon { font-size: 2.2rem; margin-bottom: 6px; }
.empty-title { font-weight: 700; color: var(--text-cream); margin: 0 0 12px 0; }

.reset-filter-btn {
  background: var(--accent-gold);
  color: var(--bg-dark);
  border: none;
  padding: 10px 18px;
  border-radius: 10px;
  font-weight: 700;
  cursor: pointer;
}

/* Xarita paneli */
.map-container {
  flex-grow: 1;
  position: relative;
  height: 100%;
  z-index: 1;
}

.leaflet-canvas {
  width: 100%;
  height: 100%;
}

/* Xarita ustidagi boshqaruv paneli */
.map-layer-controls {
  position: absolute;
  top: 14px;
  left: 14px;
  z-index: var(--z-map-ui);
  display: flex;
  gap: 4px;
  background: rgba(10, 34, 24, 0.9);
  backdrop-filter: blur(12px);
  padding: 4px;
  border-radius: 12px;
  border: 1px solid var(--border-color);
  box-shadow: 0 8px 24px rgba(0,0,0,0.4);
}

.map-layer-controls button {
  background: transparent;
  border: none;
  padding: 6px 10px;
  border-radius: 8px;
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--text-muted);
  cursor: pointer;
}

.map-layer-controls button.active {
  background: var(--accent-gold);
  color: var(--bg-dark);
}

/* Geolokatsiya tugmasi */
.geolocation-btn {
  position: absolute;
  bottom: 24px;
  right: 16px;
  background: var(--bg-dark);
  border: 1px solid var(--border-color);
  color: var(--text-cream);
  width: 48px;
  height: 48px;
  border-radius: 50%;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
  font-size: 1.3rem;
  cursor: pointer;
  z-index: var(--z-map-ui);
  display: flex;
  align-items: center;
  justify-content: center;
  touch-action: manipulation;
}

/* Mobil Bottom Sheet (Eng tepada joylashadi) */
.mobile-bottom-sheet {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(10, 34, 24, 0.97);
  backdrop-filter: blur(20px);
  border-top: 1px solid var(--border-color);
  padding: 12px 20px calc(20px + env(safe-area-inset-bottom)) 20px;
  border-top-left-radius: 28px;
  border-top-right-radius: 28px;
  box-shadow: 0 -12px 35px rgba(0, 0, 0, 0.6);
  z-index: var(--z-bottom-sheet);
}

.sheet-handle {
  width: 40px;
  height: 4px;
  background: rgba(193, 154, 108, 0.4);
  border-radius: 2px;
  margin: 0 auto 12px auto;
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
  color: var(--text-cream);
  cursor: pointer;
}

.sheet-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
  padding-right: 24px;
}

.sheet-head h3 {
  margin: 0;
  color: var(--text-cream);
  font-size: 1.1rem;
  font-weight: 800;
}

.sheet-address {
  margin: 0 0 12px 0;
  color: var(--text-muted);
  font-size: 0.85rem;
}

.sheet-pills {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
}

.pill {
  background: rgba(255, 255, 255, 0.05);
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 0.78rem;
  color: var(--text-cream);
  font-weight: 600;
}

.pill.gold {
  color: var(--accent-gold);
}

.sheet-actions {
  display: flex;
  gap: 10px;
}

.sheet-btn-main {
  flex: 1;
  background: linear-gradient(135deg, var(--accent-gold) 0%, #A37E52 100%);
  color: var(--bg-dark);
  border: none;
  padding: 14px;
  border-radius: 14px;
  font-weight: 800;
  font-size: 0.9rem;
  cursor: pointer;
  touch-action: manipulation;
}

.sheet-btn-icon {
  background: rgba(255, 255, 255, 0.1);
  color: var(--text-cream);
  padding: 14px 18px;
  border-radius: 14px;
  text-decoration: none;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Leaflet Pin Stili (Ichki qatlamlar) */
:deep(.custom-coffich-marker) {
  background: transparent;
  border: none;
}

:deep(.coffich-pin-wrapper) {
  position: relative;
  width: 46px;
  height: 46px;
  display: flex;
  align-items: center;
  justify-content: center;
}

:deep(.pin-head) {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 6px 18px rgba(0,0,0,0.5);
  border: 2px solid var(--accent-gold);
  position: relative;
  z-index: var(--z-pin-head);
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

:deep(.coffich-pin-wrapper.is-active .pin-head) {
  transform: scale(1.25);
  box-shadow: 0 0 22px var(--accent-gold);
}

:deep(.pin-pulse-ring) {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: rgba(193, 154, 108, 0.4);
  animation: pulseAnimation 2s infinite ease-out;
  z-index: var(--z-pin-ring);
}

@keyframes pulseAnimation {
  0% { transform: scale(0.9); opacity: 1; }
  100% { transform: scale(2.2); opacity: 0; }
}

.slide-up-enter-active, .slide-up-leave-active {
  transition: transform 0.3s cubic-bezier(0.165, 0.84, 0.44, 1);
}
.slide-up-enter-from, .slide-up-leave-to {
  transform: translateY(100%);
}

/* Responsiv MOSLASHUV */
@media (max-width: 768px) {
  .coffich-app {
    width: 100vw;
    height: 100dvh;
    margin: 0;
    border-radius: 0;
    border: none;
  }

  .coffich-header {
    padding: calc(12px + env(safe-area-inset-top)) 16px 12px 16px;
  }

  .subtitle { display: none; }

  .mobile-toggle-group {
    display: flex;
  }

  .sidebar-container {
    width: 100%;
    height: 100%;
    padding: 14px 16px calc(16px + env(safe-area-inset-bottom)) 16px;
    border-right: none;
  }

  .main-layout.map .sidebar-container {
    display: none;
  }

  .main-layout.list .map-container {
    display: none;
  }

  .geolocation-btn {
    bottom: calc(120px + env(safe-area-inset-bottom));
  }
}
</style>