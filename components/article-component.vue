<template>
  <article>
    <picture>
<!--      <source srcset="https://dummyimage.com/300x300/141414/ebebeb.png&text=desktop" media="(min-width: 1920px)" type="image/png">-->
<!--      <source srcset="https://dummyimage.com/250x250/141414/ebebeb.png&text=laptop" media="(min-width: 1280px)" type="image/png">-->
<!--      <source srcset="https://dummyimage.com/200x200/141414/ebebeb.png&text=tablet" media="(min-width: 768px)" type="image/png">-->
<!--      <source srcset="https://dummyimage.com/150x150/141414/ebebeb.png&text=mobile" media="(min-width: 375px)" type="image/png">-->

      <img alt="Portrait de Simon JOUAN"
           height="709"
           src="/images/BR.jpeg"
           title="Portrait de Simon JOUAN"
           width="512">
    </picture>

    <div class="content">
      <h1>Simon JOUAN</h1>
      <h2>Développeur Web FullStack</h2>
    </div>

    <div id="social">

      <details>
        <summary>
          Réseaux Sociaux
          <svg
            class="bi bi-chevron-right"
            fill="currentColor"
            height="16"
            role="img"
            viewBox="0 0 16 16"
            width="16"
            xmlns="http://www.w3.org/2000/svg">
            <path d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z" fill-rule="evenodd"/>
          </svg>
        </summary>
          <SocialComponent />
      </details>

      <div hidden>
        <ul>
          <li>
            <GithubComponent />
          </li>
          <li>
            <TwitterComponent />
          </li>
          <li>
            <LinkedinComponent />
          </li>
        </ul>
      </div>
    </div>
  </article>
</template>

<script lang="ts">
import Vue from 'vue';
import GithubComponent from "~/components/social/github-component.vue";
import LinkedinComponent from "~/components/social/linkedin-component.vue";
import SocialComponent from "~/components/social/social-component.vue";
import TwitterComponent from "~/components/social/twitter-component.vue";

export default Vue.extend({
  name: "ArticleComponent",
  components: {LinkedinComponent, TwitterComponent, GithubComponent, SocialComponent},
});
</script>

<style lang="scss" scoped>
  article {
    animation: card-animation 1200ms linear both;
    background-color: var(--color-card-background);
    border-radius: 0.25rem;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
    color: var(--color-card-text);
    display: flex;
    flex: 1;
    flex-direction: column;
    margin: auto;
    overflow: hidden;

    @media only screen and (min-width: $tablet) {
      flex-direction: row;
    }

    picture {
      align-items: center;
      animation: scaleYIn-small 750ms ease-out forwards 1000ms;
      clip-path: polygon(0 0, 100% 0, 100% 84%, 0% 100%);
      display: flex;
      flex: 1;
      justify-content: center;
      min-height: 33vh;
      opacity: 0;
      transform: scaleX(0);
      transform-origin: top center;

      @media only screen and (min-width: $tablet) {
        animation: scaleXIn-small 750ms ease-out forwards 1000ms;
        clip-path: polygon(0 0, 100% 0, 87% 100%, 0% 100%);
        flex: 1;
        min-height: 25vh;
        transform-origin: left center;
      }

      img {
        background-color: var(--color-light);
        height: auto;
        left: 0;
        position: absolute;
        top: 0;
        width: 100%;
      }
    }

    > div {
      align-items: center;
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding: 1.25rem;
      text-align: left;

      h2 {
        color: var(--color-grey);
      }

      &.content {
        animation: fadeIn 1000ms ease-out forwards;
        flex: 2;
      }

      .hide-social {
        align-items: center;
        display: flex;
        justify-content: flex-end;
        width: 100%;
      }

      button.hide-social {
        display: flex;

        @media only screen and (min-width: $tablet) {
          display: none;
        }

        &[aria-pressed="true"] {
          svg {
            transform: rotate(90deg);
          }
        }
      }

      div[hidden] {
        display: none;

        @media only screen and (min-width: $tablet) {
          display: flex;
        }
      }
    }

    &:hover {
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.15);
    }

    #social {
      flex: 1;

      details {
        width: 100%;

        summary {
          display: flex;
          justify-content: flex-end;
          list-style: none;
          margin: 0.625rem auto;

          &:focus {
            outline: none;
          }

          &::-webkit-details-marker {
            display: none;
          }
        }

        @media only screen and (min-width: $tablet) {
          display: none;
        }

        &[open] {
          summary {
            svg {
              animation: rotate-90 0.2s linear forwards;
            }
          }
        }

        div {
          align-items: center;
          display: flex;
          justify-content: center;
        }
      }

      div {
        align-items: center;
        flex-direction: column;
        justify-content: center;
        width: 100%;

        ul {
          margin: 0;
          padding: 0;
          width: 100%;

          li {
            animation: slideInUp 1000ms ease-out forwards;
            list-style-type: none;
            margin: 0 0 0.625rem 0;
            opacity: 0;

            &:first-child {
              animation-delay: 1050ms;
            }

            &:nth-child(2n) {
              animation-delay: 1100ms;
            }

            &:last-child {
              animation-delay: 1150ms;
              margin: 0;
            }
          }
        }

        a {
          @media only screen and (min-width: $tablet) {
            width: 100%;
          }

          &:last-child {
            margin: 0;
          }

          &:hover {
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
          }
        }
      }
    }
  }
</style>
