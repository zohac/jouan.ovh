<template>
  <button @click="createNewTerminal">
    Créer un nouveau terminal
  </button>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "NewTerminal",

  setup() {
    // Utiliser useContext pour accéder aux éléments injectés
    // const { $createNewTerminal } = useContext();

    return {
      createNewTerminal: () => {} ,
    };
  },
});
</script>

<style>
/* ajoutez les styles ici si nécessaire */
</style>
