import "./CalloutBubble.css";

function CalloutBubble({ text, onDismiss }) {
  return (
    <div className="callout-bubble">
      <button
        className="callout-close"
        onClick={onDismiss}
        aria-label="Dismiss"
      >
        &#10005;
      </button>
      <span>{text}</span>
      <div className="callout-tail" />
    </div>
  );
}

export default CalloutBubble;