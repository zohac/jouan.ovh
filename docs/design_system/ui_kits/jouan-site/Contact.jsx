const { Button, Input, Card, Badge } = window.JouanOvhDesignSystem_c7aa28;

function Contact({ openTerminal }) {
  const S = window.SITE;
  const [sent, setSent] = React.useState(false);
  const submit = (e) => { e.preventDefault(); setSent(true); };
  return (
    <main>
      <section className="section">
        <div className="container">
          <div className="contact__grid">
            <div>
              <p className="eyebrow">// contact</p>
              <h1 style={{ fontSize: "var(--fs-4xl)", fontWeight: "var(--fw-light)", marginBottom: "var(--space-3)" }}>Parlons de votre projet</h1>
              <p className="prose" style={{ color: "var(--text-muted)", marginBottom: "var(--space-8)", maxWidth: "48ch" }}>
                Une idée, un site à refaire, une automatisation à mettre en place ? Décrivez-moi le besoin — je réponds sous 48h.
              </p>
              {sent ? (
                <Card accent>
                  <div style={{ fontFamily: "var(--font-mono)", color: "var(--term-green)", fontSize: "var(--fs-md)", marginBottom: "var(--space-2)" }}>
                    ✓ Message envoyé
                  </div>
                  <p className="prose" style={{ fontSize: "var(--fs-sm)", margin: 0 }}>Merci ! Je vous réponds très vite à votre adresse.</p>
                </Card>
              ) : (
                <form className="contact__form" onSubmit={submit}>
                  <div className="grid-2" style={{ gap: "var(--space-4)" }}>
                    <Input label="Nom" placeholder="Votre nom" required />
                    <Input label="Email" type="email" placeholder="vous@exemple.com" required />
                  </div>
                  <Input label="Sujet" placeholder="Site WordPress, application, IA…" />
                  <Input label="Message" multiline placeholder="Parlez-moi de votre projet…" required />
                  <div>
                    <Button variant="primary" size="lg" type="submit" iconRight={<window.Icon.arrow />}>Envoyer le message</Button>
                  </div>
                </form>
              )}
            </div>
            <div className="contact__info">
              <Card>
                <div className="infoitem" style={{ marginBottom: "var(--space-5)" }}>
                  <div className="k">// email</div>
                  <a className="v" href={"mailto:" + S.email} style={{ color: "var(--term-blue)" }}>{S.email}</a>
                </div>
                <div className="infoitem" style={{ marginBottom: "var(--space-5)" }}>
                  <div className="k">// localisation</div>
                  <div className="v">{S.city}</div>
                </div>
                <div className="infoitem">
                  <div className="k">// disponibilité</div>
                  <div style={{ marginTop: "var(--space-2)" }}><Badge tone="success" dot>Ouvert aux missions freelance</Badge></div>
                </div>
              </Card>
              <Card className="offer" style={{ background: "var(--bg-terminal)", borderColor: "hsl(319 40% 30% / 0.5)" }}>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: "var(--fs-sm)", color: "var(--term-green)", marginBottom: "var(--space-2)" }}>
                  anon.@jouan.ovh:~$ <span style={{ color: "var(--ink-1)" }}>./contact</span>
                </div>
                <p className="prose" style={{ fontSize: "var(--fs-sm)", color: "var(--text-muted)", margin: "0 0 var(--space-3)" }}>
                  Vous préférez la ligne de commande ? Ouvrez le terminal.
                </p>
                <Button variant="terminal" size="sm" icon={<window.Icon.terminal />} onClick={openTerminal}>Ouvrir le terminal</Button>
              </Card>
              <div className="hexrow">
                {S.social.map((s) => { const G = window.Icon[s.icon]; return <a key={s.icon} className="hex" href={s.url} target="_blank" rel="noreferrer" title={s.label}><G /></a>; })}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
window.Contact = Contact;
