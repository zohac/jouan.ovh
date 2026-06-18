function Footer({ go }) {
  const S = window.SITE;
  return (
    <footer className="ftr">
      <div className="container">
        <div className="ftr__in">
          <div className="ftr__col" style={{ maxWidth: "300px" }}>
            <div className="hdr__brand" style={{ marginBottom: "var(--space-3)" }}>
              <img src="../../assets/brand/logo-white.png" alt="" style={{ width: 22, height: 22 }} />
              <b style={{ fontFamily: "var(--font-mono)", color: "var(--text-strong)", fontSize: "var(--fs-md)", fontWeight: "var(--fw-bold)" }}>jouan.ovh</b>
            </div>
            <p className="prose" style={{ fontSize: "var(--fs-sm)", color: "var(--text-muted)", margin: 0 }}>
              {S.role}. {S.city}.
            </p>
          </div>
          <div className="ftr__col">
            <h4>// Navigation</h4>
            <a onClick={() => go("home")}>Accueil</a>
            <a onClick={() => go("services")}>Services</a>
            <a onClick={() => go("about")}>À propos</a>
            <a onClick={() => go("blog")}>Blog</a>
            <a onClick={() => go("contact")}>Contact</a>
          </div>
          <div className="ftr__col">
            <h4>// Projets</h4>
            {S.projects.map((p) => <a key={p.name} href={p.url} target="_blank" rel="noreferrer">{p.name}</a>)}
          </div>
          <div className="ftr__col">
            <h4>// Réseaux</h4>
            <div className="hexrow">
              {S.social.map((s) => {
                const Glyph = window.Icon[s.icon];
                return <a key={s.icon} className="hex" href={s.url} target="_blank" rel="noreferrer" title={s.label}><Glyph /></a>;
              })}
            </div>
          </div>
        </div>
        <div className="ftr__bottom">
          <span>© 2026 Simon Jouan — jouan.ovh</span>
          <span>anon.@jouan.ovh:~$ <span style={{ color: "var(--term-green)" }}>echo "merci de votre visite"</span></span>
        </div>
      </div>
    </footer>
  );
}
window.Footer = Footer;
