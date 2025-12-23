# F1GPT - The Ultimate Formula One AI Assistant

F1GPT is an intelligent AI-powered chatbot dedicated to Formula One racing. Ask it anything about F1, from historical facts and driver statistics to race analysis and team information. Built with modern web technologies and powered by advanced language models.

## Features

- 🏎️ **Formula One Expertise**: Specialized knowledge base focused entirely on Formula One racing
- 🤖 **AI-Powered Chat**: Intelligent responses using Claude and OpenAI models
- ⚡ **Real-time Streaming**: Streaming responses for smooth user experience
- 🧠 **Vector Search**: Semantic search using embeddings for accurate context retrieval
- 💾 **Data Persistence**: Astra DB integration for storing and retrieving F1 documents
- 🎨 **Interactive UI**: Clean, user-friendly chat interface with prompt suggestions
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile devices

## Tech Stack

### Frontend
- **Framework**: [Next.js 15](https://nextjs.org/) - React-based full-stack framework
- **Language**: TypeScript - Type-safe development
- **Styling**: CSS - Custom styling with globals.css
- **AI Integration**: [Vercel AI SDK](https://sdk.vercel.ai/) - Unified AI interface

### Backend
- **Runtime**: Node.js with Next.js API Routes
- **LLM Providers**:
  - [OpenAI](https://openai.com/) - GPT models and embeddings
  - [Anthropic](https://www.anthropic.com/) - Claude models
- **Vector Database**: [Astra DB](https://www.datastax.com/products/astra-db) - Managed vector database by DataStax
- **Data Processing**: [LangChain](https://www.langchain.com/) - LLM orchestration and document processing
- **Web Scraping**: [Puppeteer](https://pptr.dev/) - For populating the knowledge base

### Development Tools
- **Package Manager**: npm
- **Linter**: ESLint
- **Build Tool**: TypeScript compiler

## Project Structure

```
f1gpt/
├── app/                          # Next.js app directory
│   ├── api/
│   │   └── chat/
│   │       └── route.ts          # Chat API endpoint (POST /api/chat)
│   ├── components/               # React components
│   │   ├── Bubble.tsx            # Chat message bubble
│   │   ├── LoadingBubble.tsx     # Loading state component
│   │   ├── PromptSuggestionButton.tsx
│   │   └── PromptSuggestionsRow.tsx
│   ├── assets/                   # Static assets
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Home page / chat interface
├── scripts/
│   └── loadDb.ts                 # Script to seed the database with F1 data
├── package.json                  # Project dependencies
├── tsconfig.json                 # TypeScript configuration
├── next.config.ts                # Next.js configuration
├── eslint.config.mjs             # ESLint configuration
└── README.md                      # This file
```

## Getting Started

### Prerequisites

- **Node.js** 18+ and npm
- **Environment Variables**: You'll need API keys and database credentials

### Environment Setup

Create a `.env.local` file in the root directory with the following variables:

```env
# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key

# Astra DB Configuration
ASTRA_DB_ENDPOINT=your_astra_db_endpoint
ASTRA_DB_APPLICATION_TOKEN=your_astra_db_token
ASTRA_DB_NAMESPACE=your_namespace
ASTRA_DB_COLLECTION=your_collection_name

# Anthropic Configuration (optional)
ANTHROPIC_API_KEY=your_anthropic_api_key
```

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd f1gpt
```

2. Install dependencies:
```bash
npm install
```

3. Seed the database with F1 data:
```bash
npm run seed
```

This command runs the `scripts/loadDb.ts` script which populates Astra DB with Formula One information.

## Running the Application

### Development Mode

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### Production Build

Build the application:
```bash
npm run build
```

Start the production server:
```bash
npm start
```

## How It Works

1. **User Input**: User types a question about Formula One in the chat interface
2. **Embedding Generation**: The question is converted to an embedding using OpenAI's `text-embedding-3-small` model
3. **Vector Search**: The embedding is used to search Astra DB for the 10 most relevant F1 documents
4. **Context Building**: Retrieved documents are formatted as context
5. **LLM Response**: The context and question are sent to either Claude or OpenAI's model
6. **Streaming Response**: The AI response is streamed back to the user in real-time

## API Endpoints

### POST `/api/chat`

Accepts chat messages and returns an AI-generated response about Formula One.

**Request Body:**
```json
{
  "messages": [
    {
      "role": "user",
      "content": "Tell me about Lewis Hamilton"
    }
  ]
}
```

**Response**: Streaming text response from the AI model

## Scripts

- **`npm run dev`** - Start development server with hot reload
- **`npm run build`** - Build the application for production
- **`npm start`** - Start the production server
- **`npm run seed`** - Populate Astra DB with Formula One data
- **`npm run lint`** - Run ESLint to check code quality

## Development

### Code Quality

This project uses ESLint for code quality. Run linting with:
```bash
npm run lint
```

### Type Safety

The project is built with TypeScript for type safety. The `tsconfig.json` is configured with Next.js defaults.



## License

[Add your license information here]

## Contributing

[Add contribution guidelines here]

## Contact

For questions or feedback about F1GPT, please [add contact information].

---

**Happy chatting about Formula One! 🏁**
