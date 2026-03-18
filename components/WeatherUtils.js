export const GH = {
    canvas: "#0d1117", surface: "#161b22", overlay: "#1c2128",
    border: "#30363d", borderSub: "#21262d", text: "#e6edf3",
    textMuted: "#8b949e", textFaint: "#484f58", blue: "#58a6ff",
    yellow: "#d29922", red: "#f85149", purple: "#bc8cff", green: "#3fb950"
};

export const getAccent = (code) => {
    if (!code) return GH.blue;
    if (code >= 200 && code < 300) return GH.purple;
    if (code >= 300 && code < 600) return GH.blue;
    if (code >= 600 && code < 700) return "#a5f3fc";
    if (code === 800) return GH.yellow;
    return GH.textMuted;
};

export const toF = (c) => Math.round(c * 9 / 5 + 32);
export const displayTemp = (c, unit) => unit === "C" ? Math.round(c) : toF(c);
export const formatTime = (ts) => new Date(ts * 1000).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });