<template>
  <div class="about-page">
    <div class="about-container">
      <div class="about-content">
        <div class="page-header">
          <h1>Open Source Panopticon</h1>
          <p class="tagline">Truth Verification Platform</p>
        </div>

        <section class="about-section">
          <h2>What is OSP?</h2>
          <p>
            OSP is a production-ready truth verification platform that enables users to capture and share verifiable media evidence.
            By combining timestamped, geotagged media with a dynamic trust scoring system, OSP creates an immutable archive of
            real-world events for journalistic, civic, and accountability purposes.
          </p>
        </section>

        <section class="about-section">
          <h2>Mission</h2>
          <p>
            Empowering truth through verifiable citizen media. In an age of misinformation and "fake news," OSP provides
            a platform where authenticity and verification are paramount. Every piece of media is timestamped and geotagged,
            creating a trustworthy record of events as they happen.
          </p>
        </section>

        <section class="about-section">
          <h2>Key Features</h2>
          <div class="features-grid">
            <div class="feature-card">
              <div class="feature-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
              </div>
              <h3>Geotagged Media</h3>
              <p>Every submission includes precise location data, creating a geographic map of verifiable events.</p>
            </div>

            <div class="feature-card">
              <div class="feature-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
              </div>
              <h3>Timestamped Evidence</h3>
              <p>Accurate timestamps ensure a chronological record of events as they unfold.</p>
            </div>

            <div class="feature-card">
              <div class="feature-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                </svg>
              </div>
              <h3>Trust Scoring</h3>
              <p>Dynamic trust scores help users identify the most reliable and verified content.</p>
            </div>

            <div class="feature-card">
              <div class="feature-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                  <circle cx="8.5" cy="8.5" r="1.5"></circle>
                  <polyline points="21 15 16 10 5 21"></polyline>
                </svg>
              </div>
              <h3>Image & Video Support</h3>
              <p>Capture and share both photos and videos with full metadata preservation.</p>
            </div>

            <div class="feature-card">
              <div class="feature-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
                  <polyline points="2 17 12 22 22 17"></polyline>
                  <polyline points="2 12 12 17 22 12"></polyline>
                </svg>
              </div>
              <h3>Interactive Map</h3>
              <p>Explore verified media on an interactive world map with real-time clustering and filtering.</p>
            </div>

            <div class="feature-card">
              <div class="feature-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
              </div>
              <h3>Public Access</h3>
              <p>Browse verified media without authentication, ensuring transparency and public accountability.</p>
            </div>
          </div>
        </section>

        <section class="about-section">
          <h2>Use Cases</h2>
          <div class="use-cases">
            <div class="use-case">
              <h3>Journalism</h3>
              <p>Reporters can access verified citizen media from around the world, complete with metadata for fact-checking and sourcing.</p>
            </div>
            <div class="use-case">
              <h3>Civic Accountability</h3>
              <p>Citizens can document public events, government actions, and community issues with verifiable evidence.</p>
            </div>
            <div class="use-case">
              <h3>Research & Documentation</h3>
              <p>Researchers can access a chronological, geographic archive of real-world events for analysis and study.</p>
            </div>
          </div>
        </section>

        <section class="about-section">
          <h2>Technology</h2>
          <p>
            OSP is built with modern, production-ready technologies:
          </p>
          <ul class="tech-list">
            <li><strong>Web Platform:</strong> Vue 3, Vite, Leaflet.js for interactive mapping</li>
            <li><strong>Backend:</strong> FastAPI with PostgreSQL for scalable data management</li>
            <li><strong>Mobile Apps:</strong> Native iOS and Android clients for media capture</li>
            <li><strong>Authentication:</strong> OAuth integration with Apple and Google</li>
            <li><strong>Design:</strong> Modern glassmorphism UI with responsive layouts</li>
          </ul>
        </section>

        <section class="about-section">
          <h2>Platform Components</h2>
          <div class="components">
            <div class="component">
              <h3>Web Interface</h3>
              <p>Public access to verified media with interactive map, advanced filtering, and full-screen media viewing.</p>
            </div>
            <div class="component">
              <h3>Mobile Apps</h3>
              <p>iOS and Android apps for capturing and uploading timestamped, geotagged media from the field.</p>
            </div>
            <div class="component">
              <h3>API Backend</h3>
              <p>FastAPI service providing authentication, media management, and real-time data access.</p>
            </div>
          </div>
        </section>

        <section class="about-section cta-section">
          <h2>Get Involved</h2>
          <p>
            OSP is an open-source project. We welcome contributions from developers, designers, journalists,
            and anyone passionate about truth and accountability.
          </p>
          <div class="cta-buttons">
            <a href="https://github.com/doublethinksolutions" target="_blank" rel="noopener noreferrer" class="cta-button">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
              </svg>
              View on GitHub
            </a>
            <a href="https://doublethinksolutions.com" target="_blank" rel="noopener noreferrer" class="cta-button secondary">
              Learn More
            </a>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup>
