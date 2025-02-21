# AI Tool-Calling Template

This template provides a very basic starting point for building AI applications with tool-calling capabilities using Next.js. It demonstrates how to create a chat interface where an AI assistant can interact with custom tools and how to render those tools with custom components.

## Features

### Chat Interface

- Real-time chat interface with user and AI messages
- Support for streaming responses

### AI Integration

- Integration with Google's Gemini 2.0 Flash model
- Support for tool-calling functionality

### Custom Tools

The template includes two example tools, but you can ignore those and implement your own.

## Technical Stack

- **Framework**: Next.js
- **AI SDK**: @ai-sdk/react, @ai-sdk/google
- **Styling**: Tailwind CSS
- **Type Safety**: TypeScript
- **Schema Validation**: Zod
- **UI Components**:
  - [shadcn/ui](https://ui.shadcn.com/) for core components

### Important Resources

- [Vercel AI SDK Tool Calling Documentation](https://sdk.vercel.ai/docs/ai-sdk-core/tools-and-tool-calling)
  Note: Some parts of the documentation may be outdated, but the core concepts remain valid.
- [Google AI Studio](https://aistudio.google.com/) for API key management
- [shadcn/ui Documentation](https://ui.shadcn.com/) for component customization
- Places like [21st.dev](https://21st.dev/) offer a nice selection of premade shadcn compatible components for rapid development

### Model Support

While this template uses Google's Gemini model by default, you can easily switch to other providers and models. The Vercel AI SDK supports various LLM providers including:

- OpenAI
- Anthropic
- Hugging Face
- And others

## Project Structure

```
├── components/
│   └── ui/          # Reusable UI components
├── app/
│   ├── page.tsx     # Main chat interface
│   └── api/
│       └── chat/
│           └── route.ts  # API route for chat functionality
```

## Getting Started

1. Set up your environment:

   - Copy `.env.example` to `.env.local`
   - Get your free Google Gemini API key from [Google AI Studio](https://aistudio.google.com/)
   - Add your API key to `.env.local`

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Customizing the Template

### Adding New Tools

To add a new tool, extend the `tools` object in `app/api/chat/route.ts`:

```typescript
tools: {
  yourNewTool: tool({
    description: "Description of your tool",
    parameters: z.object({
      // Define your parameters using Zod
    }),
    execute: async (params) => {
      // Implement your tool logic
    },
  }),
}
```

## Development Notes

- The template uses TypeScript for type safety
- Tool parameters are validated using Zod schemas
- Messages are streamed for better user experience
- UI components use Tailwind CSS for styling
- The chat interface automatically scrolls to the latest message
- Implementation is kept simple to make it easy to understand and extend

## UX Things to Consider

- Making it your own with custom tools, creative idea and visual design
- Better typography
- Improving chat UX and ergonomics, adding loading state to components etc.
- Adding micro-interactions, animations, and transitions
- Implementing a more advanced tool-calling system
- Overall making the interface more engaging and interactive

## License

This project is MIT licensed.
