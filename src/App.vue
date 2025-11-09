<!-- src/App.vue -->
<template>
  <div class="app-container">
    <Sidebar />
    <main :class="{ 'fullscreen': isFullscreenRoute }">
      <!-- The router will render the matched component here -->
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { RouterView, RouterLink, useRoute } from 'vue-router';
import Sidebar from './components/Sidebar.vue';

const route = useRoute();

// State to track if the user is authenticated
const isAuthenticated = ref(!!localStorage.getItem('token'));

// Check if current route should be fullscreen
const isFullscreenRoute = computed(() => {
  if (!route) return false; // safety check
  return route.path === '/' || route.name === 'Home';
});

// Show different header styles based on route type

// A function to handle signing out
const handleSignOut = () => {
  localStorage.removeItem('token');
  isAuthenticated.value = false;
  window.location.href = '/';
};

// A function to update auth status if it changes in another tab
const checkAuth = () => {
  isAuthenticated.value = !!localStorage.getItem('token');
};

// Listen for storage events to sync login status across tabs
onMounted(() => {
  window.addEventListener('storage', checkAuth);
});

onUnmounted(() => {
  window.removeEventListener('storage', checkAuth);
});
</script>

<style>
/* Global styles - remove scoped to ensure they apply everywhere */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  height: 100%;
}

#app {
  height: 100vh;
  width: 100vw;
}
</style>

<style scoped>
.app-container {
  font-family: Arial, sans-serif;
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: row;
  --header-inset: 75px;
  --sidebar-width: 60px;
}

/* Constrained layout for regular pages */
.app-container:not(:has(.fullscreen)) {
  max-width: none;
}

.app-container:not(:has(.fullscreen)) main {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  height: auto;
  min-height: 100vh;
}

.app-header {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
  flex-shrink: 0;
  justify-content: center;
  position: relative;
}

/* Overlay header for fullscreen routes */
.overlay-header {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 500;
  /* Use a gradient that fades to transparent */
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.5) 0%, rgba(255, 255, 255, 0) 100%);
  backdrop-filter: blur(8px);
  pointer-events: none; /* Allow clicks to pass through the empty parts of the header */
}

.overlay-header > * {
  pointer-events: auto;
}

.overlay-nav {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 15px 20px;
  position: relative; /* This is key for positioning the links */
}

.brand {
  font-size: 1.2rem;
  font-weight: bold;
  color: #333;
}

.overlay-nav-links {
  display: flex;
  align-items: center;
  gap: 15px;
  position: absolute; /* Take the nav out of the normal flow */
  right: 20px; /* Position it on the right side */
}

.overlay-nav-link {
  text-decoration: none;
  color: #007bff;
  font-size: 0.9rem;
  padding: 6px 12px;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.overlay-nav-link:hover {
  background-color: rgba(0,123,255,0.1);
}

.overlay-signout-button {
  background-color: rgba(220, 53, 69, 0.1); /* Transparent red */
  color: #c82333; /* Darker red text */
  border: 1px solid rgba(220, 53, 69, 0.2);
  padding: 6px 12px;
  border-radius: 6px; /* Slightly rounder */
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.2s ease;
}

.overlay-signout-button:hover {
  background-color: #dc3545; /* Solid red on hover */
  color: white;
  border-color: #dc3545;
}

.overlay-signin-link {
  background-color: rgba(0, 123, 255, 0.1); /* Transparent blue */
  color: #0056b3; /* Darker blue text */
  text-decoration: none;
  padding: 6px 12px;
  border-radius: 6px; /* Slightly rounder */
  font-size: 0.9rem;
  font-weight: 500;
  border: 1px solid rgba(0, 123, 255, 0.2);
  transition: all 0.2s ease;
}

.overlay-signin-link:hover {
  background-color: #007bff; /* Solid blue on hover */
  color: white;
  border-color: #007bff;
}

main {
  flex: 1;
  margin-left: var(--sidebar-width);
  transition: margin-left 0.3s ease;
  overflow-y: auto;
  height: 100vh;
}

main.fullscreen {
  height: 100vh;
  width: calc(100vw - var(--sidebar-width));
  overflow: hidden;
}

@media (max-width: 768px) {
  main {
    margin-left: 0;
  }

  main.fullscreen {
    width: 100vw;
  }
}

.nav-link {
  margin-right: 15px;
  text-decoration: none;
  color: #007bff;
}

.signout-button {
  background-color: #dc3545;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 4px;
  cursor: pointer;
}

/* Mobile responsive overlay header */
@media (max-width: 768px) {
  .overlay-nav {
    padding: 12px 15px;
  }
  
  .brand {
    font-size: 1rem;
  }
  
  .overlay-nav-links {
    gap: 10px;
  }
  
  .overlay-nav-link,
  .overlay-signout-button,
  .overlay-signin-link {
    padding: 5px 10px;
    font-size: 0.8rem;
  }
}
</style>
