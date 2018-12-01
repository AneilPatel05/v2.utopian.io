# `@utopian/testing`

## Introduction
This is a repository that maintains templates and hosts peer dependencies, keeping the individual monorepo package sources a bit cleaner.

We are using JEST (jasmine/mocha/chai) and WEBDRIVER (mocha/chai) and currently targeting Chrome and Firefox. Jest builds a version of vue with `jsdom`, so you don't need a running dev server. However, running e2e tests with webdriver does require at least a running local dev server.

###  **A note about testing**

#### Basics
Remember that unit testing exists to test the atomic functionality of the code. It ensures simplicity and coherence with regard to specific units within the larger scheme of systemic behaviour. If we are testing a button's extended functionality, we don't care if the API really is working, because we assume that the API has been unit tested as well.

e2e testing, on the other hand, makes sure that all of the units (even the ones you haven't tested) work in concert with each other. This is where you want to hit real API's, because this is as close as we will get to interaction with the client devices - and mock's won't cut it.

#### Moving to production
In order to be certain that our PR from dev to master is perfect, we will be running an extended version of our webdriver configuration on a grid of virtual machines.

## DETAILS

### Root folder commands:

    "test": "lerna run test --stream",
    "audit:snyk": "lerna run audit:snyk --stream",
    "audit:node_modules": "lerna run audit:node_modules --stream",
    "audit:licenses": "lerna run audit:licenses --stream",
    "test:jest": "lerna run test:jest --no-bail",
    "test:jest:watch": "lerna run test:jest:watch --no-bail",
    "test:webdriver": "lerna run test:webdriver --stream",
    "selenium:install": "selenium-standalone install",
    "selenium:start": "selenium-standalone start",


### Monorepo Package Structure
```
└─┬  %package% (API / CLIENT)
  ├───  .babelrc                // test env settings
  ├───  jest.config.js          // jest config object
  └──┬  test
     ├───  audits               // audit results
     ├──┬  jest 
     │  ├───  __tests__         // location of unit tests
     │  ├───  coverage          // coverage html
     │  ├──┬  utils
     │  │  └───  index.js       // rig vue and quasar with ssr
     │  └───  jest.setup.js     // jest boot setup
     ├───  lighthouse           // specialized config files
     ├───  loaders              // webpack loaders for <test> templates
     └──┬  webdriver
        ├──┬  config
        │  ├───  wdio.conf.js 
        │  └───  wdio.shared.conf.js
        └───  specs             // location of e2e tests
`````

**Jest**: The config object in `jest.config.js` maintains global settings such as coverage highwater, routes to vue and quasar etc. It calls the `jest.setup.js` before any tests are run.

**Webdriver**: All the configuration for the developement e2e testing process takes place here `wdio.conf.js`. 

## Features:
- simple inclusion of this package will bring in all peer dependencies
- generate your tests from within .vue SFC files
- runs Firefox and Chrome headless e2e tests

### Test harnesses:
- Jest (Unit)
    - jasmine with added mocha/chai
    - @vue/test-utils
    - no console.log()
- webdriver.io (e2e)
    - phantom-js
    - testing-bot
    - selenium
    
### Quality, Security and Compliance
- Lighthouse (PWA)
- snyk (node module security)
- nlf (open source license collector)
- yarn audit

### `<test>` templates in your SFC
Having everything in one place can help developers new to testing become better acquainted with its pitfalls. Working with one SFC component in the HMR mode of Quasar will always generate new test files and the `--watch` mode of Jest will run the latest version of the tests on the latest version of the code. These files are merely copied to the correct spec folder depending on the scope. You may have multiple tests in your file, i.e.:
```
<test lang="jest">
  // your jest test
</test>
<test lang="wdio">
  // your webdriver test
</test>
```

If you want to use a `<test>` loader in your vue SFC file, please include this snippet (appropriately constructed for your loading needs) in your webpack config:

```js
cfg.module.rules.push({
  test: /.jest/,
  use: [
    { loader: 'vue-loader',
      options: { 
        name: '[name].specs.js',
        outputPath: './test/jest/__tests__/',
        emitFile: true 
      } 
    },
    { loader: require.resolve('./test/loaders/jest-loader.js') },
  ],
  exclude: /(node_modules|quasar)/
})
cfg.plugins.push(new DiskPlugin({ 
    output: { path: "." },
    files: [{ 
    	asset: /.specs.js$/, 
    	output: { 
    	  filename: name => (`${name}`) 
        } 
    }]
}))
```

# Running your tests:

## Unit testing
Unit testing is functional testing in that the test runner attempts to execute functions with different types of input. It uses JSDom to render the page / run the functions without a browser. As such, there is no need to have a running dev server.

#### Jest (e2e)

To run jest tests across all monorepo packages:
``` 
$ yarn test:jest
```

## e2e
e2e or integration testing needs to have a running server, because it seeks to make sure that the units of code are appropriately integrated with each other. So before you can run `e2e` you have to first run `yarn dev` in the root folder.

#### webdriver

To install selenium for your platform during development, make sure you are in the root directory of the project repository and run:
```bash
$ yarn selenium:install
```

Then to start the selenium server, run:
```bash
$ yarn selenium:start
```

Make sure all the dev servers are running:
```bash
$ yarn dev
```

Finally to execute the e2e tests: 
``` 
$ yarn test:webdriver
```

See http://webdriver.io/api.html 

## Quality, Security and Compliance

The application Lighthouse from Google can be run and configured directly from the command line. However, it should only be tested on a production type artefact - so don't even bother running it on a dev server. It will make you sad.

Other little nicenesses
- SNYK: https://snyk.io/docs/using-snyk/
- yarn audit
- licenses


## Vue Dev-Tools
If you want to use the beta version of the electron vue-devtools (which Denjell highly recommends), you can add this line to your `/src/index.template.html`:
```
<script src="http://localhost:8098"></script>
```
To read more, see this: 

https://github.com/vuejs/vue-devtools/blob/master/shells/electron/README.md


## HACKING ON/WITH THIS REPO
There are a number of things to be done that require developer interaction. 

1. `.babelrc` update
2. Addition of new webpack rules to `quasar.conf.js` (if using `<test>` template in SFCs)
3. Manual copy of template folders.
4. Careful management of routes / ports etc.


``` 
      chainWebpack(chain) {
        chain.module.rule('template-engine2')
          .test(/jest/)
          .include
            .add(path.resolve(__dirname, 'src'))
            .end()
          .use('jest')
            .loader(require.resolve('./test/loaders/jest-loader.js'))

        chain.module.rule('jest')
          .test(/\.vue$/)
          .include
            .add(path.resolve(__dirname, 'src'))
            .end()
          .use('vue')
            .loader('vue-loader')
            .options({
              loaders: {
                'test': require.resolve('./test/loaders/jest-loader.js')
              }
            })

        chain.module.rule('templates')
          .test(/\.vue$/)
            .include
            .add(path.resolve(__dirname, 'src'))
              .end()
              .use('vue')
            .loader('vue-loader')
              .options({
                loaders: {
                  'jest': require.resolve('./test/loaders/jest-loader.js'),
                  'pug': 'pug-plain-loader'
                }
            })

      extendWebpack (cfg) {
        cfg.module.rules.push({
          resourceQuery: /blockType=test/,
          loader: require.resolve('./test/loaders/jest-loader.js')
        })
      },
            
            
      extendWebpack (cfg) {
        cfg.module.rules.push({
          enforce: 'pre',
          test: /\.js$/,
          loader: 'eslint-loader',
          exclude: /(node_modules|quasar)/
        })
        cfg.module.rules.push({
          test: /\.vue$/,
          loader: 'vue-loader',
          exclude: /(node_modules|quasar)/,
          options: {
            loaders: {
              'test': require.resolve('./test/loaders/jest-loader.js')
            }
          }
        })
      },            
      
      
  // environment config.
  require('dotenv').config()
  const path = require('path')
  
  // i18n webpack cruft
  const I18N = require('@utopian/i18n/lib')
  const ExtraWatchWebpackPlugin = require('extra-watch-webpack-plugin')
  // todo: https://webpack.js.org/plugins/context-replacement-plugin/ for i18n files in all libs
  // const webpack = require('webpack')
  
  // quasar / app config.
  module.exports = function (ctx) {
    // return config
    return {
      preFetch: true,
      supportIE: false,
      // list of animations to load.
      // todo: thin this out because it bloats the final package size
      animations: 'all', // animations: []
      // list of css files to load (including pre-processors).
      css: ['app.styl'],
      // quasar extras.
      extras: ['roboto-font', 'mdi', 'material-icons', 'fontawesome'],
      // quasar plugins.
      plugins: [
        { path: 'sentry', server: false },
        'vuelidate',
        'i18n',
        'axios',
        { path: 'markdown', server: false },
        { path: 'croppa', server: false }
      ],
      // build configuration.
      build: {
        env: {
          UTOPIAN_API: process.env.UTOPIAN_API,
          UTOPIAN_DOMAIN: process.env.UTOPIAN_DOMAIN,
          AUTH_DOMAIN: process.env.AUTH_DOMAIN,
          GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
          SENTRY_DSN: process.env.SENTRY_DSN,
          STEEMCONNECT_CLIENT_ID: (process.env.STEEMCONNECT_CLIENT_ID || '"utopian.signin"'),
          STEEM_API: (process.env.STEEM_API_DEV || '"https://api.steemit.com"')
        },
        scopeHoisting: true,
        vueRouterMode: 'history',
        useNotifier: false,
        vueCompiler: true,
        chainWebpack(chain) {
          chain.module.rule('lint')
            .test(/\.(js|vue)$/)
            .pre()
            .use('eslint')
              .loader('eslint-loader')
              .options({
                rules: {
                  semi: 'off'
                }
            })
          chain.module.rule('template-engine')
            .test(/\.pug$/)
            .include
              .add(path.resolve(__dirname, 'src'))
              .end()
            .use('pug')
              .loader('pug-plain-loader')
          chain.module.rule('jest')
            .test(/\.jest$/)
            .resourceQuery(/blockType=test/)
            .use('jest')
              .loader(require.resolve('./test/loaders/jest-loader.js'))
          chain.resolve.alias
            .set('~', __dirname)
            .set('@', path.resolve(__dirname, 'src'))
          // normalize the global => good for some non-isomorphic modules
          chain.output.set('globalObject', 'this')
          chain.plugin('i18n')
            .use(I18N, [
              [{
                debug: false
              }]
            ])
          chain.plugin('extraWatcher')
            .use(ExtraWatchWebpackPlugin, [
              {
                dirs: [`..${path.sep}i18n`]
              }
            ])
        }
      },
      // dev server configuration.
      devServer: {
        port: 8080,
        open: false // no auto browser.
      },
      // framework configuration.
      framework: {
        i18n: 'en-uk',
        iconSet: 'material-icons',
        components: [
          'QAjaxBar',
          'QAutocomplete',
          'QBreadcrumbs',
          'QBreadcrumbsEl',
          'QBtn',
          'QBtnDropdown',
          'QBtnGroup',
          'QBtnToggle',
          'QCard',
          'QCardActions',
          'QCardMain',
          'QCardMedia',
          'QCardSeparator',
          'QCardTitle',
          'QCarousel',
          'QCarouselControl',
          'QCarouselSlide',
          'QCheckbox',
          'QChip',
          'QChipsInput',
          'QCollapsible',
          'QDatetime',
          'QDatetimePicker',
          'QEditor',
          'QFab',
          'QFabAction',
          'QField',
          'QIcon',
          'QInfiniteScroll',
          'QInput',
          'QItem',
          'QItemMain',
          'QItemSeparator',
          'QItemSide',
          'QItemTile',
          'QLayout',
          'QLayoutDrawer',
          'QLayoutFooter',
          'QLayoutHeader',
          'QList',
          'QListHeader',
          'QModal',
          'QModalLayout',
          'QNoSsr',
          'QOptionGroup',
          'QPage',
          'QPageContainer',
          'QPageSticky',
          'QParallax',
          'QPopover',
          'QProgress',
          'QPullToRefresh',
          'QRouteTab',
          'QScrollArea',
          'QScrollObservable',
          'QSearch',
          'QSelect',
          'QSlideTransition',
          'QSlider',
          'QSpinner',
          'QSpinnerBars',
          'QSpinnerDots',
          'QTab',
          'QTabPane',
          'QTabs',
          'QToggle',
          'QToolbar',
          'QToolbarTitle',
          'QTooltip',
          'QUploader',
          'QVideo',
          'QTable',
          'QTh',
          'QTr',
          'QTd',
          'QTableColumns',
          'QWindowResizeObservable'
        ],
        directives: [
          'Ripple',
          'CloseOverlay',
          'BackToTop',
          'Platform'
        ],
        plugins: [
          'Cookies',
          'Dialog',
          'Loading',
          'Notify',
          'AddressbarColor',
          'Screen'
        ]
      },
  
      // quasar modes.
      pwa: {
        manifest: {
          htmlLang: 'de',
          name: 'Utopian.io',
          short_name: 'Utopian.io',
          description: 'Earn rewards by contributing to your favorite Open Source projects!',
          start_url: '/',
          gcm_sender_id: '103953800507',
          display: 'standalone',
          orientation: 'portrait',
          background_color: '#ffffff',
          theme_color: '#4786ff',
          icons: [
            {
              'src': 'statics/icons/icon-128x128.png',
              'sizes': '128x128',
              'type': 'image/png'
            },
            {
              'src': 'statics/icons/icon-192x192.png',
              'sizes': '192x192',
              'type': 'image/png'
            },
            {
              'src': 'statics/icons/icon-256x256.png',
              'sizes': '256x256',
              'type': 'image/png'
            },
            {
              'src': 'statics/icons/icon-384x384.png',
              'sizes': '384x384',
              'type': 'image/png'
            },
            {
              'src': 'statics/icons/icon-512x512.png',
              'sizes': '512x512',
              'type': 'image/png'
            }
          ]
        }
      },
      ssr: {
        pwa: true
      },
      starterKit: '1.0.2'
    }
  }
    
      WORKING:
              chain.module.rule('jest')
                .test(/\.jest$/)
                .resourceQuery(/blockType=test/)
                .include
                  .add(path.resolve(__dirname, 'src'))
                  .end()
                .use('jest')
                  .loader(require.resolve('./test/loaders/jest-loader.js'))
      
        chain.module.rule('lint')
          .test(/\.(js|vue)$/)
          .pre()
          .use('eslint')
            .loader('babel-loader')
            .loader('eslint-loader')
            .options({
              rules: {
                semi: 'off',
                'eol-last' :0
              },
              loaders: {
                'test': './test/loaders/jest-loader.js'
              }
            })      
            
        chain.module.rule('jest')
          .test(/\.jest$/)
          .use('jest')
            .loader(require.resolve('./test/loaders/jest-loader.js'))

```
