**TerminalWindow** — the brand's hero motif: a draggable-style OS window with a red close gem, centred title, and an aubergine, backdrop-blurred body. Fill it with `Prompt` lines and responses. Keep it as a *secondary* feature / easter-egg, not on every page.

```jsx
<TerminalWindow title="anon.@jouan.ovh: ~" height={340}>
  <Prompt command="about" /> {"\n"}
  Simon Jouan — Développeur web freelance {"\n"}
  <Prompt caret />
</TerminalWindow>
```

Props: `title`, `height`, `buttons` (traffic-light gems), `onClose`. Body scrolls; `white-space: pre-wrap` so you can lay out ASCII output. Pairs with `Prompt`.
