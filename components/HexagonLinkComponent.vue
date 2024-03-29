<template>
  <NuxtLink :to="link" class="hexagon">
    <div class="hexagon-content">
      <slot name="icon" />
      <slot name="title" />
    </div>
  </NuxtLink>
</template>

<script>
export default {
  name: "HexagonLinkComponent",

  props: {
    link: {
      type: String,
      required: true,
    },
  },
}
</script>

<style lang="scss" scoped>
  @use "sass:math";
  @use "assets/scss/abstract/color" as _color;

  .hexagon {
    $-math-sqrt2: math.sqrt(2);
    $-math-sqrt3: math.sqrt(3);
    $-hexa-div: math.div(math.tan((30 * math.$pi)), 180);

    --hexa-tan: #{$-hexa-div};
    --hexa-width: 100px;
    --hexa-border-width: 0px;
    --hexa-shadow-blur: 0px;
    --hexa-content-text-size: 18px;

    --hexa-hover-width: 100px;
    --hexa-hover-border-width: 0px;
    --hexa-hover-shadow-blur: 10px;
    --hexa-hover-content-text-size: 18px;

    // color system
    // =============================================================================
    --hexa-grey-color-background: #{_color.$gray-2};
    --hexa-grey-color-background-hover: #{_color.$gray-5};
    --hexa-grey-color-border: #{_color.$gray-2};
    --hexa-grey-color-border-hover: #{_color.$gray-5};
    --hexa-grey-color-text: #{_color.$gray-5};
    --hexa-grey-color-text-hover: #{_color.$gray-2};
    // --hexa-color-text-active: ;
    --hexa-grey-color-shapes: var(--hexa-grey-color-text);
    --hexa-grey-color-shapes-hover: var(--hexa-grey-color-text-hover);
    //--hexa-grey-color-shapes-active: ;

    --hexa-cursor: pointer;
    --hexa-height: calc(var(--hexa-width) / #{$-math-sqrt3});
    --hexa-margin-top: calc(var(--hexa-height) / 2);
    --hexa-beforeafter-widthheight: calc(var(--hexa-width) / #{$-math-sqrt2});
    --hexa-beforeafter-topbottom: calc(-1 * var(--hexa-beforeafter-widthheight) / 2);
    --hexa-beforeafter-left: calc((var(--hexa-width) - (var(--hexa-width) / #{$-math-sqrt2})) / 2 );
    --hexa-border-beforeafter-width: calc(var(--hexa-border-width) / #{$-math-sqrt2});
    --hexa-color: var(--hexa-grey-color-background);
    --hexa-border-color: var(--hexa-grey-color-border);
    --hexa-shadow-color: #{_color.$shadow};
    --hexa-content-color: var(--hexa-grey-color-text);
    --hexa-content-top: calc(var(--hexa-border-width) * var(--hexa-tan));
    --hexa-content-width: calc(var(--hexa-width) - (var(--hexa-border-width) * 2));
    --hexa-content-height: var(--hexa-height);

    --hexa-hover-cursor: pointer;
    --hexa-hover-height: calc(var(--hexa-hover-width) / #{$-math-sqrt3});
    --hexa-hover-margin-top: calc(var(--hexa-hover-height) / 2);
    --hexa-hover-beforeafter-widthheight: calc(var(--hexa-hover-width) / #{$-math-sqrt2});
    --hexa-hover-beforeafter-topbottom: calc(-1 * var(--hexa-hover-beforeafter-widthheight) / 2);
    --hexa-hover-beforeafter-left: calc((var(--hexa-hover-width) - (var(--hexa-hover-width) / #{$-math-sqrt2})) / 2 );
    --hexa-hover-border-beforeafter-width: calc(var(--hexa-hover-border-width) / #{$-math-sqrt2});
    --hexa-hover-color: var(--hexa-grey-color-background-hover);
    --hexa-hover-border-color: var(--hexa-grey-color-border-hover);
    --hexa-hover-shadow-color: #{_color.$shadow};
    --hexa-hover-content-color: var(--hexa-grey-color-text-hover);
    --hexa-hover-content-top: calc(var(--hexa-hover-border-width) * var(--hexa-hover-tan));
    --hexa-hover-content-width: calc(var(--hexa-hover-width) - (var(--hexa-hover-border-width) * 2));
    --hexa-hover-content-height: var(--hexa-height);
    --hexa-hover-content-transition: 0s;
    --hexa-hover-transition: 0s;

    cursor: var(--hexa-cursor);
    position: relative;
    width: var(--hexa-width);
    height: var(--hexa-height);
    background-color: var(--hexa-color);
    margin: var(--hexa-margin-top) auto 0 auto;
    box-shadow: 0 0 var(--hexa-shadow-blur) var(--hexa-shadow-color);
    border-left: solid var(--hexa-border-width) var(--hexa-border-color);
    border-right: solid var(--hexa-border-width) var(--hexa-border-color);
    display: grid;
    transition: var(--hexa-hover-transition);

    &:before,
    &:after {
      content: "";
      position: absolute;
      z-index: 1;
      width: var(--hexa-beforeafter-widthheight);
      height: var(--hexa-beforeafter-widthheight);
      transform: scaleY(0.5774) rotate(-45deg);
      background-color: inherit;
      left: var(--hexa-beforeafter-left);
      box-shadow: 0 0 var(--hexa-shadow-blur) var(--hexa-shadow-color);
      transition: var(--hexa-hover-transition);
    }

    &:before {
      top: var(--hexa-beforeafter-topbottom);
      border-top: solid var(--hexa-border-beforeafter-width) var(--hexa-border-color);
      border-right: solid var(--hexa-border-beforeafter-width) var(--hexa-border-color);
    }

    &:after {
      bottom: var(--hexa-beforeafter-topbottom);
      border-bottom: solid var(--hexa-border-beforeafter-width) var(--hexa-border-color);
      border-left: solid var(--hexa-border-beforeafter-width) var(--hexa-border-color);
    }

    .hexagon-content {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      position: absolute;
      font-size: var(--hexa-content-text-size);
      color: var(--hexa-content-color);
      top: var(--hexa-content-top);
      left: 0;
      width: var(--hexa-content-width);
      height: var(--hexa-content-height);
      z-index: 2;
      background: inherit;
      transition: var(--hexa-hover-content-transition);
    }

    &:hover {
      width: var(--hexa-hover-width);
      height: var(--hexa-hover-height);
      background-color: var(--hexa-hover-color);
      margin: var(--hexa-hover-margin-top) auto 0 auto;
      box-shadow: 0 0 var(--hexa-hover-shadow-blur) var(--hexa-hover-shadow-color);
      border-left: solid var(--hexa-hover-border-width) var(--hexa-hover-border-color);
      border-right: solid var(--hexa-hover-border-width) var(--hexa-hover-border-color);

      &:before,
      &:after {
        width: var(--hexa-hover-beforeafter-widthheight);
        height: var(--hexa-hover-beforeafter-widthheight);
        transform: scaleY(0.5774) rotate(-45deg);
        left: var(--hexa-hover-beforeafter-left);
        box-shadow: 0 0 var(--hexa-hover-shadow-blur) var(--hexa-hover-shadow-color);
      }

      &:before {
        top: var(--hexa-hover-beforeafter-topbottom);
        border-top: solid var(--hexa-hover-border-beforeafter-width) var(--hexa-hover-border-color);
        border-right: solid var(--hexa-hover-border-beforeafter-width) var(--hexa-hover-border-color);
      }

      &:after {
        bottom: var(--hexa-hover-beforeafter-topbottom);
        border-bottom: solid var(--hexa-hover-border-beforeafter-width) var(--hexa-hover-border-color);
        border-left: solid var(--hexa-hover-border-beforeafter-width) var(--hexa-hover-border-color);
      }

      .hexagon-content {
        font-size: var(--hexa-hover-content-text-size);
        color: var(--hexa-hover-content-color);
        top: var(--hexa-hover-content-top);
        width: var(--hexa-hover-content-width);
        height: var(--hexa-hover-content-height);
      }
    }
  }
</style>
