const Event = require('../models/Event');

// Helper: validate event payload
function validateEventBody(body) {
  const errors = [];

  const { sessionId, eventType, pageUrl, timestamp, clickX, clickY } = body || {};

  if (!sessionId || typeof sessionId !== 'string' || sessionId.trim().length === 0) {
    errors.push('sessionId is required');
  }

  if (eventType !== 'page_view' && eventType !== 'click') {
    errors.push('eventType must be "page_view" or "click"');
  }

  if (!pageUrl || typeof pageUrl !== 'string' || pageUrl.trim().length === 0) {
    errors.push('pageUrl is required');
  }

  // Accept timestamp as Date string or number (ms). Store as Date.
  const parsedTime = timestamp ? new Date(timestamp) : null;
  if (!timestamp || Number.isNaN(parsedTime.getTime())) {
    errors.push('timestamp is required and must be a valid date');
  }

  if (eventType === 'click') {
    if (typeof clickX !== 'number' || Number.isNaN(clickX)) errors.push('clickX is required for click events');
    if (typeof clickY !== 'number' || Number.isNaN(clickY)) errors.push('clickY is required for click events');
  }

  return { isValid: errors.length === 0, errors };
}

// POST /api/events
// Store event data.
async function postEvent(req, res) {
  try {
    const { isValid, errors } = validateEventBody(req.body);
    if (!isValid) {
      return res.status(400).json({ message: 'Validation error', errors });
    }

    const { sessionId, eventType, pageUrl, timestamp, clickX, clickY } = req.body;

    const event = await Event.create({
      sessionId: sessionId.trim(),
      eventType,
      pageUrl: pageUrl.trim(),
      timestamp: new Date(timestamp),
      clickX: eventType === 'click' ? clickX : null,
      clickY: eventType === 'click' ? clickY : null,
    });

    return res.status(201).json({ message: 'Event stored', eventId: event._id });
  } catch (err) {
    console.error('postEvent error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
}

// GET /api/sessions
// Return all sessions with total event count.
async function getSessions(req, res) {
  try {
    // Group by sessionId and count.
    const sessions = await Event.aggregate([
      {
        $group: {
          _id: '$sessionId',
          totalEvents: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          sessionId: '$_id',
          totalEvents: 1,
        },
      },
      { $sort: { totalEvents: -1 } },
    ]);

    return res.json(sessions);
  } catch (err) {
    console.error('getSessions error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
}

// GET /api/sessions/:sessionId
// Return all events for a specific session ordered by timestamp.
async function getSessionEvents(req, res) {
  try {
    const { sessionId } = req.params;

    const events = await Event.find({ sessionId })
      .sort({ timestamp: 1 })
      .select('-__v');

    return res.json(events);
  } catch (err) {
    console.error('getSessionEvents error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
}

// GET /api/heatmap?pageUrl=...
// Return all click events for selected page.
async function getHeatmap(req, res) {
  try {
    const pageUrl = req.query.pageUrl;

    if (!pageUrl || typeof pageUrl !== 'string' || pageUrl.trim().length === 0) {
      return res.status(400).json({ message: 'pageUrl query param is required' });
    }

    const clicks = await Event.find({
      pageUrl: pageUrl.trim(),
      eventType: 'click',
    })
      .sort({ timestamp: 1 })
      .select('clickX clickY timestamp pageUrl');

    // Return format suitable for the frontend heatmap dots.
    return res.json(clicks);
  } catch (err) {
    console.error('getHeatmap error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
}

module.exports = {
  postEvent,
  getSessions,
  getSessionEvents,
  getHeatmap,
};

