import { types } from '@babel/core';
import { NodePath } from '@babel/traverse';
import { RoutesAndSources } from './get-routes-and-sources';

export const addRouteImportsToFile = (
  path: NodePath<types.Program>,
  importsAndRoutes: RoutesAndSources[]
) => {
  const importStatements = importsAndRoutes.map(({ importSpecifierName, targetRelativeToSource }) =>
    types.importDeclaration(
      [types.importDefaultSpecifier(types.identifier(importSpecifierName))],
      types.stringLiteral(targetRelativeToSource)
    )
  );

  path.unshiftContainer('body', importStatements);
};
