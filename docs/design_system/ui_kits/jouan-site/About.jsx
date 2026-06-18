const { Card, Tag, Avatar, Button } = window.JouanOvhDesignSystem_c7aa28;

function About({ go }) {
  const S = window.SITE;
  return (
    <main>
      <section className="section">
        <div className="container">
          <div className="grid-2" style={{ gridTemplateColumns: "0.8fr 1.2fr", alignItems: "start" }}>
            <div>
              <Avatar src="../../assets/brand/portrait.jpeg" alt={S.name} size="xl" ring />
              <h1 style={{ fontSize: "var(--fs-3xl)", margin: "var(--space-5) 0 var(--space-1)" }}>{S.name}</h1>
              <p style={{ fontFamily: "var(--font-mono)", color: "var(--accent)", fontSize: "var(--fs-sm)" }}>{S.role}</p>
              <p className="prose" style={{ marginTop: "var(--space-4)", color: "var(--text-muted)", fontSize: "var(--fs-sm)" }}>
                <window.Icon.pin /> {S.city}
              </p>
              <div style={{ marginTop: "var(--space-5)", display: "flex", gap: "var(--space-3)" }}>
                <Button variant="primary" onClick={() => go("contact")}>Me contacter</Button>
                <Button variant="secondary" as="a" href={"mailto:" + S.email}>CV</Button>
              </div>
            </div>
            <div>
              <p className="eyebrow">// à propos</p>
              <p className="prose" style={{ fontSize: "var(--fs-md)" }}>
                Développeur web freelance, je viens d'un parcours technique (métrologie, instrumentation) avant de basculer dans le code. Aujourd'hui je conçois des applications en <strong style={{ color: "var(--text-strong)" }}>PHP/Symfony</strong>, des sites <strong style={{ color: "var(--text-strong)" }}>WordPress</strong> sur-mesure, et des produits en <strong style={{ color: "var(--text-strong)" }}>Node.js / Nest.js / Nuxt.js</strong>.
              </p>
              <p className="prose" style={{ fontSize: "var(--fs-md)" }}>
                Je suis aussi fondateur du SaaS <a href="https://keova.app" target="_blank" rel="noreferrer">keova.app</a>, et j'aime mettre l'IA au service du code — agents, automatisations, intégrations LLM.
              </p>
              <div style={{ margin: "var(--space-6) 0" }}>
                <p className="eyebrow eyebrow--muted">// stack</p>
                <div className="hero__tags">{S.skills.map((t) => <Tag key={t}>{t}</Tag>)}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section section--sunken">
        <div className="container">
          <div className="grid-2" style={{ gridTemplateColumns: "1.4fr 0.6fr", gap: "var(--space-12)" }}>
            <div>
              <p className="eyebrow">// expériences</p>
              <div className="tl" style={{ marginTop: "var(--space-5)" }}>
                {S.experiences.map((e) => (
                  <div className="tl__item" key={e.org}>
                    <div className="tl__date">{e.date}</div>
                    <div className="tl__role">{e.role}</div>
                    <div className="tl__org">{e.org}</div>
                    <div className="tl__desc">{e.desc}</div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p className="eyebrow">// formation</p>
              <div style={{ marginTop: "var(--space-5)", display: "flex", flexDirection: "column", gap: "var(--space-5)" }}>
                {S.degrees.map((d) => (
                  <Card key={d.name} padded>
                    <div className="tl__date">{d.date}</div>
                    <div style={{ fontFamily: "var(--font-mono)", color: "var(--text-strong)", fontSize: "var(--fs-sm)", margin: "4px 0" }}>{d.name}</div>
                    <div className="tl__org">{d.school}</div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
window.About = About;
