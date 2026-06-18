const { Button, Badge, Tag, Card, Avatar, TerminalWindow, Prompt } = window.JouanOvhDesignSystem_c7aa28;

function HeroTerminal({ go, openTerminal }) {
  const S = window.SITE;
  return (
    <section className="hero hero__grad">
      <div className="hero__in container">
        <div className="hero__grid">
          <div className="anim">
            <p className="eyebrow">// développeur web freelance</p>
            <h1>Du code <em>sur-mesure</em>,<br />de l'IA <em>utile</em>.</h1>
            <p className="hero__sub">{S.tagline}</p>
            <div className="hero__cta">
              <Button variant="primary" size="lg" iconRight={<window.Icon.arrow />} onClick={() => go("contact")}>Démarrer un projet</Button>
              <Button variant="secondary" size="lg" onClick={() => go("services")}>Voir les services</Button>
            </div>
            <div className="hero__tags">
              {["php", "symfony", "wordpress", "nest.js", "nuxt.js"].map((t) => <Tag key={t}>{t}</Tag>)}
            </div>
          </div>
          <div className="anim" style={{ animationDelay: "80ms" }}>
            <TerminalWindow title="anon.@jouan.ovh: ~" height={300} onClose={() => {}}>
              <Prompt command="whoami" />{"\n"}
              <span style={{ color: "var(--ink-1)" }}>Simon Jouan — {S.role}</span>{"\n\n"}
              <Prompt command="cat stack.txt" />{"\n"}
              <span style={{ color: "var(--term-blue)" }}>PHP/Symfony · WordPress · Node/Nest · Nuxt</span>{"\n\n"}
              <Prompt command="ls ~/projets" />{"\n"}
              <span style={{ color: "var(--term-green)" }}>keova.app/   patio-conseil.fr/</span>{"\n\n"}
              <span onClick={openTerminal} style={{ cursor: "pointer" }}><Prompt command="help" caret /></span>
            </TerminalWindow>
          </div>
        </div>
      </div>
    </section>
  );
}

function HeroPortrait({ go }) {
  const S = window.SITE;
  return (
    <section className="hero hero__heritage hero--center">
      <div className="hero__in container">
        <div className="anim" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <Avatar src="../../assets/brand/portrait.jpeg" alt={S.name} size="xl" ring status />
          <p className="eyebrow" style={{ marginTop: "var(--space-5)" }}>// {S.role}</p>
          <h1 style={{ marginBottom: "var(--space-2)" }}>{S.name}</h1>
          <p className="hero__sub">{S.tagline}</p>
          <div className="hero__cta">
            <Button variant="primary" size="lg" iconRight={<window.Icon.arrow />} onClick={() => go("contact")}>Travaillons ensemble</Button>
            <Button variant="secondary" size="lg" onClick={() => go("about")}>À propos</Button>
          </div>
          <div className="hexrow" style={{ marginTop: "var(--space-6)" }}>
            {S.social.map((s) => { const G = window.Icon[s.icon]; return <a key={s.icon} className="hex" href={s.url} target="_blank" rel="noreferrer"><G /></a>; })}
          </div>
        </div>
      </div>
    </section>
  );
}

function HeroStatement({ go }) {
  const S = window.SITE;
  return (
    <section className="hero">
      <div className="hero__img" style={{ backgroundImage: "url(../../assets/backgrounds/hacker-den-1.png)" }} />
      <div className="hero__in container">
        <div className="anim" style={{ maxWidth: "820px" }}>
          <p className="eyebrow">// freelance · PHP · WordPress · IA</p>
          <h1 style={{ fontSize: "var(--fs-6xl)" }}>Je transforme des idées en <em>produits web</em> qui tournent.</h1>
          <p className="hero__sub" style={{ maxWidth: "52ch" }}>{S.tagline}</p>
          <div className="hero__cta">
            <Button variant="primary" size="lg" iconRight={<window.Icon.arrow />} onClick={() => go("contact")}>Démarrer un projet</Button>
            <Button variant="terminal" size="lg" icon={<window.Icon.terminal />} onClick={() => go("services")}>./services</Button>
          </div>
        </div>
      </div>
    </section>
  );
}

function ServicesPreview({ go }) {
  const S = window.SITE;
  return (
    <section className="section">
      <div className="container">
        <p className="eyebrow">// ce que je fais</p>
        <h2 style={{ fontSize: "var(--fs-3xl)", marginBottom: "var(--space-8)" }}>Trois façons de travailler ensemble</h2>
        <div className="grid-3">
          {S.services.map((sv) => {
            const G = window.Icon[sv.icon];
            return (
              <Card key={sv.title} interactive accent={sv.featured} featured={sv.featured} className="offer">
                <div className="offer__icon"><G /></div>
                <h3>{sv.title}</h3>
                <p>{sv.desc}</p>
                <a onClick={() => go("services")} style={{ fontFamily: "var(--font-mono)", fontSize: "var(--fs-sm)", color: "var(--accent)", cursor: "pointer" }}>En savoir plus →</a>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function StatsProjects({ go }) {
  const S = window.SITE;
  return (
    <section className="section section--sunken">
      <div className="container">
        <div className="statrow" style={{ marginBottom: "var(--space-12)" }}>
          {S.stats.map((s) => <div className="stat" key={s.l}><b>{s.n}</b><span>{s.l}</span></div>)}
        </div>
        <p className="eyebrow">// projets sélectionnés</p>
        <div className="grid-2" style={{ marginTop: "var(--space-5)" }}>
          {S.projects.map((p) => (
            <Card key={p.name} interactive as="a" href={p.url} target="_blank">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <h3 style={{ fontSize: "var(--fs-xl)" }}>{p.name}</h3>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "var(--fs-xs)", color: "var(--text-muted)" }}>{p.role}</span>
              </div>
              <p className="prose" style={{ fontSize: "var(--fs-sm)", margin: "var(--space-3) 0 var(--space-4)" }}>{p.desc}</p>
              <div className="hero__tags">{p.tags.map((t) => <Tag key={t}>{t}</Tag>)}</div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

function Home({ go, openTerminal, heroVariant }) {
  const Hero = heroVariant === "b" ? HeroPortrait : heroVariant === "c" ? HeroStatement : HeroTerminal;
  return (
    <main>
      <Hero go={go} openTerminal={openTerminal} />
      <ServicesPreview go={go} />
      <StatsProjects go={go} />
    </main>
  );
}
window.Home = Home;
