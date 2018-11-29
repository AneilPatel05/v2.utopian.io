# `@utopian/testing`
There are a number of things to be done that require developer interaction. 

1. `.babelrc` update
2. Addition of new webpack rules (if using `<test>` template in SFCs)
3. Manual copy of template folders.

## Features:
- new monorepo package "testing"
- simple inclusion of this package will bring in all peer dependencies
- electron version of beta vue-devtools


### Vue Dev-Tools
If you want to use the beta version of the electron vue-devtools (which Denjell highly recommends), you can add this line to your `/src/index.template.html`:
```
<script src="http://localhost:8098"></script>
```
To read more, see this: 

https://github.com/vuejs/vue-devtools/blob/master/shells/electron/README.md

## Test harnesses:
- Jest (Unit)
    - jasmine with added mocha/chai
    - @vue/test-utils
    - no console.log()
- webdriver (e2e)
    - phantom-js
    - testing-bot
    - selenium
- Quality, Security and Compliance
    - Lighthouse (PWA)
    - snyk (node module security)
    - fossa (license compliance)
    - yarn audit

### `<test>` templates in your SFC
Having everything in one place can help new developers become better acquainted with testing, and have one file to maintain (and be updated by the webpack server). These files are merely copied to the correct spec folder depending on the scope. You may have multiple tests in your file, i.e.:
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
    { loader: 'jest-loader',
      options: { 
        name: '[name].specs.js',
        outputPath: 'test/cypress/integration/',
        emitFile: true 
      } 
    },
    { loader: require.resolve('.test/loaders/test-jest-loader.js') },
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

To run jest tests across 
``` 
$ yarn test:jest
```

## e2e
e2e or integration testing needs to have a running server, because it seeks to make sure that the units of code are appropriately integrated with each other. So before you can run `e2e` you have to first run `yarn dev` in the root folder.

#### webdriver

To install selenium for your platform during development, run:
```bash
$ yarn selenium:install
```

Then to start the selenium server, run:
```bash
$ yarn selenium:start
```

Finally to execute the e2e tests: 
``` 
$ lerna run test:webdriver --stream
```

See http://webdriver.io/api.html 

## Quality, Security and Compliance

The application Lighthouse from Google can be run and configured directly from the command line. However, it should only be tested on a production type artefact - so don't even bother running it on a dev server. It will make you sad.

Other little nicenesses
- SNYK: https://snyk.io/docs/using-snyk/
- yarn audit
- licenses
