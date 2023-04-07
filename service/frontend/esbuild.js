#!/usr/bin/env node

const fs            = require('fs');
const esbuild       = require('esbuild');
const esbuildSvelte = require('esbuild-svelte');
const preprocess    = require('svelte-preprocess');
const glob          = require('fast-glob');

const entryPoints = glob.sync('./src/*.ts')
  .sort()
  .reduce((r, a) => ({
    ...r,
    ...(
      a.substr(0,1) == '.' ?
        { [a.substr(6).substr(0,a.length - 9)]: __dirname + '/' + a } :
        { [a]: __dirname + `/node_modules/${a}.ts` }
    )
  }), {})

const config = {
  format: 'cjs',
  target: ['chrome108','firefox107'],
  mainFields: ['svelte','browser','module','main'],
  bundle: true,
  outdir: __dirname + '/dist',
  entryPoints: Object.values(entryPoints),
  minify: false,
  plugins: [
    esbuildSvelte({
      preprocess: preprocess(),
    }),
  ],
};

const buildList = [];
const styles    = [];

esbuild
  .build(config)
  .then(() => {

    for(const name of Object.keys(entryPoints)) {
      buildList.push(`${name}.js`);
      try {
        fs.statSync(config.outdir + `/${name}.css`);
        styles.push(`${name}.css`);
      } catch(e) {
        // Intentionally empty
      }
    }

    fs.writeFileSync(config.outdir + `/index.html`, `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <style>
      * { box-sizing: border-box; }
      html, body { height: 100%; }
    </style>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/water.css@2/out/water.css">
    ${styles.map(name => `<link rel="stylesheet" href="${name}"/>`).join('\n    ')}
  </head>
  <body>
    ${buildList.map(name => `<script defer src="${name}"></script>`).join('\n    ')}
  </body>
</html>
`);

    // fs.writeFileSync(config.outdir + `/index.bundled.html`, `<!DOCTYPE html>
// <html>
  // <head>
    // <meta charset="utf-8">
    // <meta name="viewport" content="width=device-width,initial-scale=1">
    // <style>* { box-sizing: border-box; }</style>
    // ${styles.map(path => `<style type="text/css">${fs.readFileSync(`${config.outdir}/${path}`,'utf-8')}</style>`).join('\n    ')}
  // </head>
  // <body>
    // ${buildList.map(path => `<script type="text/javascript">${fs.readFileSync(`${config.outdir}/${path}`,'utf-8')}</script>`).join('\n    ')}
  // </body>
// </html>
// `);

  })




