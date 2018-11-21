<script>
export default {
  name: 'u-page-signup',
  data () {
    return {
      currentStep: 'steem/connect',
      didMount: false
    }
  },
  methods () {
    return {
      goToCreate () {
        this.$router.push('/signup/steem/create')
      },
      goToConnect () {
        this.$router.push('signup/steem/username')
      }
    }
  },
  mounted () {
    this.currentStep = this.$route.params.step
    this.$nextTick(function () {
      this.didMount = true
    })
  },
  watch: {
    '$route' (to, from) {
      this.currentStep = to.params.step
    }
  }
}
</script>

<template lang="pug">
q-layout.u-page-signup.column.items-center.no-wrap
  .column.justify-center.items-center.logo-container
    img.utopian-logo(src="~assets/img/logo-black.svg")
    q-spinner.q-ma-xl(v-if="!didMount" size="7em" color="primary")
  .centered-container
    q-stepper.main-stepper(
      v-model="currentStep",
      active-icon="mdi-pencil",
      done-icon="mdi-check",
      error-icon="mdi-alert-circle",
      alternative-labels,
      no-header-navigation
      v-if="didMount"
    )
      q-step(name="steem/connect" title="Steem" subtitle="Connect account")
        q-stepper-navigation
          .create-user-form
            p.q-title You're almost there! Just a few more steps and you'll be ready to use Utopian.io
            p.q-subtitle You can connect a Steem account to receive SP rewards
            .row
              q-btn.col-xs-12.col-md-3(color="primary", label="Connect", @click="goToConnect", :disabled="true")
              q-btn.q-ml-sm(flat, color="primary", label="I don't have a Steem account", @click="goToCreate")

      q-step(name="steem/create" title="Steem" subtitle="Create username")
        q-stepper-navigation
          div
</template>

<style lang="stylus">
.u-page-signup {
  height 100%
  background-color #f7f7f7
  .logo-container {
    min-height 130px
  }
  .utopian-logo {
    margin-top 40px
    height 50px
    margin-bottom 40px
  }
  .centered-container {
    background-color #f7f7f7
    max-width 600px
    .q-stepper.main-stepper {
      border none !important
      box-shadow none
      .q-stepper-header {
        border none
        box-shadow none
      }
      .q-stepper-nav {
        justify-content center
      }
    }
    .create-user-form {
      width 100%
      text-align center
      .utopian-logo {
        height 60px
        margin-bottom 20px
      }
    }
  }
}
</style>