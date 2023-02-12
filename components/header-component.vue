<template>

  <header>
    <button ref="toggle-menu" class="btn btn-small btn-dark" role="button">&lt;sj &#47;&gt;</button>
    <nav id="menu" hidden>
      <div id="close-menu"></div>
      <ul>
        <li ref="menu-terminal">terminal</li>
        <li ref="menu-about">À propos</li>
      </ul>
    </nav>
  </header>

</template>

<script lang="ts">

// import Vue from "vue";
// import { About, Clear, Help } from "~/utils/terminal/src/application";
// import { Terminal } from "~/utils/terminal/src/terminal";
//
// export default Vue.extend({
//   name: 'HeaderComponent',
//
//   mounted() {
//     const refs = this.$refs;
//
//     const menuId = 'menu';
//     const terminal = new Terminal({
//       scheme: [
//         '\xa0\xa0\xa0\xa0/$$\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0/$$',
//         '\xa0\xa0\xa0/$$/\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0|\xa0\xa0$$',
//         '\xa0\xa0/$$/\xa0\xa0\xa0/$$$$$$$\xa0/$$\xa0\\\xa0\xa0$$',
//         '\xa0/$$/\xa0\xa0\xa0/$$_____/|__/\xa0\xa0\\\xa0\xa0$$',
//         '|\xa0\xa0$$\xa0\xa0|\xa0\xa0$$$$$$\xa0\xa0/$$\xa0\xa0\xa0/$$/',
//         '\xa0\\\xa0\xa0$$\xa0\xa0\\____\xa0\xa0$$|\xa0$$\xa0\xa0/$$/',
//         '\xa0\xa0\\\xa0\xa0$$\xa0/$$$$$$$/|\xa0$$\xa0/$$/',
//         '\xa0\xa0\xa0\\__/|_______/\xa0|\xa0$$|__/',
//         '\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0/$$\xa0\xa0|\xa0$$',
//         '\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0|\xa0\xa0$$$$$$/',
//         '\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\\______/'
//       ]
//     });
//     const about = new About();
//
//     terminal.addApplication(new Help(terminal))
//       .addApplication(new Clear(terminal))
//       .addApplication(about);
//
//     document.body.append(terminal.render());
//     document.body.append(about.render());
//
//     if (refs['toggle-menu'] && refs['toggle-menu'] instanceof HTMLElement) {
//       refs['toggle-menu'].addEventListener('click', (event: Event) => {
//         event.preventDefault();
//
//         toggle(menuId);
//       });
//     }
//     if (refs['menu-terminal'] && refs['menu-terminal'] instanceof HTMLElement) {
//       refs['menu-terminal'].addEventListener('click', () => {
//         terminal.open();
//
//         toggle(menuId);
//       });
//     }
//     if (refs['menu-about'] && refs['menu-about'] instanceof HTMLElement) {
//       refs['menu-about'].addEventListener('click', async () => {
//         about.openAbout();
//
//         toggle(menuId);
//       });
//     }
//
//     const closeMenuElement = document.getElementById('close-menu');
//     closeMenuElement?.addEventListener('click',function () {
//       const menu = document.getElementById('menu');
//
//       if (menu) {
//         menu.hidden = true;
//       }
//     });
//   }
// });
//
// function toggle(id: string) {
//   const menu = document.getElementById(id);
//
//   if (menu) {
//     menu.hidden = !menu.hidden;
//   }
// }

</script>

<style lang="scss" scoped>
  //@import '../utils/terminal/src/asset/css/ubuntu_theme.css';

  header {
    // color system
    // =============================================================================
    --header-color-background: var(--color-dark-background);
    --header-color-background-hover: var(--color-dark-background-hover);
    // --header-color-border: ;
    // --header-color-border-hover: var(--color-shapes);
    // Shapes : icons/elements
    // --header-color-shapes: ;
    // --header-color-shapes-hover: var(--color-text);
    // --header-color-shapes-active: var(--color-text-hover);
    --header-color-text: var(--color-dark-text);
    // --header-color-text-hover: ;
    // --header-color-text-active: ;

    --header-height: 2.5rem;
    --margin-left-button: 0.25rem;

    display: flex;
    align-items: center;
    width: 100%;
    height: var(--header-height);
    color: var(--header-color-text);
    background-color: var(--header-color-background);

    button {
      margin-left: var(--margin-left-button);
    }

    nav {
      position: absolute;
      z-index: 1;
      top: var(--header-height);

      #close-menu {
        position: absolute;
        z-index: 0;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        width: 0;
        height: 0;
        background-color: transparent;
      }

      &:not([hidden]) {
        animation: menu-animation 300ms ease-in-out forwards;

        #close-menu {
          animation: close-menu 500ms ease-in-out forwards;
        }

        ul {
          z-index: 1;
          overflow: hidden;
          margin: 0;
          padding: 0;
          border-radius: 0 0 0.5em 0.5em;

          li {
            padding: 0.5rem 1rem;
            list-style-type: none;
            cursor: pointer;
            animation: menu-item-opacity 300ms ease-in-out forwards;
            background-color: var(--header-color-background);

            &:hover {
              background-color: var(--header-color-background-hover);
            }
          }
        }
      }
    }
  }
</style>
