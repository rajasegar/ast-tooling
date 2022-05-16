'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = function (defaults) {
  let app = new EmberApp(defaults, {
    // Add options here
    autoImport: {
      alias: {
        recastBabel: 'recast/parsers/babel',
        recastBabylon: 'recast/parsers/babylon',
        recastFlow: 'recast/parsers/flow',
        recastTypeScript: 'recast/parsers/typescript',
      },
      webpack: {
        node: {
          path: true,
        },
      },
    },
    codemirror: {
      themes: ['solarized'],
      modes: ['javascript', 'handlebars'],
      addonFiles: [
        'fold/foldcode.js',
        'fold/foldgutter.js',
        'fold/foldgutter.css',
        'edit/matchbrackets.js',
        'fold/brace-fold.js',
      ],
    },
  });

  // Use `app.import` to add additional libraries to the generated
  // output files.
  //
  // If you need to use different assets in different
  // environments, specify an object as the first parameter. That
  // object's keys should be the environment name and the values
  // should be the asset to use in that environment.
  //
  // If the library that you are including contains AMD or ES6
  // modules that you would like to import into your application
  // please specify an object with the list of modules as keys
  // along with the exports of each module as its value.

  return app.toTree();
};
