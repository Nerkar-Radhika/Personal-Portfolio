// Central registry: one entry per desktop icon.
// type: "chatbot" opens the AI assistant window.
// type: "project" opens a ProjectWindow with the details below.

export const apps = [
  {
    id: "chatbot",
    type: "chatbot",
    title: "Ask Radhika",
    icon: "chat",
    defaultSize: { width: 420, height: 620 },
  },
  {
    id: "mindvibe",
    type: "project",
    title: "MindVibe",
    icon: "folder",
    defaultSize: { width: 560, height: 520 },
    project: {
      name: "MindVibe",
      tagline: "Multilingual voice-based psychological stress detection",
      description:
        "A web app that classifies psychological stress from speech in Hindi, English, and Marathi. Existing models trained on English-only acted emotion datasets fail on natural Indian speech — MindVibe addresses that domain shift with a custom Indian-speaker dataset. Best model: a Stacking Ensemble (XGBoost + Random Forest + SVM base learners, Logistic Regression meta-learner) reaching 97.42% accuracy with 5-fold cross-validation on 5,056 audio files.",
      stack: [
        "Python",
        "Librosa",
        "Scikit-learn",
        "XGBoost",
        "SMOTE",
        "Streamlit",
        "Google Colab",
        "Pandas",
        "NumPy",
      ],
      notes: [
        "560 acoustic features per sample: MFCC, Delta/Delta2 MFCC, Mel Spectrogram, ZCR, RMS, Chroma, Spectral Contrast, Tonnetz, Rolloff, Bandwidth, plus a novel gender-encoding feature",
        "Language-wise accuracy: Hindi 97.25%, Marathi 96.76%, English 94.29%",
        "Discovered and documented a domain-shift problem as a research finding: a model trained on US studio-acted speech predicted 98.2% 'unstressed' for genuinely angry Indian voices",
        "MindVibe 2.0 planned: four-tier stress detection using unsupervised acoustic clustering + hybrid CNN-BiLSTM-Attention networks",
      ],
    },
  },
  {
    id: "dpi-engine",
    type: "project",
    title: "DPI Engine",
    icon: "folder",
    defaultSize: { width: 560, height: 520 },
    project: {
      name: "Java Deep Packet Inspection (DPI) Engine",
      tagline: "Live network traffic analysis and security monitoring",
      description:
        "A Java-based DPI engine that captures live network traffic, parses it across multiple protocol layers (Ethernet, IPv4, TCP, UDP, HTTP, DNS), classifies traffic by service, manages network flows, detects suspicious scanning activity, and generates CSV, interactive HTML dashboard, and PDF reports.",
      stack: [
        "Java",
        "Maven",
        "Pcap4J",
        "OpenPDF",
        "HTML/CSS/JS",
        "Chart.js",
        "Git",
        "GitHub",
      ],
      notes: [
        "Port-scan detection via TCP flag analysis (SYN, FIN, NULL, XMAS scan patterns)",
        "Flow management, traffic statistics, and top-talker identification across observed hosts",
        "Built as a flagship placement-prep project for interviews",
      ],
    },
  },
];

// Real external profile links shown in the taskbar dock.
export const dockLinks = [
  {
    id: "linkedin",
    title: "LinkedIn",
    url: "https://www.linkedin.com/in/radhika-nerkar?utm_source=share_via&utm_content=profile&utm_medium=member_android",
  },
  {
    id: "github",
    title: "GitHub",
    url: "https://github.com/Nerkar-Radhika",
  },
];

// Decorative-only taskbar icons — visual filler, not wired to anything.
export const dockDecor = [
  { id: "decor-1", title: "Browser", color: "#4FC3F7" },
  { id: "decor-2", title: "Mail", color: "#FF7043" },
  { id: "decor-3", title: "Files", color: "#FFC107" },
  { id: "decor-4", title: "Settings", color: "#9575CD" },
  { id: "decor-5", title: "Camera", color: "#66BB6A" },
];