import PromptSuggestionsButton from "./PromptSuggestionButton"

const PromptSuggestionsRow = ({ onPromptClick }: { onPromptClick: (prompt: string) => void }) => {
    const prompts = [
        "Who is head of racing for Aston Martin's F1 Academy team?", 
        "Who is the highest paid F1 driver?",
        "Who will be the newest driver for Ferrari?",
        "Who is the current Formula One World Driver's Champion?",
    ]
    return (
        <div className="prompt-suggestion-row"> {/* Fixed: was 'promt-suggestion-row' */}
            {prompts.map((prompt, index) => (
                <PromptSuggestionsButton 
                    key={`suggestion-${index}`}
                    text={prompt} 
                    onClick={() => onPromptClick(prompt)}
                />
            ))}
        </div>
    )
}

export default PromptSuggestionsRow