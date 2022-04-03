<template>
  <div>
    <GithubComponent />
    <TwitterComponent />
    <LinkedinComponent />
  </div>
</template>

<script>
import GithubComponent from "@/components/social/github-component";
import TwitterComponent from "@/components/social/twitter-component";
import LinkedinComponent from "@/components/social/linkedin-component";
export default {
  name: "SocialComponent",
  components: {LinkedinComponent, TwitterComponent, GithubComponent}
}
</script>

<style scoped>

</style>
