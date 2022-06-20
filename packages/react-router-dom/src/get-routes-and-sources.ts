import path from 'path';
import { sync } from 'fast-glob';

interface Args {
  originFile: string;
  relativeTargetLocation: string;
}

export type RoutesAndSources = {
  routerPath: string;
  importSpecifierName: string;
  targetRelativeToSource: string;
};

export const getRoutesAndSources = ({
  originFile,
  relativeTargetLocation,
}: Args): RoutesAndSources[] => {
  const originDir = path.dirname(originFile);
  const targetDir = path.resolve(originDir, relativeTargetLocation);

  return sync(`${targetDir}/**/*`).map((file) => {
    const targetRelativeToSource = `./${path.relative(originDir, file)}`;
    const fileNameIsIndex = Boolean(file.match(/\/index\.([tj]s[x]?)?$/));

    let routerPath = targetRelativeToSource
      .replace(/(?:^.*?\/)(?:.*?\/)(.*)(?:\..*$)/, '$1')
      .replace(/\[(.*?)\]/g, (match) => `:${match.slice(1, -1)}`)
      .replace(/(:\.\.\..*?)(?=\/|$)/g, '*');

    if (fileNameIsIndex) routerPath = routerPath.replace(/(\/index|^index)$/, '');

    const importSpecifierName = `RFBR_${targetRelativeToSource
      .replace(/(?:^\.\/)(.*)(?:\.([tj]s[x]?)?$)/, '$1')
      .replace(/[/-]/g, '_')
      .replace(/[[\].]/g, '')}`;

    return {
      routerPath,
      importSpecifierName,
      targetRelativeToSource,
    };
  });
};
