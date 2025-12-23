"use client"

import { useChat } from "ai/react"
import { Message } from "ai"
import PromptSuggestionsRow from "./components/PromptSuggestionsRow"

export default function Home() {
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    setInput
  } = useChat()

  const noMessages = messages.length === 0

  const onPromptClick = (prompt: string) => {
    setInput(prompt)
  }

  return (
    <main>
      {/* <Image src={f1GPTLogo} width="250" alt="F1GPT Logo" /> */}
      <section>
        {noMessages ? (
          <>
            <p className="starter-text">
              The Ultimate place for Formula One super fans!
              Ask F1GPT anything about the fantastic topic of F1 racing
            </p>
            <br />
            <PromptSuggestionsRow onPromptClick={onPromptClick}/> 
          </>
        ) : (
          <>
            {messages.map((message: Message) => (
              <div key={message.id}>
                <strong>{message.role}:</strong> {message.content}
              </div>
            ))}
            {isLoading && <div>Loading...</div>}
          </>
        )
        }
        <form onSubmit={handleSubmit}>
          <input 
            className="question-box" 
            onChange={handleInputChange} 
            value={input} 
            placeholder="Ask me something"
          />
          <input type="submit" value="Send" />
        </form>
      </section>
    </main>
  )
}