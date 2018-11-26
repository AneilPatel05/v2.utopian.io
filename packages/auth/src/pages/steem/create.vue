<script>
import { mapActions } from 'vuex'

export default {
  name: 'u-page-steem-create',
  data () {
    return {
    }
  },
  methods: {
    ...mapActions('users', [  
      'hasClaimedBlockchainAccount'
    ]),
    goToCreate () {
      this.$router.push('/steem/create')
    },
    goToConnect () {
      this.$router.push('signup/steem/username')
    }
  },
  async mounted () {
    alert(await this.hasClaimedBlockchainAccount('steem'))
  }
}
</script>

<template lang="pug">
.u-page-steem-connect
  .q-subheading.q-mb-sm {{ $t('auth.steemConnect.text') }}
  .q-body-1.text-grey.q-mb-lg {{ $t('auth.steemConnect.smallerText') }}
  .row
    q-btn.col-xs-12.col-md-3(color="primary", no-caps, :label="$t('auth.steemConnect.connect')", @click="goToConnect", :disabled="true")
    q-btn.q-mt-sm(flat, color="primary", no-caps, :label="$t('auth.steemConnect.create')", @click="goToCreate")

</template>

<style lang="stylus">

</style>