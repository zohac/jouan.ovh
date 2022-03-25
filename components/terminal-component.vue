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
    display: none;
    align-items: center;
    justify-content: center;
    width: 50vw;

    @media only screen and (min-width: $laptop) {
      display: flex;
    }

    > div {
      padding: 1.25rem;
      border-radius: 0.25rem;
      @include background-opacity($color-light, 0.8)
    }

    .tooltip {
      position: relative;
      display: inline-block;
      border-bottom: 1px dashed var(--color-dark);

      /* Show the tooltip text when you mouse over the tooltip container */
      &:hover {
        .tooltip-text {
          visibility: visible;
        }
      }

      .tooltip-text {
        --width-box: 150px;
        visibility: hidden;
        width: var(--width-box);
        bottom: 120%;
        left: 50%;
        margin-left: calc(var(--width-box) / -2);
        background-color: var(--color-dark);
        color: var(--color-text-light);
        text-align: center;
        padding: 5px 0;
        border-radius: 0.25rem;

        /* Position the tooltip text - see examples below! */
        position: absolute;
        z-index: 1;

        &::after {
          content: " ";
          position: absolute;
          top: 100%; /* At the bottom of the tooltip */
          left: 50%;
          margin-left: -5px;
          border-width: 5px;
          border-style: solid;
          border-color: var(--color-dark) transparent transparent transparent;
        }
      }
    }
  }
</style>
