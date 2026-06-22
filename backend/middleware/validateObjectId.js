// Basic middleware for validating sessionId route param.
// Note: sessionId is stored as String in schema, so we just ensure it's present & non-empty.
function validateSessionIdParam(req, res, next) {
  const { sessionId } = req.params;

  if (!sessionId || typeof sessionId !== 'string' || sessionId.trim().length === 0) {
    return res.status(400).json({ message: 'sessionId is required' });
  }

  next();
}

module.exports = { validateSessionIdParam };

