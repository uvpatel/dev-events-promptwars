# EventFlow AI - REST API Documentation

All API endpoints are prefixed with `/api`.

## 1. Events

### `GET /api/events`
List all events.
- **Response**: `{ success: true, data: Event[], count: Number }`

### `GET /api/events/:id`
Get event details.
- **Response**: `{ success: true, data: Event }`

### `GET /api/events/:id/announcements`
Get announcements for an event.
- **Response**: `{ success: true, data: Announcement[] }`

## 2. Crowd Data

### `GET /api/crowd/density`
Get crowd density for all zones.
- **Response**: `{ success: true, data: ZoneDensity[], timestamp: String }`

### `GET /api/crowd/summary`
Get aggregated crowd summary.
- **Response**: `{ success: true, data: CrowdSummary }`

## 3. Queue Times

### `GET /api/queue/times`
Get waiting times. Optional query `?type=food` or `?type=washroom`.
- **Response**: `{ success: true, data: QueueInfo[], recommendation: String }`

## 4. Sessions

### `GET /api/sessions`
Get schedule. Optional queries `?stage=Main` or `?tag=AI`.
- **Response**: `{ success: true, data: Session[], count: Number }`

## 5. View Locations / Booths

### `GET /api/booths`
Get map locations. Optional query `?type=booth`. Includes dynamic `nearbyDensity` data.
- **Response**: `{ success: true, data: Location[], count: Number }`

## 6. AI Chat

### `POST /api/chat/message`
Send a message to the Gemini AI assistant.
- **Body**: `{ message: String, history: Array }`
- **Response**: `{ success: true, data: { reply: String, source: "gemini"|"demo", timestamp: String } }`

## 7. Planner (Auth Required)

### `GET /api/planner`
Get user's saved items.
- **Header**: `Authorization: Bearer <token>`
- **Response**: `{ success: true, data: UserPlan }`

### `POST /api/planner/save`
Save item to plan.
- **Body**: `{ type: "session"|"booth", itemId: String }`

### `DELETE /api/planner/remove`
Remove item.
- **Body**: `{ type: "session"|"booth", itemId: String }`

## 8. Admin (Auth + Admin Role Required)

### `PUT /api/admin/crowd`
Manually override crowd simulation data for a zone.
- **Body**: `{ zoneId: String, percentage: Number(0-100) }`

### `POST /api/admin/sessions`
Create a new session.
- **Body**: `{ title: String, stage: String, startTime: Date, endTime: Date, speaker: String, description: String }`
