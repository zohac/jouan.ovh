const { Button, Card, Badge } = window.JouanOvhDesignSystem_c7aa28;

function Services({ go }) {
  const S = window.SITE;
  const steps = [
    ["01", "Échange", "On cadre le besoin, le périmètre et le budget — sans jargon inutile."],
    ["02", "Conception", "Architecture, maquette, et plan de livraison clair."],
    ["03", "Développement", "Code propre, testé, livré par itérations visibles."],
    ["04", "Livraison & suivi", "Mise en ligne, documentation, et accompagnement."],
  ];
  return (
    <main>
      <section className="section">
        <div className="container">
          <p className="eyebrow">// services</p>
          <h1 style={{ fontSize: "var(--fs-4xl)", fontWeight: "var(--fw-light)", maxWidth: "16ch", marginBottom: "var(--space-3)" }}>
            Des prestations claires, pensées comme des produits.
          </h1>
          <p className="prose" style={{ maxWidth: "60ch", color: "var(--text-muted)", marginBottom: "var(--space-10)" }}>
            Du site WordPress à l'application sur-mesure, en passant par l'IA appliquée — je m'occupe de la technique, vous gardez la main sur votre projet.
          </p>
          <div className="grid-3">
            {S.services.map((sv) => {
              const G = window.Icon[sv.icon];
              return (
                <Card key={sv.title} accent={sv.featured} featured={sv.featured} className="offer" style={{ display: "flex", flexDirection: "column" }}>
                  {sv.featured ? <div style={{ marginBottom: "var(--space-3)" }}><Badge tone="accent">Le plus demandé</Badge></div> : null}
                  <div className="offer__icon"><G /></div>
                  <h3>{sv.title}</h3>
                  <p>{sv.desc}</p>
                  <ul>{sv.points.map((p) => <li key={p}>{p}</li>)}</ul>
                  <div className="offer__price" style={{ marginTop: "auto", paddingTop: "var(--space-5)" }}>
                    <b>{sv.price}</b>
                  </div>
                  <div style={{ marginTop: "var(--space-4)" }}>
                    <Button variant={sv.featured ? "primary" : "secondary"} onClick={() => go("contact")} style={{ width: "100%" }}>Discuter du projet</Button>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section section--sunken">
        <div className="container">
          <p className="eyebrow">// comment ça se passe</p>
          <h2 style={{ fontSize: "var(--fs-3xl)", marginBottom: "var(--space-8)" }}>Un déroulé simple en quatre temps</h2>
          <div className="grid-2" style={{ gridTemplateColumns: "repeat(4, 1fr)", gap: "var(--space-5)" }}>
            {steps.map(([n, t, d]) => (
              <div key={n}>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: "var(--fs-3xl)", color: "var(--accent)", fontWeight: "var(--fw-light)" }}>{n}</div>
                <h3 style={{ fontSize: "var(--fs-lg)", margin: "var(--space-2) 0" }}>{t}</h3>
                <p className="prose" style={{ fontSize: "var(--fs-sm)", color: "var(--text-muted)" }}>{d}</p>
              </div>
            ))}
          </div>
          <div style={{ marginTop: "var(--space-12)", textAlign: "center" }}>
            <Button variant="primary" size="lg" iconRight={<window.Icon.arrow />} onClick={() => go("contact")}>Demander un devis</Button>
          </div>
        </div>
      </section>
    </main>
  );
}
window.Services = Services;
