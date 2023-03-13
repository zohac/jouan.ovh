<template>
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
</template>

<script>
import GithubComponent from "@/components/social/github-component";
import TwitterComponent from "@/components/social/twitter-component";
import LinkedinComponent from "@/components/social/linkedin-component";

export default {
  name: "SocialLinkListComponent",
  components: {LinkedinComponent, TwitterComponent, GithubComponent}
}
</script>

<style lang="scss" scoped>
  @use "assets/scss/components/list";
  @use "assets/scss/abstract/color";

  ul {
    $n-rows: 1;
    $n-cols-min: 3;
    $n-cols-max: $n-cols-min + 1;
    $n-cols-sum: $n-cols-max + $n-cols-min;

    --n-rows: #{$n-rows};
    --n-cols: calc(2 * #{$n-cols-max});

    --l: calc(20vh / (var(--n-rows) + 3));
    --hl: calc(.5 * var(--l));
    --ri: calc(.5 * 1.73205 * var(--l));

    box-sizing: border-box;
    display: grid;
    place-content: center;
    grid-template: repeat(var(--n-rows), var(--l))/repeat(var(--n-cols), var(--ri));
    grid-gap: var(--hl) 0;
    overflow: hidden;
    margin: 0;
    padding: var(--hl) 0;
    //filter: drop-shadow(0 1px 4px);

    li {
      background: var(--color-border);
      overflow: hidden;
      grid-column-end: span 2;
      margin: calc(-1 * var(--hl)) 0;
      transform: scale(0.95);
      clip-path: polygon(50% 0, 100% 25%, 100% 75%, 50% 100%, 0 75%, 0 25%);
      display: grid;
      justify-content: center;
      align-content: center;

      &:nth-of-type(#{$n-cols-sum}n+1) {
        grid-column-start: 2;
      }

      a {
        --hl: 0;

        width: 100%;
        height: 100%;

        color: var(--color-text-hover);

        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
      }

      &:hover {
        background: var(--color-text-hover);

        a {
          --hl: 1;

          color: var(--color-border);
          transform: scale(calc(1 + 0.2 * var(--hl)));
          transition: 700ms;
        }
      }
    }
  }
</style>
