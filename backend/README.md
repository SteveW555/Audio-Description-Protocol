# Audio Protocol Backend - AI Phrase Generation Service

Backend service for generating AI-powered natural language descriptions of musical content using GPT-5 Nano.

## Features

- **AI Phrase Generation**: GPT-5 Nano generates concise 10-30 word descriptions
- **Rate Limiting**: 30 requests/minute, 1000 requests/hour, max 3 concurrent
- **Cost Tracking**: $0.10/session, $0.50/day limits with persistent tracking
- **Email Notifications**: Automatic alerts to joeyfoursheds@gmail.com when limits reached
- **Retry Logic**: 2-second retry for transient errors
- **Validation**: Word count and content validation

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Configuration

Create `.env` file from `.env.example`:

```bash
cp .env.example .env
```

Configure the following variables:

```env
# OpenAI API Configuration
OPENAI_API_KEY=your_openai_api_key_here

# SMTP Configuration (Gmail example)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password_here

# Notification Configuration
NOTIFY_EMAIL=joeyfoursheds@gmail.com

# Server Configuration
PORT=3001
NODE_ENV=development
```

**Gmail SMTP Setup:**
1. Enable 2-factor authentication on your Google account
2. Generate an "App Password" at https://myaccount.google.com/apppasswords
3. Use the app password as `SMTP_PASS`

### 3. Run Development Server

```bash
npm run dev
```

Server will start on `http://localhost:3001`

### 4. Build for Production

```bash
npm run build
node dist/index.js
```

## API Documentation

### POST `/api/generate-phrase`

Generates an AI-powered natural language description from wizard data.

**Request Body:**
```json
{
  "wizardData": {
    "genre": { "primary": "rock" },
    "mood": ["energetic", "upbeat"],
    "energy": ["high-energy"],
    "instrumentation": [
      { "instrument": "guitar", "role": "lead" }
    ],
    "vocals": { "presence": "lead" },
    "bpm": 140
  },
  "sessionId": "uuid-v4-session-id",
  "requestId": "uuid-v4-request-id"
}
```

**Response (200 OK):**
```json
{
  "phrase": "An energetic rock track with driving guitar and upbeat vocals",
  "confidence": 0.9,
  "tokensUsed": 45,
  "costUSD": 0.0045,
  "requestId": "uuid-v4-request-id",
  "timestamp": "2025-09-30T12:34:56.789Z"
}
```

**Error Responses:**

- **400 Bad Request**: Missing or invalid request fields
- **429 Too Many Requests**: Rate limit or cost limit exceeded
- **500 Internal Server Error**: Generation failed

## Rate Limits

| Limit Type | Threshold | Window |
|------------|-----------|--------|
| Requests per minute | 30 | 60 seconds |
| Requests per hour | 1000 | 3600 seconds |
| Concurrent requests | 3 | N/A |
| Cost per session | $0.10 | Session lifetime |
| Cost per day | $0.50 | 24 hours |
| Tokens per request | 900 | Per request |

## Architecture

```
backend/
├── src/
│   ├── services/           # Core business logic
│   │   ├── openai-client.ts       # OpenAI API integration
│   │   ├── rate-limiter.ts        # Multi-tier rate limiting
│   │   ├── cost-tracker.ts        # Session/daily cost tracking
│   │   └── email-notifier.ts      # Email notifications
│   ├── routes/             # API endpoints
│   │   └── generate-phrase.ts     # Phrase generation endpoint
│   ├── middleware/         # Express middleware
│   │   ├── error-handler.ts       # Error handling
│   │   └── logger.ts              # Request/response logging
│   ├── types/              # TypeScript type definitions
│   │   └── index.ts
│   └── index.ts            # Application entry point
└── tests/                  # Test suites
    ├── unit/              # Unit tests
    ├── integration/       # Integration tests
    └── contract/          # API contract tests
```

## Testing

```bash
# Run all tests
npm test

# Watch mode
npm run test:watch

# Run specific test suite
npm test -- openai-client.test
```

## Development

```bash
# Type checking
npm run build

# Linting
npm run lint
```

## Cost Monitoring

Daily costs are tracked in `daily-costs.json`:

```json
{
  "2025-09-30": 0.245,
  "2025-10-01": 0.158
}
```

## Email Notifications

When limits are reached, an email is automatically sent to `joeyfoursheds@gmail.com` with:
- Limit type (rate/cost)
- Current value
- Threshold
- Session ID
- Timestamp

## Troubleshooting

### Email not sending
- Verify SMTP credentials in `.env`
- Check Gmail app password is correct
- Ensure 2FA is enabled on Google account

### Rate limits too restrictive
- Adjust limits in `src/services/rate-limiter.ts`
- Modify constants: `MINUTE_LIMIT`, `HOUR_LIMIT`, `CONCURRENT_LIMIT`

### Cost tracking file errors
- Check `COST_TRACKING_FILE` path in `.env`
- Ensure write permissions in directory

## License

ISC
