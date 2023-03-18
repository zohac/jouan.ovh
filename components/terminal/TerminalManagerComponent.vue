<template>
  <div>
    <div v-for="(terminal, index) in terminals" :key="index">
      <TerminalComponent
        :id="index"
        :create-new-terminal="createNewTerminal"
        :terminal-config="terminal.terminalConfig"/>
    </div>
  </div>
</template>

<script lang="ts">
import { ITerminalConfig } from "~/components/terminal/interfaces";
import { uniqueId } from "~/utils/functions";

export default {
  name: "TerminalManagerComponent",
  components: {},

  setup() {
    const terminals = ref<Array<{ id: string; terminalConfig: ITerminalConfig; }>>([]);

    const createNewTerminal = (terminalConfig: ITerminalConfig = {}) => {
      // Créez une nouvelle instance de terminal et ajoutez-la à la liste des terminaux.
      const newTerminal = {
        id: uniqueId(),
        terminalConfig,
      };
      terminals.value.push(newTerminal);
    }

    return {
      terminals,
      createNewTerminal,
    };
  },
};
</script>

<style scoped>

</style>