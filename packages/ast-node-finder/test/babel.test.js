import assert from 'assert';
import fs from 'fs';
import globby from 'globby';
import path from 'path';

import {parse } from 'recast';
import { babel } from '../src/index';

function parseWithBabel(source) {
  return parse(source, {
    parser: require('recast/parsers/babel')
  });
}

describe('Babel Finder api', function() {
  let fixtureDir = 'test/fixtures/babel';
  globby
    .sync('**/*.input.*', {
      cwd: fixtureDir,
    })
    .forEach(filename => {
      let extension = path.extname(filename);
      let testName = filename.replace(`.input${extension}`, '');
      let inputFixture = path.join(fixtureDir, `${testName}.input${extension}`);
      let outputFixture = path.join(fixtureDir, `${testName}.output${extension}`);
      it(testName, function() {

        const input = fs.readFileSync(inputFixture, 'utf-8');
        const output = fs.readFileSync(outputFixture, 'utf-8');
        let ast = parseWithBabel(input);

        let query =  babel.dispatchNodes(ast).join('\n');

        assert.strictEqual(query, output);
      });

    });

});
