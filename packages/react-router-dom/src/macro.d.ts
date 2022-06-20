/* eslint-disable @typescript-eslint/no-unused-vars */
import type { FC } from 'react';

declare module '@react-file-based-routing/react-router-dom/dist/macro' {
  export interface MacroProps {
    path: string;
    logRoutes?: boolean;
  }

  export = (props: MacroProps) => any;
}
