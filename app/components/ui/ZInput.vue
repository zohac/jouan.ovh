<template>
  <div class="zfield" :class="{ 'zfield--error': error }">
    <label v-if="label" class="zfield__label" :for="fieldId">
      {{ label }}<span v-if="required" class="zfield__req" aria-hidden="true">*</span>
    </label>

    <textarea
      v-if="multiline"
      :id="fieldId"
      class="ztextarea"
      :value="modelValue"
      :required="required || undefined"
      :aria-invalid="error || undefined"
      :aria-describedby="hint ? hintId : undefined"
      v-bind="$attrs"
      @input="onInput"
    />

    <span v-else class="zinput__wrap">
      <span v-if="icon || $slots.icon" class="zinput__icon">
        <component :is="icon" v-if="icon" aria-hidden="true" />
        <slot v-else name="icon" />
      </span>
      <input
        :id="fieldId"
        class="zinput"
        :class="{ 'zinput--has-icon': icon || $slots.icon }"
        :value="modelValue"
        :required="required || undefined"
        :aria-invalid="error || undefined"
        :aria-describedby="hint ? hintId : undefined"
        v-bind="$attrs"
        @input="onInput"
      />
    </span>

    <span v-if="hint" :id="hintId" class="zfield__hint">{{ hint }}</span>
  </div>
</template>

<script setup lang="ts">
// Primitive champ du DS — label mono uppercase, valeur sans-serif, focus ring orange.
// Porté de docs/design_system/components/core/Input.jsx (CSS en <style scoped>, prerender-safe).
// API React (attrs natifs forwarded) → Vue : v-model (modelValue/update:modelValue) + $attrs sur le contrôle.
import type { Component } from "vue";
import { computed, useId } from "vue";

defineOptions({
  inheritAttrs: false,
});

interface Props {
  /** Valeur liée (v-model). */
  modelValue?: string;
  /** Label mono uppercase au-dessus du contrôle. */
  label?: string;
  /** Texte d'aide / d'erreur sous le contrôle. */
  hint?: string;
  /** Style d'erreur. @default false */
  error?: boolean;
  /** Ajoute un `*` orange au label + `required` natif. @default false */
  required?: boolean;
  /** Rend un <textarea> au lieu d'un <input>. @default false */
  multiline?: boolean;
  /** Icône leading (composant Vue ou nom), input simple uniquement. */
  icon?: string | Component;
  /** id explicite ; sinon généré (hydration-safe via useId). */
  id?: string;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: "",
  label: undefined,
  hint: undefined,
  error: false,
  required: false,
  multiline: false,
  icon: undefined,
  id: undefined,
});

const emit = defineEmits<{
  "update:modelValue": [value: string];
}>();

// id déterministe et hydration-safe (useId), surchargeable par la prop `id`.
const generatedId = useId();
const fieldId = computed(() => props.id ?? generatedId);
const hintId = computed(() => `${fieldId.value}-hint`);

function onInput(event: Event) {
  emit("update:modelValue", (event.target as HTMLInputElement | HTMLTextAreaElement).value);
}
</script>

<style lang="scss" scoped>
/* stylelint-disable selector-class-pattern -- convention DS BEM (block__element / block--modifier) portée depuis Input.jsx */
.zfield {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.zfield__label {
  font-family: var(--font-mono);
  font-size: var(--fs-xs);
  letter-spacing: var(--ls-wider);
  text-transform: uppercase;
  color: var(--text-muted);
}

.zfield__req {
  margin-left: 2px;
  color: var(--accent);
}

.zinput,
.ztextarea {
  box-sizing: border-box;
  width: 100%;
  height: 42px;
  padding: 0 var(--space-3);
  font-family: var(--font-sans);
  font-size: var(--fs-base);
  color: var(--text-strong);
  background: var(--bg-input);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-md);
  transition:
    border-color var(--dur-fast) var(--ease-standard),
    box-shadow var(--dur-fast) var(--ease-standard);

  &::placeholder {
    color: var(--text-faint);
  }

  &:hover {
    border-color: var(--border-strong);
  }

  &:focus {
    outline: none;
    border-color: var(--accent);
    box-shadow: var(--ring-accent);
  }
}

.ztextarea {
  height: auto;
  min-height: 110px;
  padding: var(--space-3);
  line-height: var(--lh-normal);
  resize: vertical;
}

.zfield--error {
  .zinput,
  .ztextarea {
    border-color: var(--danger);
  }

  .zfield__hint {
    color: var(--danger);
  }
}

.zfield__hint {
  font-family: var(--font-mono);
  font-size: var(--fs-xs);
  color: var(--text-muted);
}

.zinput__wrap {
  position: relative;
  display: flex;
  align-items: center;
}

.zinput--has-icon {
  padding-left: calc(var(--space-3) + 1.4em);
}

.zinput__icon {
  position: absolute;
  left: var(--space-3);
  display: inline-flex;
  width: 1.05em;
  height: 1.05em;
  color: var(--text-muted);

  :deep(svg) {
    width: 100%;
    height: 100%;
  }
}

@media (prefers-reduced-motion: reduce) {
  .zinput,
  .ztextarea {
    transition: none;
  }
}
</style>
