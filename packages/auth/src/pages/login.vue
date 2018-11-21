<script>
import { btoa } from 'b2a'

export default {
  preFetch ({ store, redirect }) {
    if (store.state.auth.user) {
      redirect('/')
    }
  },
  name: 'u-page-login',
  methods: {
    startGithubLogin () {
      const state = btoa(`githublogin::${this.$route.query.redirectUrl}`)
      window.location = `https://github.com/login/oauth/authorize?scope=read:user,repo&client_id=${process.env.GITHUB_CLIENT_ID}&state=${state}`
    }
  }
}
</script>

<template lang="pug">
  q-btn.q-mb-sm(@click="startGithubLogin", icon="mdi-github-circle", color="white", text-color="black", :label="$t('auth.login.github')")
</template>

<style lang="stylus">

</style>
