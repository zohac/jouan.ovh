<template>

  <header>
    <button class="btn btn-large btn-dark" role="button" aria-label="Ouvrir le menu" @click="toggle">
      <nuxt-img src="/images/logo_white_32x32.png" preload loading="edger" alt="logo" height="32" width="32"/>
    </button>
    <nav id="menu" :class="{'hidden': isHidden}">
      <div id="close-menu" @click="closeMenu"></div>
      <ul>
        <li>
          <NuxtLink to="/" @click="closeMenu">Accueil</NuxtLink>
        </li>
        <li>
          <NuxtLink to="/blog" @click="closeMenu">Blog</NuxtLink>
        </li>
        <li>
          <NuxtLink to="/about" @click="closeMenu">À propos</NuxtLink>
        </li>
        <li>
          <TerminalButton @click="closeMenu" @open-terminal="addNewTerminal" />
        </li>
      </ul>
    </nav>
    <TerminalManagerComponent ref="terminalManager" />
  </header>

</template>

<script lang="ts" setup>

import TerminalManagerComponent from "~/components/terminal/TerminalManagerComponent.vue";

defineComponent({
  name: 'HeaderComponent',
});

const TerminalManager = defineComponent(TerminalManagerComponent);
const terminalManager = ref<InstanceType<typeof TerminalManager> | null>(null);

const addNewTerminal = () => {
  if (terminalManager.value) {
    terminalManager.value.createNewTerminal();
  }
};

const isHidden = ref(true);

const toggle = () => {
  isHidden.value = !isHidden.value;
}

const closeMenu = () => {
  isHidden.value = true
}

</script>

<style lang="scss" scoped>
  @use "assets/scss/abstract/color" as _color;
  @use "assets/scss/abstract/variables";
  @use "assets/scss/components/button";
  @use "assets/scss/abstract/space";
  @use "assets/scss/abstract/radius";
  @use "assets/scss/abstract/function";
  @use "assets/scss/components/list";

  //Value     Token
  // =============================================================================
  //4px       space-stack-4x
  //16px      space-stack-16x

  //Value     Token
  // =============================================================================
  //8px       space-inline-8x

  //Value     Token
  // =============================================================================
  //16px      space-inset-16x

  .hidden {
    display: none;
  }

  header {
    --header-height: #{variables.$header-height};
    --header-space-inline: #{space.$space-inline-8x};
    --header-space-inset: #{space.$space-inset-16x};
    --header-radius: #{radius.$radius-rounded-4px};
    --header-list-item-inset-x: #{list.$list-space-inset-8x-x};
    --header-list-item-inset-y: #{list.$list-space-inset-8x-y};
    --header-list-item-font-size: #{variables.$font-size-base};
    --header-list-item-font-weight: #{variables.$font-weight-regular};
    --header-list-item-line-height: #{function.line-height(var(--header-list-item-font-size))};

    // color system
    // =============================================================================
    --header-color-background: #{_color.$dark-background};
    --header-color-background-hover: #{_color.$dark-background-hover};
    //--header-color-border: ;
    //--header-color-border-hover: ;
    --header-color-text: #{_color.$dark-text};
    //--header-color-text-hover: var(--color-dark-text-hover);
    //--header-color-text-active: ;
    //--header-color-shapes: var(--header-color-border-hover);
    //--header-color-shapes-hover: var(--color-text);
    //--header-color-shapes-active: var(--color-text-hover);

    display: flex;
    align-items: center;
    width: 100%;
    height: var(--header-height);
    color: var(--header-color-text);
    background-color: var(--header-color-background);
    max-width: 100vw;

    button {
      &.btn {
        --header-btn-space-inline: var(--header-space-inline);

        margin-left: var(--header-btn-space-inline);
      }

      img {
        width: 32px;
        height: auto;
      }
    }

    nav {
      --header-nav-space-inline: var(--header-space-inline);

      position: absolute;
      z-index: 9999999999;
      top: var(--header-height);
      left: var(--header-nav-space-inline);

      #close-menu {
        position: absolute;
        z-index: 0;
        top: calc(-1 * var(--header-height));
        right: 0;
        bottom: 0;
        left: calc(-1 * var(--header-space-inset));
        background-color: transparent;
        min-height: 100vh;
        width: 100vw;
      }

      ul {
        z-index: 9999999999;
        position: relative;
        overflow: hidden;
        margin: 0;
        padding: 0;
        border-radius: 0 0 var(--header-radius) var(--header-radius);

        li {
          font-size: var(--header-list-item-font-size);
          font-weight: var(--header-list-item-font-weight);
          line-height: var(--header-list-item-line-height);

          list-style-type: none;
          cursor: pointer;
          animation: menu-item-opacity 300ms ease-in-out forwards;
          background-color: var(--header-color-background);

          &:hover {
            background-color: var(--header-color-background-hover);
          }

          a, div {
            color: var(--header-color-text);
            text-decoration: none;
            padding: var(--header-list-item-inset-x) var(--header-list-item-inset-y);
            display: inline-block;
          }
        }
      }

      &:not(.hidden) {
        animation: menu-animation 800ms ease-in-out forwards;

        #close-menu {
          animation: close-menu 500ms ease-in-out forwards;
        }
      }
    }
  }
</style>
