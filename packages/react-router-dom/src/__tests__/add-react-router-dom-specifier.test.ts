import { NodePath, types } from '@babel/core';
import pluginTester from 'babel-plugin-tester';
import { addReactRouterDomSpecifier } from '../add-react-router-dom-specifier';

describe('foo', () => {
  pluginTester({
    plugin: () => ({
      visitor: {
        Program: (path: NodePath<types.Program>) => addReactRouterDomSpecifier(path),
      },
    }),
    babelOptions: { filename: __filename },
    tests: {
      'it should add just the route specifier to the existing react-router-dom-import': {
        code: `
          import { BrowserRouter, Routes } from 'react-router-dom';
        `,
        output: `
          import { BrowserRouter, Routes, Route } from 'react-router-dom';
        `,
      },
      'it should add a complete import statement if react-router-dom import is not present': {
        code: `
          import someOtherModule from 'some-other-module';
        `,
        output: `
          import { Route } from 'react-router-dom';
          import someOtherModule from 'some-other-module';

        `,
      },
    },
  });
});
