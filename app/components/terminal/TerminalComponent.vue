<template>
  <!--
    Téléporté sur <body> : le terminal est monté dans le <header>, qui porte un
    `backdrop-filter: blur(10px)`. Un ancêtre filtré devient "backdrop root" et
    neutralise le `backdrop-filter` du corps (le blur DS ne s'applique alors qu'au
    contenu du header, pas à la page). Hors du header, le flou aubergine rend bien.
    Déplacement de rendu uniquement — drag/resize/focus/historique inchangés.
  -->
  <Teleport to="body">
    <div ref="terminalElement" :data-id="id" class="terminal" @click="focusUserInput">
      <div class="terminal-header" @mousedown="handleHeaderMouseDown" @mouseup="handleMouseUp">
        <div class="terminal-dots">
          <div
            class="close-button"
            role="button"
            tabindex="0"
            aria-label="Fermer le terminal"
            @click="closeTerminal"
            @keydown.enter="closeTerminal"
            @keydown.space.prevent="closeTerminal"
          ></div>
          <span class="terminal-dot terminal-dot--min" aria-hidden="true"></span>
          <span class="terminal-dot terminal-dot--max" aria-hidden="true"></span>
        </div>
        <div class="header-text">{{ defaultConfig.domainName }}</div>
      </div>

      <div class="terminal-body">
        <div v-for="(line, index) in commandLines" :key="index">
          <template v-if="line.isResponse">
            <!-- eslint-disable-next-line vue/no-v-html -- sortie générée en interne par les programmes du terminal (contenu maîtrisé) -->
            <span class="terminal-response" v-html="line.text"></span>
          </template>
          <template v-else>
            <span class="git-prompt"
              >{{ defaultConfig.userName }}@{{ defaultConfig.domainName }}<span class="git-prompt-separator">:</span>
              <span class="git-prompt-directory">~</span>
              <span class="git-prompt-separator">$</span></span
            >&nbsp;{{ line.text }}
          </template>
        </div>
        <span class="git-prompt"
          >{{ defaultConfig.userName }}@{{ defaultConfig.domainName }}<span class="git-prompt-separator">:</span>
          <span class="git-prompt-directory">~</span>
          <span class="git-prompt-separator">$</span></span
        >&nbsp;<input
          ref="userInputRef"
          v-model="userInput"
          type="text"
          class="user-input"
          aria-label="Saisie de commande du terminal"
          @keydown.enter="submitInput"
          @keydown.arrow-up="handleHistoryNavigation"
          @keydown.arrow-down="handleHistoryNavigation"
        />
      </div>

      <div class="resize-handle" @mousedown="handleResizeMouseDown"></div>
    </div>
  </Teleport>
</template>

<script lang="ts">
import { defineComponent, onMounted, onUnmounted, ref, watch } from "vue";
import type { ITerminalConfig } from "~/components/terminal/interfaces";
import programManager from "~/components/terminal/programs/ProgramManager";
import { escapeHtml } from "~/utils/functions";
// Import statique : les valeurs par défaut sont disponibles dès l'exécution de setup(),
// sans course asynchrone qui laissait parfois la config vide à l'initialisation.
import { terminalDefaults } from "~/terminal.config";

