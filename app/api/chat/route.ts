import { createOpenAI } from "@ai-sdk/openai"
import { streamText } from "ai"

// Create OpenAI client pointing to your local vLLM server
const openai = createOpenAI({
  apiKey: "123", // vLLM doesn't require a real API key
  baseURL: "http://localhost:8000/v1",
})

export async function POST(req: Request) {
  try {
    const { messages, tone, length, temperature, maxTokens } = await req.json()

    // Create system message based on parameters
    const systemMessage = createSystemMessage(tone, length)

    // Create the chat completion request
    const result = streamText({
      model: openai("qwen-chat"),
      messages: [{ role: "system", content: systemMessage }, ...messages],
      temperature: temperature || 0.7,
      maxTokens: maxTokens || 512,
    })

    return result.toDataStreamResponse()
  } catch (error) {
    console.error("Error in chat API:", error)
    return new Response(
      JSON.stringify({
        error: "Failed to connect to vLLM server. Make sure it's running on localhost:8000",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    )
  }
}

function createSystemMessage(tone: string, length: string): string {
  let systemPrompt = "You are a helpful AI assistant."

  // Add tone instructions
  switch (tone) {
    case "professional":
      systemPrompt += " Respond in a professional, business-appropriate manner."
      break
    case "casual":
      systemPrompt += " Respond in a casual, relaxed manner using everyday language."
      break
    case "friendly":
      systemPrompt += " Respond in a warm, friendly, and approachable manner."
      break
    case "formal":
      systemPrompt += " Respond in a formal, academic manner with proper structure."
      break
    case "creative":
      systemPrompt += " Respond creatively with engaging and imaginative language."
      break
    default:
      systemPrompt += " Respond in a balanced, neutral tone."
  }

  // Add length instructions
  switch (length) {
    case "short":
      systemPrompt += " Keep your responses concise and to the point."
      break
    case "medium":
      systemPrompt += " Provide moderately detailed responses."
      break
    case "long":
      systemPrompt += " Provide comprehensive and detailed responses."
      break
    case "detailed":
      systemPrompt += " Provide very thorough, detailed explanations with examples when appropriate."
      break
  }

  return systemPrompt
}
