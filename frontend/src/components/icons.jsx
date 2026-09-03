// Flat, single-family icon set (accent blue) used across desktop icons,
// window title bars, and the taskbar — keeps everything visually cohesive
// instead of mixing emoji with UI chrome.

export function FolderIcon({ size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <path
        d="M4 13a3 3 0 0 1 3-3h9.5l4 4H41a3 3 0 0 1 3 3v20a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V13z"
        fill="#5C79E8"
      />
      <path
        d="M4 17a2 2 0 0 1 2-2h36a2 2 0 0 1 2 2v19a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V17z"
        fill="#8CA3FF"
      />
    </svg>
  );
}

export function ChatIcon({ size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <path
        d="M24 5C12.95 5 4 12.66 4 22.1c0 5.28 2.82 10 7.26 13.1-.32 2.46-1.38 4.94-2.96 6.9a1 1 0 0 0 1.02 1.6c3.9-.86 7.28-2.68 9.8-4.98 1.56.32 3.19.48 4.88.48 11.05 0 20-7.66 20-17.1S35.05 5 24 5z"
        fill="#6C8EFF"
      />
      <circle cx="15.5" cy="22" r="2.3" fill="#fff" />
      <circle cx="24" cy="22" r="2.3" fill="#fff" />
      <circle cx="32.5" cy="22" r="2.3" fill="#fff" />
    </svg>
  );
}

export function StartIcon({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect x="2" y="2" width="9" height="9" rx="2" fill="#6C8EFF" />
      <rect x="13" y="2" width="9" height="9" rx="2" fill="#8CA3FF" />
      <rect x="2" y="13" width="9" height="9" rx="2" fill="#8CA3FF" />
      <rect x="13" y="13" width="9" height="9" rx="2" fill="#6C8EFF" />
    </svg>
  );
}

export function LinkedInIcon({ size = 24 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <rect width="48" height="48" rx="10" fill="#0A66C2" />
      <rect x="10" y="19" width="6" height="19" fill="#fff" />
      <circle cx="13" cy="12" r="3.5" fill="#fff" />
      <path
        d="M21 19h5.7v2.7h.08c.8-1.5 2.7-3.1 5.6-3.1 6 0 7.1 3.9 7.1 9.1V38h-6V29c0-2.2 0-5-3-5s-3.5 2.4-3.5 4.9V38h-6V19z"
        fill="#fff"
      />
    </svg>
  );
}

export function GitHubIcon({ size = 24 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <rect width="48" height="48" rx="10" fill="#171B21" />
      <path
        d="M24 10c-7.7 0-14 6.3-14 14 0 6.2 4 11.4 9.6 13.3.7.1 1-.3 1-.7v-2.6c-3.9.9-4.7-1.7-4.7-1.7-.6-1.6-1.6-2.1-1.6-2.1-1.3-.9.1-.9.1-.9 1.4.1 2.2 1.5 2.2 1.5 1.3 2.2 3.4 1.6 4.2 1.2.1-.9.5-1.6.9-2-3.1-.4-6.4-1.6-6.4-7 0-1.5.5-2.8 1.4-3.8-.1-.4-.6-1.8.1-3.7 0 0 1.2-.4 3.9 1.5a13 13 0 0 1 7 0c2.7-1.9 3.9-1.5 3.9-1.5.7 1.9.2 3.3.1 3.7.9 1 1.4 2.3 1.4 3.8 0 5.4-3.3 6.6-6.4 7 .5.5 1 1.4 1 2.8v4.1c0 .4.3.8 1 .7C34 35.4 38 30.2 38 24c0-7.7-6.3-14-14-14z"
        fill="#fff"
      />
    </svg>
  );
}

export function DecorIcon({ color = "#6C8EFF", size = 24 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <rect width="48" height="48" rx="10" fill={color} />
      <circle cx="24" cy="24" r="9" fill="rgba(255,255,255,0.85)" />
    </svg>
  );
}

// Looks up the right icon by the "icon" key stored in apps.js (e.g. "chat", "folder").
export function AppIcon({ type, size = 32 }) {
  if (type === "chat") return <ChatIcon size={size} />;
  return <FolderIcon size={size} />;
}