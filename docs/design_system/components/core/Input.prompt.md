**Input** — labelled text field or textarea. Mono uppercase label, Ubuntu-sans value, orange focus ring; supports hint + error states and a leading icon.

```jsx
<Input label="Email" type="email" placeholder="vous@exemple.com" required />
<Input label="Message" multiline placeholder="Parlez-moi de votre projet…" />
<Input label="Nom" error hint="Ce champ est requis" />
```

Props: `label`, `hint`, `error`, `required`, `multiline`, `icon`. Forwards all native input/textarea attributes.
