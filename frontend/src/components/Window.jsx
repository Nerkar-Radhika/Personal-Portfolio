import { Rnd } from "react-rnd";
import { AppIcon } from "./icons";
import "./Window.css";

function Window({
  title,
  icon,
  children,
  onClose,
  onMinimize,
  onFocus,
  isFocused,
  isMinimized,
  zIndex,
  defaultPosition,
  defaultSize,
}) {
  return (
    <Rnd
      default={{
        x: defaultPosition.x,
        y: defaultPosition.y,
        width: defaultSize.width,
        height: defaultSize.height,
      }}
      minWidth={320}
      minHeight={280}
      bounds="parent"
      dragHandleClassName="window-titlebar"
      style={{
        display: isMinimized ? "none" : "block",
        zIndex,
      }}
      onDragStart={onFocus}
      onResizeStart={onFocus}
    >
      <div
        className={`window ${isFocused ? "window-focused" : ""}`}
        onMouseDown={onFocus}
      >
        <div className="window-titlebar">
          <div className="window-titlebar-label">
            <span className="window-icon">
              <AppIcon type={icon} size={16} />
            </span>
            <span>{title}</span>
          </div>
          <div className="window-controls">
            <button
              className="window-btn window-btn-min"
              onClick={onMinimize}
              aria-label="Minimize"
            >
              &#8211;
            </button>
            <button
              className="window-btn window-btn-close"
              onClick={onClose}
              aria-label="Close"
            >
              &#10005;
            </button>
          </div>
        </div>
        <div className="window-body">{children}</div>
      </div>
    </Rnd>
  );
}

export default Window;