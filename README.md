# Environments

The npm scripts use different environments.

Environment variable files needs to be created for each environment.
A file is named as

> .env.\${envName}

It's content needs to look like

```
VUE_APP_MODE=DEV_SERVE VUE_APP_API_URL=https://localhost:3000
```

| envName    | VUE_APP_MODE |                                                     description |
| :--------- | :----------: | --------------------------------------------------------------: |
| dev-serve  |  DEV_SERVE   |                      local dev page simulating the netflix page |
| dev-build  |  DEV_BUILD   | build to try the extension in local with the local back-end url |
| prod-build |  PROD_BUILD  |                                    build for the real extension |

# personal notes

- node-sass worked with node v12 but not node v15
  after switching to v12 and back to v15 it somehow works
  if the bug resurfaces switch to dart-sass https://sass-lang.com/dart-sass

- The most important thing to understand about using Tailwind with a preprocessor is that preprocessors like Sass, Less, and Stylus run separately, before Tailwind.
