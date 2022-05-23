import assert from 'assert';
import fs from 'fs';

import {parse } from 'ember-template-recast';
import { dispatchNodes } from '../src/glimmer';

describe('Glimmer Finder api', function() {
  it('should a generate an Element query', function() {
    const fixturePath = 'test/fixtures/glimmer/element';
    const inputFixture = `${fixturePath}.input.hbs`;
    const outputFixture = `${fixturePath}.output.js`;
    const input = fs.readFileSync(inputFixture, 'utf-8');
    const output = fs.readFileSync(outputFixture, 'utf-8');
    let ast = parse(input);

    let query =  dispatchNodes(ast).join('\n');

    assert.strictEqual(query, output);
  });

  it('should a generate a TextNode query', function() {
    const fixturePath = 'test/fixtures/glimmer/text';
    const inputFixture = `${fixturePath}.input.hbs`;
    const outputFixture = `${fixturePath}.output.js`;
    const input = fs.readFileSync(inputFixture, 'utf-8');
    const output = fs.readFileSync(outputFixture, 'utf-8');
    let ast = parse(input);

    let query =  dispatchNodes(ast).join('\n');

    assert.strictEqual(query, output);
  });

  it('should a generate a MustacheStatement query', function() {
    const fixturePath = 'test/fixtures/glimmer/mustache';
    const inputFixture = `${fixturePath}.input.hbs`;
    const outputFixture = `${fixturePath}.output.js`;
    const input = fs.readFileSync(inputFixture, 'utf-8');
    const output = fs.readFileSync(outputFixture, 'utf-8');
    let ast = parse(input);

    let query =  dispatchNodes(ast).join('\n');

    assert.strictEqual(query, output);
  });

  it('should a generate a BlockStatement query', function() {
    const fixturePath = 'test/fixtures/glimmer/block';
    const inputFixture = `${fixturePath}.input.hbs`;
    const outputFixture = `${fixturePath}.output.js`;
    const input = fs.readFileSync(inputFixture, 'utf-8');
    const output = fs.readFileSync(outputFixture, 'utf-8');
    let ast = parse(input);

    let query =  dispatchNodes(ast).join('\n');

    assert.strictEqual(query, output);
  });
});
