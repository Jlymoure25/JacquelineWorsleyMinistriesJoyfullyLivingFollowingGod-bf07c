# Performance Optimization Guide

## Loading Performance

### Critical Resource Optimization
```html
<!-- Preconnect to external domains -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://w.soundcloud.com">

<!-- Optimized font loading -->
<link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&display=swap" rel="stylesheet">
```

### JavaScript Performance
- **Async Loading**: Scripts loaded asynchronously
- **Event Delegation**: Single event listeners for multiple elements
- **Debouncing**: Rate-limited API calls and DOM updates

### CSS Performance
```css
/* Hardware acceleration for animations */
.section {
    transform: translateZ(0);
    will-change: transform;
}

/* Efficient animations */
@keyframes fadeIn {
    from { opacity: 0; transform: translate3d(0, 20px, 0); }
    to { opacity: 1; transform: translate3d(0, 0, 0); }
}
```

## SoundCloud API Performance

### Efficient Event Handling
```javascript
// Throttled progress monitoring
let lastVolumeCheck = 0;
scWidget.bind(SC.Widget.Events.PLAY_PROGRESS, (data) => {
    const now = Date.now();
    if (now - lastVolumeCheck > 5000) { // Every 5 seconds
        scWidget.setVolume(17);
        lastVolumeCheck = now;
    }
});
```

### Memory Management
```javascript
class AudioManager {
    constructor() {
        this.intervals = new Set();
        this.eventListeners = new Map();
    }
    
    addInterval(interval) {
        this.intervals.add(interval);
    }
    
    cleanup() {
        // Clear all intervals
        this.intervals.forEach(clearInterval);
        this.intervals.clear();
        
        // Remove event listeners
        this.eventListeners.forEach((listener, element) => {
            element.removeEventListener(listener.event, listener.handler);
        });
        this.eventListeners.clear();
    }
}
```

## Mobile Performance

### Touch Optimization
```javascript
// Passive event listeners for better scrolling
document.addEventListener('touchstart', handleTouch, { passive: true });
document.addEventListener('touchmove', handleTouch, { passive: true });
```

### Viewport Management
```css
/* Prevent zoom on input focus */
input, textarea, select {
    font-size: 16px;
}

/* Optimize for mobile viewports */
.section {
    height: 100vh;
    height: calc(var(--vh, 1vh) * 100);
}
```

### Reduced Motion Support
```css
@media (prefers-reduced-motion: reduce) {
    * {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
    }
}
```

## Network Performance

### Resource Hints
```html
<!-- DNS prefetch for external resources -->
<link rel="dns-prefetch" href="//w.soundcloud.com">

<!-- Preload critical resources -->
<link rel="preload" href="styles.css" as="style">
<link rel="preload" href="script.js" as="script">
```

### Compression
```javascript
// Netlify automatically enables:
// - Gzip compression
// - Brotli compression  
// - Asset optimization
```

## Core Web Vitals Optimization

### Largest Contentful Paint (LCP)
- Critical CSS inlined
- Hero fonts preloaded
- Images optimized with proper dimensions

### First Input Delay (FID)  
```javascript
// Non-blocking initialization
requestIdleCallback(() => {
    initializeNonCriticalFeatures();
});
```

### Cumulative Layout Shift (CLS)
```css
/* Prevent layout shift with font loading */
font-display: swap;

/* Reserve space for dynamic content */
.loading-placeholder {
    height: 200px;
    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
}
```

## Monitoring and Analytics

### Performance Monitoring
```javascript
// Custom performance marks
performance.mark('soundcloud-init-start');
// ... SoundCloud initialization
performance.mark('soundcloud-init-end');

performance.measure('soundcloud-init', 'soundcloud-init-start', 'soundcloud-init-end');
```

### Error Tracking
```javascript
window.addEventListener('error', (event) => {
    // Log client-side errors
    console.error('Client error:', {
        message: event.error.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno
    });
});
```

## Caching Strategy

### Browser Caching
```toml
# netlify.toml
[[headers]]
  for = "*.js"
  [headers.values]
    Cache-Control = "public, max-age=31536000"

[[headers]]  
  for = "*.css"
  [headers.values]
    Cache-Control = "public, max-age=31536000"
```

### Service Worker (Optional)
```javascript
// Basic service worker for offline support
self.addEventListener('fetch', (event) => {
    if (event.request.destination === 'document') {
        event.respondWith(
            fetch(event.request).catch(() => {
                return caches.match('/offline.html');
            })
        );
    }
});
```

## Performance Budget

### Metrics Targets
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s  
- **First Input Delay**: < 100ms
- **Cumulative Layout Shift**: < 0.1
- **Total Bundle Size**: < 500KB

### Monitoring Tools
- Google PageSpeed Insights
- Lighthouse CI
- WebPageTest
- Netlify Analytics