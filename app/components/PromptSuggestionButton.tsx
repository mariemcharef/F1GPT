interface PromptSuggestionButtonProps {
    text: string;
    onClick: () => void;
}

const PromptSuggestionsButton = ({ text, onClick }: PromptSuggestionButtonProps) => {
    return (
        <button className="prompt-suggestion-button" onClick={onClick}>
            {text}
        </button>
    );
};

export default PromptSuggestionsButton;