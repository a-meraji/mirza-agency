This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
# mirza-agency

# Data Sync API

This API allows external systems to synchronize conversation data, messages, and usage information with the database.

## Authentication

All API requests must include a valid API key in the `X-API-Key` header.

```
X-API-Key: user_api_key_here
```

API keys are associated with users and can be found in the user profile.

## Endpoints

### Create Conversation with Messages and Usage

`POST /api/dashboard/dataSync`

Creates a new conversation with associated messages and usage data.

#### Request Body

```json
{
  "ragSystemId": "rag_system_id_here",
  "conversationId": "unique_conversation_id",
  "messages": [
    {
      "role": "user",
      "text": "Hello, how are you?",
      "executionId": "execution_123"
    },
    {
      "role": "assistant",
      "text": "I'm doing well, thank you for asking!",
      "executionId": "execution_123"
    }
  ],
  "usage": {
    "executionId": "execution_123"
  }
}
```

#### Response

```json
{
  "success": true,
  "data": {
    "conversationId": "mongo_conversation_id",
    "messageCount": 2,
    "usage": {
      "executionId": "execution_123",
      "promptTokens": 10,
      "completionTokens": 15,
      "totalTokens": 25,
      "costEstimated": 0.0005
    }
  }
}
```

### Add Messages and Usage to Existing Conversation

`PUT /api/dashboard/dataSync`

Adds new messages and usage data to an existing conversation.

#### Request Body

```json
{
  "conversationId": "existing_conversation_id",
  "messages": [
    {
      "role": "user",
      "text": "What's the weather like today?",
      "executionId": "execution_456"
    },
    {
      "role": "assistant",
      "text": "It's sunny and warm today!",
      "executionId": "execution_456"
    }
  ],
  "usage": {
    "executionId": "execution_456"
  }
}
```

#### Response

```json
{
  "success": true,
  "data": {
    "conversationId": "mongo_conversation_id",
    "messageCount": 2,
    "usage": {
      "executionId": "execution_456",
      "promptTokens": 8,
      "completionTokens": 12,
      "totalTokens": 20,
      "costEstimated": 0.0004
    }
  }
}
```

## Token Calculation

Tokens and costs are calculated server-side based on the message content:

- **Tokens**: The API automatically calculates token counts for each message
- **Cost**: The cost is estimated based on token counts and predefined rates

You only need to provide the message text - the token counting and cost calculation happen automatically.

## Error Handling

All API endpoints return appropriate HTTP status codes and error messages:

- `400 Bad Request`: Missing or invalid request parameters
- `401 Unauthorized`: Missing or invalid API key
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server-side error

Example error response:

```json
{
  "error": "Missing required fields: conversationId, messages, or usage"
}
```
