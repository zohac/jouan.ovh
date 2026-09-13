const { Button, Badge, Avatar } = window.JouanOvhDesignSystem_c7aa28;

function Header({ route, go, openTerminal }) {
  const items = [
    ["home", "Accueil"], ["services", "Services"], ["about", "À propos"],
    ["blog", "Blog"], ["contact", "Contact"],
  ];
  return (
    <header className="hdr">
      <div className="hdr__in container">
        <div className="hdr__brand" onClick={() => go("home")}>
          <img src="../../assets/brand/logo-white.png" alt="" />
          <b>jouan.ovh</b>
        </div>
        <nav className="hdr__nav">
          {items.map(([id, label]) => (
            <button key={id}
              className={"hdr__link" + (route === id || (route === "article" && id === "blog") ? " hdr__link--active" : "")}
              onClick={() => go(id)}>{label}</button>
          ))}
        </nav>
        <div className="hdr__right">
          <Badge tone="success" dot>Disponible</Badge>
          <Button variant="terminal" size="sm" icon={<window.Icon.terminal />} onClick={openTerminal}>Terminal</Button>
          <Button variant="primary" size="sm" onClick={() => go("contact")}>Démarrer un projet</Button>
        </div>
      </div>
    </header>
  );
}
window.Header = Header;
