<template>
  <div class="tooltip-container">
    <div>
      Ouvrez le comme si vous étiez sous
      <div class="tooltip"> linux
        <div class="tooltip-text">ctrl + alt + t</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">

export default {
  name: 'TerminalComponent',

}

</script>

<style>

  .tooltip-container {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .tooltip {
    position: relative;
    display: inline-block;
    border-bottom: 1px dashed var(--black-color);
  }

  /* Tooltip text */
  .tooltip .tooltip-text {
    --width-box: 150px;
    visibility: hidden;
    width: var(--width-box);
    bottom: 120%;
    left: 50%;
    margin-left: calc(var(--width-box) / -2);
    background-color: var(--black-color);
    color: var(--white-color);
    text-align: center;
    padding: 5px 0;
    border-radius: 0.25rem;

    /* Position the tooltip text - see examples below! */
    position: absolute;
    z-index: 1;
  }

  /* Show the tooltip text when you mouse over the tooltip container */
  .tooltip:hover .tooltip-text {
    visibility: visible;
  }

  .tooltip .tooltip-text::after {
    content: " ";
    position: absolute;
    top: 100%; /* At the bottom of the tooltip */
    left: 50%;
    margin-left: -5px;
    border-width: 5px;
    border-style: solid;
    border-color: var(--black-color) transparent transparent transparent;
  }
</style>
