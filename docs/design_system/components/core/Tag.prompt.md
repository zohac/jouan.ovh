**Tag** — pill chip for technologies and blog topics; mono with an orange `#` prefix. Use in clusters for tech stacks (`#wordpress #symfony #nuxt`) or article tags.

```jsx
<Tag>wordpress</Tag>
<Tag hash={false}>Freelance</Tag>
<Tag onRemove={() => drop(t)}>react</Tag>   // removable
```

`hash` toggles the `#`. `onRemove` adds a × button. Pass `onClick` to make it interactive (filter chips).
