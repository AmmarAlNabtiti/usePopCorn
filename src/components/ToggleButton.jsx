function ToggleButton({ setIsOpen, isOpen }) {
    return (
        <button
            className="btn-toggle"
            onClick={() => setIsOpen((open) => !open)}
        >
            {isOpen ? "–" : "+"}
        </button>
    );
}
export default ToggleButton;