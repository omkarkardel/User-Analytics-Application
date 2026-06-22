const express = require('express');

const {
  postEvent,
  getSessions,
  getSessionEvents,
  getHeatmap,
} = require('../controllers/eventController');

const { validateSessionIdParam } = require('../middleware/validateObjectId');

const router = express.Router();

// Store event data.
router.post('/events', postEvent);

// Return all sessions with total event count.
router.get('/sessions', getSessions);

// Return all events for a specific session ordered by timestamp.
router.get('/sessions/:sessionId', validateSessionIdParam, getSessionEvents);

// Return all click events for selected page.
router.get('/heatmap', getHeatmap);

module.exports = router;

