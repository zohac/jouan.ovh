<template>
  <div ref="terminalElement" :data-id="id" class="terminal" @click="focusUserInput">

    <div
      class="terminal-header"
      @mousedown="handleHeaderMouseDown"
      @mouseup="handleMouseUp">
      <div class="close-button" @click="closeTerminal"></div>
      <div class="header-text">{{ defaultConfig.domainName }}</div>
      <div></div>
    </div>

    <div class="terminal-body">
      <div v-for="(line, index) in commandLines" :key="index">
        <template v-if="line.isResponse">
          <span v-html="line.text"></span>
        </template>
        <template v-else>
          <span class="git-prompt">{{ defaultConfig.userName }}@{{ defaultConfig.domainName }}
            <span class="git-prompt-separator">:</span>
            <span class="git-prompt-directory">~</span>
            <span class="git-prompt-separator">$</span>
          </span>{{ line.text }}
        </template>
      </div>
      <span class="git-prompt">{{ defaultConfig.userName }}@{{ defaultConfig.domainName }}
        <span class="git-prompt-separator">:</span>
        <span class="git-prompt-directory">~</span>
        <span class="git-prompt-separator">$</span>
      </span>
      <input
        ref="userInputRef"
        v-model="userInput"
        type="text"
        class="user-input"
        @keydown.enter="submitInput"
        @keydown.arrow-up="handleHistoryNavigation"
        @keydown.arrow-down="handleHistoryNavigation" />
    </div>

    <div
      class="resize-handle"
      @mousedown="handleMouseDown"
      @mousemove="handleResizeMouseMove"
      @mouseup="handleMouseUp"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, watch } from "vue";
import { ITerminalConfig } from "~/components/terminal/interfaces";
import programManager from "~/components/terminal/programs/ProgramManager";

let terminalDefaults = {
  width: '800px',
  height: '400px',
  userName: 'anon.',
  domainName: 'example.com',
  initialData: '',
};