export default defineComponent({
  name: "TerminalComponent",
  props: {
    id: {
      type: Number,
      required: false,
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
    const userInput = ref<string>("");
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
    };

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
        userInput.value = "";
      }
    };

    const runCommand = (command: string): string | HTMLElement => {
      const program = programManager.get(command);
      if (program) {
        return program.run(
          { userName: defaultConfig.value.userName },
          props.createNewTerminal as (config?: ITerminalConfig) => void,
          program.initialData,
        );
      }
      // La commande provient de la saisie utilisateur : on l'échappe car la réponse est rendue via v-html.
      return `Commande inconnue : ${escapeHtml(command)}`;
    };

    const handleHistoryNavigation = (event: KeyboardEvent): void => {
      if (event.key === "ArrowUp") {
        if (commandHistoryPosition.value < commandHistory.value.length - 1) {
          commandHistoryPosition.value++;
        }
      } else if (event.key === "ArrowDown") {
        if (commandHistoryPosition.value > -1) {
          commandHistoryPosition.value--;
        }
      }

      if (commandHistoryPosition.value > -1 && commandHistoryPosition.value < commandHistory.value.length) {
        userInput.value = commandHistory.value[commandHistory.value.length - 1 - commandHistoryPosition.value] ?? "";
      } else {
        userInput.value = "";
      }
    };

    const handleResizeMouseDown = (event: MouseEvent): void => {
      if (event.target instanceof HTMLElement && event.target.classList.contains("resize-handle")) {
        resizing.value = true;

        // Écouteurs globaux : le redimensionnement continue même si le curseur sort
        // de la poignée de 16px pendant le glissement.
        window.addEventListener("mousemove", handleGlobalResizeMouseMove);
        window.addEventListener("mouseup", handleGlobalResizeMouseUp);
      }
    };

    const handleGlobalResizeMouseMove = (event: MouseEvent): void => {
      if (resizing.value && terminalElement.value) {
        const terminalRect = terminalElement.value.getBoundingClientRect();
        const minWidth = 320;
        const minHeight = 180;
        const newWidth = Math.max(minWidth, event.clientX - terminalRect.left);
        const newHeight = Math.max(minHeight, event.clientY - terminalRect.top);

        terminalElement.value.style.width = `${newWidth}px`;
        terminalElement.value.style.height = `${newHeight}px`;
      }
    };

    const handleGlobalResizeMouseUp = (): void => {
      resizing.value = false;
      window.removeEventListener("mousemove", handleGlobalResizeMouseMove);
      window.removeEventListener("mouseup", handleGlobalResizeMouseUp);
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
        event.target.classList.contains("terminal-header")
      ) {
        dragging.value = true;
        dragStartPosition.value = {
          x: event.clientX - event.currentTarget.parentElement.offsetLeft,
          y: event.clientY - event.currentTarget.parentElement.offsetTop,
        };

        // Ajouter les écouteurs d'événements globaux
        window.addEventListener("mousemove", handleGlobalMouseMove);
        window.addEventListener("mouseup", handleGlobalMouseUp);
      }
    };

    // Créer une nouvelle fonction pour gérer les événements globaux de déplacement de la souris
    const handleGlobalMouseMove = (event: MouseEvent): void => {
      if (dragging.value && terminalElement.value) {
        const terminalElementValue = terminalElement.value;
        // Borne haute clampée à 0 : si le terminal est plus large/haut que le viewport,
        // on le garde collé au bord (0) plutôt que de le pousser hors écran (valeur négative).
        const maxLeft = Math.max(0, window.innerWidth - terminalElementValue.offsetWidth);
        const maxTop = Math.max(0, window.innerHeight - terminalElementValue.offsetHeight);
        const newLeft = Math.min(Math.max(0, event.clientX - dragStartPosition.value.x), maxLeft);
        const newTop = Math.min(Math.max(0, event.clientY - dragStartPosition.value.y), maxTop);

        terminalElementValue.style.left = `${newLeft}px`;
        terminalElementValue.style.top = `${newTop}px`;
      }
    };

    // Créer une nouvelle fonction pour gérer les événements globaux de relâchement de la souris
    const handleGlobalMouseUp = (_: MouseEvent): void => {
      if (dragging.value) {
        dragging.value = false;

        // Supprimer les écouteurs d'événements globaux
        window.removeEventListener("mousemove", handleGlobalMouseMove);
        window.removeEventListener("mouseup", handleGlobalMouseUp);
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
    };

    onMounted(() => {
      updateTerminalDimensions();
      focusUserInput();
    });

    watch(
      () => [defaultConfig.value.width, defaultConfig.value.height],
      () => {
        updateTerminalDimensions();
      },
    );

    onUnmounted(() => {
      // Filet de sécurité : retrait des écouteurs globaux si le composant est démonté en plein drag/resize.
      window.removeEventListener("mousemove", handleGlobalMouseMove);
      window.removeEventListener("mouseup", handleGlobalMouseUp);
      window.removeEventListener("mousemove", handleGlobalResizeMouseMove);
      window.removeEventListener("mouseup", handleGlobalResizeMouseUp);
    });

    return {
      defaultConfig,
      commandLines,
      userInput,
      terminalElement,
      userInputRef,
      submitInput,
      handleHistoryNavigation,
      handleResizeMouseDown,
      handleMouseUp,
      handleHeaderMouseDown,
      closeTerminal,
      focusUserInput,
    };
  },
});
</script>

