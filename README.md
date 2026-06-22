# User Analytics Application

A full-stack analytics application built with the MERN stack that tracks user interactions on web pages and visualizes user behavior through session analytics and heatmaps.

## Overview

This project captures user interactions such as page views and clicks, stores them in MongoDB, and provides a dashboard to analyze user sessions and click behavior.

## Features

### Event Tracking

- Track page views
- Track click events
- Generate unique session IDs
- Store page URLs and timestamps
- Capture click coordinates (X, Y)
- Send events to backend APIs in real-time

### Session Analytics

- View all user sessions
- Display total event count per session
- Explore complete user journeys
- Sort events chronologically

### Heatmap Visualization

- Filter click events by page URL
- Visualize click positions as heatmap points
- Analyze user interaction patterns

## Tech Stack

### Frontend

- React.js
- Vite
- React Router DOM
- Axios
- CSS

### Backend

- Node.js
- Express.js

### Database

- MongoDB Atlas
- Mongoose


## Project Structure

```bash
causal/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── server.js
│   └── package.json
│
├── frontend/
│   ├── index.html
│   ├── package.json
│   ├── public/
│   ├── src/
│   │   │
│   │   ├── pages/
│   │   │   ├── HeatmapPage.jsx
│   │   │   ├── SessionsPage.jsx
│   │   │   └── SessionDetailsPage.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── ui/
│   │   │   ├── LoadingSpinner.jsx
│   │   │   ├── Skeleton.jsx
│   │   │   ├── StateMessage.jsx
│   │   │   └── ui.css
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   └── vite.config.js
│
├── tracking.js
└── README.md
```

## Installation & Setup

### Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file:

```env
PORT=4000
MONGODB_URI=your_mongodb_atlas_connection_string
```

Start the server:

```bash
npm start
```

Backend will run on:

http://localhost:4000

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend will run on:

http://localhost:5173

## API Endpoints

### Store Event

```http
POST /api/events
```

Request Body:

```json
{
  "sessionId": "session123",
  "eventType": "click",
  "pageUrl": "http://localhost:5173/home",
  "timestamp": "2026-06-22T10:00:00Z",
  "clickX": 120,
  "clickY": 250
}
```

### Get All Sessions

```http
GET /api/sessions
```

Response:

```json
[
  {
    "sessionId": "session123",
    "totalEvents": 10
  }
]
```

### Get Session Events

```http
GET /api/sessions/:sessionId
```

Returns all events associated with a specific session.

### Get Heatmap Data

```http
GET /api/heatmap?pageUrl=http://localhost:5173/home
```

Response:

```json
[
  {
    "_id": "eventId",
    "pageUrl": "http://localhost:5173/home",
    "clickX": 120,
    "clickY": 250,
    "timestamp": "2026-06-22T10:00:00Z"
  }
]
```

## Tracking Script

The project includes a lightweight `tracking.js` script that can be embedded into web pages.

### Tracked Events

- `page_view`
- `click`

## Dashboard Pages

### Sessions Page

- Session ID
- Total Event Count

### Session Details Page

- Event Type
- Timestamp
- Page URL
- Click Coordinates

### Heatmap Page

- Visualizes click positions as points for the selected `pageUrl`

## Assumptions

- Session IDs are stored in browser localStorage.
- Click coordinates are stored as raw mouse coordinates.
- No authentication is required for this assignment.
- Events are stored individually for easier querying and aggregation.

## Future Enhancements

- Interactive heatmap with intensity visualization
- Session replay functionality
- Event filtering and search
- Analytics charts and reports
- User authentication and role management
- Event batching for improved performance

## Author

**Omkar Kardel**

Full Stack Developer | MERN Stack Developer

GitHub: https://github.com/omkarkardel

