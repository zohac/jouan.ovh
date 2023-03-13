<template>
  <article>
    <header>
      <picture>
        <img
          alt="Portrait de Simon JOUAN"
          height="256"
          :src="getSrc"
          title="Portrait de Simon JOUAN"
          width="256"
          loading="eager"
          decoding="async"
          type="image/webp">
      </picture>
    </header>

    <section class="content">
      <h1>Simon JOUAN</h1>
      <p>Développeur Web FullStack & Testeur/QA</p>
    </section>

    <footer id="social">
      <SocialLinkListComponent />
    </footer>
  </article>
  
</template>

<script lang="ts">

export default {
  name: 'ArticleComponent',

  computed: {
    getSrc() {
      const portraitUrl = [
        '/images/portrait_512x512_drip_art_1.webp',
        '/images/portrait_512x512_drip_art_2.webp',
        // '/images/portrait_512x512_drip_art_3.webp',
        '/images/portrait_512x512_drip_art_4.webp',
        // '/images/portrait_512x512_drip_art_5.webp',
        // '/images/portrait_512x512_drip_art_6.webp',
        '/images/portrait_512x512_drip_art_7.webp',
        '/images/portrait_512x512_drip_art_8.webp',
        '/images/portrait_512x512_drip_art_9.webp',
      ];

      return `${portraitUrl[Math.floor(Math.random() * portraitUrl.length)]}`;
    },
  }
}
</script>

<style lang="scss" scoped>
  @use "assets/scss/abstract/space";
  @use "assets/scss/abstract/radius";
  @use "assets/scss/abstract/variables";
  @use "assets/scss/abstract/function";
  @use "sass:math";

  article {
    --main-space-inset: #{space.$space-inset-16x};
    --article-space-inset: #{space.$space-inset-16x};
    --article-radius: #{radius.$radius-rounded-4px};
    --article-height: 80vh;
    --article-width: 600px;
    --article-header-height: 30vw;
    --article-footer-button-height: 32px;
    --article-footer-height:
      calc(var(--article-footer-button-height) * 3 + #{space.$space-stack-8x} * 2 + var(--article-space-inset) * 2);

    // color system
    // =============================================================================
    --article-color-background: var(--color-background);
    //--article-color-background-hover: ;
    //--article-color-border: ;
    //--article-color-border-hover: ;
    // Shapes : icons/elements
    //--article-color-shapes: var(--article-color-border-hover);
    //--article-color-shapes-hover: var(--color-text);
    //--article-color-shapes-active: var(--color-text-hover);
    --article-color-text: var(--color-text);
    --article-color-text-hover: var(--color-text-hover);
    //--article-color-text-active: ;

    animation: card-animation 1200ms linear both;
    background-color: var(--article-color-background);
    border-radius: var(--article-radius);
    box-shadow: var(--box-shadow-2), var(--box-shadow-1);
    color: var(--article-color-text);
    //overflow: hidden;
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: auto 1fr var(--article-footer-height);
    gap: 0 0;
    grid-auto-flow: row;
    grid-template-areas:
      "header"
      "section"
      "footer";

    //height: var(--article-height);
    //min-height: 900px;
    //width: var(--article-width);
    //max-width: calc(100vw - (2 * var(--main-space-inset)));
    aspect-ratio: 1/2;

    header {
      grid-area: header;
      background-color: transparent;
      //height: calc(var(--article-width) / 3 * 2 );
      //max-height: calc(100vw - (2 * var(--main-space-inset)));
      aspect-ratio: 4/3;

      picture {
        display: flex;
        align-items: flex-start;
        justify-content: center;
        height: 100%;
        width: 100%;
        overflow: hidden;

        img {
          width: 100%;
          height: auto;
        }
      }
    }

    section {
      grid-area: section;
      padding: var(--article-space-inset);

      display: flex;
      flex-direction: column;
      justify-content: center;

      text-align: center;

      h1 {
        color: var(--article-color-text-hover);
      }

      h2 {
        color: var(--article-color-text);
      }

      &.content {
        animation: fadeIn 1000ms ease-out forwards;
      }
    }

    footer {
      grid-area: footer;
      padding: var(--article-space-inset);

      //ul {
      //  margin: 0;
      //  padding: 0;
      //}
    }

    @media (min-width: function.breakpoint("xs")) {
      aspect-ratio: 3/5;

      header {
        aspect-ratio: 6/5;
      }
    }

    @media (min-width: function.breakpoint("sm")) {
      aspect-ratio: 2/3;

      header {
        aspect-ratio: 3/2;
      }
    }

    //@media (min-width: function.breakpoint("md")) {
    //  width: 60vw;
    //}
    //
    //@media (min-width: function.breakpoint("lg")) {
    //  width: 55vw;
    //}
    //
    //@media (min-width: function.breakpoint("xl")) {
    //  width: 50vw;
    //}
    //
    //@media (min-width: function.breakpoint("xxl")) {
    //  width: 45vw;
    //}

    &:hover {
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.15);
    }
  }

</style>