<style lang="scss">
/* stylelint-disable selector-class-pattern -- convention DS BEM (block__element / block--modifier) portée de TerminalWindow.jsx */
.terminal {
  // Châssis fenêtre — porté de TerminalWindow.jsx (.ds-term). STYLE uniquement : la
  // logique (drag/resize/close/focus/historique/commandes) et les classes porteuses de
  // handlers (terminal-header, close-button, user-input, resize-handle) sont préservées.
  // `position: fixed` (et non absolute) : le terminal est <Teleport>é sur <body> (pour que
  // son backdrop-filter rende hors du <header> filtré) ; fixed le garde relatif au VIEWPORT,
  // cohérent avec le clamp du drag (window.innerWidth/innerHeight) et évite une fenêtre
  // hors-écran ou un saut de scroll au focus quand la page est défilée.
  // Dimensions/pastilles (px) = structurelles (DS), portées telles quelles.
  box-sizing: border-box;
  position: fixed;
  top: 60px;
  left: 15px;
  z-index: 1000;
  width: 600px;
  height: 400px;
  overflow: hidden;
  resize: both;
  font-family: var(--font-mono);
  color: var(--ink-1);
  border: 1px solid var(--border-terminal);
  border-radius: var(--radius-sm);
  box-shadow: var(--glow-terminal);

  &-header {
    position: relative;
    z-index: 1;
    display: flex;
    flex-wrap: nowrap;
    align-items: center;
    gap: var(--space-2);
    height: 30px;
    padding: 0 var(--space-3);
    background: var(--aubergine-black);
    cursor: move;

    // Groupe de pastilles à gauche (façon fenêtre Ubuntu) — porté de .ds-term__btns.
    .terminal-dots {
      display: flex;
      align-items: center;
      gap: 7px; // espacement décoratif des pastilles (DS, pas de token)
    }

    // Pastille de fermeture (.ds-term__dot--close). Conserve @click="closeTerminal".
    // Rouge sombre (hsl(0 100% 27%)) + ombre : sans token dédié, valeurs portées du DS.
    .close-button {
      width: 13px;
      height: 13px;
      cursor: pointer;
      background-image: linear-gradient(to bottom right, var(--term-red), hsl(0deg 100% 27%));
      border-radius: var(--radius-circle);
      box-shadow: 1px 1px 2px hsl(320deg 60% 2%);

      &:hover {
        filter: brightness(1.2);
      }

      // Focus clavier visible (close désormais focusable — a11y CAP-11).
      &:focus-visible {
        outline: 2px solid var(--accent);
        outline-offset: 2px;
      }
    }

    // Pastilles min/max purement décoratives (aucun handler).
    .terminal-dot {
      width: 13px;
      height: 13px;
      border-radius: var(--radius-circle);
      opacity: 0.85;
    }

    .terminal-dot--min {
      background: var(--term-yellow);
    }

    .terminal-dot--max {
      background: var(--term-green);
    }

    // Titre centré, transparent aux clics → toute la barre reste draggable.
    .header-text {
      position: absolute;
      inset: 0;
      font-family: var(--font-mono);
      font-size: var(--fs-xs);
      letter-spacing: var(--ls-wide);
      line-height: 30px; // centre verticalement dans la barre de 30px
      color: var(--text-muted);
      text-align: center;
      pointer-events: none;
    }
  }

  &-body {
    height: calc(100% - 30px);
    margin: 0;
    padding: var(--space-4);
    overflow: auto;
    font-size: var(--fs-sm);
    line-height: var(--lh-snug);
    white-space: pre-wrap;
    overflow-wrap: break-word;
    background: var(--bg-terminal);

    .git-prompt,
    .git-prompt-separator,
    .git-prompt-directory {
      display: inline;
    }

    // `user@host` (vert) et le répertoire `~` (bleu) en gras comme Prompt.jsx ;
    // les séparateurs `:` et `$` restent en graisse normale (.ds-prompt__sep).
    .git-prompt,
    .git-prompt-directory {
      font-weight: var(--fw-bold);
    }

    .git-prompt {
      color: var(--prompt);
    }

    // `:` et `$` : graisse normale explicite (sinon ils héritent du gras du parent
    // `.git-prompt`) — fidèle à `.ds-prompt__sep` du DS.
    .git-prompt-separator {
      color: var(--ink-1);
      font-weight: var(--fw-regular);
    }

    .git-prompt-directory {
      color: var(--term-blue);
    }

    .user-input {
      margin: 0;
      padding: 0;
      font-family: inherit;
      font-size: inherit;
      color: inherit;
      background-color: transparent;
      border: none;
      outline: none;

      // Caret natif coloré : le navigateur dessine et fait clignoter le caret de l'<input>
      // éditable (il suit la frappe). AUCUNE animation CSS en boucle n'est ajoutée →
      // contrainte « caret = seule boucle » (CAP-11) respectée par construction. `caret-shape:
      // block` est une amélioration progressive (Chromium récent) ; repli gracieux en caret
      // barre ailleurs (Firefox/Safari). (Le caret texte natif n'est pas piloté par
      // prefers-reduced-motion ; aucune boucle CSS n'étant introduite, il n'y a rien à neutraliser.)
      caret-color: var(--prompt);
      caret-shape: block;
    }

    // Sorties de commandes injectées via v-html : HTML pretty-printé (\n + indentation) qui,
    // sous le `white-space: pre-wrap` du corps, afficherait lignes vides et décalages. On
    // rétablit `normal` pour ces conteneurs (le DS garde `pre-wrap` pour l'ASCII ; la bannière
    // initiale, en `<br>` + espaces insécables, rend correctement en `normal`).
    .terminal-response {
      white-space: normal;
    }

    // Scrollbar fine aubergine — porté de .ds-term__body (chrome de fenêtre DS).
    // Largeur 10px structurelle (comme la barre 30px / pastilles 13px) ; teinte sur
    // --aubergine (≈ hsl(319 30% 30%) de la réf), pouce arrondi --radius-pill.
    /* stylelint-disable-next-line selector-pseudo-element-no-unknown -- pseudo-élément vendeur WebKit (scrollbar), non câblé par autoprefixer */
    &::-webkit-scrollbar {
      width: 10px;
    }

    /* stylelint-disable-next-line selector-pseudo-element-no-unknown -- pseudo-élément vendeur WebKit (scrollbar), non câblé par autoprefixer */
    &::-webkit-scrollbar-thumb {
      background: var(--aubergine);
      border-radius: var(--radius-pill);
    }
  }

  // Corps translucide + flou aubergine derrière (porté de .ds-term__body, derrière @supports).
  @supports (backdrop-filter: blur(5px)) or (-webkit-backdrop-filter: blur(5px)) {
    .terminal-body {
      background: color-mix(in srgb, var(--bg-terminal) 86%, transparent);
      /* stylelint-disable-next-line property-no-vendor-prefix -- Safari : autoprefixer non câblé, préfixe manuel requis */
      -webkit-backdrop-filter: blur(5px);
      backdrop-filter: blur(5px);
    }
  }

  .resize-handle {
    position: absolute;
    right: 0;
    bottom: 0;
    width: 16px;
    height: 16px;
    background-color: transparent;
    cursor: nwse-resize;
  }
}

table,
.table {
  --color-light: hsl(0deg 0% 92% / 100%);
  --color-dark: hsl(0deg 0% 8% / 100%);
  --color-grey-light: hsl(0deg 0% 68%);
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

      // --color-dark est redéfini localement ci-dessus (le bloc `.terminal` qui exposait
      // --color-text-dark a été retiré au profit des tokens DS) : table auto-suffisante.
      color: var(--color-dark);
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
