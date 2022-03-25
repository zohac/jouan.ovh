<template>

  <header>
    <button ref="toggle-menu" role="button">&lt;sj &#47;&gt;</button>
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

import Vue from 'vue';
import { About, Clear, Help } from '~/utils/terminal/src/application';
import { Terminal } from '~/utils/terminal/src/terminal';

export default Vue.extend({
  name: 'HeaderComponent',

  mounted() {
    const refs = this.$refs;

    const menuId = 'menu';
    const terminal = new Terminal({
      scheme: [
        '\xa0\xa0\xa0\xa0/$$\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0/$$',
        '\xa0\xa0\xa0/$$/\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0|\xa0\xa0$$',
        '\xa0\xa0/$$/\xa0\xa0\xa0/$$$$$$$\xa0/$$\xa0\\\xa0\xa0$$',
        '\xa0/$$/\xa0\xa0\xa0/$$_____/|__/\xa0\xa0\\\xa0\xa0$$',
        '|\xa0\xa0$$\xa0\xa0|\xa0\xa0$$$$$$\xa0\xa0/$$\xa0\xa0\xa0/$$/',
        '\xa0\\\xa0\xa0$$\xa0\xa0\\____\xa0\xa0$$|\xa0$$\xa0\xa0/$$/',
        '\xa0\xa0\\\xa0\xa0$$\xa0/$$$$$$$/|\xa0$$\xa0/$$/',
        '\xa0\xa0\xa0\\__/|_______/\xa0|\xa0$$|__/',
        '\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0/$$\xa0\xa0|\xa0$$',
        '\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0|\xa0\xa0$$$$$$/',
        '\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\\______/'
      ]
    });
    const about = new About();

    terminal.addApplication(new Help(terminal))
      .addApplication(new Clear(terminal))
      .addApplication(about);

    document.body.append(terminal.render());
    document.body.append(about.render());

    if (refs['toggle-menu'] && refs['toggle-menu'] instanceof HTMLElement) {
      refs['toggle-menu'].addEventListener('click', (event: Event) => {
        event.preventDefault();

        toggle(menuId);
      });
    }
    if (refs['menu-terminal'] && refs['menu-terminal'] instanceof HTMLElement) {
      refs['menu-terminal'].addEventListener('click', () => {
        terminal.open();

        toggle(menuId);
      });
    }
    if (refs['menu-about'] && refs['menu-about'] instanceof HTMLElement) {
      refs['menu-about'].addEventListener('click', async () => {
        about.open();

        toggle(menuId);
      });
    }

    const closeMenuElement = document.getElementById('close-menu');
    closeMenuElement?.addEventListener('click',function (event: Event) {
      const menu = document.getElementById('menu');

      if (menu) {
        menu.hidden = true;
      }
    });
  }
});

function toggle(id: string) {
  const menu = document.getElementById(id);

  if (menu) {
    menu.hidden = !menu.hidden;
  }
}

</script>

<style lang="scss">
  @import '../utils/terminal/src/asset/css/ubuntu_theme.css';

  header {
    /*button color*/
    background-color: var(--color-dark);
    --color-button-background: var(--color-dark);
    --color-button-background-hover: var(--color-grey);
    --color-button-border: var(--color-grey);
    /*Shapes : icons/elements*/
    /*--color-shapes: ;*/
    /*--color-shapes-hover: ;*/
    /*--color-shapes-active: ;*/
    --color-button-border-hover: var(--color-grey-light);
    --color-button-text: var(--color-text-light);
    /*--color-text-active: ;*/

    --color-button-text-hover: var(--color-text-light);

    color: var(--color-text-light);

    display: flex;
    width: 100%;
  }

  nav {
    position: absolute;
    top: 2.5rem;

    &:not([hidden]) {
      animation: menu-animation 300ms ease-in-out forwards;

      #close-menu {
        background-color: transparent;
        bottom: 0;
        height: 100vh;
        left: 0;
        position: absolute;
        right: 0;
        top: 0;
        width: 100vw;
        z-index: 0;
      }

      ul {
        border-radius: 0 0 0.5em 0.5em;
        margin: 0;
        overflow: hidden;
        padding: 0;
        z-index: 1;

        li {
          @keyframes menu-item-opacity {
            0% {
              opacity: 0;
            }
            80% {
              opacity: 0;
            }
            100% {
              opacity: 1;
            }
          }

          animation: menu-item-opacity 300ms ease-in-out forwards;
          background-color: var(--color-dark);
          color: var(--color-text-light);
          cursor: pointer;
          list-style-type: none;
          padding: 0.5rem 1rem;

          &:hover {
            background-color: var(--color-grey);
          }
        }
      }
    }
  }

  button {
    background-color: var(--color-button-background);
    border: 1px solid var(--color-button-border);
    border-radius: 0.25rem;
    color: var(--color-button-text);

    height: 2rem;
    margin: 0.25rem;

    padding: 0.25rem;

    width: auto;

    &:hover {
      background-color: var(--color-button-background-hover);

      border: 1px solid var(--color-button-border-hover);

      color: var(--color-button-text-hover);
    }
  }
</style>
