<script>
import { required, minLength, maxLength, helpers } from 'vuelidate/lib/validators'
import { mapGetters, mapActions } from 'vuex'
import jwt from 'jsonwebtoken'
import { Cookies, debounce, Notify, Loading } from 'quasar'

export default {
  name: 'u-page-signup',
  preFetch ({ redirect, ssrContext }) {
    const cookies = process.env.SERVER ? Cookies.parseSSR(ssrContext) : Cookies
    if (cookies.get('access_token')) {
      let scopes = jwt.decode(cookies.get('access_token')).scopes
      if (!scopes.includes('createAccount')) {
        redirect('/')
      }
    }
  },
  data () {
    return {
      ...mapGetters('auth', ['account', 'username']),
      user: {
        username: '',
        usernameAvailable: ''
      }
    }
  },
  validations: {
    ...mapGetters('api', ['getTokens']),
    user: {
      username: {
        required,
        minLength: minLength(3),
        maxLength: maxLength(32),
        usernameAvailable: (value, vm) => vm.usernameAvailable,
        regex: helpers.regex('alpha', /^[A-Za-z0-9]+(?:[._-][A-Za-z0-9]+)*$/)
      }
    }
  },
  methods: {
    ...mapActions([
      'startLoading',
      'stopLoading',
      'showDialog'
    ]),
    ...mapActions('users', [
      'isUsernameAvailable',
      'saveUser'
    ]),
    validateUsername () {
      this.user.usernameAvailable = 'checking'
      this.checkUsername()
    },
    checkUsername: debounce(async function () {
      const usernameValidator = this.$v.user.username
      this.$v.user.$touch()
      if (this.user.username.length > 2 && usernameValidator.minLength &&
        usernameValidator.maxLength && usernameValidator.regex) {
        this.user.usernameAvailable = await this.isUsernameAvailable(this.user.username)
      }
      if (this.user.usernameAvailable === 'checking') {
        this.user.usernameAvailable = ''
      }
    }, 1000),
    getErrorLabel () {
      const usernameValidator = this.$v.user.username
      if (!usernameValidator.minLength) {
        return 'The username should be at least 3 characters long.'
      } else if (!usernameValidator.maxLength) {
        return 'The username should have the maximum of 32 characters.'
      } else if (!usernameValidator.regex) {
        return 'Please use alphanumeric characters. Dot, underscore and dash are allowed as separators.'
      } else if (!usernameValidator.usernameAvailable) {
        return 'Sorry. This username is not available.'
      }
      return ''
    },
    async submit () {
      this.$v.user.$touch()
      Loading.show({ message: this.$t('auth.signup.loading') })
      try {
        await this.saveUser({ username: this.user.username })
        Loading.hide()
        if (typeof window !== 'undefined') window.location = this.$route.query.redirectUrl || process.env.UTOPIAN_DOMAIN
      } catch (err) {
        Loading.hide()
        Notify.create({
          type: 'negative',
          position: 'bottom-right',
          message: this.$t(`api.error.${err.message}`)
        })
      }
    }
  }
}
</script>

<template lang="pug">
  .u-page-signup-utopian
    .q-subheading.q-mb-sm {{ $t('auth.signup.text') }}
    .q-body-1.text-grey.q-mb-lg {{ $t('auth.signup.smallerText') }}
    q-field.full-width.q-mb-md(
    :error="$v.user.username.$error && user.usernameAvailable !== 'checking'",
    :error-label="getErrorLabel()"
    )
      q-input(
      v-model.trim="user.username",
      placeholder="ada.lovelace",
      :before="[{ icon: 'mdi-account' }]",
      prefix="@"
      maxlength="32"
      @input="validateUsername()"
      :loading="user.usernameAvailable === 'checking'"
      :color="user.usernameAvailable === true ? 'green' : 'primary'"
      )
    q-btn.full-width(color="primary", no-caps, :label="$t('auth.signup.create')", @click="submit", :disabled="user.usernameAvailable !== true")
</template>

<style lang="stylus">
  .u-page-signup-utopian {
    .q-if-addon-left {
      margin-top 5px
    }
    .q-field {
      height 75px
    }
  }
</style>
