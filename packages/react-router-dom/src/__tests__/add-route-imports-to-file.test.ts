import { NodePath, types } from '@babel/core';
import pluginTester from 'babel-plugin-tester';
import { addRouteImportsToFile } from '../add-route-imports-to-file';

describe('foo', () => {
  pluginTester({
    plugin: () => ({
      visitor: {
        Program: (path: NodePath<types.Program>) =>
          addRouteImportsToFile(path, [
            {
              routerPath: '',
              importSpecifierName: 'foo',
              targetRelativeToSource: './dir/foo',
            },
            {
              routerPath: '',
              importSpecifierName: 'bar_baz',
              targetRelativeToSource: './dir/bar/baz',
            },
          ]),
      },
    }),
    babelOptions: { filename: __filename },
    tests: {
      'it should add route imports to file': {
        code: 'export default null',
        output: `
          import foo from './dir/foo';
          import bar_baz from './dir/bar/baz';
          export default null;
        `,
      },
    },
  });
});
