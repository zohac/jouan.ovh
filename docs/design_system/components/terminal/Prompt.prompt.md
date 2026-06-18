**Prompt** — the signature shell prompt line: green `user@host`, blue directory, `$`, command. Use as an eyebrow, a section marker, or inside `TerminalWindow`.

```jsx
<Prompt command="whoami" caret />
<Prompt user="anon." host="jouan.ovh" dir="~/blog" command="ls -la" />
```

Props: `user`, `host`, `dir`, `command`, `caret` (blinking, respects reduced-motion).
