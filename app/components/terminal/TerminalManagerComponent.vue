<template>
  <div>
    <div v-for="(terminal, index) in terminals" :key="index">
      <TerminalComponent
        :id="index"
        :create-new-terminal="createNewTerminal"
        :terminal-config="terminal.terminalConfig"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ITerminalConfig } from "~/components/terminal/interfaces";
import { uniqueId } from "~/utils/functions";

// Migration Options API → <script setup> (story 8.3) : comportement strictement constant.
defineOptions({ name: "TerminalManagerComponent" });

const terminals = ref<Array<{ id: string; terminalConfig: ITerminalConfig }>>([]);

const createNewTerminal = (terminalConfig: ITerminalConfig = {}) => {
  // Créez une nouvelle instance de terminal et ajoutez-la à la liste des terminaux.
  const newTerminal = {
    id: uniqueId(),
    terminalConfig,
  };
  terminals.value.push(newTerminal);
};

// En <script setup> les bindings ne sont PAS exposés au parent sans defineExpose. Seul le
// header détient une ref de ce composant et appelle la méthode directement
// (`terminalManager.value?.createNewTerminal()`, HeaderComponent.vue). Le hero et /contact
// passent par `useTerminal().open()` → le lanceur que le header enregistre, lequel finit par
// appeler cette même méthode via sa ref. → on l'expose explicitement.
defineExpose({ createNewTerminal });
</script>

<style scoped></style>
