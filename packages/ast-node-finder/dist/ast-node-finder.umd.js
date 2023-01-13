(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global["ast-node-finder"] = {}));
})(this, (function (exports) { 'use strict';

  var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

  var _templateObject = _taggedTemplateLiteral(['', ''], ['', '']);

  function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  /**
   * @class TemplateTag
   * @classdesc Consumes a pipeline of composable transformer plugins and produces a template tag.
   */
  var TemplateTag = function () {
    /**
     * constructs a template tag
     * @constructs TemplateTag
     * @param  {...Object} [...transformers] - an array or arguments list of transformers
     * @return {Function}                    - a template tag
     */
    function TemplateTag() {
      var _this = this;

      for (var _len = arguments.length, transformers = Array(_len), _key = 0; _key < _len; _key++) {
        transformers[_key] = arguments[_key];
      }

      _classCallCheck(this, TemplateTag);

      this.tag = function (strings) {
        for (var _len2 = arguments.length, expressions = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
          expressions[_key2 - 1] = arguments[_key2];
        }

        if (typeof strings === 'function') {
          // if the first argument passed is a function, assume it is a template tag and return
          // an intermediary tag that processes the template using the aforementioned tag, passing the
          // result to our tag
          return _this.interimTag.bind(_this, strings);
        }

        if (typeof strings === 'string') {
          // if the first argument passed is a string, just transform it
          return _this.transformEndResult(strings);
        }

        // else, return a transformed end result of processing the template with our tag
        strings = strings.map(_this.transformString.bind(_this));
        return _this.transformEndResult(strings.reduce(_this.processSubstitutions.bind(_this, expressions)));
      };

      // if first argument is an array, extrude it as a list of transformers
      if (transformers.length > 0 && Array.isArray(transformers[0])) {
        transformers = transformers[0];
      }

      // if any transformers are functions, this means they are not initiated - automatically initiate them
      this.transformers = transformers.map(function (transformer) {
        return typeof transformer === 'function' ? transformer() : transformer;
      });

      // return an ES2015 template tag
      return this.tag;
    }

    /**
     * Applies all transformers to a template literal tagged with this method.
     * If a function is passed as the first argument, assumes the function is a template tag
     * and applies it to the template, returning a template tag.
     * @param  {(Function|String|Array<String>)} strings        - Either a template tag or an array containing template strings separated by identifier
     * @param  {...*}                            ...expressions - Optional list of substitution values.
     * @return {(String|Function)}                              - Either an intermediary tag function or the results of processing the template.
     */


    _createClass(TemplateTag, [{
      key: 'interimTag',


      /**
       * An intermediary template tag that receives a template tag and passes the result of calling the template with the received
       * template tag to our own template tag.
       * @param  {Function}        nextTag          - the received template tag
       * @param  {Array<String>}   template         - the template to process
       * @param  {...*}            ...substitutions - `substitutions` is an array of all substitutions in the template
       * @return {*}                                - the final processed value
       */
      value: function interimTag(previousTag, template) {
        for (var _len3 = arguments.length, substitutions = Array(_len3 > 2 ? _len3 - 2 : 0), _key3 = 2; _key3 < _len3; _key3++) {
          substitutions[_key3 - 2] = arguments[_key3];
        }

        return this.tag(_templateObject, previousTag.apply(undefined, [template].concat(substitutions)));
      }

      /**
       * Performs bulk processing on the tagged template, transforming each substitution and then
       * concatenating the resulting values into a string.
       * @param  {Array<*>} substitutions - an array of all remaining substitutions present in this template
       * @param  {String}   resultSoFar   - this iteration's result string so far
       * @param  {String}   remainingPart - the template chunk after the current substitution
       * @return {String}                 - the result of joining this iteration's processed substitution with the result
       */

    }, {
      key: 'processSubstitutions',
      value: function processSubstitutions(substitutions, resultSoFar, remainingPart) {
        var substitution = this.transformSubstitution(substitutions.shift(), resultSoFar);
        return ''.concat(resultSoFar, substitution, remainingPart);
      }

      /**
       * Iterate through each transformer, applying the transformer's `onString` method to the template
       * strings before all substitutions are processed.
       * @param {String}  str - The input string
       * @return {String}     - The final results of processing each transformer
       */

    }, {
      key: 'transformString',
      value: function transformString(str) {
        var cb = function cb(res, transform) {
          return transform.onString ? transform.onString(res) : res;
        };
        return this.transformers.reduce(cb, str);
      }

      /**
       * When a substitution is encountered, iterates through each transformer and applies the transformer's
       * `onSubstitution` method to the substitution.
       * @param  {*}      substitution - The current substitution
       * @param  {String} resultSoFar  - The result up to and excluding this substitution.
       * @return {*}                   - The final result of applying all substitution transformations.
       */

    }, {
      key: 'transformSubstitution',
      value: function transformSubstitution(substitution, resultSoFar) {
        var cb = function cb(res, transform) {
          return transform.onSubstitution ? transform.onSubstitution(res, resultSoFar) : res;
        };
        return this.transformers.reduce(cb, substitution);
      }

      /**
       * Iterates through each transformer, applying the transformer's `onEndResult` method to the
       * template literal after all substitutions have finished processing.
       * @param  {String} endResult - The processed template, just before it is returned from the tag
       * @return {String}           - The final results of processing each transformer
       */

    }, {
      key: 'transformEndResult',
      value: function transformEndResult(endResult) {
        var cb = function cb(res, transform) {
          return transform.onEndResult ? transform.onEndResult(res) : res;
        };
        return this.transformers.reduce(cb, endResult);
      }
    }]);

    return TemplateTag;
  }();

  /**
   * TemplateTag transformer that trims whitespace on the end result of a tagged template
   * @param  {String} side = '' - The side of the string to trim. Can be 'start' or 'end' (alternatively 'left' or 'right')
   * @return {Object}           - a TemplateTag transformer
   */
  var trimResultTransformer = function trimResultTransformer() {
    var side = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    return {
      onEndResult: function onEndResult(endResult) {
        if (side === '') {
          return endResult.trim();
        }

        side = side.toLowerCase();

        if (side === 'start' || side === 'left') {
          return endResult.replace(/^\s*/, '');
        }

        if (side === 'end' || side === 'right') {
          return endResult.replace(/\s*$/, '');
        }

        throw new Error('Side not supported: ' + side);
      }
    };
  };

  function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

  /**
   * strips indentation from a template literal
   * @param  {String} type = 'initial' - whether to remove all indentation or just leading indentation. can be 'all' or 'initial'
   * @return {Object}                  - a TemplateTag transformer
   */
  var stripIndentTransformer = function stripIndentTransformer() {
    var type = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'initial';
    return {
      onEndResult: function onEndResult(endResult) {
        if (type === 'initial') {
          // remove the shortest leading indentation from each line
          var match = endResult.match(/^[^\S\n]*(?=\S)/gm);
          var indent = match && Math.min.apply(Math, _toConsumableArray(match.map(function (el) {
            return el.length;
          })));
          if (indent) {
            var regexp = new RegExp('^.{' + indent + '}', 'gm');
            return endResult.replace(regexp, '');
          }
          return endResult;
        }
        if (type === 'all') {
          // remove all indentation from each line
          return endResult.replace(/^[^\S\n]+/gm, '');
        }
        throw new Error('Unknown type: ' + type);
      }
    };
  };

  /**
   * Replaces tabs, newlines and spaces with the chosen value when they occur in sequences
   * @param  {(String|RegExp)} replaceWhat - the value or pattern that should be replaced
   * @param  {*}               replaceWith - the replacement value
   * @return {Object}                      - a TemplateTag transformer
   */
  var replaceResultTransformer = function replaceResultTransformer(replaceWhat, replaceWith) {
    return {
      onEndResult: function onEndResult(endResult) {
        if (replaceWhat == null || replaceWith == null) {
          throw new Error('replaceResultTransformer requires at least 2 arguments.');
        }
        return endResult.replace(replaceWhat, replaceWith);
      }
    };
  };

  var replaceSubstitutionTransformer = function replaceSubstitutionTransformer(replaceWhat, replaceWith) {
    return {
      onSubstitution: function onSubstitution(substitution, resultSoFar) {
        if (replaceWhat == null || replaceWith == null) {
          throw new Error('replaceSubstitutionTransformer requires at least 2 arguments.');
        }

        // Do not touch if null or undefined
        if (substitution == null) {
          return substitution;
        } else {
          return substitution.toString().replace(replaceWhat, replaceWith);
        }
      }
    };
  };

  var defaults = {
    separator: '',
    conjunction: '',
    serial: false
  };

  /**
   * Converts an array substitution to a string containing a list
   * @param  {String} [opts.separator = ''] - the character that separates each item
   * @param  {String} [opts.conjunction = '']  - replace the last separator with this
   * @param  {Boolean} [opts.serial = false] - include the separator before the conjunction? (Oxford comma use-case)
   *
   * @return {Object}                     - a TemplateTag transformer
   */
  var inlineArrayTransformer = function inlineArrayTransformer() {
    var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : defaults;
    return {
      onSubstitution: function onSubstitution(substitution, resultSoFar) {
        // only operate on arrays
        if (Array.isArray(substitution)) {
          var arrayLength = substitution.length;
          var separator = opts.separator;
          var conjunction = opts.conjunction;
          var serial = opts.serial;
          // join each item in the array into a string where each item is separated by separator
          // be sure to maintain indentation
          var indent = resultSoFar.match(/(\n?[^\S\n]+)$/);
          if (indent) {
            substitution = substitution.join(separator + indent[1]);
          } else {
            substitution = substitution.join(separator + ' ');
          }
          // if conjunction is set, replace the last separator with conjunction, but only if there is more than one substitution
          if (conjunction && arrayLength > 1) {
            var separatorIndex = substitution.lastIndexOf(separator);
            substitution = substitution.slice(0, separatorIndex) + (serial ? separator : '') + ' ' + conjunction + substitution.slice(separatorIndex + 1);
          }
        }
        return substitution;
      }
    };
  };

  var splitStringTransformer = function splitStringTransformer(splitBy) {
    return {
      onSubstitution: function onSubstitution(substitution, resultSoFar) {
        if (splitBy != null && typeof splitBy === 'string') {
          if (typeof substitution === 'string' && substitution.includes(splitBy)) {
            substitution = substitution.split(splitBy);
          }
        } else {
          throw new Error('You need to specify a string character to split by.');
        }
        return substitution;
      }
    };
  };

  var isValidValue = function isValidValue(x) {
    return x != null && !Number.isNaN(x) && typeof x !== 'boolean';
  };

  var removeNonPrintingValuesTransformer = function removeNonPrintingValuesTransformer() {
    return {
      onSubstitution: function onSubstitution(substitution) {
        if (Array.isArray(substitution)) {
          return substitution.filter(isValidValue);
        }
        if (isValidValue(substitution)) {
          return substitution;
        }
        return '';
      }
    };
  };

  new TemplateTag(inlineArrayTransformer({ separator: ',' }), stripIndentTransformer, trimResultTransformer);

  new TemplateTag(inlineArrayTransformer({ separator: ',', conjunction: 'and' }), stripIndentTransformer, trimResultTransformer);

  new TemplateTag(inlineArrayTransformer({ separator: ',', conjunction: 'or' }), stripIndentTransformer, trimResultTransformer);

  new TemplateTag(splitStringTransformer('\n'), removeNonPrintingValuesTransformer, inlineArrayTransformer, stripIndentTransformer, trimResultTransformer);

  new TemplateTag(splitStringTransformer('\n'), inlineArrayTransformer, stripIndentTransformer, trimResultTransformer, replaceSubstitutionTransformer(/&/g, '&amp;'), replaceSubstitutionTransformer(/</g, '&lt;'), replaceSubstitutionTransformer(/>/g, '&gt;'), replaceSubstitutionTransformer(/"/g, '&quot;'), replaceSubstitutionTransformer(/'/g, '&#x27;'), replaceSubstitutionTransformer(/`/g, '&#x60;'));

  new TemplateTag(replaceResultTransformer(/(?:\n(?:\s*))+/g, ' '), trimResultTransformer);

  new TemplateTag(replaceResultTransformer(/(?:\n\s*)/g, ''), trimResultTransformer);

  new TemplateTag(inlineArrayTransformer({ separator: ',' }), replaceResultTransformer(/(?:\s+)/g, ' '), trimResultTransformer);

  new TemplateTag(inlineArrayTransformer({ separator: ',', conjunction: 'or' }), replaceResultTransformer(/(?:\s+)/g, ' '), trimResultTransformer);

  new TemplateTag(inlineArrayTransformer({ separator: ',', conjunction: 'and' }), replaceResultTransformer(/(?:\s+)/g, ' '), trimResultTransformer);

  new TemplateTag(inlineArrayTransformer, stripIndentTransformer, trimResultTransformer);

  new TemplateTag(inlineArrayTransformer, replaceResultTransformer(/(?:\s+)/g, ' '), trimResultTransformer);

  var stripIndent = new TemplateTag(stripIndentTransformer, trimResultTransformer);

  new TemplateTag(stripIndentTransformer('all'), trimResultTransformer);

  // Build object query
  function objectQuery$1(node) {
      let str = '';
      switch (node.type) {
          case 'Identifier':
              str = `object: { name: '${node.name}' }`;
              break;
          case 'CallExpression':
              str = `object: { ${calleeQuery(node.callee)} }`;
              break;
          case 'MemberExpression':
              str = stripIndent `
      object: { ${objectQuery$1(node.object)} ,
        property: { name: '${node.property.name}' }
      }`;
              break;
          case 'ThisExpression':
              str = `object: { type: "ThisExpression" }`;
              break;
          default:
              console.log('objectQuery::object => ', node.type);
              break;
      }
      return str;
  }
  // Build callee query
  function calleeQuery(node) {
      let str = '';
      if (node.type === 'MemberExpression') {
          let { object, property } = node;
          let obj = '';
          let prop = '';
          obj = objectQuery$1(object);
          switch (property.type) {
              case 'Identifier':
                  prop = `property: { name: '${property.name}' }`;
                  break;
              default:
                  console.log('calleeQuery::property => ', property.type);
                  break;
          }
          str = stripIndent `callee: {
      ${obj},
      ${prop}
    }`;
      }
      else if (node.type === 'CallExpression') {
          str = ` ${calleeQuery(node.callee)} `;
      }
      else if (node.type === 'Identifier') {
          str = `callee: { name: '${node.name}' }`;
      }
      else {
          console.error('calleeQuery: ', node.type);
      }
      return str;
  }
  // Build memberExpression query
  function memberExpressionQuery$1(node) {
      let str = '';
      let { object, property } = node;
      let obj = '';
      let prop = '';
      obj = objectQuery$1(object);
      switch (property.type) {
          case 'Identifier':
              prop = `property: { name: '${property.name}' }`;
              break;
          default:
              console.log('buildMemberExpressionQuery::property => ', property.type);
              break;
      }
      str = `root.find(j.MemberExpression, {
    ${obj},
    ${prop}
    })`;
      return str;
  }
  // Build callExpression query
  function callExpressionQuery$1(node) {
      let str = '';
      const { arguments: args } = node;
      // Deliberately filtering out other argument nodes here
      let filteredArgs = args.filter((a) => ['Literal', 'Identifier'].includes(a.type));
      let _filter = filteredArgs.map((a, i) => {
          let temp = '';
          switch (a.type) {
              case 'Literal':
                  temp = `path.value.arguments[${i}].raw === '${a.raw.replace(/'/g, '')}'`;
                  break;
              case 'Identifier':
                  temp = `path.value.arguments[${i}].name === '${a.name}'`;
                  break;
              default:
                  console.log('callExpressionQuery::filter => ', a.type);
                  break;
          }
          return temp;
      }).join('\n  && ');
      if (filteredArgs.length > 0) {
          str = stripIndent `
  root.find(j.CallExpression, {
    ${calleeQuery(node.callee)}
  })
  .filter(path => {
    return ${_filter}
  })`;
      }
      else {
          str = stripIndent `
  root.find(j.CallExpression, {
    ${calleeQuery(node.callee)}
  })`;
      }
      return str;
  }
  function literalQuery$1(node) {
      let value = typeof node.value === 'string' ? `'${node.value}'` : node.value;
      return `root.find(j.Literal, { value: ${value} })`;
  }
  function variableDeclaratorQuery$1(node) {
      return `root.find(j.VariableDeclarator, {
  id: { name: '${node.id.name}' }
  });`;
  }
  function jsxElementQuery$1(node) {
      let str = `root.find(j.JSXElement, {
openingElement: { name: { name: '${node.openingElement.name.name}' }}
})`;
      return str;
  }
  function expressionStatementQuery$1(node) {
      let { expression } = node;
      let str = '';
      switch (expression.type) {
          case 'CallExpression':
              str = `root.find(j.ExpressionStatement, {
      expression: {
      ${calleeQuery(expression)}
      }
      })`;
              break;
          case 'MemberExpression':
              str = `root.find(j.ExpressionStatement, {
      expression: {
      ${calleeQuery(expression)}
      }
      })`;
              break;
          case 'JSXElement':
              str = `root.find(j.ExpressionStatement, {
expression: {
${jsxElementQuery$1(expression)}
}

})`;
              break;
          default:
              console.error('expressionStatementQuery => ', node.type);
      }
      return str;
  }
  // New Expression Query
  function newExpressionQuery$1(node) {
      let str = '';
      str = `root.find(j.NewExpression, {
  callee: { name: '${node.callee.name}' }
})`;
      return str;
  }
  // Import Declaration query
  function importDeclarationQuery$1(node) {
      let str = '';
      str = `root.find(j.ImportDeclaration, {
  source: ${node.source.raw}
})`;
      return str;
  }
  function exportDefaultDeclarationQuery$1(node) {
      let str = '';
      switch (node.declaration.type) {
          case 'CallExpression':
              str = `root.find(j.ExportDefaultDeclaration, {
  declaration: { ${calleeQuery(node.declaration.callee)} }
  })`;
              break;
          default:
              console.log('exportDefaultDeclaration => ', node.declaration.type);
      }
      return str;
  }
  function exportNamedDeclarationQuery$1(node) {
      let str = '';
      switch (node.declaration.type) {
          case 'CallExpression':
              str = `root.find(j.ExportNamedDeclaration, {
  declaration: { ${calleeQuery(node.declaration.callee)} }
  })`;
              break;
          case 'FunctionDeclaration':
              str = `root.find(j.ExportNamedDeclaration, {
declaration: { id: { name: '${node.declaration.id.name}' } }
  })`;
              break;
          default:
              console.log('exportNamedDeclaration => ', node.declaration.type);
      }
      return str;
  }
  function identifier$2(node) {
      let str = '';
      str = `root.find(j.Identifier, {
  name: '${node.name}'
  })`;
      return str;
  }
  function functionDeclaration$2(node) {
      let str = '';
      str = `root.find(j.FunctionDeclaration, {
  id: { name: '${node.id.name}' }
  })`;
      return str;
  }
  function assignmentExpression$2(node) {
      let { operator, left, right } = node;
      let str = '';
      let val = '';
      let _right = '';
      switch (right.type) {
          case 'Literal':
              val = typeof right.value === 'string' ? `'${right.value}'` : right.value;
              _right = `right: { value: ${val} }`;
              break;
          case 'Identifier':
              _right = `right: { name: '${right.name}' }`;
              break;
          case 'MemberExpression':
              _right = stripIndent `
      right: {
        ${objectQuery$1(right.object)},
        property: { name: '${right.property.name}' }
      }`;
              break;
          default:
              console.log('assignmentExpression => ', right.type);
              break;
      }
      str = stripIndent `
  root.find(j.AssignmentExpression, {
    operator: '${operator}',
    left: { name: '${left.name}' },
    ${_right}
  })
  `;
      return str;
  }

  var query = /*#__PURE__*/Object.freeze({
    __proto__: null,
    assignmentExpression: assignmentExpression$2,
    callExpressionQuery: callExpressionQuery$1,
    literalQuery: literalQuery$1,
    memberExpressionQuery: memberExpressionQuery$1,
    newExpressionQuery: newExpressionQuery$1,
    expressionStatementQuery: expressionStatementQuery$1,
    variableDeclaratorQuery: variableDeclaratorQuery$1,
    importDeclarationQuery: importDeclarationQuery$1,
    exportDefaultDeclarationQuery: exportDefaultDeclarationQuery$1,
    exportNamedDeclarationQuery: exportNamedDeclarationQuery$1,
    identifier: identifier$2,
    functionDeclaration: functionDeclaration$2,
    jsxElementQuery: jsxElementQuery$1
  });

  // Build object query
  function objectQuery(node) {
      let str = '';
      switch (node.type) {
          case 'Identifier':
              str = `object: { name: '${node.name}' }`;
              break;
          case 'CallExpression':
              str = `object: { ${callee(node.callee)} }`;
              break;
          case 'MemberExpression':
              str = stripIndent `
      object: { ${objectQuery(node.object)} ,
        property: { name: '${node.property.name}' }
      }`;
              break;
          case 'ThisExpression':
              str = `object: { type: "ThisExpression" }`;
              break;
          default:
              console.log('objectQuery::object => ', node.type);
              break;
      }
      return str;
  }
  // Build callee query
  function callee(node) {
      let str = '';
      if (node.type === 'MemberExpression') {
          let { object, property } = node;
          let obj = '';
          let prop = '';
          obj = objectQuery(object);
          switch (property.type) {
              case 'Identifier':
                  prop = `property: { name: '${property.name}' }`;
                  break;
              default:
                  console.log('calleeQuery::property => ', property.type);
                  break;
          }
          str = stripIndent `callee: {
      ${obj},
      ${prop}
    }`;
          //} else if (node.type === 'CallExpression') {
          //str = ` ${calleeQuery(node.callee)} `;
      }
      else if (node.type === 'Identifier') {
          str = `callee: { name: '${node.name}' }`;
      }
      else {
          console.error('Unknown node type in calleeQuery');
      }
      return str;
  }
  // Build memberExpression query
  function memberExpression(node) {
      let str = '';
      let { object, property } = node;
      let obj = '';
      let prop = '';
      obj = objectQuery(object);
      switch (property.type) {
          case 'Identifier':
              prop = `property: { name: '${property.name}' }`;
              break;
          default:
              console.log('buildMemberExpressionQuery::property => ', property.type);
              break;
      }
      str = `root.find(j.MemberExpression, {
    ${obj},
    ${prop}
    })`;
      return str;
  }
  // Build callExpression query
  function callExpression(node) {
      let str = '';
      const { arguments: args } = node;
      // Deliberately filtering out other argument nodes here
      let filteredArgs = args.filter((a) => ['Identifier'].includes(a.type));
      let _filter = filteredArgs.map((a, i) => {
          let temp = '';
          switch (a.type) {
              case 'Literal':
                  temp = `path.value.arguments[${i}].raw === '${a.raw.replace(/'/g, '')}'`;
                  break;
              case 'Identifier':
                  temp = `path.value.arguments[${i}].name === '${a.name}'`;
                  break;
              default:
                  console.log('callExpressionQuery::filter => ', a.type);
                  break;
          }
          return temp;
      }).join('\n  && ');
      if (filteredArgs.length > 0) {
          str = stripIndent `
  root.find(j.CallExpression, {
    ${callee(node.callee)}
  })
  .filter(path => {
    return ${_filter}
  })`;
      }
      else {
          str = stripIndent `
  root.find(j.CallExpression, {
    ${callee(node.callee)}
  })`;
      }
      return str;
  }
  function variableDeclarator(node) {
      return `root.find(j.VariableDeclarator, {
  id: { name: '${node.id.name}' }
  })`;
  }
  function expressionStatement(node) {
      let { expression } = node;
      let str = '';
      switch (expression.type) {
          case 'CallExpression':
              str = `root.find(j.ExpressionStatement, {
      expression: {
      ${callee(expression)}
      }
      })`;
              break;
          case 'MemberExpression':
              str = `root.find(j.ExpressionStatement, {
      expression: {
      ${callee(expression)}
      }
      })`;
              break;
      }
      return str;
  }
  // New Expression Query
  function newExpression(node) {
      let str = '';
      str = `root.find(j.NewExpression, {
  callee: { name: '${node.callee.name}' }
})`;
      return str;
  }
  // Import Declaration query
  function importDeclaration(node) {
      let str = '';
      str = `root.find(j.ImportDeclaration, {
  source: { value: '${node.source.value}' }
})`;
      return str;
  }
  function exportDefaultDeclaration(node) {
      let str = '';
      switch (node.declaration.type) {
          case 'CallExpression':
              str = `root.find(j.ExportDefaultDeclaration, {
  declaration: { ${callee(node.declaration.callee)} }
  })`;
              break;
          case 'ClassDeclaration':
              str = `root.find(j.ExportDefaultDeclaration, {
        declaration: {
          type: 'ClassDeclaration'
        }
      })`;
              break;
          default:
              console.log('exportDefaultDeclaration => ', node.declaration.type);
      }
      return str;
  }
  function identifier$1(node) {
      let str = '';
      str = `root.find(j.Identifier, {
  name: '${node.name}'
  })`;
      return str;
  }
  function functionDeclaration$1(node) {
      let str = '';
      str = `root.find(j.FunctionDeclaration, {
  id: { name: '${node.id.name}' }
  })`;
      return str;
  }
  function assignmentExpression$1(node) {
      let { operator, left, right } = node;
      let str = '';
      let val = '';
      let _right = '';
      switch (right.type) {
          case 'StringLiteral':
              val = `'${right.value}'`;
              _right = `right: { value: ${val} }`;
              break;
          case 'NumericLiteral':
              val = right.value;
              _right = `right: { value: ${val} }`;
              break;
          case 'BooleanLiteral':
              val = right.value;
              _right = `right: { value: ${val} }`;
              break;
          case 'Identifier':
              _right = `right: { name: '${right.name}' }`;
              break;
          case 'MemberExpression':
              _right = stripIndent `
      right: {
        ${objectQuery(right.object)},
        property: { name: '${right.property.name}' }
      }`;
              break;
          default:
              console.log('assignmentExpression => ', right.type);
              break;
      }
      str = stripIndent `
  root.find(j.AssignmentExpression, {
    operator: '${operator}',
    left: { name: '${left.name}' },
    ${_right}
  })
  `;
      return str;
  }
  function expressionQuery(node) {
      let str = '';
      switch (node.type) {
          case 'CallExpression':
              str = callExpression(node);
              break;
          case 'AssignmentExpression':
              str = assignmentExpression$1(node);
              break;
          case 'Identifier':
              str = identifier$1(node);
              break;
          case 'MemberExpression':
              str = memberExpression(node);
              break;
          case 'NewExpression':
              str = newExpression(node);
              break;
          default:
              console.log('expressionQuery => ', node.type);
              break;
      }
      return str;
  }
  function dispatchNodes$2(ast, wrapExpression = false) {
      let str = '';
      str = ast.program && ast.program.body.map((node) => {
          switch (node.type) {
              case 'ExpressionStatement':
                  return wrapExpression ? expressionStatement(node.expression) : expressionQuery(node.expression);
              case 'VariableDeclaration':
                  return variableDeclarator(node.declarations[0]);
              case 'ImportDeclaration':
                  return importDeclaration(node);
              case 'ExportDefaultDeclaration':
                  return exportDefaultDeclaration(node);
              case 'FunctionDeclaration':
                  return functionDeclaration$1(node);
              default:
                  console.log('Babel::dispatchNodes => ', node.type); // eslint-disable-line
                  return '';
          }
      });
      return str;
  }

  var babel = /*#__PURE__*/Object.freeze({
    __proto__: null,
    dispatchNodes: dispatchNodes$2
  });

  function textNode(transform) {
      let str = '';
      str = stripIndent `
  return {
    TextNode(node) {
      ${transform}
    }
  };`;
      return str;
  }
  function elementNode(node, transform) {
      let str = '';
      transform = transform || `node.tag = node.tag.split("").reverse().join("");`;
      str = stripIndent `
  return {
    ElementNode(node) {
      if(node.tag === '${node.tag}') {
        ${transform}
      }
    }
  };`;
      return str;
  }
  function blockStatement(node, transform) {
      let str = '';
      str = stripIndent `
  return {
    BlockStatement(node) {
      if(node.path.original === '${node.path.original}') {
        ${transform}
      }
    }
  };`;
      return str;
  }
  function mustacheStatement(node, transform) {
      let str = '';
      str = stripIndent `
  return {
    MustacheStatement(node) {
      if(node.path.original === '${node.path.original}') {
        ${transform}
      }
    }
  };`;
      return str;
  }
  function dispatchNodes$1(ast, transform = 'return node;') {
      // Build the Glimmer template api
      let _body = ast && ast.body ? ast.body : [];
      let _ast = _body.map((node) => {
          switch (node.type) {
              case "TextNode":
                  return textNode(transform);
              case "ElementNode":
                  return elementNode(node, transform);
              case "BlockStatement":
                  return blockStatement(node, transform);
              case 'MustacheStatement':
                  return mustacheStatement(node, transform);
              default:
                  console.log("dispatchNodes => ", node.type); // eslint-disable-line
          }
      });
      return _ast;
  }

  var glimmer = /*#__PURE__*/Object.freeze({
    __proto__: null,
    dispatchNodes: dispatchNodes$1
  });

  const { assignmentExpression, callExpressionQuery, memberExpressionQuery, literalQuery, newExpressionQuery, expressionStatementQuery, variableDeclaratorQuery, importDeclarationQuery, exportDefaultDeclarationQuery, exportNamedDeclarationQuery, identifier, functionDeclaration, jsxElementQuery, } = query;
  // Build the jscodeshift find query from nodes
  function findQuery(node) {
      let str = '';
      switch (node.type) {
          case 'CallExpression':
              str = callExpressionQuery(node);
              break;
          case 'MemberExpression':
              str = memberExpressionQuery(node);
              break;
          case 'Literal':
              str = literalQuery(node);
              break;
          case 'VariableDeclarator':
              str = variableDeclaratorQuery(node);
              break;
          case 'ExportDefaultDeclaration':
              str = exportDefaultDeclarationQuery(node);
              break;
          case 'ExportNamedDeclaration':
              str = exportNamedDeclarationQuery(node);
              break;
          case 'ExpressionStatement':
              str = expressionStatementQuery(node);
              break;
          case 'NewExpression':
              str = newExpressionQuery(node);
              break;
          case 'ImportDeclaration':
              str = importDeclarationQuery(node);
              break;
          case 'Identifier':
              str = identifier(node);
              break;
          case 'FunctionDeclaration':
              str = functionDeclaration(node);
              break;
          case 'AssignmentExpression':
              str = assignmentExpression(node);
              break;
          case 'JSXElement':
              str = jsxElementQuery(node);
              break;
          default:
              console.log('findQuery => ', node.type);
              break;
      }
      return str;
  }
  function dispatchNodes(ast) {
      let str = '';
      str = ast.program && ast.program.body.map((node) => {
          switch (node.type) {
              case 'ExpressionStatement':
                  return findQuery(node.expression);
              case 'VariableDeclaration':
                  return findQuery(node.declarations[0]);
              case 'ImportDeclaration':
                  return findQuery(node);
              case 'ExportDefaultDeclaration':
                  return findQuery(node);
              case 'FunctionDeclaration':
                  return findQuery(node);
              default:
                  console.log('dispatchNodes => ', node.type); // eslint-disable-line
                  return '';
          }
      });
      return str;
  }

  exports.babel = babel;
  exports.dispatchNodes = dispatchNodes;
  exports.findQuery = findQuery;
  exports.glimmer = glimmer;
  exports.query = query;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
