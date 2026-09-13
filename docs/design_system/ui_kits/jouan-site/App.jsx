const ACCENTS = {
  orange: {},
  aubergine: {
    "--accent": "hsl(319 55% 60%)",
    "--accent-hover": "hsl(319 62% 68%)",
    "--accent-active": "hsl(319 55% 50%)",
    "--accent-text": "hsl(320 60% 6%)",
    "--accent-soft": "hsl(319 55% 60% / 0.15)",
    "--accent-ring": "hsl(319 55% 60% / 0.45)",
  },
  vert: {
    "--accent": "hsl(143 58% 48%)",
    "--accent-hover": "hsl(143 60% 56%)",
    "--accent-active": "hsl(143 58% 40%)",
    "--accent-text": "hsl(150 60% 6%)",
    "--accent-soft": "hsl(143 58% 48% / 0.15)",
    "--accent-ring": "hsl(143 58% 48% / 0.45)",
  },
};

function Switcher({ heroVariant, setHeroVariant, accent, setAccent, route }) {
  return (
    <div className="switcher">
      {route === "home" ? (
        <>
          <span className="switcher__lbl">Hero</span>
          <div className="seg">
            {[["a", "Terminal"], ["b", "Portrait"], ["c", "Statement"]].map(([v, l]) => (
              <button key={v} className={heroVariant === v ? "on" : ""} onClick={() => setHeroVariant(v)}>{l}</button>
            ))}
          </div>
        </>
      ) : null}
      <span className="switcher__lbl">Accent</span>
      <div className="seg">
        {[["orange", "Orange"], ["aubergine", "Aubergine"], ["vert", "Vert"]].map(([v, l]) => (
          <button key={v} className={accent === v ? "on" : ""} onClick={() => setAccent(v)}>{l}</button>
        ))}
      </div>
    </div>
  );
}

function App() {
  const [route, setRoute] = React.useState("home");
  const [slug, setSlug] = React.useState(null);
  const [heroVariant, setHeroVariant] = React.useState("a");
  const [accent, setAccent] = React.useState("orange");
  const [termOpen, setTermOpen] = React.useState(false);

  React.useEffect(() => {
    const root = document.documentElement;
    const keys = ["--accent", "--accent-hover", "--accent-active", "--accent-text", "--accent-soft", "--accent-ring"];
    keys.forEach((k) => root.style.removeProperty(k));
    Object.entries(ACCENTS[accent]).forEach(([k, v]) => root.style.setProperty(k, v));
  }, [accent]);

  const go = (r) => { setRoute(r); window.scrollTo({ top: 0 }); };
  const openArticle = (s) => { setSlug(s); go("article"); };
  const openTerminal = () => setTermOpen(true);

  const screen = () => {
    switch (route) {
      case "services": return <window.Services go={go} />;
      case "about": return <window.About go={go} />;
      case "blog": return <window.Blog go={go} openArticle={openArticle} />;
      case "article": return <window.Article go={go} slug={slug} />;
      case "contact": return <window.Contact openTerminal={openTerminal} />;
      default: return <window.Home go={go} openTerminal={openTerminal} heroVariant={heroVariant} />;
    }
  };

  return (
    <div className="app">
      <window.Header route={route} go={go} openTerminal={openTerminal} />
      <div key={route}>{screen()}</div>
      <window.Footer go={go} />
      <button className="term-launch" onClick={openTerminal}>
        <window.Icon.terminal /> ouvrir le terminal
      </button>
      {termOpen ? <window.TerminalScreen close={() => setTermOpen(false)} /> : null}
      <Switcher heroVariant={heroVariant} setHeroVariant={setHeroVariant} accent={accent} setAccent={setAccent} route={route} />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
