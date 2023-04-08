<template>
  <header>
    <nuxt-picture :src="img.src" :img-attrs="img.attr" />
  </header>
</template>

<script lang="ts">
import { type PropType } from "vue";

export type ImgLoadingType = "eager" | "lazy";
export type ImgDecodingType = "sync" | "async" | "auto";
export interface ImageInterface {
  src: string;
  attr: {
    alt?: string;
    title?: string;
    loading?: ImgLoadingType;
    height?: number;
    width?: number;
    decoding?: ImgDecodingType;
    class?: string;
  };
}

export default {
  name: "ZCardHeader",

  props: {
    img: {
      type: Object as PropType<ImageInterface>,
      required: true,
    },
  },
};
</script>

<style lang="scss" scoped>
header {
  --card-header-height: 256px;

  grid-area: header;
  background-color: transparent;
  max-height: var(--card-header-height);
  width: 100%;
  overflow: hidden;

  picture {
    max-height: var(--card-header-height);
    width: 100%;

    img {
      width: 100%;
      height: auto;
      aspect-ratio: 16/9;
    }
  }
}
</style>
