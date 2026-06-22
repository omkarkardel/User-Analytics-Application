/*
  tracking.js
  Simple client-side tracker to send analytics events to the backend.

  Usage (include in any webpage):
    <script src="/path/to/tracking.js"></script>
    <script>
      window.AnalyticsTracker.init({
        backendUrl: 'http://localhost:5000' // optional, default below
      });
    </script>

  This script:
  - Generates/stores a sessionId in localStorage
  - Sends page_view and click events using fetch()
*/

(function () {
  const DEFAULT_BACKEND_URL = 'http://localhost:5000';
  const SESSION_KEY = 'analytics_session_id';

  // Generate a simple random session id.
  function generateSessionId() {
    // Not cryptographically secure; good enough for beginner analytics demos.
    return 'sess_' + Math.random().toString(16).slice(2) + '_' + Date.now().toString(16);
  }

  function getOrCreateSessionId() {
    try {
      let id = localStorage.getItem(SESSION_KEY);
      if (!id) {
        id = generateSessionId();
        localStorage.setItem(SESSION_KEY, id);
      }
      return id;
    } catch (e) {
      // If localStorage is blocked, fall back to a per-tab session id.
      return generateSessionId();
    }
  }

  function sendEvent({ backendUrl, payload }) {
    // Send JSON using fetch API.
    return fetch(backendUrl + '/api/events', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    }).catch(() => {
      // Ignore errors to avoid breaking the user's page.
    });
  }

  function buildPageUrl() {
    // Include full path; frontend dashboard will show it as-is.
    return window.location.pathname + window.location.search + window.location.hash;
  }

  function init(options) {
    const backendUrl = (options && options.backendUrl) || DEFAULT_BACKEND_URL;

    const sessionId = getOrCreateSessionId();
    const pageUrl = buildPageUrl();
    const now = new Date();

    // 1) page_view event
    sendEvent({
      backendUrl,
      payload: {
        sessionId,
        eventType: 'page_view',
        pageUrl,
        timestamp: now.toISOString(),
      },
    });

    // 2) click event
    // Capture click position relative to the viewport.
    document.addEventListener('click', function (e) {
      // click coordinates
      const clickX = e.clientX;
      const clickY = e.clientY;

      sendEvent({
        backendUrl,
        payload: {
          sessionId,
          eventType: 'click',
          pageUrl,
          timestamp: new Date().toISOString(),
          clickX,
          clickY,
        },
      });
    });
  }

  // Expose a global API for easy import/usage.
  window.AnalyticsTracker = {
    init,
  };
})();

