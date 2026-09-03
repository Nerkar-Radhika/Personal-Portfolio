import { useEffect, useState } from "react";
import { AppIcon, StartIcon, LinkedInIcon, GitHubIcon, DecorIcon } from "./icons";
import StartMenu from "./StartMenu";
import "./Taskbar.css";

function Taskbar({ apps, dockLinks, dockDecor, openWindows, focusedId, onAppClick }) {
  const [time, setTime] = useState(new Date());
  const [showStartMenu, setShowStartMenu] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000 * 30);
    return () => clearInterval(timer);
  }, []);

  const timeLabel = time.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  const dateLabel = time.toLocaleDateString([], {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  const isRunning = (id) => openWindows.some((w) => w.id === id);

  const openLink = (url) => window.open(url, "_blank", "noopener,noreferrer");

  return (
    <div className="taskbar">
      {showStartMenu && (
        <div
          className="start-menu-backdrop"
          onClick={() => setShowStartMenu(false)}
        />
      )}

      <div className="taskbar-left">
        <button
          className={`start-btn ${showStartMenu ? "start-btn-active" : ""}`}
          onClick={() => setShowStartMenu((v) => !v)}
          aria-label="Start"
        >
          <StartIcon size={26} />
        </button>
        {showStartMenu && <StartMenu />}
      </div>

      <div className="taskbar-dock">
        {apps.map((app) => (
          <button
            key={app.id}
            className={`dock-icon ${focusedId === app.id ? "dock-icon-active" : ""}`}
            onClick={() => onAppClick(app.id)}
            title={app.title}
          >
            <AppIcon type={app.icon} size={30} />
            {isRunning(app.id) && <span className="dock-running-dot" />}
          </button>
        ))}

        <div className="dock-divider" />

        {dockLinks.map((link) => (
          <button
            key={link.id}
            className="dock-icon"
            onClick={() => openLink(link.url)}
            title={link.title}
          >
            {link.id === "linkedin" ? (
              <LinkedInIcon size={30} />
            ) : (
              <GitHubIcon size={30} />
            )}
          </button>
        ))}

        <div className="dock-divider" />

        {dockDecor.map((item) => (
          <button
            key={item.id}
            className="dock-icon dock-icon-decorative"
            title={item.title}
          >
            <DecorIcon color={item.color} size={30} />
          </button>
        ))}
      </div>

      <div className="taskbar-right">
        <span className="taskbar-date">{dateLabel}</span>
        <span className="taskbar-clock">{timeLabel}</span>
      </div>
    </div>
  );
}

export default Taskbar;