import { OpenAIStream, StreamingTextResponse } from "ai";
import { DataAPIClient } from "@datastax/astra-db-ts";
import OpenAI from "openai";

const { 
    ASTRA_DB_NAMESPACE, 
    ASTRA_DB_COLLECTION, 
    ASTRA_DB_ENDPOINT, 
    ASTRA_DB_APPLICATION_TOKEN, 
    OPENAI_API_KEY,
    HUGGINGFACE_API_KEY 
} = process.env;

const openai = new OpenAI({
    apiKey: OPENAI_API_KEY,
});

const client = new DataAPIClient(ASTRA_DB_APPLICATION_TOKEN);
const db = client.db(ASTRA_DB_ENDPOINT, { namespace: ASTRA_DB_NAMESPACE });

export async function POST(req: Request) {
    try {
        const { messages } = await req.json();
        const latestMessage = messages[messages.length - 1]?.content || "";
        let docContext = "";
        
        try {
            const embedding = await openai.embeddings.create({
                model: "text-embedding-3-small",
                input: latestMessage,
                encoding_format: "float"
            });
            
            try {
                const collection = await db.collection(ASTRA_DB_COLLECTION);
                const cursor = collection.find(null, {
                    sort: {
                        $vector: embedding.data[0].embedding,
                    },
                    limit: 10,
                });
                
                const documents = await cursor.toArray(); 
                const docsMap = documents?.map((doc) => doc.text);
                docContext = JSON.stringify(docsMap);

            } catch (err) {
                console.log("Error querying database:", err);
            }
            
            const template = {
                role: "system",
                content: `You are an AI assistant who knows everything about Formula One. 
                    Use the below context to augment what you know about Formula One racing. 
                    The context will provide you with the most recent page data from wikipedia,
                    the official F1 website and others.
                    If the context doesn't include the information you need answer based on your existing knowledge and don't mention the source of your information or
                    what the context does or doesn't include.
                    Format responses using markdown where applicable and don't return images.
                    -------------
                    START CONTEXT
                    ${docContext}
                    END CONTEXT
                    -------------
                    QUESTION: ${latestMessage}
                `
            };
            
            const response = await openai.chat.completions.create({
                model: "gpt-4o",
                stream: true,
                messages: [template, ...messages],
            });
            
            const stream = OpenAIStream(response as any);
            return new StreamingTextResponse(stream);
            
        } catch (openaiError: any) {
            console.log("OpenAI quota exceeded, using Hugging Face fallback");
            
            if (!HUGGINGFACE_API_KEY) {
                return new Response(
                    "API quota exceeded. Please add HUGGINGFACE_API_KEY to your .env file. Get free key at: https://huggingface.co/settings/tokens",
                    { status: 503 }
                );
            }
            
            try {
                const chatMessages = messages.map((msg: any) => ({
                    role: msg.role === 'user' ? 'user' : 'assistant',
                    content: msg.content
                }));

                chatMessages.unshift({
                    role: 'system',
                    content: 'You are an expert on Formula One racing. Answer questions accurately and helpfully about F1.'
                });

                console.log("Calling Hugging Face API with new endpoint...");

                const response = await fetch(
                    "https://router.huggingface.co/v1/chat/completions",
                    {
                        method: "POST",
                        headers: {
                            "Authorization": `Bearer ${HUGGINGFACE_API_KEY}`,
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            model: "meta-llama/Llama-3.2-3B-Instruct",
                            messages: chatMessages,
                            max_tokens: 800,
                            temperature: 0.7,
                            stream: false
                        }),
                    }
                );

                if (!response.ok) {
                    const errorText = await response.text();
                    console.error("Hugging Face API error:", response.status, errorText);
                    throw new Error(`Hugging Face API error: ${response.status} - ${errorText}`);
                }

                const data = await response.json();
                console.log("Hugging Face response received");
                
                const text = data.choices?.[0]?.message?.content || "I apologize, but I'm having trouble generating a response right now.";

                // Format response in the correct streaming format for ai/react
                const encodedText = text.replace(/"/g, '\\"').replace(/\n/g, '\\n');
                const stream = new ReadableStream({
                    start(controller) {
                        // Send text content in the format expected by ai/react
                        controller.enqueue(`0:"${encodedText}"\n`);
                        controller.close();
                    }
                });

                return new Response(stream, {
                    headers: {
                        'Content-Type': 'text/event-stream',
                        'Cache-Control': 'no-cache',
                        'Connection': 'keep-alive',
                        'Transfer-Encoding': 'chunked',
                    }
                });
                
            } catch (hfError: any) {
                console.error("Hugging Face error:", hfError);
                return new Response(
                    `Unable to process your request. Error: ${hfError.message}. Please check your Hugging Face API key or add credits to OpenAI.`,
                    { status: 503 }
                );
            }
        }
        
    } catch (err) {
        console.error("Error handling chat request:", err);
        return new Response("Internal Server Error", { status: 500 });
    }
}