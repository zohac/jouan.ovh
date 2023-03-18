<template>
  <div>
    <button @click="addNewTerminal">Terminal</button>
    <div v-for="(terminal, index) in terminals" :key="index">
      <TerminalComponent :id="index" :create-new-terminal="createNewTerminal" :initial-data="terminal.initialData"/>
    </div>
  </div>
</template>

<script lang="ts">
import { uniqueId } from "~/utils/functions";

export default {
  name: "TerminalManagerComponent",
  components: {},

  setup() {
    const terminals = ref<Array<{ id: string; initialData?: string; }>>([]);

    const addNewTerminal = () => {
      terminals.value.push({ id: uniqueId() });
    }

    const createNewTerminal = (initialData?: string) => {
      // Créez une nouvelle instance de terminal et ajoutez-la à la liste des terminaux.
      const newTerminal = {
        id: uniqueId(), // Générez un ID unique pour le nouveau terminal.
        initialData
      };
      terminals.value.push(newTerminal);
    }

    return {
      terminals,
      addNewTerminal,
      createNewTerminal,
    };
  },
};
</script>


<style scoped>

</style>