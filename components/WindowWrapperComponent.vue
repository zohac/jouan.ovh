<template>
  <div class="window-wrapper">
    <div ref="windowElement" class="window">
      <div
        class="window-header visible"
        @mousedown="handleHeaderMouseDown"
        @mouseup="handleMouseUp"
      >
        <div class="close-button" @click="closeWindow"></div>
      </div>

      <div
        class="window-body"
        :style="{
          backgroundColor: backgroundColor,
          color: textColor,
          height: height,
          width: width,
          overflow: overflow,
        }"
        @mouseenter="handleWindowBodyMouseEnter"
        @mouseleave="handleWindowBodyMouseLeave"
      >
        <div ref="slotWrapper" v-show="isTypingStarted">
          <div ref="typewriting" class="typewriting">
            <slot />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, nextTick, onMounted, ref, watch } from "vue";

export default defineComponent({
  name: "WindowWrapperComponent",
  props: {
    backgroundColor: {
      type: String,
      default: "var(--color-aubergine-dark)",
    },
    textColor: {
      type: String,
      default: "var(--wwc-color-text)",
    },
    height: {
      type: String,
      default: "400px",
    },
    width: {
      type: String,
      default: "600px",
    },
    overflow: {
      type: String,
      default: "auto",
    },
  },

  setup() {
    const isHoveringWindowBody = ref<boolean>(false);
    const commandLines = ref<{ text: string; isResponse: boolean }[]>([]);
    const dragging = ref<boolean>(false);
    const dragStartPosition = ref<{ x: number; y: number }>({ x: 0, y: 0 });
    const windowElement = ref<HTMLElement | null>(null);
    const slotWrapper = ref<HTMLElement | null>(null);
    const typewriting = ref<HTMLElement | null>(null);
    const isTypingStarted = ref<boolean>(false);

    const animateTypewriting = async (element: HTMLElement, delay = 50) => {
      isTypingStarted.value = true;

      const childElements = Array.from(element.children);

      // Cacher tous les éléments enfants sans la classe 'no-typewriting'
      for (const childElement of childElements) {
        if (
          childElement.nodeType === Node.ELEMENT_NODE &&
          !childElement.classList.contains("no-typewriting")
        ) {
          const htmlChildElement = childElement as HTMLElement;
          htmlChildElement.style.visibility = "hidden";
        }
      }

      // Effectuer le typewriting sur les éléments enfants sans la classe 'no-typewriting' les uns après les autres
      for (const childElement of childElements) {
        if (
          childElement.nodeType === Node.ELEMENT_NODE &&
          !childElement.classList.contains("no-typewriting")
        ) {
          const htmlChildElement = childElement as HTMLElement;
          const originalChildText = htmlChildElement.textContent || "";
          htmlChildElement.textContent = "";
          htmlChildElement.style.visibility = "visible";

          const cursorElement = document.createElement("span");
          cursorElement.className = "cursor-blink";
          cursorElement.textContent = "|";
          htmlChildElement.appendChild(cursorElement);

          for (const char of originalChildText) {
            cursorElement.insertAdjacentText("beforebegin", char);
            await new Promise((resolve) => setTimeout(resolve, delay));
          }

          cursorElement.remove();
        }
      }
    };

    const handleMouseUp = (): void => {
      dragging.value = false;
    };

    const handleHeaderMouseDown = (event: MouseEvent): void => {
      if (
        event.target instanceof HTMLElement &&
        event.currentTarget instanceof HTMLElement &&
        event.currentTarget.parentElement &&
        event.target.classList.contains("window-header")
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
      if (dragging.value && windowElement.value) {
        const windowElementValue = windowElement.value;
        const newLeft = Math.min(
          Math.max(0, event.clientX - dragStartPosition.value.x),
          window.innerWidth - windowElementValue.offsetWidth
        );
        const newTop = Math.min(
          Math.max(0, event.clientY - dragStartPosition.value.y),
          window.innerHeight - windowElementValue.offsetHeight
        );

        windowElementValue.style.left = `${newLeft}px`;
        windowElementValue.style.top = `${newTop}px`;
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

    const closeWindow = () => {
      if (windowElement.value) {
        windowElement.value.style.display = "none";
      }
    };

    const handleWindowBodyMouseEnter = () => {
      isHoveringWindowBody.value = true;
    };

    const handleWindowBodyMouseLeave = () => {
      isHoveringWindowBody.value = false;
    };

    const fadeOut = (headerElement: HTMLElement) => {
      setTimeout(() => {
        if (!isHoveringWindowBody.value) {
          headerElement.classList.remove("visible");
        }
      }, 3000);
    };

    watch(isHoveringWindowBody, (newValue) => {
      if (windowElement.value) {
        const headerElement = windowElement.value.querySelector(
          ".window-header"
        ) as HTMLElement;
        if (headerElement) {
          if (newValue && !headerElement.classList.contains("visible")) {
            headerElement.classList.add("visible");
          } else if (!newValue) {
            fadeOut(headerElement);
          }
        }
      }
    });

    onMounted(async () => {
      await nextTick();
      if (windowElement.value) {
        const headerElement = windowElement.value.querySelector(
          ".window-header"
        ) as HTMLElement;
        if (headerElement) {
          fadeOut(headerElement);
        }
      }
      if (slotWrapper.value) {
        await animateTypewriting(
          slotWrapper.value.querySelector(".typewriting") as HTMLElement
        );
      }
    });

    return {
      commandLines,
      windowElement,
      handleMouseUp,
      handleHeaderMouseDown,
      closeWindow,
      handleWindowBodyMouseEnter,
      handleWindowBodyMouseLeave,
      slotWrapper,
      isTypingStarted,
      typewriting,
    };
  },
});
</script>

<style lang="scss" scoped>
@use "assets/scss/abstract/color" as _color;
@use "assets/scss/abstract/variables" as _variables;
@use "assets/scss/abstract/space" as _space;
@use "assets/scss/abstract/function" as _function;
@use "assets/scss/abstract/box_shadow" as _boxShadow;

.window-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.window {
  // color system
  // =============================================================================
  --wwc-color-background: #{_color.$background};
  //--wwc-color-background-hover: #{_color.$background-hover};
  //--wwc-color-border: ;
  //--wwc-color-border-hover: ;
  --wwc-color-text: #{_color.$text};
  //--wwc-color-text-hover: var(--color-dark-text-hover);
  //--wwc-color-text-active: ;
  //--wwc-color-shapes: var(--wwc-color-border-hover);
  //--wwc-color-shapes-hover: var(--color-text);
  //--wwc-color-shapes-active: var(--color-text-hover);

  --wwc-color-dark: hsla(0, 0%, 8%, 1);
  --wwc-color-grey: hsl(0, 0%, 27%);
  --wwc-color-grey-light: hsl(0, 0%, 68%);
  --wwc-color-grey-dark: hsl(0, 0%, 20%);
  --wwc-color-aubergine: hsla(319, 33%, 30%, 1);
  --wwc-color-aubergine-light: hsla(319, 26%, 70%, 1);
  --wwc-color-aubergine-dark: hsla(319, 100%, 9%, 1);
  --wwc-color-red: hsla(0, 100%, 43%, 1);
  --wwc-color-red-light: hsla(0, 72%, 72%, 1);
  --wwc-color-red-dark: hsla(0, 100%, 27%, 1);

  --wh-height: 24px;

  @supports (-webkit-backdrop-filter: none) or (backdrop-filter: none) {
    backdrop-filter: blur(5px);
    -webkit-backdrop-filter: blur(5px);
  }

  color: var(--wwc-color-text);
  font-size: 1rem;
  border-radius: 5px;
  position: absolute;
  overflow: hidden;
  z-index: 100;
  box-shadow: #{_boxShadow.$box-shadow-2};

  &-header {
    z-index: 1;

    height: var(--wh-height);
    padding: 0.25rem;

    border-top-left-radius: 0.25rem;
    border-top-right-radius: 0.25rem;

    text-align: center;

    background-color: var(--wwc-color-grey-dark);

    position: absolute;
    width: 100%;
    cursor: move;

    opacity: 0;
    transition: opacity 0.5s ease-in-out;

    &.visible {
      opacity: 1;
    }

    .close-button {
      position: fixed;
      top: 0;
      left: 0;
      cursor: pointer;
      border-radius: 9999px;

      width: 1rem;
      height: 1rem;
      margin: 0.25rem;

      background-image: linear-gradient(
        to bottom right,
        var(--wwc-color-red),
        var(--wwc-color-red-dark)
      );

      box-shadow: #{_boxShadow.$box-shadow-2}, #{_boxShadow.$box-shadow-1};

      &:hover {
        filter: brightness(1.2);
      }
    }
  }

  &-body {
    margin: 0;
    padding: 0;
    height: calc(100% - 24px);
    overflow: auto;
    background-color: var(--wwc-color-aubergine-dark);
    opacity: 0.85;
  }
}

.cursor-blink {
  display: inline-block;
  animation: blink 1s steps(1, start) infinite;
}

@keyframes blink {
  0%,
  50% {
    opacity: 1;
  }
  50.1%,
  100% {
    opacity: 0;
  }
}
</style>
