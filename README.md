# 🤖 Groq Chatbot - Node.js Backend + Web UI

Complete chatbot setup using Groq API with a beautiful web interface.

## Project Structure

```
Chabot/
├── server.js           # Express backend
├── package.json        # Dependencies
├── .env               # API key (configured)
├── public/
│   └── index.html     # Web UI for testing
└── README.md          # This file
```

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

This installs:
- **express** - Web server
- **cors** - Cross-Origin Resource Sharing
- **dotenv** - Environment variables
- **openai** - Groq API client

### 2. Configure .env File

Create a `.env` file in the root directory:
```
GROQ_API_KEY=your_api_key_here
PORT=3000
```

**To get your API key:**
1. Go to: https://console.groq.com/keys
2. Create/Copy your API key
3. Paste it in `.env` file as `GROQ_API_KEY=gsk_xxxxx`

⚠️ **Never commit `.env` to GitHub!** It's in `.gitignore`

### 3. Start the Server

```bash
npm start
```

or

```bash
node server.js
```

You should see:
```
🚀 Server running on http://localhost:3000
📝 Chat endpoint: POST http://localhost:3000/chat
💻 Web UI: http://localhost:3000
```

### 4. Open Web UI

Go to: **http://localhost:3000**

## Features

✅ **Beautiful Chat Interface**
- Real-time message streaming
- Typing indicators
- Smooth animations
- Responsive design

✅ **AI Model**
- Using Llama 3.3 70B (latest Groq model)
- Fast inference
- High quality responses

✅ **Error Handling**
- Detailed error messages
- Connection error detection
- Graceful error display

## API Endpoints

### POST /chat

Send a message to the chatbot.

**Request:**
```json
{
  "message": "What is artificial intelligence?"
}
```

**Response:**
```json
{
  "reply": "Artificial intelligence is...",
  "success": true
}
```

**Error Response:**
```json
{
  "error": "Something went wrong",
  "details": "error message",
  "success": false
}
```

### GET /health

Check if server is running.

**Response:**
```json
{
  "status": "Server is running"
}
```

## Testing with cURL

```bash
curl -X POST http://localhost:3000/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello, who are you?"}'
```

## Troubleshooting

### "Cannot find module 'express'"
```bash
npm install
```

### "API Key Error"
- Verify `GROQ_API_KEY` in `.env` is correct
- Check for extra spaces or quotes

### "Port 3000 already in use"
- Kill the process: `lsof -ti:3000 | xargs kill -9`
- Or use a different port in `.env`

### "CORS Error"
- CORS is enabled in `server.js`
- Try opening from `http://localhost:3000` directly

## Deployment

To deploy online:

1. **Heroku:**
   ```bash
   heroku create
   heroku config:set GROQ_API_KEY=your_key
   git push heroku main
   ```

2. **Vercel/Netlify:**
   - Backend on Railway, Render, or Heroku
   - Frontend on Vercel/Netlify

3. **Docker:**
   ```dockerfile
   FROM node:18
   WORKDIR /app
   COPY package*.json ./
   RUN npm install
   COPY . .
   EXPOSE 3000
   CMD ["node", "server.js"]
   ```

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| GROQ_API_KEY | - | Your Groq API key (required) |
| PORT | 3000 | Server port |

## Model Options

You can change the AI model in `server.js`:

```javascript
model: "llama-3.3-70b-versatile",  // Current
model: "llama-3.1-70b-versatile",  // Alternative
model: "mixtral-8x7b-32768",       // Alternative
```

## Security Notes

⚠️ **IMPORTANT:**
- Never commit `.env` to version control
- Add `.env` to `.gitignore`
- Rotate API keys regularly
- Keep `openai` package updated

```
# .gitignore
.env
node_modules/
```

## Support

- **Groq Docs:** https://console.groq.com/docs
- **Express Docs:** https://expressjs.com/
- **OpenAI SDK:** https://github.com/openai/node-sdk

---

**Made with ❤️ using Node.js + Groq API**
