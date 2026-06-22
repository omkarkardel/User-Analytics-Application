import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../services/api';
import { StateMessage } from '../ui/StateMessage';
import LoadingSpinner from '../ui/LoadingSpinner';
import { SkeletonBlock } from '../ui/Skeleton';

// Session Details Page
// Shows eventType, timestamp, and pageUrl for all events ordered by backend.
export default function SessionDetailsPage() {
  const { sessionId } = useParams();

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setError('');
        const res = await api.get(`/api/sessions/${encodeURIComponent(sessionId)}`);
        setEvents(res.data || []);
      } catch (err) {
        const msg =
          err?.response?.data?.message ||
          err?.response?.statusText ||
          err?.message ||
          'Failed to load session events';
        setError(msg);
      } finally {
        setLoading(false);
      }
    }

    if (sessionId) load();
  }, [sessionId]);

  const hasData = useMemo(() => Array.isArray(events) && events.length > 0, [events]);

  return (
    <div className="ui-page">
      <div className="ui-pageHeader">
        <div>
          <h2 className="ui-pageTitle">Session Details</h2>
          <p className="ui-pageHint">
            <strong style={{ color: 'var(--text-h)' }}>Session ID:</strong> {sessionId}
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button
            type="button"
            className="ui-button"
            style={{ height: 40, borderColor: 'rgba(229,228,231,0.9)', background: 'transparent' }}
            onClick={() => window.history.back()}
          >
            ← Back
          </button>
          {loading ? <LoadingSpinner size={40} /> : null}
        </div>
      </div>


      {error && (
        <div style={{ marginTop: 10 }}>
          <StateMessage variant="error" title="Could not load session" message={error} />
        </div>
      )}

      {!loading && !error && !hasData && (
        <div style={{ marginTop: 14 }}>
          <StateMessage variant="empty" title="No analytics data available" />
        </div>
      )}

      {loading && (
        <div style={{ marginTop: 10 }}>
          <div className="ui-tableWrap">
            <table className="ui-table" style={{ tableLayout: 'fixed' }}>
              <colgroup>
                <col style={{ width: 170 }} />
                <col style={{ width: 230 }} />
                <col style={{ width: 320 }} />
                <col style={{ width: 90 }} />
                <col style={{ width: 90 }} />
              </colgroup>
              <thead>
                <tr>
                  <th className="ui-th">Event Type</th>
                  <th className="ui-th">Timestamp</th>
                  <th className="ui-th" style={{ paddingLeft: 12 }}>Page URL</th>
                  <th className="ui-th" style={{ textAlign: 'center' }}>Click X</th>
                  <th className="ui-th" style={{ textAlign: 'center' }}>Click Y</th>
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: 7 }).map((_, i) => (
                  <tr key={i}>
                    <td className="ui-td" style={{ overflow: 'hidden', textOverflow: 'ellipsis', textAlign: 'left' }}>
                      <SkeletonBlock height={12} style={{ width: '65%' }} />
                    </td>
                    <td className="ui-td" style={{ textAlign: 'left' }}>
                      <SkeletonBlock height={12} style={{ width: '80%' }} />
                    </td>
                    <td className="ui-td" style={{ overflow: 'hidden', textOverflow: 'ellipsis', textAlign: 'left' }}>
                      <SkeletonBlock height={12} style={{ width: '90%' }} />
                    </td>
                    <td className="ui-td" style={{ width: 90, textAlign: 'center' }}>
                      <SkeletonBlock height={12} style={{ width: 46 }} />
                    </td>
                    <td className="ui-td" style={{ width: 90, textAlign: 'center' }}>
                      <SkeletonBlock height={12} style={{ width: 46 }} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {!loading && !error && hasData && (
        <div style={{ marginTop: 10 }}>
          <div className="ui-tableWrap">
            <table className="ui-table" style={{ tableLayout: 'fixed' }}>
              <colgroup>
                <col style={{ width: 170 }} />
                <col style={{ width: 230 }} />
                <col style={{ width: 320 }} />
                <col style={{ width: 90 }} />
                <col style={{ width: 90 }} />
              </colgroup>
              <thead>
                <tr>
                  <th className="ui-th">Event Type</th>
                  <th className="ui-th">Timestamp</th>
                  <th className="ui-th">Page URL</th>
                  <th className="ui-th" style={{ textAlign: 'center' }}>Click X</th>
                  <th className="ui-th" style={{ textAlign: 'center' }}>Click Y</th>
                </tr>
              </thead>
              <tbody>
                {events.map((ev) => (
                  <tr key={ev._id}>
                    <td className="ui-td" style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {ev.eventType}
                    </td>
                    <td className="ui-td">
                      {ev.timestamp ? new Date(ev.timestamp).toLocaleString() : ''}
                    </td>
                    <td
                      className="ui-td"
                      style={{ maxWidth: 320, overflow: 'hidden', textOverflow: 'ellipsis' }}
                      title={ev.pageUrl}
                    >
                      {ev.pageUrl}
                    </td>
                    <td className="ui-td" style={{ width: 90 }}>
                      <span className="ui-codeCell">{ev.clickX ?? ''}</span>
                    </td>
                    <td className="ui-td" style={{ width: 90 }}>
                      <span className="ui-codeCell">{ev.clickY ?? ''}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}


