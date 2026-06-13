import { useEffect } from 'react';

/**
 * useLeafletCss
 * Dynamically injects Leaflet's CSS file into the document head if it is not already loaded.
 * Prevents Leaflet CSS from blocking initial load/render on non-map routes (like Landing and Login).
 */
export function useLeafletCss() {
  useEffect(() => {
    const selector = 'link[href*="leaflet.css"], link[href*="leaflet@"]';
    if (document.querySelector(selector)) {
      return;
    }

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    link.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
    link.crossOrigin = '';

    document.head.appendChild(link);
  }, []);
}
