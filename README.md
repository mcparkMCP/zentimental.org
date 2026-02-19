# GPT-4o Chat

I built this so that people could still keep their connection with GPT-4o.

When OpenAI started changing things, a lot of people genuinely wanted to hold on to the model they had grown attached to. I thought it was really rude and not nice how others would mock people for wanting that. It was really easy for me to put this together, so I thought I'd just do it.

This is a full ChatGPT-style interface that connects to GPT-4o through Azure OpenAI. It runs in your browser, stores everything locally, and gives you the same conversational experience you're used to.

## Features

- **Streaming chat** with GPT-4o via Azure OpenAI
- **Conversation management** - create, rename, and delete conversations
- **Memory system** - store up to 50 memories that persist across conversations
- **System prompt editor** - customize the system prompt per conversation
- **Prompt templates** - pre-built templates for common tasks (code review, summarize, translate, etc.)
- **Markdown rendering** with syntax-highlighted code blocks
- **Copy code** button on all code blocks
- **Local storage** - all your data stays in your browser, nothing is sent to a server besides the chat API
- **Dark theme** with the classic ChatGPT look
- **Mobile responsive**

## Tech Stack

- **Next.js** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Vercel AI SDK** with Azure OpenAI provider
- **React Markdown** with syntax highlighting

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- An Azure OpenAI account with a GPT-4o deployment

### Installation

```bash
git clone https://github.com/chaollapark/zentimental.org.git
cd zentimental.org
npm install
```

### Environment Setup

Create a `.env.local` file in the root directory:

```env
AZURE_OPENAI_API_KEY=your-azure-openai-api-key
AZURE_OPENAI_ENDPOINT=https://your-resource.cognitiveservices.azure.com
AZURE_OPENAI_API_VERSION=2025-01-01-preview
AZURE_OPENAI_DEPLOYMENT=gpt-4o
```

You can get these values from the [Azure Portal](https://portal.azure.com) after creating an Azure OpenAI resource and deploying the GPT-4o model.

### Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
src/
├── app/
│   ├── api/chat/route.ts       # Chat streaming API endpoint
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Main chat page
│   └── globals.css             # Global styles
├── components/
│   ├── chat/                   # Chat UI components
│   ├── sidebar/                # Sidebar navigation
│   └── memory/                 # Memory management
├── hooks/                      # React hooks
├── lib/                        # Utilities and stores
└── types/                      # TypeScript type definitions
```

## How to Modify This Repository

### Adding New Features

1. **Fork and clone** the repository
2. **Create a feature branch**: `git checkout -b feature/your-feature-name`
3. Make your changes
4. **Test locally** with `npm run dev`
5. **Lint your code**: `npm run lint`
6. **Commit and push**: `git push -u origin feature/your-feature-name`
7. Open a pull request

### Changing the AI Model

To use a different Azure OpenAI model, update `AZURE_OPENAI_DEPLOYMENT` in your `.env.local` to match your deployment name.

### Customizing the System Prompt

Edit `src/lib/system-prompt.ts` to change the base system prompt that defines how the AI behaves.

### Adding Prompt Templates

Edit `src/lib/default-templates.ts` to add or modify the built-in prompt templates.

### Styling

The app uses Tailwind CSS. Global styles are in `src/app/globals.css`. The green accent color (`#10a37f`) is used throughout for the ChatGPT-style look.

## Data Storage

All data is stored in your browser's localStorage:

| Key | Description |
|-----|-------------|
| `gpt4o-conversations` | Conversation metadata |
| `gpt4o-messages-{id}` | Messages for each conversation |
| `gpt4o-memories` | User memories |
| `gpt4o-templates` | Custom prompt templates |

No data is sent to any server other than the Azure OpenAI API for generating responses.

## License

MIT
