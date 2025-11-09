<template>
  <div>
    <!-- Sidebar overlay for mobile -->
    <div v-if="isExpanded" class="sidebar-overlay" @click="toggleSidebar"></div>

    <!-- Sidebar -->
    <div class="sidebar" :class="{ 'expanded': isExpanded }">
      <!-- Toggle button -->
      <button class="toggle-btn" @click="toggleSidebar" :title="isExpanded ? 'Collapse sidebar' : 'Expand sidebar'">
        <svg v-if="!isExpanded" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="3" y1="12" x2="21" y2="12"></line>
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <line x1="3" y1="18" x2="21" y2="18"></line>
        </svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>

      <!-- Sidebar content -->
      <div class="sidebar-content">
        <!-- Title -->
        <div class="sidebar-title">
          <h2>Open Source Panopticon</h2>
          <p class="sidebar-subtitle">Truth Through Verification</p>
        </div>

        <!-- Navigation links -->
        <nav class="sidebar-nav">
          <router-link to="/" class="nav-item" @click="closeSidebarOnMobile">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
            <span>Home</span>
          </router-link>

          <router-link to="/about" class="nav-item" @click="closeSidebarOnMobile">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="16" x2="12" y2="12"></line>
              <line x1="12" y1="8" x2="12.01" y2="8"></line>
            </svg>
            <span>About</span>
          </router-link>
        </nav>

        <!-- Divider -->
        <div class="sidebar-divider"></div>

        <!-- Company section -->
        <div class="sidebar-section">
          <h3 class="section-title">DoublethinkSolutions</h3>

          <a href="https://doublethinksolutions.com" target="_blank" rel="noopener noreferrer" class="external-link">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="2" y1="12" x2="22" y2="12"></line>
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
            </svg>
            <span>Website</span>
          </a>

          <a href="https://github.com/doublethinksolutions" target="_blank" rel="noopener noreferrer" class="external-link">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
            </svg>
            <span>GitHub</span>
          </a>

          <a href="https://www.linkedin.com/company/doublethink-solutions" target="_blank" rel="noopener noreferrer" class="external-link">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
              <rect x="2" y="9" width="4" height="12"></rect>
              <circle cx="4" cy="4" r="2"></circle>
            </svg>
            <span>LinkedIn</span>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const isExpanded = ref(false);

const toggleSidebar = () => {
  isExpanded.value = !isExpanded.value;
};

const closeSidebarOnMobile = () => {
  // Close sidebar on mobile after clicking a link
  if (window.innerWidth <= 768) {
    isExpanded.value = false;
  }
};

// Close sidebar when pressing Escape key
const handleEscape = (event) => {
  if (event.key === 'Escape' && isExpanded.value) {
    isExpanded.value = false;
  }
};

onMounted(() => {
  window.addEventListener('keydown', handleEscape);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleEscape);
});
</script>

<style scoped>
.sidebar-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 998;
  display: none;
}

@media (max-width: 768px) {
  .sidebar-overlay {
    display: block;
  }
}

.sidebar {
  position: fixed;
  left: 0;
  top: 0;
  height: 100vh;
  background-color: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(16px);
  border-right: 1px solid rgba(0, 0, 0, 0.1);
  box-shadow: 2px 0 12px rgba(0, 0, 0, 0.1);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 999;
  width: 60px;
  overflow: hidden;
}

.sidebar.expanded {
  width: 280px;
}

.toggle-btn {
  position: absolute;
  top: 16px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(37, 99, 235, 0.1);
  border: 1px solid rgba(37, 99, 235, 0.2);
  border-radius: 8px;
  padding: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #2563eb;
  z-index: 1000;
}

.sidebar.expanded .toggle-btn {
  left: auto;
  right: 16px;
  transform: none;
}

.toggle-btn:hover {
  background: rgba(37, 99, 235, 0.2);
  border-color: rgba(37, 99, 235, 0.3);
}

.toggle-btn:active,
.toggle-btn:focus {
  background: rgba(37, 99, 235, 0.25);
  outline: none;
}

.sidebar-content {
  margin-top: 70px;
  padding: 20px;
  opacity: 0;
  transition: opacity 0.3s ease 0.1s;
  pointer-events: none;
}

.sidebar.expanded .sidebar-content {
  opacity: 1;
  pointer-events: auto;
}

.sidebar-title {
  margin-bottom: 30px;
}

.sidebar-title h2 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #111827;
  margin: 0 0 8px 0;
  line-height: 1.3;
}

.sidebar-subtitle {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0;
  font-style: italic;
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 24px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  color: #374151;
  text-decoration: none;
  border-radius: 8px;
  transition: all 0.2s ease;
  font-weight: 500;
}

.nav-item:hover {
  background-color: rgba(37, 99, 235, 0.08);
  color: #2563eb;
}

.nav-item.router-link-active {
  background-color: rgba(37, 99, 235, 0.15);
  color: #2563eb;
}

.nav-item svg {
  flex-shrink: 0;
}

.sidebar-divider {
  height: 1px;
  background: linear-gradient(to right, transparent, rgba(0, 0, 0, 0.1), transparent);
  margin: 24px 0;
}

.sidebar-section {
  margin-bottom: 24px;
}

.section-title {
  font-size: 0.875rem;
  font-weight: 700;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin: 0 0 12px 0;
}

.external-link {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 16px;
  color: #374151;
  text-decoration: none;
  border-radius: 8px;
  transition: all 0.2s ease;
  font-size: 0.95rem;
  margin-bottom: 4px;
}

.external-link:hover {
  background-color: rgba(0, 0, 0, 0.05);
  color: #2563eb;
}

.external-link svg {
  flex-shrink: 0;
}

/* Mobile adjustments */
@media (max-width: 768px) {
  .sidebar {
    width: 0;
    border-right: none;
  }

  .sidebar.expanded {
    width: 280px;
  }

  .toggle-btn {
    left: 16px;
    transform: none;
  }

  .sidebar.expanded .toggle-btn {
    right: 16px;
    left: auto;
  }
}
</style>
