# phaser-ts-boilerplate
Instant Phaser games with TypeScript, WebPack and ES6.
This boilerplate has no `master` branch, but instead has `gh-pages` branch.

The boilerplate includes:
* Webpack configuration (dev AND production)
* Asset names are constants
* `phaser-shim` is set up (Phaser can be used as an ES6 module)
* Basic loading and title screens
* Window re-sizing logic and fullscreen

# Scripts

To start the Webpack dev server:

```bash
npm run dev
```

To upload game to Github pages:

```bash
npm run publish
```

The `package.json` file also contains `build` and `build-dev` scripts.