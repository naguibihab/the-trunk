/**
 * Shared PM dashboard color themes. Same storage key as dashboard/index.html (`pmDashboardTheme`).
 * Include this script on static HTML subpages and call `PmDashboardTheme.initFromStorageAndSync()`
 * so they match the dashboard dropdown (localStorage + BroadcastChannel + storage event + bfcache).
 */
(function (global) {
  var STORAGE_KEY = "pmDashboardTheme";
  var DEFAULT_ID = "slides";
  var BROADCAST_CHANNEL_NAME = "pm-dashboard-theme";
  var SYNC_ATTR = "data-pm-dashboard-theme-sync";

  var broadcastChannelInstance = null;

  var themes = {
    "slides": {
      colorScheme: "light",
      bg: "#ffffff",
      panel: "#ffffff",
      panel2: "#fafafa",
      text: "#0a0a0a",
      muted: "#737373",
      line: "#e5e5e5",
      accent: "#4f46e5",
      primary: "#4f46e5",
      header: "#fafafa",
      hover: "#f5f5f5",
      shadow: "0 1px 3px rgba(0, 0, 0, 0.06), 0 12px 28px -10px rgba(0, 0, 0, 0.10)",
      dangerBg: "#fef2f2",
      dangerLine: "#fecaca",
      dangerText: "#991b1b",
      warn: "#d97706",
    },
    "github-dark": {
      colorScheme: "dark",
      bg: "#0d1117",
      panel: "#161b22",
      panel2: "#1b2230",
      text: "#c9d1d9",
      muted: "#8b949e",
      line: "#30363d",
      accent: "#58a6ff",
      primary: "#58a6ff",
      header: "#161b22",
      hover: "#21262d",
      shadow: "0 10px 30px rgba(1, 4, 9, 0.45)",
      dangerBg: "#2d1517",
      dangerLine: "#f85149",
      dangerText: "#ffa198",
      warn: "#d29922",
    },
    "calm-minimal": {
      colorScheme: "light",
      bg: "#f8fafc",
      panel: "#ffffff",
      panel2: "#f8fafc",
      text: "#0f172a",
      muted: "#475569",
      line: "#e2e8f0",
      accent: "#14b8a6",
      primary: "#2563eb",
      header: "#f1f5f9",
      hover: "#eff6ff",
      shadow: "0 10px 24px rgba(15, 23, 42, 0.08)",
      dangerBg: "#fef2f2",
      dangerLine: "#fecaca",
      dangerText: "#991b1b",
      warn: "#d97706",
    },
    "dark-pro": {
      colorScheme: "dark",
      bg: "#0b1220",
      panel: "#111827",
      panel2: "#0f172a",
      text: "#e5e7eb",
      muted: "#94a3b8",
      line: "#1f2937",
      accent: "#22d3ee",
      primary: "#60a5fa",
      header: "#172033",
      hover: "#1d2a42",
      shadow: "0 10px 30px rgba(2, 8, 23, 0.45)",
      dangerBg: "#3b1c24",
      dangerLine: "#7f1d1d",
      dangerText: "#fecaca",
      warn: "#fbbf24",
    },
    "muted-elegant": {
      colorScheme: "light",
      bg: "#f6f6f4",
      panel: "#ffffff",
      panel2: "#f2f1ee",
      text: "#2f2f2f",
      muted: "#6b6b6b",
      line: "#e7e2dc",
      accent: "#c08a5d",
      primary: "#3b5b7a",
      header: "#efebe6",
      hover: "#f6f1eb",
      shadow: "0 10px 24px rgba(47, 47, 47, 0.09)",
      dangerBg: "#fdf2f2",
      dangerLine: "#f5c6c6",
      dangerText: "#8b1e1e",
      warn: "#b45309",
    },
    "nature-soft": {
      colorScheme: "light",
      bg: "#f4f8f2",
      panel: "#ffffff",
      panel2: "#f0f6ec",
      text: "#1f2a1f",
      muted: "#4f5d50",
      line: "#dde8d8",
      accent: "#a3c76d",
      primary: "#4f8a4c",
      header: "#e9f1e6",
      hover: "#edf6e9",
      shadow: "0 10px 24px rgba(31, 42, 31, 0.08)",
      dangerBg: "#fef5f5",
      dangerLine: "#f0c4c4",
      dangerText: "#8b2525",
      warn: "#b7791f",
    },
    "warm-friendly": {
      colorScheme: "light",
      bg: "#fff8f1",
      panel: "#ffffff",
      panel2: "#fff5eb",
      text: "#3f2d20",
      muted: "#7a5a42",
      line: "#f2e8dc",
      accent: "#ef4444",
      primary: "#f97316",
      header: "#fdf0e3",
      hover: "#fff1e6",
      shadow: "0 10px 24px rgba(63, 45, 32, 0.08)",
      dangerBg: "#fff5f5",
      dangerLine: "#facaca",
      dangerText: "#9a1c1c",
      warn: "#ca8a04",
    },
    "bold-startup": {
      colorScheme: "light",
      bg: "#f9fafb",
      panel: "#ffffff",
      panel2: "#f3f4f6",
      text: "#111827",
      muted: "#4b5563",
      line: "#e5e7eb",
      accent: "#f43f5e",
      primary: "#7c3aed",
      header: "#eef2ff",
      hover: "#f5f3ff",
      shadow: "0 10px 24px rgba(17, 24, 39, 0.1)",
      dangerBg: "#fef2f2",
      dangerLine: "#fecaca",
      dangerText: "#991b1b",
      warn: "#eab308",
    },
  };

  function applyTheme(themeId) {
    var theme = themes[themeId] || themes[DEFAULT_ID];
    var root = document.documentElement;
    root.style.setProperty("color-scheme", theme.colorScheme);
    root.style.setProperty("--bg", theme.bg);
    root.style.setProperty("--panel", theme.panel);
    root.style.setProperty("--panel-2", theme.panel2);
    root.style.setProperty("--text", theme.text);
    root.style.setProperty("--muted", theme.muted);
    root.style.setProperty("--line", theme.line);
    root.style.setProperty("--accent", theme.accent);
    root.style.setProperty("--primary", theme.primary);
    root.style.setProperty("--header-bg", theme.header);
    root.style.setProperty("--hover-bg", theme.hover);
    root.style.setProperty("--panel-shadow", theme.shadow);
    root.style.setProperty("--danger-bg", theme.dangerBg);
    root.style.setProperty("--danger-line", theme.dangerLine);
    root.style.setProperty("--danger-text", theme.dangerText);
    root.style.setProperty("--warn", theme.warn);
    root.style.colorScheme = theme.colorScheme;
  }

  function readStoredThemeId() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (raw && themes[raw]) return raw;
    } catch (e) {}
    return DEFAULT_ID;
  }

  function initFromStorage() {
    var id = readStoredThemeId();
    applyTheme(id);
    return id;
  }

  function syncThemeSelect(themeId) {
    try {
      var sel = global.document && global.document.getElementById("themeSelect");
      if (sel && themes[themeId]) sel.value = themeId;
    } catch (e) {}
  }

  function handleBroadcastPayload(data) {
    var tid =
      typeof data === "string"
        ? data
        : data && typeof data === "object" && data.themeId != null
          ? String(data.themeId)
          : "";
    if (tid === "" || tid === "__clear__") {
      var id = readStoredThemeId();
      applyTheme(id);
      syncThemeSelect(id);
      return;
    }
    if (themes[tid]) {
      applyTheme(tid);
      syncThemeSelect(tid);
      return;
    }
    var fallback = readStoredThemeId();
    applyTheme(fallback);
    syncThemeSelect(fallback);
  }

  function ensureBroadcastChannel() {
    if (typeof BroadcastChannel === "undefined") return null;
    if (!broadcastChannelInstance) {
      broadcastChannelInstance = new BroadcastChannel(BROADCAST_CHANNEL_NAME);
      broadcastChannelInstance.onmessage = function (ev) {
        handleBroadcastPayload(ev.data);
      };
    }
    return broadcastChannelInstance;
  }

  /** Notify other tabs immediately (same-tab subpages also listen here). */
  function broadcastThemeChange(themeId) {
    var ch = ensureBroadcastChannel();
    if (!ch) return;
    try {
      ch.postMessage({ themeId: themeId });
    } catch (e) {}
  }

  /**
   * Apply theme from storage once, then subscribe to cross-tab sync (storage + BroadcastChannel)
   * and bfcache restore. Idempotent per document (guarded).
   */
  function initThemeSync() {
    var doc = global.document;
    if (!doc || !doc.documentElement) {
      initFromStorage();
      return;
    }
    var root = doc.documentElement;
    if (root.getAttribute(SYNC_ATTR) === "1") return;
    root.setAttribute(SYNC_ATTR, "1");

    var initial = initFromStorage();
    syncThemeSelect(initial);
    ensureBroadcastChannel();

    global.addEventListener("storage", function (e) {
      if (e.key !== STORAGE_KEY) return;
      if (e.newValue != null && themes[e.newValue]) {
        applyTheme(e.newValue);
        syncThemeSelect(e.newValue);
      } else {
        var id = readStoredThemeId();
        applyTheme(id);
        syncThemeSelect(id);
      }
    });

    global.addEventListener("pageshow", function (ev) {
      if (root.getAttribute(SYNC_ATTR) !== "1") return;
      if (!ev.persisted) return;
      var id = readStoredThemeId();
      applyTheme(id);
      syncThemeSelect(id);
    });
  }

  function initFromStorageAndSync() {
    initThemeSync();
    return readStoredThemeId();
  }

  global.PmDashboardTheme = {
    STORAGE_KEY: STORAGE_KEY,
    DEFAULT_ID: DEFAULT_ID,
    BROADCAST_CHANNEL_NAME: BROADCAST_CHANNEL_NAME,
    themes: themes,
    apply: applyTheme,
    readStoredThemeId: readStoredThemeId,
    initFromStorage: initFromStorage,
    initThemeSync: initThemeSync,
    initFromStorageAndSync: initFromStorageAndSync,
    broadcastThemeChange: broadcastThemeChange,
  };
})(typeof window !== "undefined" ? window : this);
