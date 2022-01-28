<template>

  <header>
    <button ref="toggle-menu">&lt;sj &#47;&gt;</button>
    <nav id="menu" hidden>
      <ul>
        <li ref="menu-terminal">terminal</li>
        <li>application 2</li>
        <li>application 3</li>
      </ul>
    </nav>
  </header>

</template>

<script lang="ts">
import terminal from '~/utils/terminal/src/main';

export default {
  name: 'HeaderComponent',

  mounted() {
    this.$refs['toggle-menu'].addEventListener('click', function(){
      toggle('menu');
    });
    this.$refs['menu-terminal'].addEventListener('click', function(event: Event){
      terminal.open(event);

      toggle('menu');
    });
    // document.addEventListener('click',function (event: Event) {
    //   console.log(event?.target?.localName);
    //   if ('li' !== event?.target?.localName && 'button' !== event?.target?.localName) {
    //     const menu = document.getElementById('menu');
    //
    //     if (menu) {
    //       menu.hidden = true;
    //     }
    //   }
    // });
  }
};

function toggle(id: string) {
  const menu = document.getElementById(id);

  if (menu) {
    menu.hidden = !menu.hidden;
  }
}

</script>

<style scoped>

  header {
    display: flex;

    width: 100%;

    color: var(--white-color);
    background-color: var(--black-color);
  }

  button {
    height: 2rem;
    width: auto;
    margin: 0.25rem;
    padding: 0.25rem;

    border: 1px solid var(--light-grey-color);
    border-radius: 0.25rem;

    color: var(--white-color);
    background-color: var(--grey-color);
  }

  nav {
    position: absolute;
    top: 2.5rem;

    color: var(--white-color);
    background-color: var(--black-color);
  }

  ul {
    margin: 0;
    padding: 0;
  }

  li {
    padding: 0.5rem 1rem;
    list-style-type: none;

    cursor: pointer;
  }

  li:hover {
    background-color: var(--grey-color);
  }

</style>
