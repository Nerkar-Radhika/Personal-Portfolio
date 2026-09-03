import { AppIcon } from "./icons";

function DesktopIcon({ icon, title, onOpen }) {
  return (
    <button className="desktop-icon" onDoubleClick={onOpen}>
      <span className="desktop-icon-glyph">
        <AppIcon type={icon} size={44} />
      </span>
      <span className="desktop-icon-label">{title}</span>
    </button>
  );
}

export default DesktopIcon;