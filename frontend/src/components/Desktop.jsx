import { useState } from "react";
import NetworkBackground from "./NetworkBackground";
import HeroText from "./HeroText";
import DesktopIcon from "./DesktopIcon";
import Window from "./Window";
import Taskbar from "./Taskbar";
import ChatWindow from "./ChatWindow";
import ProjectWindow from "./ProjectWindow";
import CalloutBubble from "./CalloutBubble";
import { apps, dockLinks, dockDecor } from "../data/apps";
import "./Desktop.css";

let zCounter = 10;

function Desktop() {
  // openWindows: array of { id, appId, minimized }
  const [openWindows, setOpenWindows] = useState([]);
  const [focusedId, setFocusedId] = useState(null);
  const [zIndexes, setZIndexes] = useState({});
  const [showCallout, setShowCallout] = useState(true);

  const openApp = (appId) => {
    if (appId === "chatbot") setShowCallout(false);

    const existing = openWindows.find((w) => w.id === appId);

    if (existing) {
      // Already open: un-minimize and focus it.
      setOpenWindows((prev) =>
        prev.map((w) => (w.id === appId ? { ...w, minimized: false } : w))
      );
      focusWindow(appId);
      return;
    }

    setOpenWindows((prev) => [...prev, { id: appId, minimized: false }]);
    focusWindow(appId);
  };

  const closeApp = (appId) => {
    setOpenWindows((prev) => prev.filter((w) => w.id !== appId));
    if (focusedId === appId) setFocusedId(null);
  };

  const minimizeApp = (appId) => {
    setOpenWindows((prev) =>
      prev.map((w) => (w.id === appId ? { ...w, minimized: true } : w))
    );
    if (focusedId === appId) setFocusedId(null);
  };

  const focusWindow = (appId) => {
    zCounter += 1;
    setZIndexes((prev) => ({ ...prev, [appId]: zCounter }));
    setFocusedId(appId);
  };

  // Used by both the dynamic desktop icons and the taskbar's pinned dock.
  // Falls back to opening the app fresh if it isn't running yet.
  const handleAppClick = (appId) => {
    const win = openWindows.find((w) => w.id === appId);

    if (!win) {
      openApp(appId);
      return;
    }

    if (win.minimized) {
      setOpenWindows((prev) =>
        prev.map((w) => (w.id === appId ? { ...w, minimized: false } : w))
      );
      focusWindow(appId);
    } else if (focusedId === appId) {
      minimizeApp(appId);
    } else {
      focusWindow(appId);
    }
  };

  return (
    <div className="desktop">
      <NetworkBackground />
      <HeroText />

      <div className="desktop-icons">
        {apps.map((app) => (
          <div key={app.id} className="desktop-icon-slot">
            <DesktopIcon
              icon={app.icon}
              title={app.title}
              onOpen={() => openApp(app.id)}
            />
            {app.id === "chatbot" && showCallout && (
              <CalloutBubble
                text="👋 Ask me anything about Radhika!"
                onDismiss={() => setShowCallout(false)}
              />
            )}
          </div>
        ))}
      </div>

      {openWindows.map((w, index) => {
        const app = apps.find((a) => a.id === w.id);
        return (
          <Window
            key={w.id}
            title={app.title}
            icon={app.icon}
            onClose={() => closeApp(w.id)}
            onMinimize={() => minimizeApp(w.id)}
            onFocus={() => focusWindow(w.id)}
            isFocused={focusedId === w.id}
            isMinimized={w.minimized}
            zIndex={zIndexes[w.id] || 10}
            defaultPosition={{ x: 80 + index * 30, y: 60 + index * 30 }}
            defaultSize={app.defaultSize}
          >
            {app.type === "chatbot" ? (
              <ChatWindow />
            ) : (
              <ProjectWindow project={app.project} />
            )}
          </Window>
        );
      })}

      <Taskbar
        apps={apps}
        dockLinks={dockLinks}
        dockDecor={dockDecor}
        openWindows={openWindows}
        focusedId={focusedId}
        onAppClick={handleAppClick}
      />
    </div>
  );
}

export default Desktop;