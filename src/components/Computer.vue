<template>
  <footer class="green-footer">
    <div class="footer-container">
      
      <!-- 1-USTUN: BREND VA IJTIMOIY TARMOQLAR -->
      <div class="footer-col brand-col">
        <div class="brand-header">
          <img :src="brand.logo" :alt="brand.name" class="brand-logo" />
          <div class="brand-info">
            <h2 class="brand-name">{{ brand.name }}</h2>
            <span class="brand-tagline">Specialty Coffee</span>
          </div>
        </div>
        <p class="brand-desc">
          Shinam atmosfera, oliy navli qahva va mazali shirinliklar maskani.
        </p>
        <div class="social-links">
          <a 
            v-for="(s, i) in socialLinks" 
            :key="i" 
            :href="s.url" 
            target="_blank" 
            class="social-btn"
            :title="s.name"
          >
            <span v-html="s.icon"></span>
          </a>
        </div>
      </div>

      <!-- 2-USTUN: NAVIGATSIYA -->
      <div class="footer-col">
        <h3 class="col-title">Navigatsiya</h3>
        <ul class="nav-list">
          <li v-for="(link, i) in navLinks" :key="i">
            <a :href="link.url">{{ link.text }}</a>
          </li>
        </ul>
      </div>

      <!-- 3-USTUN: ALOQA VA ISH VAQTI -->
      <div class="footer-col">
        <h3 class="col-title">Aloqa & Ish vaqti</h3>
        <div class="contact-list">
          <div class="contact-item">
            <span class="item-label">Manzil</span>
            <p class="item-val">{{ contacts.address }}</p>
          </div>
          <div class="contact-item">
            <span class="item-label">Telefon</span>
            <a :href="`tel:${contacts.phone}`" class="item-link">{{ contacts.phone }}</a>
          </div>
          <div class="contact-item">
            <span class="item-label">Ish vaqti</span>
            <p class="item-val">{{ contacts.hours }}</p>
          </div>
        </div>
      </div>

    </div>

    <!-- PASKI MUALLIFLIK QISMI -->
    <div class="footer-bottom">
      <div class="bottom-container">
        <p class="copy-text">&copy; {{ currentYear }} <strong>{{ brand.name }}</strong>. Barcha huquqlar himoyalangan.</p>
        <div class="bottom-links">
          <a href="#">Maxfiylik siyosati</a>
          <span class="dot">•</span>
          <a href="#">Foydalanish shartlari</a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { ref } from 'vue'

const brand = ref({
  logo: '/images/photo_2026-08-31_23-15-56.jpg',
  name: 'Coffich'
})

const contacts = ref({
  address: 'Buxoro sh., Islom Karimov ko\'chasi, 15',
  phone: '+998 90 123 45 67',
  hours: 'Har kuni: 08:00 - 23:00'
})

const currentYear = 2026

const navLinks = ref([
  { text: 'Bosh sahifa', url: '#' },
  { text: 'Biz haqimizda', url: '#' },
  { text: 'Menyu', url: '#' },
  { text: 'Galereya', url: '#' },
  { text: 'Filiallar', url: '#' }
])

const socialLinks = ref([
  {
    name: 'Telegram',
    url: 'https://web.telegram.org/a/#8936625886',
    icon: `<svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>`
  },
  {
    name: 'Instagram',
    url: 'https://www.instagram.com/coffichbukhara/',
    icon: `<svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>`
  },
  {
    name: 'YouTube',
    url: '#',
    icon: `<svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"></path><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="currentColor"></polygon></svg>`
  }
])
</script>

<style>
/* CHEKKA BO'SHLIQLARNI TO'LIQ OLIB TASHASH */
html, body {
  margin: 0 !important;
  padding: 0 !important;
  width: 100% !important;
  max-width: 100% !important;
  overflow-x: hidden;
  box-sizing: border-box;
}

*, *::before, *::after {
  box-sizing: inherit;
}
</style>

<style scoped>
.green-footer {
  width: 100%;
  background-color: #0A1A13;
  color: #E2ECE7;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  box-sizing: border-box;
  border-top: 1px solid rgba(226, 236, 231, 0.08);
}

.footer-container {
  width: 100%;
  display: grid;
  grid-template-columns: 1.5fr 1fr 1.2fr;
  gap: 50px;
  padding: 50px 5%;
  box-sizing: border-box;
}

.footer-col {
  display: flex;
  flex-direction: column;
}

/* BREND */
.brand-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 14px;
}

.brand-logo {
  width: 46px;
  height: 46px;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid #D4B26F;
}

.brand-name {
  font-size: 20px;
  font-weight: 700;
  margin: 0;
  color: #FFFFFF;
}

.brand-tagline {
  font-size: 11px;
  color: #D4B26F;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.brand-desc {
  font-size: 13.5px;
  color: #9DB3A8;
  line-height: 1.5;
  margin: 0 0 18px 0;
}

.social-links {
  display: flex;
  gap: 8px;
}

.social-btn {
  width: 34px;
  height: 34px;
  border-radius: 8px;
  background-color: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #E2ECE7;
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  transition: all 0.2s ease;
}

.social-btn:hover {
  background-color: #D4B26F;
  border-color: #D4B26F;
  color: #0A1A13;
}

/* SARLAVHALAR */
.col-title {
  font-size: 14px;
  font-weight: 600;
  color: #D4B26F;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  margin: 0 0 18px 0;
}

/* NAVIGATSIYA */
.nav-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.nav-list a {
  color: #C1D1C9;
  text-decoration: none;
  font-size: 13.5px;
  transition: color 0.2s ease;
}

.nav-list a:hover {
  color: #D4B26F;
}

/* ALOQA */
.contact-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.item-label {
  display: block;
  font-size: 11px;
  color: #799487;
  text-transform: uppercase;
}

.item-val, .item-link {
  margin: 2px 0 0 0;
  font-size: 13.5px;
  color: #C1D1C9;
}

.item-link {
  text-decoration: none;
  transition: color 0.2s;
}

.item-link:hover {
  color: #D4B26F;
}

/* BOTTOM BAR */
.footer-bottom {
  width: 100%;
  background-color: #06120D;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  padding: 16px 5%;
  box-sizing: border-box;
}

.bottom-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12.5px;
  color: #799487;
}

.copy-text strong {
  color: #E2ECE7;
}

.bottom-links {
  display: flex;
  align-items: center;
  gap: 10px;
}

.bottom-links a {
  color: #799487;
  text-decoration: none;
  transition: color 0.2s;
}

.bottom-links a:hover {
  color: #D4B26F;
}

.dot {
  color: rgba(121, 148, 135, 0.4);
}

/* RESPONSIVE */
@media (max-width: 850px) {
  .footer-container {
    grid-template-columns: 1fr 1fr;
    gap: 30px;
  }
}

@media (max-width: 550px) {
  .footer-container {
    grid-template-columns: 1fr;
    gap: 24px;
    padding: 36px 5%;
  }

  .bottom-container {
    flex-direction: column;
    gap: 8px;
    text-align: center;
  }
}
</style>