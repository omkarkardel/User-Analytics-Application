import { useEffect, useMemo, useRef, useState } from 'react';
import { api } from '../services/api';
import { StateMessage, FullOverlayLoading } from '../ui/StateMessage';
import LoadingSpinner from '../ui/LoadingSpinner';

// Heatmap Page
// Renders click events as dots.
// We normalize clickX/clickY into the heatmap container using getBoundingClientRect().
export default function HeatmapPage() {
  const [pageUrls, setPageUrls] = useState([]);
  const [selectedPageUrl, setSelectedPageUrl] = useState('');

  const [clicks, setClicks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const containerRef = useRef(null);
  const [containerRect, setContainerRect] = useState(null);

  // Prevent stale requests from overwriting a newer selection
  const requestIdRef = useRef(0);

  // Load pageUrl history from localStorage
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('analytics_pageUrls') || '[]');
      if (Array.isArray(saved) && saved.length > 0) {
        setPageUrls(saved);
        setSelectedPageUrl((prev) => prev || saved[0]);
      }
    } catch {
      // ignore
    }
  }, []);

  // Keep container rect updated (for correct dot placement)
  useEffect(() => {
    if (!containerRef.current) return;

    const update = () => {
      const rect = containerRef.current.getBoundingClientRect();
      setContainerRect(rect);
    };

    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  // Convert clicks -> dot positions inside the heatmap container
  const dotPositions = useMemo(() => {
    const rect = containerRect;
    if (
      !rect ||
      !Number.isFinite(rect.width) ||
      !Number.isFinite(rect.height) ||
      rect.width <= 0 ||
      rect.height <= 0
    ) {
      return [];
    }

    const width = rect.width;
    const height = rect.height;

    const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

    return (clicks || [])
      .filter((c) => Number.isFinite(c?.clickX) && Number.isFinite(c?.clickY))
      .map((c) => {
        const localX = c.clickX;
        const localY = c.clickY;

        const x = clamp(localX, 0, width);
        const y = clamp(localY, 0, height);

        return { id: c._id, x, y };
      });
  }, [clicks, containerRect]);

  async function fetchHeatmap(pageUrl) {
    if (!pageUrl) return;

    const myRequestId = ++requestIdRef.current;

    setLoading(true);
    setError('');
    try {
      const res = await api.get('/api/heatmap', {
        params: { pageUrl },
      });

      if (requestIdRef.current !== myRequestId) return;

      setClicks(res.data || []);

      setPageUrls((prev) => {
        const existing = Array.isArray(prev) ? prev : [];
        const next = existing.includes(pageUrl)
          ? existing
          : [pageUrl, ...existing].slice(0, 20);
        try {
          localStorage.setItem('analytics_pageUrls', JSON.stringify(next));
        } catch {
          // ignore
        }
        return next;
      });
    } catch (err) {
      if (requestIdRef.current !== myRequestId) return;
      const msg =
        err?.response?.data?.message ||
        err?.response?.statusText ||
        err?.message ||
        'Failed to load heatmap';
      setError(msg);
    } finally {
      if (requestIdRef.current !== myRequestId) return;
      setLoading(false);
    }
  }

  useEffect(() => {
    if (selectedPageUrl) fetchHeatmap(selectedPageUrl);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPageUrl]);

  const heatmapEmpty = !loading && !error && (clicks || []).length === 0;

  return (
    <div className="ui-page">
      <div className="ui-pageHeader">
        <div>
          <h2 className="ui-pageTitle">Heatmap</h2>
          <p className="ui-pageHint">
            Tip: clicks must be sent with the same <code>pageUrl</code> (from tracking.js).
          </p>
        </div>
      </div>

      <div className="ui-grid" style={{ marginTop: 10 }}>
        <div className="ui-col-6">
          <div className="ui-control">
            <div className="ui-label">Page URL</div>
            <select
              className="ui-select"
              value={selectedPageUrl}
              onChange={(e) => setSelectedPageUrl(e.target.value)}
            >
              <option value="" disabled>
                Select a page
              </option>
              {pageUrls.map((u) => (
                <option key={u} value={u}>
                  {u}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="ui-col-6">
          <div className="ui-control">
            <div className="ui-label">Paste pageUrl</div>
            <div className="ui-row" style={{ alignItems: 'stretch' }}>
              <input
                className="ui-input"
                type="text"
                value={selectedPageUrl}
                onChange={(e) => setSelectedPageUrl(e.target.value)}
                placeholder="Paste pageUrl"
              />
              <button
                type="button"
                onClick={() => fetchHeatmap(selectedPageUrl)}
                className="ui-button ui-buttonPrimary"
                disabled={!selectedPageUrl || loading}
                style={{ minWidth: 120 }}
              >
                Refresh
              </button>
            </div>
          </div>
        </div>
      </div>

      <div
        ref={containerRef}
        className="ui-heatmap"
        style={{ marginTop: 14 }}
      >
        <div style={{ position: 'absolute', top: 10, left: 12, fontSize: 12, color: 'var(--text2)', zIndex: 1 }}>
          Rendering click positions
        </div>

        {loading && (
          <div className="ui-heatmapOverlay">
            <FullOverlayLoading />
          </div>
        )}

        {!loading && error && (
          <div className="ui-heatmapOverlay">
            <StateMessage variant="error" title="Error" message={error} />
          </div>
        )}

        {!loading && !error && heatmapEmpty && (
          <div className="ui-heatmapOverlay">
            <StateMessage variant="empty" title="No analytics data available" />
          </div>
        )}

        {!loading && !error &&
          dotPositions.map((p) => (
            <div
              key={p.id}
              style={{
                position: 'absolute',
                left: `${p.x}px`,
                top: `${p.y}px`,
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: '#ff2b2b',
                transform: 'translate(-50%, -50%)',
                pointerEvents: 'none',
                boxShadow: '0 0 10px rgba(255,43,43,0.55)',
              }}
            />
          ))}
      </div>

      <p style={{ marginTop: 12, color: 'var(--text2)', fontSize: 13 }}>
        Dots are normalized into the heatmap container using browser viewport coordinates.
      </p>

      {/* Safety: if we somehow have a blank state while loading is false */}
      {!loading && !error && (clicks || []).length > 0 ? null : null}
    </div>
  );
}





