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
import GithubComponent from '@/components/social/github-component';
import TwitterComponent from '@/components/social/twitter-component';
import LinkedinComponent from '@/components/social/linkedin-component';

export default {
  name: "SocialLinkListComponent",
  components: {LinkedinComponent, TwitterComponent, GithubComponent}
}
</script>

<style lang="scss" scoped>
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
</style>