try {
  const importedConfig = await import("@/terminal.config");
  terminalDefaults = importedConfig.terminalDefaults;
} catch (error) {
  console.warn("Aucun fichier terminal.config.ts trouvé. Utilisation des valeurs par défaut.");
}
export default defineComponent({
  name: "TerminalComponent",
  props: {
    id: {
      type: Number,
      required: true,
      default: 0,
    },
    createNewTerminal: {
      type: Function,
      required: false,
      default: () => {},
    },
    terminalConfig: {
      type: Object,
      default: () => ({}),
    },
  },

  setup(props) {
    const commandLines = ref<{ text: string; isResponse: boolean }[]>([]);
    const userInput = ref<string>('');
    const resizing = ref<boolean>(false);
    const dragging = ref<boolean>(false);
    const dragStartPosition = ref<{ x: number; y: number }>({ x: 0, y: 0 });
    const terminalElement = ref<HTMLElement | null>(null);
    const userInputRef = ref<HTMLInputElement | null>(null);
    const commandHistory = ref<string[]>([]);
    const commandHistoryPosition = ref<number>(-1);
    const defaultConfig = ref({
      width: props.terminalConfig.width || terminalDefaults.width,
      height: props.terminalConfig.height || terminalDefaults.height,
      userName: props.terminalConfig.userName || terminalDefaults.userName,
      domainName: props.terminalConfig.domainName || terminalDefaults.domainName,
      initialData: props.terminalConfig.initialData || terminalDefaults.initialData,
    });

    if (defaultConfig.value.initialData) {
      commandLines.value.push({
        text: defaultConfig.value.initialData,
        isResponse: true,
      });
    }

    const focusUserInput = () => {
      if (terminalElement.value) {
        // Garantir que la valeur de zIndex ne dépasse pas la limite du navigateur.
        terminalElement.value.style.zIndex = (Date.now() % 2147483647).toString();
      }

      // Mettre le focus sur l'élément input
      if (userInputRef.value) {
        userInputRef.value.focus();
      }
    }

    const submitInput = (): void => {
      const command = userInput.value.trim();
      if (command) {
        commandLines.value.push({
          text: userInput.value,
          isResponse: false,
        });

        const output = runCommand(command);
        if (output instanceof HTMLElement) {
          commandLines.value.push({ text: output.outerHTML, isResponse: true });
        } else {
          commandLines.value.push({ text: output, isResponse: true });
        }

        commandHistory.value.push(userInput.value);
        commandHistoryPosition.value = -1;
        userInput.value = '';
      }
    };

    const runCommand = (command: string): string | HTMLElement => {
      const program = programManager.get(command);
      if (program) {
        return program.run(
          { userName: defaultConfig.value.userName },
          props.createNewTerminal as (config?: ITerminalConfig) => {},
          program.initialData,
        );
      }
      return `Commande inconnue : ${command}`;
    };


    const handleHistoryNavigation = (event: KeyboardEvent): void => {
      if (event.key === 'ArrowUp') {
        if (commandHistoryPosition.value < commandHistory.value.length - 1) {
          commandHistoryPosition.value++;
        }
      } else if (event.key === 'ArrowDown') {
        if (commandHistoryPosition.value > -1) {
          commandHistoryPosition.value--;
        }
      }

      if (commandHistoryPosition.value > -1 && commandHistoryPosition.value < commandHistory.value.length) {
        userInput.value = commandHistory.value[commandHistory.value.length - 1 - commandHistoryPosition.value];
      } else {
        userInput.value = '';
      }
    };

    const handleMouseDown = (event: MouseEvent): void => {
      if (event.target instanceof HTMLElement && event.target.classList.contains('resize-handle')) {
        resizing.value = true;
      }
    };

    const handleResizeMouseMove = (event: MouseEvent): void => {
      if (resizing.value && terminalElement.value) {
        terminalElement.value.style.width = `${event.clientX - terminalElement.value.offsetLeft}px`;
        terminalElement.value.style.height = `${event.clientY - terminalElement.value.offsetTop}px`;
      }
    };

    const handleMouseUp = (): void => {
      resizing.value = false;
      dragging.value = false;
    };

    const handleHeaderMouseDown = (event: MouseEvent): void => {
      if (
        event.target instanceof HTMLElement &&
        event.currentTarget instanceof HTMLElement &&
        event.currentTarget.parentElement &&
        event.target.classList.contains('terminal-header')
      ) {
        dragging.value = true;
        dragStartPosition.value = {
          x: event.clientX - event.currentTarget.parentElement.offsetLeft,
          y: event.clientY - event.currentTarget.parentElement.offsetTop,
        };

        // Ajouter les écouteurs d'événements globaux
        window.addEventListener('mousemove', handleGlobalMouseMove);
        window.addEventListener('mouseup', handleGlobalMouseUp);
      }
    };

    // Créer une nouvelle fonction pour gérer les événements globaux de déplacement de la souris
    const handleGlobalMouseMove = (event: MouseEvent): void => {
      if (dragging.value && terminalElement.value) {
        const terminalElementValue = terminalElement.value;
        const newLeft = Math.min(
          Math.max(0, event.clientX - dragStartPosition.value.x),
          window.innerWidth - terminalElementValue.offsetWidth
        );
        const newTop = Math.min(
          Math.max(0, event.clientY - dragStartPosition.value.y),
          window.innerHeight - terminalElementValue.offsetHeight
        );

        terminalElementValue.style.left = `${newLeft}px`;
        terminalElementValue.style.top = `${newTop}px`;
      }
    };

    // Créer une nouvelle fonction pour gérer les événements globaux de relâchement de la souris
    const handleGlobalMouseUp = (_: MouseEvent): void => {
      if (dragging.value) {
        dragging.value = false;

        // Supprimer les écouteurs d'événements globaux
        window.removeEventListener('mousemove', handleGlobalMouseMove);
        window.removeEventListener('mouseup', handleGlobalMouseUp);
      }
    };

    const updateTerminalDimensions = (): void => {
      if (terminalElement.value) {
        terminalElement.value.style.width = defaultConfig.value.width;
        terminalElement.value.style.height = defaultConfig.value.height;
      }
    };

    const closeTerminal = () => {
      if (terminalElement.value) {
        terminalElement.value.style.display = "none";
      }
    }

    onMounted(() => {
      updateTerminalDimensions();
      focusUserInput();
    });

    watch(
      () => [defaultConfig.value.width, defaultConfig.value.height],
      () => {
        updateTerminalDimensions();
      }
    );

    return {
      defaultConfig,
      commandLines,
      userInput,
      terminalElement,
      userInputRef,
      submitInput,
      handleHistoryNavigation,
      handleMouseDown,
      handleResizeMouseMove,
      handleMouseUp,
      handleHeaderMouseDown,
      closeTerminal,
      focusUserInput,
    };
  },
});
</script>

