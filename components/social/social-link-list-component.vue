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
  ul {
    list-style-type: none;
    display: flex;
    flex-direction: row;
    margin: 0;
    padding: 0;
    justify-content: space-around;
    height: auto;

    li {
      height: 120px;
    }
  }
</style>
