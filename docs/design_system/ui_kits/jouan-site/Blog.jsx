const { Card, Tag, Button, Badge } = window.JouanOvhDesignSystem_c7aa28;

function Blog({ go, openArticle }) {
  const S = window.SITE;
  return (
    <main>
      <section className="section">
        <div className="container">
          <p className="eyebrow">// ~/blog</p>
          <h1 style={{ fontSize: "var(--fs-4xl)", fontWeight: "var(--fw-light)", marginBottom: "var(--space-2)" }}>Notes de dev</h1>
          <p className="prose" style={{ color: "var(--text-muted)", marginBottom: "var(--space-10)", maxWidth: "56ch" }}>
            WordPress, architecture, IA appliquée — ce que j'apprends en construisant des choses.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-5)" }}>
            {S.posts.map((p) => (
              <Card key={p.slug} interactive className="post" onClick={() => openArticle(p.slug)}>
                <img className="post__thumb" src={p.img} alt="" />
                <div>
                  <div className="hero__tags" style={{ marginBottom: "var(--space-2)" }}>{p.tags.map((t) => <Tag key={t}>{t}</Tag>)}</div>
                  <h3>{p.title}</h3>
                  <p>{p.desc}</p>
                  <div className="post__meta"><span>{p.date}</span><span>·</span><span>{p.read} de lecture</span></div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

function Article({ go, slug }) {
  const S = window.SITE;
  const p = S.posts.find((x) => x.slug === slug) || S.posts[0];
  return (
    <main>
      <section className="section">
        <div className="container">
          <div className="article">
            <button className="hdr__link" style={{ paddingLeft: 0, marginBottom: "var(--space-5)" }} onClick={() => go("blog")}>← Retour au blog</button>
            <div className="hero__tags" style={{ marginBottom: "var(--space-4)" }}>{p.tags.map((t) => <Tag key={t}>{t}</Tag>)}</div>
            <h1>{p.title}</h1>
            <div className="post__meta" style={{ margin: "var(--space-4) 0 var(--space-8)" }}>
              <span>Simon Jouan</span><span>·</span><span>{p.date}</span><span>·</span><span>{p.read}</span>
            </div>
            <img className="article__hero" src={p.img} alt="" />
            <div className="prose">
              <p>{p.desc}</p>
              <p>
                La plupart des intégrations IA échouent non pas sur le modèle, mais sur l'architecture autour. On greffe un appel d'API au mauvais endroit, et le site devient lent, fragile et impossible à maintenir. Voici l'approche que j'applique sur mes projets.
              </p>
              <h2>Garder l'IA hors du chemin critique</h2>
              <p>
                L'idée centrale : un appel à un LLM est lent et faillible. Il ne doit jamais bloquer le rendu d'une page. On le déporte dans une file de traitement, on met en cache agressivement, et on prévoit toujours un fallback.
              </p>
              <pre><code>{`// file d'attente plutôt qu'appel synchrone
await queue.push('summarize', {
  postId: post.id,
  prompt: buildPrompt(post),
});
// le résultat arrive via webhook, mis en cache`}</code></pre>
              <h2>Mesurer le coût, toujours</h2>
              <p>
                Chaque appel a un prix. Je logue les tokens par requête et je fixe un budget mensuel — au-delà, le système bascule sur le cache ou désactive la fonctionnalité proprement. L'IA reste un confort, jamais une dépendance qui casse le site.
              </p>
            </div>
            <div style={{ marginTop: "var(--space-10)", paddingTop: "var(--space-6)", borderTop: "1px solid var(--border-subtle)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "var(--space-4)" }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "var(--fs-sm)", color: "var(--text-muted)" }}>Un projet en tête ?</span>
              <Button variant="primary" iconRight={<window.Icon.arrow />} onClick={() => go("contact")}>Démarrer un projet</Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
window.Blog = Blog;
window.Article = Article;
