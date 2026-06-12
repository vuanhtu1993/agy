import { useState, useEffect, useRef } from "react";

const NAV_ITEMS = [
  {
    chapter: "Getting Started",
    icon: "⚡",
    items: [
      { label: "What is Antigravity?", active: false },
      { label: "Installation & Setup", active: false },
      { label: "Your First Vibe Session", active: false },
    ],
  },
  {
    chapter: "Core Workflow",
    icon: "🔁",
    items: [
      { label: "The Vibe Loop", active: true },
      { label: "Prompt Engineering", active: false },
      { label: "Context Windows", active: false },
      { label: "Multi-file Edits", active: false },
    ],
  },
  {
    chapter: "Debugging",
    icon: "🐛",
    items: [
      { label: "AI Error Analysis", active: false },
      { label: "Stack Trace Decoding", active: false },
      { label: "Rubber Duck Mode", active: false },
    ],
  },
  {
    chapter: "Deployment",
    icon: "🚀",
    items: [
      { label: "CI/CD Integration", active: false },
      { label: "Docker & Containers", active: false },
      { label: "Edge Deployments", active: false },
    ],
  },
  {
    chapter: "Advanced",
    icon: "✦",
    items: [
      { label: "Custom AI Models", active: false },
      { label: "Plugin Architecture", active: false },
      { label: "Team Workflows", active: false },
    ],
  },
];

const TOC = [
  { label: "The Vibe Loop Explained", id: "vibe-loop" },
  { label: "Why Context Matters", id: "context" },
  { label: "Trade-offs to Know", id: "tradeoffs" },
  { label: "When to Break the Loop", id: "break" },
];

const CODE_EXAMPLES = [
  {
    filename: "terminal",
    lang: "bash",
    isTerminal: true,
    code: `$ antigravity init my-project\n✦ Initializing Vibe session...\n✦ Attaching AI context (claude-sonnet-4-6)\n✦ Watching: src/**/*.ts\n\n> Ready. Start typing to begin vibe coding.`,
  },
  {
    filename: "vibe.config.ts",
    lang: "typescript",
    isTerminal: false,
    code: `import { defineConfig } from 'antigravity'

export default defineConfig({
  model: 'claude-sonnet-4-6',
  context: {
    maxTokens: 32000,
    includeGitHistory: true,
    watchPaths: ['src/**', 'tests/**'],
  },
  vibe: {
    autoApply: false,       // review before applying
    diffMode: 'unified',
    explainChanges: true,   // AI explains every edit
  },
  hooks: {
    beforeApply: './hooks/lint.ts',
    afterApply: './hooks/typecheck.ts',
  },
})`,
  },
  {
    filename: "run command",
    lang: "bash",
    isTerminal: true,
    code: `$ antigravity run --watch\n\n[vibe] Analyzing src/api/routes.ts...\n[vibe] Detected: unhandled Promise rejection\n[vibe] Suggestion ready → apply? (y/n) y\n[vibe] ✓ Applied in 340ms\n[vibe] Running typecheck... passed\n[vibe] Running lint...      passed`,
  },
];

function CopyButton({ code }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(code).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };
  return (
    <button
      onClick={copy}
      className="copy-btn"
      aria-label="Copy code"
      style={{
        background: copied ? "rgba(0,212,255,0.15)" : "rgba(255,255,255,0.05)",
        border: `1px solid ${copied ? "rgba(0,212,255,0.4)" : "rgba(255,255,255,0.1)"}`,
        color: copied ? "#00d4ff" : "#8892a4",
        borderRadius: "6px",
        padding: "4px 10px",
        fontSize: "11px",
        fontFamily: "inherit",
        cursor: "pointer",
        transition: "all 0.2s",
        letterSpacing: "0.02em",
      }}
    >
      {copied ? "✓ Copied" : "Copy"}
    </button>
  );
}

function WindowDots() {
  return (
    <span style={{ display: "flex", gap: "6px", alignItems: "center" }}>
      {["#ff5f57", "#ffbd2e", "#28c840"].map((c, i) => (
        <span
          key={i}
          style={{
            width: 10,
            height: 10,
            borderRadius: "50%",
            background: c,
            opacity: 0.85,
          }}
        />
      ))}
    </span>
  );
}