<style lang="scss">
.terminal {
  --color-light: hsla(0, 0%, 92%, 1);                    /*with dark text*/
  --color-dark: hsla(0, 0%, 8%, 1);                       /*with light text*/

  --color-text-dark: var(--color-dark);
  --color-text-light: var(--color-light);

  --color-grey: hsl(0, 0%, 27%);               /*with light text*/
  --color-grey-light: hsl(0, 0%, 68%);         /*with dark text*/
  --color-grey-dark: hsl(0, 0%, 20%);

  --color-aubergine: hsla(319, 33%, 30%, 1);       /*with light text*/
  --color-aubergine-light: hsla(319, 26%, 70%, 1); /*with dark text*/
  --color-aubergine-dark: hsla(319, 100%, 9%, 1);  /*with light text*/

  --color-red: hsla(0, 100%, 43%, 1);           /*without text*/
  --color-red-light: hsla(0, 72%, 72%, 1);      /*with dark text*/
  --color-red-dark: hsla(0, 100%, 27%, 1);      /*with light text*/
  --color-yellow: hsla(48, 89%, 50%, 1);        /*with dark text*/
  --color-yellow-light: hsla(48, 89%, 79%, 1);  /*with dark text*/
  --color-yellow-dark: hsla(48, 100%, 15%, 1);  /*with light text*/
  --color-green: hsla(143, 60%, 50%, 1);        /*with dark text*/
  --color-green-light: hsla(143, 60%, 75%, 1);  /*with dark text*/
  --color-green-dark: hsla(143, 80%, 19%, 1);   /*with light text*/
  --color-blue: hsla(204, 70%, 53%, 1);         /*without text*/
  --color-blue-light: hsla(204, 69%, 80%, 1);   /*with dark text*/
  --color-blue-dark: hsla(204, 75%, 24%, 1);    /*with light text*/

  @supports (-webkit-backdrop-filter: none) or (backdrop-filter: none) {
    backdrop-filter: blur(5px);
    -webkit-backdrop-filter: blur(5px);
  }

  color: var(--color-light);
  font-family: 'Ubuntu Mono', monospace;
  font-size: 1rem;
  border-radius: 5px;
  width: 600px;
  height: 400px;
  box-sizing: border-box;
  position: absolute;
  resize: both;
  overflow: hidden;
  top: 60px;
  left: 15px;
  z-index: 1000;
  box-shadow: var(--box-shadow-2);

  &-header {
    //display: flex;
    //align-items: center;
    //background-color: var(--color-grey);
    //color: var(--color-light);
    //height: 24px;
    //border-top-left-radius: 5px;
    //border-top-right-radius: 5px;
    //padding: 0 10px;
    //font-size: 12px;

    display: flex;
    flex-wrap: nowrap;
    align-items: center;
    justify-content: space-between;
    z-index: 1;

    height: 24px;
    padding: 0.25rem;

    border-top-left-radius: 0.25rem;
    border-top-right-radius: 0.25rem;

    text-align: center;

    background-color: var(--color-grey-dark);

    cursor: move;

    .header-text {
      text-align: center;
    }

    .close-button {
      cursor: pointer;
      border-radius: 9999px;

      width: 1rem;
      height: 1rem;
      margin: 0.25rem;

      background-image: linear-gradient(to bottom right, var(--color-red), var(--color-red-dark));

      box-shadow: 2px 2px 3px var(--color-dark), -2px -2px 3px var(--color-grey);

      &:hover {
        filter: brightness(1.2);
      }
    }
  }

  &-body {
    margin: 0;
    padding: 10px;
    height: calc(100% - 24px);
    overflow: auto;
    background-color: var(--color-aubergine-dark);
    opacity: 0.85;

    .git-prompt,
    .git-prompt-separator,
    .git-prompt-directory,
    .git-prompt-branch {
      display: inline;
      font-weight: 700;
    }

    .git-prompt {
      color: var(--color-green);
    }

    .git-prompt-separator {
      color: var(--color-light);
    }

    .git-prompt-directory {
      color: var(--color-blue);
    }

    .git-prompt-branch {
      color: var(--color-red);
    }

    .user-input {
      background-color: transparent;
      border: none;
      outline: none;
      color: inherit;
      font-family: inherit;
      font-size: inherit;
      padding: 0;
      margin: 0;
      caret-color: var(--color-green);
      caret-shape: bar;
    }

    .command-prefix {
      display: inline;
      color: var(--color-green);
      font-weight: 700;
      padding-right: 0.5em;
    }
  }

  .resize-handle {
    position: absolute;
    bottom: 0;
    right: 0;
    width: 16px;
    height: 16px;
    background-color: transparent;
    cursor: nwse-resize;
  }
}

table,
.table {
  --color-light: hsla(0, 0%, 92%, 1);
  --color-dark: hsla(0, 0%, 8%, 1);
  --color-grey-light: hsl(0, 0%, 68%);
  --margin: 1em;

  border: 1px dashed var(--color-light);
  margin: var(--margin);

  thead {
    color: var(--color-dark);
    text-align: center;
    background-color: var(--color-light);
  }

  td {
    padding: 0 0.5em;
  }

  &.w-100 {
    width: calc(100% - 2 * var(--margin));
  }

  &.w-50 {
    width: calc(50% - 2 * var(--margin));
  }

  tbody {
    tr:nth-child(even) {
      background-color: var(--color-grey-light);
      color: var(--color-text-dark);
    }
  }

  &.w-100 {
    width: calc(100% - 2 * var(--margin));
  }

  &.w-50 {
    width: calc(50% - 2 * var(--margin));
  }
}

</style>
