import { types } from '@babel/core';
import { NodePath } from '@babel/traverse';

export const addReactRouterDomSpecifier = (path: NodePath<types.Program>) => {
  let addedSpecifier = false;
  let hasReactRouterDomImport = false;

  path.traverse({
    ImportDeclaration: (path) => {
      if (path.node.source.value !== 'react-router-dom' || addedSpecifier) return;

      hasReactRouterDomImport = true;

      const hasRouteImport = Object.values(path.node.specifiers).some(
        (specifier) =>
          types.isImportSpecifier(specifier) &&
          types.isIdentifier(specifier.imported) &&
          specifier.imported.name === 'Route'
      );

      if (hasRouteImport) return;

      path.node.specifiers.push(
        types.importSpecifier(types.identifier('Route'), types.identifier('Route'))
      );

      addedSpecifier = true;
    },
  });

  if (hasReactRouterDomImport) return;

  path.unshiftContainer(
    'body',
    types.importDeclaration(
      [types.importSpecifier(types.identifier('Route'), types.identifier('Route'))],
      types.stringLiteral('react-router-dom')
    )
  );
};