function CodeBlock({ block }) {
  const isTerminal = block.isTerminal;
  return (
    <div
      className="code-block"
      style={{
        background: isTerminal ? "#050810" : "#0d1117",
        border: `1px solid ${isTerminal ? "rgba(0,212,255,0.12)" : "rgba(255,255,255,0.07)"}`,
        borderRadius: "10px",
        overflow: "hidden",
        marginBottom: "20px",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "9px 14px",
          borderBottom: `1px solid ${isTerminal ? "rgba(0,212,255,0.08)" : "rgba(255,255,255,0.06)"}`,
          background: isTerminal ? "rgba(0,212,255,0.03)" : "rgba(255,255,255,0.02)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {isTerminal ? (
            <span
              style={{
                fontSize: "11px",
                color: "#00d4ff",
                opacity: 0.7,
                fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                letterSpacing: "0.06em",
              }}
            >
              ◈ TERMINAL
            </span>
          ) : (
            <>
              <WindowDots />
              <span
                style={{
                  fontSize: "12px",
                  color: "#8892a4",
                  fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                }}
              >
                {block.filename}
              </span>
            </>
          )}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span
            style={{
              fontSize: "10px",
              color: "#4a5568",
              fontFamily: "'JetBrains Mono', monospace",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
            }}
          >
            {block.lang}
          </span>
          <CopyButton code={block.code} />
        </div>
      </div>
      <pre
        style={{
          margin: 0,
          padding: "16px 18px",
          fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
          fontSize: "12.5px",
          lineHeight: "1.75",
          color: isTerminal ? "#a8d8b0" : "#c9d1d9",
          overflowX: "auto",
          whiteSpace: "pre",
        }}
      >
        <HighlightedCode code={block.code} lang={block.lang} isTerminal={isTerminal} />
      </pre>
    </div>
  );
}

function HighlightedCode({ code, lang, isTerminal }) {
  if (isTerminal) {
    return (
      <>
        {code.split("\n").map((line, i) => {
          const isCmd = line.startsWith("$");
          const isCheck = line.startsWith("✦") || line.includes("✓");
          const isPrompt = line.includes("→") || line.includes("?");
          return (
            <span
              key={i}
              style={{
                display: "block",
                color: isCmd
                  ? "#e2e8f0"
                  : isCheck
                  ? "#68d391"
                  : isPrompt
                  ? "#fbd38d"
                  : "#6b8a6b",
              }}
            >
              {line || "\u00a0"}
            </span>
          );
        })}
      </>
    );
  }

  if (lang === "typescript") {
    return <TypeScriptHighlight code={code} />;
  }

  return <span>{code}</span>;
}

