import pluginTester from 'babel-plugin-tester';
import macrosPlugin from 'babel-plugin-macros';

jest.mock('../get-routes-and-sources.ts', () => ({
  getRoutesAndSources: jest.fn().mockReturnValue([
    {
      routerPath: 'foo',
      importSpecifierName: 'foo',
      targetRelativeToSource: './dir/foo',
    },
    {
      routerPath: 'bar/baz',
      importSpecifierName: 'bar_baz',
      targetRelativeToSource: './dir/bar/baz',
    },
  ]),
}));

describe('macro.test.ts', () => {
  pluginTester({
    plugin: macrosPlugin,
    snapshot: true,
    babelOptions: { filename: __filename, presets: ['@babel/preset-react'] },
    tests: [
      `
        import { BrowserRouter, Routes } from 'react-router-dom';
        import FileBasedRouting from '../macro';

        const App = () => (
          <BrowserRouter>
              <FileBasedRouting path="./some/folder" />
          </BrowserRouter>
        );
      `,
      `
        import FileBasedRouting from '../macro';
        import { BrowserRouter, Routes } from 'react-router-dom';

        const App = () => React.createElement(BrowserRouter, null, React.createElement(FileBasedRouting, {
          path: "./some/folder"
        }));
      `,
    ],
  });
});
