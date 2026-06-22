import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { SkeletonBlock } from '../ui/Skeleton';
import { StateMessage } from '../ui/StateMessage';
import LoadingSpinner from '../ui/LoadingSpinner';

export default function SessionsPage() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setError('');
        const res = await api.get('/api/sessions');
        setSessions(res.data || []);
      } catch (err) {
        const msg =
          err?.response?.data?.message ||
          err?.response?.statusText ||
          err?.message ||
          'Failed to load sessions';
        setError(msg);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const hasData = Array.isArray(sessions) && sessions.length > 0;

  return (
    <div className="ui-page">
      <div className="ui-pageHeader">
        <div>
          <h2 className="ui-pageTitle">Sessions</h2>
          <p className="ui-pageHint">Explore analytics sessions and drill into events.</p>
        </div>
      </div>

      {loading && (
        <div className="ui-grid" style={{ marginTop: 10 }}>
          <div className="ui-col-12" style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
            <LoadingSpinner size={42} />
            <div style={{ flex: 1 }}>
              <SkeletonBlock height={14} style={{ width: '45%', marginBottom: 10 }} />
              <SkeletonBlock height={14} style={{ width: '70%', marginBottom: 10 }} />
              <SkeletonBlock height={14} style={{ width: '60%' }} />
            </div>
          </div>
        </div>
      )}

      {error && (
        <div style={{ marginTop: 12 }}>
          <StateMessage variant="error" title="Something went wrong" message={error} />
        </div>
      )}

      {!loading && !error && !hasData && (
        <div style={{ marginTop: 14 }}>
          <StateMessage variant="empty" title="No analytics data available" />
        </div>
      )}

      {!loading && !error && hasData && (
        <div className="ui-grid" style={{ marginTop: 10 }}>
          {sessions.map((s) => (
            <div key={s.sessionId} className="ui-col-4">
              <button
                type="button"
                onClick={() =>
                  navigate(`/sessions/${encodeURIComponent(s.sessionId)}`)
                }
                style={{
                  width: '100%',
                  textAlign: 'left',
                  cursor: 'pointer',
                  background: 'transparent',
                  border: 'none',
                  padding: 0,
                }}
              >
                <div
                  className="ui-card"
                  style={{
                    height: '100%',
                    background: 'linear-gradient(180deg, rgba(170,59,255,0.10), rgba(170,59,255,0.03))',
                    borderColor: 'var(--card-border)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10 }}>
                    <div>
                      <div style={{ fontWeight: 850, color: 'var(--text-h)', marginBottom: 6 }}>
                        {s.sessionId}
                      </div>
                      <div style={{ fontSize: 13, color: 'var(--text2)' }}>
                        Total Events
                      </div>
                    </div>
                    <div
                      style={{
                        fontFamily: 'var(--mono)',
                        fontWeight: 900,
                        color: 'var(--text-h)',
                        border: '1px solid var(--card-border)',
                        padding: '8px 10px',
                        borderRadius: 12,
                        background: 'rgba(170,59,255,0.14)',
                        whiteSpace: 'nowrap',
                        minWidth: 92,
                        textAlign: 'center',
                      }}
                    >
                      {s.totalEvents}
                    </div>
                  </div>

                  <div style={{ marginTop: 12, display: 'flex', alignItems: 'center' }}>
                    <span style={{ color: 'var(--accent)', fontWeight: 800 }}>View details</span>
                    <span style={{ marginLeft: 6, color: 'var(--text2)' }}>→</span>
                  </div>
                </div>
              </button>
            </div>
          ))}
        </div>
      )}

      {loading && !error && hasData === false && (
        <div className="ui-grid" style={{ marginTop: 12 }}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="ui-col-4">
              <div className="ui-card">
                <SkeletonBlock height={18} style={{ width: '60%', marginBottom: 10 }} />
                <SkeletonBlock height={14} style={{ width: '40%', marginBottom: 10 }} />
                <SkeletonBlock height={12} style={{ width: '80%' }} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