function TypeScriptHighlight({ code }) {
  const keywords = ["import", "from", "export", "default", "const", "let", "true", "false"];
  const tokens = code.split(/(\s+|[{}()[\],.:'"\/])/);
  return (
    <>
      {code.split("\n").map((line, li) => {
        const isComment = line.trim().startsWith("//");
        if (isComment) {
          return (
            <span key={li} style={{ display: "block", color: "#525e6e" }}>
              {line}
            </span>
          );
        }
        const parts = line.split(/('.*?'|".*?"|\b(?:import|from|export|default|const|let|true|false)\b)/g);
        return (
          <span key={li} style={{ display: "block" }}>
            {parts.map((p, pi) => {
              if (keywords.includes(p))
                return <span key={pi} style={{ color: "#c792ea" }}>{p}</span>;
              if ((p.startsWith("'") || p.startsWith('"')) && p.length > 1)
                return <span key={pi} style={{ color: "#a5d6a7" }}>{p}</span>;
              if (/^\d+$/.test(p))
                return <span key={pi} style={{ color: "#f78c6c" }}>{p}</span>;
              return <span key={pi} style={{ color: "#c9d1d9" }}>{p}</span>;
            })}
          </span>
        );
      })}
    </>
  );
}

function Callout({ type, icon, title, children }) {
  const styles = {
    info: {
      border: "rgba(0,212,255,0.35)",
      bg: "rgba(0,212,255,0.05)",
      iconColor: "#00d4ff",
      titleColor: "#7dd8f0",
    },
    warning: {
      border: "rgba(251,189,35,0.4)",
      bg: "rgba(251,189,35,0.05)",
      iconColor: "#fbbf24",
      titleColor: "#fde68a",
    },
    success: {
      border: "rgba(52,211,153,0.4)",
      bg: "rgba(52,211,153,0.05)",
      iconColor: "#34d399",
      titleColor: "#6ee7b7",
    },
    danger: {
      border: "rgba(248,113,113,0.4)",
      bg: "rgba(248,113,113,0.05)",
      iconColor: "#f87171",
      titleColor: "#fca5a5",
    },
  };
  const s = styles[type] || styles.info;
  return (
    <div
      style={{
        borderLeft: `3px solid ${s.border}`,
        background: s.bg,
        borderRadius: "0 8px 8px 0",
        padding: "14px 16px",
        marginBottom: "20px",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          marginBottom: "6px",
        }}
      >
        <span style={{ color: s.iconColor, fontSize: "15px" }}>{icon}</span>
        <span
          style={{
            color: s.titleColor,
            fontSize: "13px",
            fontWeight: 600,
            letterSpacing: "0.04em",
            textTransform: "uppercase",
          }}
        >
          {title}
        </span>
      </div>
      <p
        style={{
          margin: 0,
          color: "#8892a4",
          fontSize: "14px",
          lineHeight: "1.65",
        }}
      >
        {children}
      </p>
    </div>
  );
}

function SidebarSection({ chapter, icon, items, defaultOpen }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={{ marginBottom: "4px" }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          padding: "7px 10px",
          background: "none",
          border: "none",
          cursor: "pointer",
          color: "#8892a4",
          fontSize: "11px",
          fontWeight: 600,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          textAlign: "left",
          borderRadius: "6px",
        }}
        className="sidebar-chapter-btn"
      >
        <span>{icon}</span>
        <span style={{ flex: 1 }}>{chapter}</span>
        <span
          style={{
            fontSize: "10px",
            transition: "transform 0.2s",
            transform: open ? "rotate(90deg)" : "rotate(0deg)",
            display: "inline-block",
          }}
        >
          ▶
        </span>
      </button>
      {open && (
        <div style={{ paddingLeft: "8px" }}>
          {items.map((item) => (
            <a
              key={item.label}
              href="#"
              onClick={(e) => e.preventDefault()}
              className="sidebar-link"
              style={{
                display: "block",
                padding: "6px 10px",
                fontSize: "13.5px",
                color: item.active ? "#00d4ff" : "#6b7585",
                background: item.active ? "rgba(0,212,255,0.07)" : "transparent",
                borderRadius: "6px",
                textDecoration: "none",
                borderLeft: item.active ? "2px solid #00d4ff" : "2px solid transparent",
                marginBottom: "1px",
                transition: "all 0.15s",
              }}
            >
              {item.label}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

export default function AntigravityCookbook() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
        setTimeout(() => searchRef.current?.focus(), 50);
      }
      if (e.key === "Escape") setSearchOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <div
      style={{
        fontFamily: "'Inter', 'Geist', system-ui, sans-serif",
        background: "#080b12",
        minHeight: "100vh",
        color: "#c9d1d9",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: #080b12; }
        ::-webkit-scrollbar-thumb { background: #1e2535; border-radius: 3px; }
        .sidebar-link:hover { color: #c9d1d9 !important; background: rgba(255,255,255,0.04) !important; }
        .sidebar-chapter-btn:hover { background: rgba(255,255,255,0.03) !important; color: #c9d1d9 !important; }
        .copy-btn:hover { background: rgba(0,212,255,0.1) !important; border-color: rgba(0,212,255,0.3) !important; color: #00d4ff !important; }
        .toc-link { color: #525e6e; text-decoration: none; font-size: 13px; display: block; padding: 4px 0 4px 10px; border-left: 1px solid #1e2535; transition: all 0.15s; }
        .toc-link:hover { color: #a0aec0; border-left-color: #00d4ff; }
        .nav-link { color: #6b7585; text-decoration: none; font-size: 13px; transition: color 0.15s; }
        .nav-link:hover { color: #c9d1d9; }
        .search-modal-backdrop { position: fixed; inset: 0; background: rgba(0,0,0,0.7); z-index: 100; display: flex; align-items: flex-start; justify-content: center; padding-top: 80px; }
        .github-btn { display: flex; align-items: center; gap: 6px; padding: 6px 12px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 7px; color: #8892a4; font-size: 13px; text-decoration: none; transition: all 0.15s; }
        .github-btn:hover { background: rgba(255,255,255,0.08); color: #c9d1d9; }
        .mobile-nav-btn { display: none; }
        @media (max-width: 900px) {
          .three-col { flex-direction: column !important; }
          .left-sidebar { position: static !important; width: 100% !important; max-height: none !important; border-right: none !important; border-bottom: 1px solid rgba(255,255,255,0.06) !important; display: none; }
          .left-sidebar.open { display: block !important; }
          .right-panel { width: 100% !important; position: static !important; }
          .middle-col { width: 100% !important; }
          .mobile-nav-btn { display: flex !important; }
        }
      `}</style>

      {/* Search Modal */}
      {searchOpen && (
        <div className="search-modal-backdrop" onClick={() => setSearchOpen(false)}>
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "100%",
              maxWidth: "560px",
              background: "#0d1117",
              border: "1px solid rgba(0,212,255,0.2)",
              borderRadius: "12px",
              overflow: "hidden",
              boxShadow: "0 24px 80px rgba(0,0,0,0.6)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", padding: "14px 16px", gap: "10px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              <span style={{ color: "#525e6e", fontSize: "16px" }}>⌕</span>
              <input
                ref={searchRef}
                placeholder="Search docs..."
                style={{
                  flex: 1,
                  background: "none",
                  border: "none",
                  outline: "none",
                  color: "#c9d1d9",
                  fontSize: "15px",
                  fontFamily: "inherit",
                }}
              />
              <kbd style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "5px", padding: "2px 6px", fontSize: "11px", color: "#525e6e" }}>ESC</kbd>
            </div>
            {["The Vibe Loop", "Installation & Setup", "antigravity run", "vibe.config.ts", "Error Analysis"].map((s) => (
              <div key={s} style={{ padding: "10px 16px", display: "flex", gap: "10px", alignItems: "center", cursor: "pointer", borderBottom: "1px solid rgba(255,255,255,0.04)" }}
                className="search-result-row">
                <span style={{ color: "#525e6e", fontSize: "13px" }}>⌕</span>
                <span style={{ fontSize: "14px", color: "#8892a4" }}>{s}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Navbar */}
      <nav
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          background: "rgba(8,11,18,0.92)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          height: "52px",
          display: "flex",
          alignItems: "center",
          padding: "0 24px",
          gap: "20px",
        }}
      >
        {/* Logo */}
        <a href="#" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{
            width: 26, height: 26,
            background: "linear-gradient(135deg, #00d4ff 0%, #7c3aed 100%)",
            borderRadius: "7px",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "13px", fontWeight: 700,
          }}>✦</span>
          <span style={{ fontSize: "15px", fontWeight: 600, color: "#e2e8f0", letterSpacing: "-0.02em" }}>
            Antigravity
          </span>
          <span style={{ fontSize: "11px", background: "rgba(0,212,255,0.12)", color: "#00d4ff", border: "1px solid rgba(0,212,255,0.2)", borderRadius: "4px", padding: "1px 6px", letterSpacing: "0.03em" }}>
            Cookbook
          </span>
        </a>

        <div style={{ flex: 1 }} />

        {/* Search */}
        <button
          onClick={() => { setSearchOpen(true); setTimeout(() => searchRef.current?.focus(), 50); }}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "8px",
            padding: "6px 12px",
            color: "#525e6e",
            fontSize: "13px",
            cursor: "pointer",
            fontFamily: "inherit",
            minWidth: "200px",
            textAlign: "left",
          }}
        >
          <span>⌕</span>
          <span style={{ flex: 1 }}>Search docs...</span>
          <kbd style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "4px", padding: "1px 5px", fontSize: "11px", color: "#525e6e" }}>⌘K</kbd>
        </button>

        <nav style={{ display: "flex", gap: "16px", alignItems: "center" }}>
          <a href="#" className="nav-link">Docs</a>
          <a href="#" className="nav-link">CLI Ref</a>
          <a href="#" className="nav-link">Changelog</a>
        </nav>

        <a href="#" className="github-btn">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
          </svg>
          GitHub
        </a>

        <button
          className="mobile-nav-btn"
          onClick={() => setMobileNavOpen(!mobileNavOpen)}
          style={{ background: "none", border: "none", color: "#8892a4", cursor: "pointer", fontSize: "20px" }}
        >
          ☰
        </button>
      </nav>

      {/* Main 3-column layout */}
      <div className="three-col" style={{ display: "flex", maxWidth: "1400px", margin: "0 auto" }}>

        {/* Left Sidebar */}
        <aside
          className={`left-sidebar ${mobileNavOpen ? "open" : ""}`}
          style={{
            width: "220px",
            flexShrink: 0,
            borderRight: "1px solid rgba(255,255,255,0.06)",
            position: "sticky",
            top: "52px",
            height: "calc(100vh - 52px)",
            overflowY: "auto",
            padding: "20px 12px",
          }}
        >
          <div style={{ marginBottom: "16px", padding: "0 10px" }}>
            <p style={{ fontSize: "10px", color: "#2d3748", letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 4px" }}>v2.4.1</p>
          </div>
          {NAV_ITEMS.map((section, i) => (
            <SidebarSection
              key={section.chapter}
              {...section}
              defaultOpen={i < 2}
            />
          ))}
        </aside>

        {/* Middle Column — Theory */}
        <main
          className="middle-col"
          style={{
            flex: 1,
            minWidth: 0,
            padding: "40px 44px 80px",
            borderRight: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          {/* Breadcrumb */}
          <div style={{ display: "flex", gap: "6px", alignItems: "center", marginBottom: "24px", fontSize: "13px", color: "#525e6e" }}>
            <span>Core Workflow</span>
            <span>›</span>
            <span style={{ color: "#8892a4" }}>The Vibe Loop</span>
          </div>

          {/* Page Title */}
          <h1
            style={{
              fontSize: "30px",
              fontWeight: 700,
              color: "#e2e8f0",
              margin: "0 0 10px",
              letterSpacing: "-0.03em",
              lineHeight: 1.2,
            }}
          >
            The Vibe Loop
          </h1>
          <p style={{ fontSize: "16px", color: "#6b7585", marginBottom: "32px", lineHeight: 1.6 }}>
            The core feedback cycle that makes AI-assisted coding fast, deliberate, and reversible.
          </p>

          {/* Divider */}
          <div style={{ height: "1px", background: "rgba(255,255,255,0.06)", marginBottom: "32px" }} />

          {/* TOC */}
          <div style={{ marginBottom: "36px" }}>
            <p style={{ fontSize: "11px", color: "#2d3748", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "10px" }}>On this page</p>
            {TOC.map((t) => (
              <a key={t.id} href={`#${t.id}`} className="toc-link" onClick={(e) => e.preventDefault()}>
                {t.label}
              </a>
            ))}
          </div>

          {/* Content */}
          <h2 id="vibe-loop" style={{ fontSize: "20px", fontWeight: 600, color: "#e2e8f0", margin: "0 0 14px", letterSpacing: "-0.02em" }}>
            The Vibe Loop Explained
          </h2>
          <p style={{ color: "#8892a4", fontSize: "15px", lineHeight: "1.75", marginBottom: "16px" }}>
            Vibe coding is a tight loop between <strong style={{ color: "#c9d1d9" }}>intent</strong>, <strong style={{ color: "#c9d1d9" }}>generation</strong>, and <strong style={{ color: "#c9d1d9" }}>validation</strong>. You express what you want in natural language, Antigravity generates a diff, and you decide whether to apply, reject, or iterate. The loop runs until the code is exactly right.
          </p>
          <p style={{ color: "#8892a4", fontSize: "15px", lineHeight: "1.75", marginBottom: "24px" }}>
            Unlike autocomplete tools that produce line-by-line suggestions, Antigravity reasons about your entire codebase before generating a change. This means fewer hallucinated APIs and far less time debugging suggestions that don't compile.
          </p>

          <Callout type="info" icon="◈" title="How It Works">
            Antigravity loads your project graph into context before every generation. It reads open files, recent git commits, and your{" "}
            <code style={{ fontFamily: "monospace", fontSize: "13px", background: "rgba(255,255,255,0.06)", padding: "1px 5px", borderRadius: "4px", color: "#a5d6a7" }}>
              vibe.config.ts
            </code>{" "}
            to understand your conventions before writing a single token.
          </Callout>

          <h2 id="context" style={{ fontSize: "20px", fontWeight: 600, color: "#e2e8f0", margin: "32px 0 14px", letterSpacing: "-0.02em" }}>
            Why Context Matters
          </h2>
          <p style={{ color: "#8892a4", fontSize: "15px", lineHeight: "1.75", marginBottom: "16px" }}>
            Most AI coding failures aren't model failures — they're context failures. When the model doesn't know your types, your naming conventions, or what file calls what, it guesses. Antigravity's context engine is designed to make guessing unnecessary.
          </p>
          <p style={{ color: "#8892a4", fontSize: "15px", lineHeight: "1.75", marginBottom: "24px" }}>
            By default, Antigravity includes up to 32,000 tokens of context per generation. This covers most mid-sized features end-to-end. For large refactors, use the{" "}
            <code style={{ fontFamily: "monospace", fontSize: "13px", background: "rgba(255,255,255,0.06)", padding: "1px 5px", borderRadius: "4px", color: "#a5d6a7" }}>
              --scope
            </code>{" "}
            flag to limit which files are included.
          </p>

          <h2 id="tradeoffs" style={{ fontSize: "20px", fontWeight: 600, color: "#e2e8f0", margin: "32px 0 14px", letterSpacing: "-0.02em" }}>
            Trade-offs to Know
          </h2>

          <Callout type="warning" icon="⚠" title="Trade-off: Speed vs. Accuracy">
            Disabling{" "}
            <code style={{ fontFamily: "monospace", fontSize: "13px", background: "rgba(251,189,35,0.1)", padding: "1px 5px", borderRadius: "4px", color: "#fbd38d" }}>
              explainChanges
            </code>{" "}
            in your config speeds up the loop by ~40%, but you lose the AI's reasoning. For greenfield work, this is often fine. For debugging or refactors, keep explanations on — you'll catch bad reasoning before it lands.
          </Callout>

          <Callout type="success" icon="✓" title="Best Practice: Hook Your Validators">
            Wire your TypeScript check and linter into the{" "}
            <code style={{ fontFamily: "monospace", fontSize: "13px", background: "rgba(52,211,153,0.08)", padding: "1px 5px", borderRadius: "4px", color: "#6ee7b7" }}>
              afterApply
            </code>{" "}
            hook. Antigravity will show you validation results inline, so you never apply a change that breaks your build.
          </Callout>

          <Callout type="danger" icon="✕" title="Avoid: Applying Without Reading">
            The speed of vibe coding can tempt you into applying every suggestion without reading the diff. This is how subtle logic errors accumulate. The{" "}
            <code style={{ fontFamily: "monospace", fontSize: "13px", background: "rgba(248,113,113,0.08)", padding: "1px 5px", borderRadius: "4px", color: "#fca5a5" }}>
              autoApply: false
            </code>{" "}
            default exists for a reason — keep it.
          </Callout>

          <h2 id="break" style={{ fontSize: "20px", fontWeight: 600, color: "#e2e8f0", margin: "32px 0 14px", letterSpacing: "-0.02em" }}>
            When to Break the Loop
          </h2>
          <p style={{ color: "#8892a4", fontSize: "15px", lineHeight: "1.75", marginBottom: "16px" }}>
            The Vibe Loop is a tool, not a religion. Break out of it when the problem requires deep architectural thinking, when you're working on security-critical code, or when you notice the AI producing increasingly convoluted solutions to what should be a simple problem.
          </p>
          <p style={{ color: "#8892a4", fontSize: "15px", lineHeight: "1.75", marginBottom: "24px" }}>
            In those cases, switch to manual mode with{" "}
            <code style={{ fontFamily: "monospace", fontSize: "13px", background: "rgba(255,255,255,0.06)", padding: "1px 5px", borderRadius: "4px", color: "#a5d6a7" }}>
              antigravity pause
            </code>
            , write the tricky part yourself, then resume. Antigravity will re-read your manual changes and incorporate them into the next generation.
          </p>

          {/* Next / Prev */}
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "48px", paddingTop: "24px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
            <a href="#" style={{ display: "flex", flexDirection: "column", gap: "3px", textDecoration: "none" }} onClick={(e) => e.preventDefault()}>
              <span style={{ fontSize: "11px", color: "#525e6e", letterSpacing: "0.06em" }}>← PREVIOUS</span>
              <span style={{ fontSize: "14px", color: "#8892a4" }}>Your First Vibe Session</span>
            </a>
            <a href="#" style={{ display: "flex", flexDirection: "column", gap: "3px", textDecoration: "none", textAlign: "right" }} onClick={(e) => e.preventDefault()}>
              <span style={{ fontSize: "11px", color: "#525e6e", letterSpacing: "0.06em" }}>NEXT →</span>
              <span style={{ fontSize: "14px", color: "#8892a4" }}>Prompt Engineering</span>
            </a>
          </div>
        </main>

        {/* Right Column — Code */}
        <aside
          className="right-panel"
          style={{
            width: "400px",
            flexShrink: 0,
            position: "sticky",
            top: "52px",
            height: "calc(100vh - 52px)",
            overflowY: "auto",
            padding: "32px 24px 40px",
            background: "rgba(0,0,0,0.2)",
          }}
        >
          <div style={{ marginBottom: "20px" }}>
            <span style={{
              fontSize: "10px",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "#00d4ff",
              opacity: 0.7,
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}>
              <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#00d4ff", display: "inline-block" }} />
              Execution & Code
            </span>
          </div>

          {/* Code blocks */}
          {CODE_EXAMPLES.map((block, i) => (
            <div key={i}>
              {i === 0 && (
                <p style={{ fontSize: "12px", color: "#525e6e", marginBottom: "10px", lineHeight: "1.5" }}>
                  Initialize a new project and attach the AI context engine:
                </p>
              )}
              {i === 1 && (
                <p style={{ fontSize: "12px", color: "#525e6e", marginBottom: "10px", lineHeight: "1.5", marginTop: "4px" }}>
                  Configure the loop behavior in{" "}
                  <code style={{ fontFamily: "monospace", color: "#a5d6a7", fontSize: "12px" }}>vibe.config.ts</code>:
                </p>
              )}
              {i === 2 && (
                <p style={{ fontSize: "12px", color: "#525e6e", marginBottom: "10px", lineHeight: "1.5", marginTop: "4px" }}>
                  Start the watcher and let Antigravity monitor your files:
                </p>
              )}
              <CodeBlock block={block} />
            </div>
          ))}

          {/* Quick Ref */}
          <div style={{
            background: "#0d1117",
            border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: "10px",
            padding: "16px",
            marginTop: "4px",
          }}>
            <p style={{ fontSize: "11px", color: "#525e6e", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "12px" }}>Quick Reference</p>
            {[
              ["antigravity init", "Create new project"],
              ["antigravity run", "Start vibe loop"],
              ["antigravity pause", "Suspend AI watching"],
              ["antigravity diff", "Review pending changes"],
              ["antigravity undo", "Revert last apply"],
            ].map(([cmd, desc]) => (
              <div key={cmd} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "7px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                <code style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "12px", color: "#00d4ff", opacity: 0.85 }}>{cmd}</code>
                <span style={{ fontSize: "12px", color: "#525e6e" }}>{desc}</span>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}
