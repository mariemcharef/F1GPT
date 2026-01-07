"use client";

import { useChat } from "ai/react";
import { Message } from "ai";
import { FormEvent } from "react";
import PromptSuggestionsRow from "./components/PromptSuggestionsRow";
import Bubble from "./components/Bubble";
import LoadingBubble from "./components/LoadingBubble";

export default function Home() {
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    setInput,
  } = useChat({
    api: "/api/chat",
  });

  const noMessages = messages.length === 0;

  const onPromptClick = (prompt: string) => {
    setInput(prompt);
  };

  const handleFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (input.trim()) {
      handleSubmit(e);
    }
  };

  return (
    <main>
      <section>
        {noMessages ? (
          <>
            <p className="starter-text">
              The Ultimate place for Formula One super fans! Ask F1GPT anything
              about the fantastic topic of F1 racing
            </p>
            <br />
            <PromptSuggestionsRow onPromptClick={onPromptClick} />
          </>
        ) : (
          <>
            {messages.map((message: Message) => (
              <Bubble key={message.id} message={message} />
            ))}
            {isLoading && <LoadingBubble />}
          </>
        )}
        <form onSubmit={handleFormSubmit}>
          <input
            className="question-box"
            onChange={handleInputChange}
            value={input}
            placeholder="Ask me something about F1..."
            disabled={isLoading}
          />
          <input 
            type="submit" 
            value={isLoading ? "Sending..." : "Send"}
            disabled={isLoading || !input.trim()}
          />
        </form>
      </section>
    </main>
  );
}