// No script needed for this static page
</script>

<style scoped>
.about-page {
  min-height: 100%;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e9f2 100%);
  padding: 20px;
}

.about-container {
  max-width: 1000px;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(16px);
  border-radius: 16px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  margin-bottom: 40px;
}

.about-content {
  padding: 48px 40px;
}

.page-header {
  text-align: center;
  margin-bottom: 48px;
  padding-bottom: 32px;
  border-bottom: 2px solid rgba(37, 99, 235, 0.1);
}

.page-header h1 {
  font-size: 2.5rem;
  margin: 0 0 8px 0;
  font-weight: 700;
  color: #111827;
}

.tagline {
  font-size: 1rem;
  margin: 0;
  color: #6b7280;
  font-weight: 500;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.about-section {
  margin-bottom: 48px;
}

.about-section:last-child {
  margin-bottom: 0;
}

.about-section h2 {
  font-size: 1.5rem;
  color: #111827;
  margin: 0 0 16px 0;
  font-weight: 700;
}

.about-section p {
  font-size: 0.95rem;
  line-height: 1.7;
  color: #4b5563;
  margin: 0 0 12px 0;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
  margin-top: 32px;
}

.feature-card {
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(37, 99, 235, 0.1);
  border-radius: 12px;
  padding: 24px;
  transition: all 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(37, 99, 235, 0.15);
  border-color: rgba(37, 99, 235, 0.3);
}

.feature-icon {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
}

.feature-icon svg {
  color: white;
}

.feature-card h3 {
  font-size: 1.1rem;
  color: #111827;
  margin: 0 0 8px 0;
  font-weight: 600;
}

.feature-card p {
  font-size: 0.875rem;
  color: #6b7280;
  line-height: 1.6;
  margin: 0;
}

.use-cases {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
  margin-top: 24px;
}

.use-case {
  background: linear-gradient(135deg, rgba(37, 99, 235, 0.05) 0%, rgba(37, 99, 235, 0.1) 100%);
  border-left: 4px solid #2563eb;
  padding: 24px;
  border-radius: 8px;
}

.use-case h3 {
  font-size: 1.1rem;
  color: #2563eb;
  margin: 0 0 10px 0;
  font-weight: 600;
}

.use-case p {
  font-size: 0.9rem;
  color: #4b5563;
  line-height: 1.6;
  margin: 0;
}

.tech-list {
  list-style: none;
  padding: 0;
  margin: 16px 0 0 0;
}

.tech-list li {
  font-size: 0.9rem;
  color: #4b5563;
  line-height: 1.8;
  padding-left: 24px;
  position: relative;
}

.tech-list li::before {
  content: "→";
  color: #2563eb;
  font-weight: bold;
  position: absolute;
  left: 0;
}

.components {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
  margin-top: 24px;
}

.component {
  background: rgba(139, 92, 246, 0.05);
  border: 1px solid rgba(139, 92, 246, 0.2);
  border-radius: 12px;
  padding: 24px;
}

.component h3 {
  font-size: 1.1rem;
  color: #8b5cf6;
  margin: 0 0 10px 0;
  font-weight: 600;
}

.component p {
  font-size: 0.9rem;
  color: #4b5563;
  line-height: 1.6;
  margin: 0;
}

.cta-section {
  background: linear-gradient(135deg, rgba(37, 99, 235, 0.05) 0%, rgba(139, 92, 246, 0.05) 100%);
  border-radius: 12px;
  padding: 32px;
  text-align: center;
}

.cta-buttons {
  display: flex;
  gap: 12px;
  justify-content: center;
  margin-top: 24px;
  flex-wrap: wrap;
}

.cta-button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.95rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
}

.cta-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(37, 99, 235, 0.4);
}

.cta-button.secondary {
  background: white;
  color: #2563eb;
  border: 2px solid #2563eb;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.1);
}

.cta-button.secondary:hover {
  background: #2563eb;
  color: white;
  box-shadow: 0 8px 20px rgba(37, 99, 235, 0.3);
}

/* Mobile responsive */
@media (max-width: 768px) {
  .about-page {
    padding: 10px;
  }

  .about-content {
    padding: 32px 24px;
  }

  .page-header h1 {
    font-size: 1.75rem;
  }

  .tagline {
    font-size: 0.875rem;
  }

  .about-section {
    margin-bottom: 32px;
  }

  .about-section h2 {
    font-size: 1.25rem;
  }

  .features-grid,
  .use-cases,
  .components {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .feature-card,
  .use-case,
  .component {
    padding: 20px;
  }

  .cta-section {
    padding: 24px;
  }

  .cta-buttons {
    flex-direction: column;
    align-items: stretch;
  }

  .cta-button {
    justify-content: center;
  }
}
</style>
