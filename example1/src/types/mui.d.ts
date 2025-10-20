import { Palette, PaletteOptions } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Palette {
    customColors: {
      dark: string;
      main: string;
      light: string;
      primaryGradient: string;
      bodyBg: string;
      trackBg: string;
      darkBg: string;
      lightBg: string;
      tableHeaderBg: string;
      navText: string;
      navHoverBg: string;
      navHoverText: string;
      navSelectedText: string;
      navSubMenuBg: string;
      navSelectedGradient: string;
    };
  }

  interface PaletteOptions {
    customColors?: {
      dark?: string;
      main?: string;
      light?: string;
      primaryGradient?: string;
      bodyBg?: string;
      trackBg?: string;
      darkBg?: string;
      lightBg?: string;
      tableHeaderBg?: string;
      navText?: string;
      navHoverBg?: string;
      navHoverText?: string;
      navSelectedText?: string;
      navSubMenuBg?: string;
      navSelectedGradient?: string;
    };
  }
}