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

<style lang="scss">
  .tooltip-container {
    --width-box: 150px;

    align-items: center;
    display: none;
    flex: 1;
    justify-content: center;
    width: 50vw;

    @media only screen and (min-width: $laptop) {
      display: flex;
    }

    > div {
      border-radius: 0.25rem;
      padding: 1.25rem;
      background: var(--color-background);
    }

    .tooltip {
      border-bottom: 1px dashed var(--color-text);
      display: inline-block;
      position: relative;

      // Show the tooltip text when you mouse over the tooltip container
      &:hover {
        .tooltip-text {
          visibility: visible;
        }
      }

      .tooltip-text {
        background-color: var(--color-dark-background);
        border-radius: 0.25rem;
        bottom: 120%;
        color: var(--color-dark-text);
        left: 50%;
        margin-left: calc(-1 * var(--width-box) / 2);
        padding: 5px 0;
        position: absolute;
        text-align: center;
        visibility: hidden;

        // Position the tooltip text - see examples below!
        width: var(--width-box);
        z-index: 1;

        &::after {
          border-color: var(--color-dark-background) transparent transparent transparent;
          border-style: solid;
          border-width: 5px;
          content: " ";
          left: 50%;
          margin-left: -5px;
          position: absolute;
          top: 100%; // At the bottom of the tooltip
        }
      }
    }
  }
</style>
