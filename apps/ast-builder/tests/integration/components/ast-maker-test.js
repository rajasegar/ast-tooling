import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, findAll } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | ast-maker', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    await render(hbs`<AstMaker 
  @mode="javascript" 
  @code="foo.bar()"
  @parser="recast">
  </AstMaker>
`);

    assert.equal(findAll('.grid-col').length, 1);
  });
});
