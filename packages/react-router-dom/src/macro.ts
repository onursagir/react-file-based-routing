import { createMacro, MacroError } from 'babel-plugin-macros';
import { addReactRouterDomSpecifier } from './add-react-router-dom-specifier';
import { addRouteImportsToFile } from './add-route-imports-to-file';
import { getReferenceProps } from './get-reference-props';
import { getRoutesAndSources } from './get-routes-and-sources';

module.exports = createMacro(({ babel, references, state }) => {
  const { types } = babel;

  references.default.forEach((reference) => {
    const props = getReferenceProps(reference);
    const { filename } = state.file.opts;

    if (filename == null) throw new MacroError('');

    const routesAndSource = getRoutesAndSources({
      originFile: filename,
      relativeTargetLocation: props.path,
    });

    babel.traverse(state.file.path.parent, {
      Program: (path) => {
        addRouteImportsToFile(path, routesAndSource);
        addReactRouterDomSpecifier(path);
      },
    });

    const routes = routesAndSource.map(
      ({ routerPath, importSpecifierName, targetRelativeToSource }, i) => {
        const routeComponentIdentifier = types.jsxIdentifier(importSpecifierName);
        const routeComponentOpeningElement = types.jsxOpeningElement(
          routeComponentIdentifier,
          [],
          true
        );
        const routeComponentElement = types.jsxElement(routeComponentOpeningElement, null, []);

        const routeIdentifier = types.jsxIdentifier('Route');
        const routeOpeningElement = types.jsxOpeningElement(
          routeIdentifier,
          [
            types.jsxAttribute(types.jsxIdentifier('key'), types.stringLiteral(String(i))),
            types.jsxAttribute(types.jsxIdentifier('path'), types.stringLiteral(routerPath)),
            types.jsxAttribute(
              types.jsxIdentifier('element'),
              types.jSXExpressionContainer(routeComponentElement)
            ),
          ],
          true
        );

        if (props.logRoutes)
          console.log(`ℹ️  Added route: /${routerPath} with component: ${targetRelativeToSource}`);

        return types.jsxElement(routeOpeningElement, null, []);
      }
    );

    if (types.isCallExpression(reference.parent))
      return reference.parentPath?.replaceWith(types.arrayExpression(routes));

    if (types.isJSXOpeningElement(reference.parent))
      return reference.parentPath?.parentPath?.replaceWith(types.arrayExpression(routes));

    throw new MacroError('Invalid reference');
  });
});
