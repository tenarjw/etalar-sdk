// ** React Imports
import { ReactNode } from 'react';
import { AppBarProps } from '@mui/material/AppBar';
import { SwipeableDrawerProps } from '@mui/material/SwipeableDrawer';
import { Theme, SxProps, Direction, PaletteMode } from '@mui/material';

// Typy z pliku settings
export type Skin = 'default' | 'bordered';
export type Mode = PaletteMode | 'semi-dark';
export type ContentWidth = 'full' | 'boxed';
export type AppBar = 'fixed' | 'static' | 'hidden';
export type Footer = 'fixed' | 'static' | 'hidden';
export type ThemeColor = 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success';
export type VerticalNavToggle = 'accordion' | 'collapse';
export type HorizontalMenuToggle = 'hover' | 'click'

// Typy nawigacji
export type NavSectionTitle = {
  action?: string;
  subject?: string;
  sectionTitle: string;
};

export type NavGroup = {
  icon?: string;
  title: string;
  action?: string;
  subject?: string;
  badgeContent?: string;
  children?: (NavGroup | NavLink)[];
  badgeColor?: 'default' | 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info';
};

export type NavLink = {
  icon?: string;
  path?: string;
  title: string;
  roles?: string[];
  //action?: string;
  //subject?: string;
  disabled?: boolean;
  badgeContent?: string;
  externalLink?: boolean;
  openInNewTab?: boolean;
  badgeColor?: 'default' | 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info';
};

export type VerticalNavItemsType = (NavLink | NavGroup | NavSectionTitle)[];
export type HorizontalNavItemsType = (NavLink | NavGroup)[];

// Typy ustawień (Settings)
export type Settings = {
  skin: Skin;
  mode: Mode;
  appBar?: AppBar;
  footer?: Footer;
  navHidden?: boolean;
  appBarBlur: boolean;
  direction: Direction;
  navCollapsed: boolean;
  themeColor: ThemeColor;
  contentWidth: ContentWidth;
  layout?: 'vertical' | 'horizontal';
  lastLayout?: 'vertical' | 'horizontal';
  verticalNavToggleType: VerticalNavToggle;
  toastPosition?: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
  fontSize: number;
  contrast: boolean;
};

// inne
export type BlankLayoutProps = {
  children: ReactNode
}

export type FooterProps = {
  sx?: SxProps<Theme>
  content?: (props?: any) => ReactNode
}

export type VerticalLayoutProps = {
  appBar?: {
    componentProps?: AppBarProps
    content?: (props?: any) => ReactNode
  }
  navMenu: {
    lockedIcon?: ReactNode
    unlockedIcon?: ReactNode
    navItems?: VerticalNavItemsType
    content?: (props?: any) => ReactNode
    branding?: (props?: any) => ReactNode
    afterContent?: (props?: any) => ReactNode
    beforeContent?: (props?: any) => ReactNode
    componentProps?: Omit<SwipeableDrawerProps, 'open' | 'onOpen' | 'onClose'>
  }
}

export type HorizontalLayoutProps = {
  appBar?: {
    componentProps?: AppBarProps
    content?: (props?: any) => ReactNode
    branding?: (props?: any) => ReactNode
  }
  navMenu?: {
    sx?: SxProps<Theme>
    navItems?: HorizontalNavItemsType
    content?: (props?: any) => ReactNode
  }
}

export type LayoutProps = {
  hidden: boolean
  settings: Settings
  children: ReactNode
  footerProps?: FooterProps
  contentHeightFixed?: boolean
  scrollToTop?: (props?: any) => ReactNode
  saveSettings: (values: Settings) => void
  verticalLayoutProps: VerticalLayoutProps
  horizontalLayoutProps?: HorizontalLayoutProps
}

