import { NodePath, types } from '@babel/core';
import { MacroError } from 'babel-plugin-macros';

interface Props {
  path: string;
  logRoutes?: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const validateProps = (props: Record<string, any>): props is Props => {
  if (!('path' in props)) throw new MacroError('Path prop is missing');

  return true;
};

const getPropsIfCallExpression = (reference: types.CallExpression): Props => {
  const propsExpression = reference.arguments[1];

  if (!types.isObjectExpression(propsExpression)) throw new MacroError('');

  const props = propsExpression.properties.reduce((acc, prop) => {
    if (!types.isObjectProperty(prop) || !types.isIdentifier(prop.key))
      throw new MacroError('Invalid prop passed');

    if (!types.isStringLiteral(prop.value) && !types.isBooleanLiteral(prop.value))
      throw new Error('Invalid prop passed');

    return {
      ...acc,
      [prop.key.name]: prop.value.value,
    };
  }, {});

  if (!validateProps(props)) throw new MacroError('Invalid props passed');

  return props;
};

const getPropsIfJSXOpeningElement = (reference: types.JSXOpeningElement): Props => {
  const props = reference.attributes.reduce((acc, attribute) => {
    if (
      !types.isJSXAttribute(attribute) ||
      !types.isJSXIdentifier(attribute.name) ||
      !types.isLiteral(attribute.value)
    )
      return acc;

    return {
      ...acc,
      [attribute.name.name]: attribute.value.value,
    };
  }, {});

  if (!validateProps(props)) throw new MacroError('Props are incomplete or invalid');

  return props;
};

export const getReferenceProps = (reference: NodePath<types.Node>): Props => {
  const parent = reference.parent;

  if (types.isCallExpression(parent)) return getPropsIfCallExpression(parent);

  if (types.isJSXOpeningElement(parent)) return getPropsIfJSXOpeningElement(parent);

  throw new MacroError('Invalid reference');
};
