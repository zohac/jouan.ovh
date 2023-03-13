<template>

  <header>
    <button class="btn btn-small btn-dark" role="button" @click="toggle">&lt;sj &#47;&gt;</button>
    <nav id="menu" :class="{'hidden': isHidden}">
      <div id="close-menu" @click="closeMenu"></div>
      <ul>
        <li @click="closeMenu">terminal</li>
        <li @click="closeMenu">À propos</li>
      </ul>
    </nav>
  </header>

</template>

<script lang="ts">

export default {
  name: 'HeaderComponent',
  data: () => ({
    isHidden: true,
  }),
  methods: {
    toggle() {
      this.isHidden = !this.isHidden;
    },
    closeMenu() {
      this.isHidden = true
    }
  }
}

</script>

<style lang="scss" scoped>
  @use "assets/scss/abstract/space";
  @use "assets/scss/abstract/radius";
  @use "assets/scss/abstract/function";
  @use "assets/scss/abstract/variables";
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
    //--header-space-stack: #{space.$space-stack-16x};
    //--header-space-inline: #{space.$space-inline-8x};
    --header-space-inset: #{space.$space-inset-16x};
    --header-radius: #{radius.$radius-rounded-4px};
    --header-list-item-inset-x: #{list.$list-space-inset-8x-x};
    --header-list-item-inset-y: #{list.$list-space-inset-8x-y};
    --header-list-item-font-size: #{variables.$font-size-base};
    --header-list-item-font-weight: #{variables.$font-weight-regular};
    --header-list-item-line-height: #{function.line-height(var(--header-list-item-font-size))};
    --header-list-item-height: #{function.height(var(--header-list-item-inset-x), var(--header-list-item-font-size))};

    // color system
    // =============================================================================
    --header-color-background: var(--color-dark-background);
    --header-color-background-hover: var(--color-dark-background-hover);
    //--header-color-border: ;
    //--header-color-border-hover: ;
    // Shapes : icons/elements
    //--header-color-shapes: var(--header-color-border-hover);
    //--header-color-shapes-hover: var(--color-text);
    //--header-color-shapes-active: var(--color-text-hover);
    --header-color-text: var(--color-dark-text);
    --header-color-text-hover: var(--color-dark-text-hover);
    //--header-color-text-active: ;

    display: flex;
    align-items: center;
    width: 100%;
    height: var(--header-height);
    padding: var(--header-space-inset);
    color: var(--header-color-text);
    background-color: var(--header-color-background);

    nav {
      position: absolute;
      z-index: 1;
      top: var(--header-height);

      #close-menu {
        position: absolute;
        z-index: 0;
        top: calc(-1 * var(--header-height));
        right: 0;
        bottom: 0;
        left: calc(-1 * var(--header-space-inset));
        width: 0;
        height: 0;
        background-color: transparent;
      }

      ul {
        z-index: 1;
        overflow: hidden;
        margin: 0;
        padding: 0;
        border-radius: 0 0 var(--header-radius) var(--header-radius);

        li {
          font-size: var(--header-list-item-font-size);
          font-weight: var(--header-list-item-font-weight);
          line-height: var(--header-list-item-line-height);

          padding: var(--header-list-item-inset-x) var(--header-list-item-inset-y);
          list-style-type: none;
          cursor: pointer;
          animation: menu-item-opacity 300ms ease-in-out forwards;
          background-color: var(--header-color-background);

          &:hover {
            background-color: var(--header-color-background-hover);
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
