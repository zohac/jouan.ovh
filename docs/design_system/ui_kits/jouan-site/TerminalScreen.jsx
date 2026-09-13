const { TerminalWindow, Prompt } = window.JouanOvhDesignSystem_c7aa28;

const COMMANDS = {
  help: () => "Commandes disponibles :\n  about     — qui suis-je\n  skills    — ma stack technique\n  projets   — mes projets\n  contact   — comment me joindre\n  clear     — vider le terminal",
  whoami: () => "Simon Jouan — Développeur web freelance",
  about: () => "Développeur web freelance basé à Valognes.\nPHP/Symfony · WordPress · Node.js / Nest.js / Nuxt.js.\nFondateur du SaaS keova.app.",
  skills: () => window.SITE.skills.join("  "),
  projets: () => window.SITE.projects.map((p) => `${p.name.padEnd(20)} ${p.role}`).join("\n"),
  contact: () => "email   : simon@jouan.ovh\nville   : Valognes, France\nstatut  : disponible",
};

function TerminalScreen({ close }) {
  const [lines, setLines] = React.useState([
    { t: "  /S/  /J/  ·  jouan.ovh", c: "var(--accent)" },
    { t: 'Bienvenue. Tapez "help" pour voir les commandes.', c: "var(--text-muted)" },
  ]);
  const [input, setInput] = React.useState("");
  const bodyRef = React.useRef(null);
  const inputRef = React.useRef(null);

  React.useEffect(() => { if (inputRef.current) inputRef.current.focus(); }, []);
  React.useEffect(() => { if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight; }, [lines]);

  const run = (raw) => {
    const cmd = raw.trim();
    if (!cmd) return;
    if (cmd === "clear") { setLines([]); return; }
    const out = COMMANDS[cmd] ? COMMANDS[cmd]() : `Commande inconnue : ${cmd}  (tapez "help")`;
    setLines((l) => [...l, { prompt: cmd }, { t: out, c: COMMANDS[cmd] ? "var(--ink-1)" : "var(--term-red)" }]);
  };
  const onKey = (e) => { if (e.key === "Enter") { run(input); setInput(""); } };

  return (
    <div className="term-modal" onMouseDown={(e) => { if (e.target.classList.contains("term-modal")) close(); }}>
      <div className="term-modal__win">
        <TerminalWindow title="anon.@jouan.ovh: ~" height={420} onClose={close}>
          <div ref={bodyRef} style={{ height: "100%", overflow: "auto" }} onClick={() => inputRef.current && inputRef.current.focus()}>
            {lines.map((ln, i) => (
              <div key={i}>
                {ln.prompt ? <Prompt command={ln.prompt} /> : <span style={{ color: ln.c || "var(--ink-1)" }}>{ln.t}</span>}
              </div>
            ))}
            <div style={{ display: "flex", alignItems: "center" }}>
              <Prompt />
              <input ref={inputRef} className="term-input" value={input}
                onChange={(e) => setInput(e.target.value)} onKeyDown={onKey} spellCheck="false" autoComplete="off" />
            </div>
          </div>
        </TerminalWindow>
      </div>
    </div>
  );
}
window.TerminalScreen = TerminalScreen;
