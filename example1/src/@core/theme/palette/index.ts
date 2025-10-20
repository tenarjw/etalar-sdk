// ** Type Imports
import { PaletteMode } from '@mui/material'
import { Skin, ThemeColor } from 'src/@core/layouts/types'

let primaryColor = '#8a2929'

let secondaryColor = '#edb65f'

const DefaultPalette = (mode: PaletteMode, skin: Skin, themeColor: ThemeColor) => {
  // ** Vars
  const whiteColor = '#ffffff'
  const lightColor = 'rgb(253, 255, 234)'
  const darkColor = 'rgba(189, 192, 185, 0.75)'
  const mainColor = mode === 'light' ? primaryColor : whiteColor

  const primaryGradient = () => {
    if (themeColor === 'primary') {
      return primaryColor //'#C6A7FE'
    } else if (themeColor === 'secondary') {
      return secondaryColor //'#9C9FA4'
    } else if (themeColor === 'success') {
      return '#93DD5C'
    } else if (themeColor === 'error') {
      return '#FF8C90'
    } else if (themeColor === 'warning') {
      return '#FFCF5C'
    } else {
      return '#6ACDFF'
    }
  }

  const defaultBgColor = () => {
    if (skin === 'bordered' && mode === 'light') {
      return whiteColor
    } else if (skin === 'bordered' && mode === 'dark') {
      return '#cda703'
    } else if (mode === 'light') {
      return '#fff9f1' // kolor background strony
    } else return '#aacc69'
  }

  return {
    typography: {
      useNextVariants: true,
      fontFamily: "Montserrat",
      h6: {
        color: mainColor,
      },
      h3: {
        fontSize: 33,
        fontFamily: "Montserrat",
        fontWeight: 300,
        color: mainColor,
        letterSpacing: "0.0075em",
        verticalAlign: "middle",
        alignItems: "center",
        textAlign: "center"
      }
    },
    customColors: {
      dark: darkColor,
      main: mainColor,
      light: lightColor,
      primaryGradient: primaryGradient(),
      bodyBg: mode === 'light' ? '#f4f9fa' : '#ffffff', // Same as palette.background.default but doesn't consider bordered skin
      trackBg: mode === 'light' ? '#F0F2F8' : '#474360',
      darkBg: skin === 'bordered' ? '#312D4B' : '#ffffff',
      lightBg: skin === 'bordered' ? whiteColor : '#f4f9fa',
      tableHeaderBg: mode === 'light' ? '#F9FAFC' : '#3D3759',
// menu
      navText: '#333333',                       // Domyślny kolor tekstu w menu
      navHoverBg: '#cda703',                     // Tło elementu menu po najechaniu
      navHoverText: '#FFFFFF',                   // Kolor tekstu po najechaniu
      navSelectedText: '#960303ff',                // Kolor tekstu dla aktywnego elementu
      navSubMenuBg: '#FFFFFF',                   // Tło dla rozwijanego podmenu
      // Gradient dla aktywnego elementu menu (używa kolorów głównych z palety)
      navSelectedGradient: 'linear-gradient(98deg, #dba00cff, #f5d992ff 94%)',


    },
    mode: mode,
    common: {
      black: '#000',
      white: whiteColor
    },
    primary: {
      light: '#eefd69ff',
      main: (mode === 'light')?primaryColor:'#010101', //(mode=='contrast')?whiteColor:((mode === 'light')?primaryColor:lightColor),
      dark: '#382d03ff',
      contrastText: whiteColor
    },
    secondary: {
      light: '#9C9FA4',
      main: secondaryColor,
      dark: '#777B82',
      contrastText: whiteColor
    },
    error: {
      light: '#FF6166',
      main: '#FF4C51',
      dark: '#E04347',
      contrastText: whiteColor
    },
    warning: {
      light: '#FFCA64',
      main: '#FFB400',
      dark: '#E09E00',
      contrastText: whiteColor
    },
    info: {
      light: '#32BAFF',
      main: '#16B1FF',
      dark: '#139CE0',
      contrastText: whiteColor
    },
    success: {
      light: '#6AD01F',
      main: '#56CA00',
      dark: '#4CB200',
      contrastText: whiteColor
    },
    grey: {
      50: '#FAFAFA',
      100: '#F5F5F5',
      200: '#EEEEEE',
      300: '#E0E0E0',
      400: '#BDBDBD',
      500: '#9E9E9E',
      600: '#757575',
      700: '#616161',
      800: '#424242',
      900: '#212121',
      A100: '#F5F5F5',
      A200: '#EEEEEE',
      A400: '#BDBDBD',
      A700: '#616161'
    },
    text: {
      primary: mainColor, 
      secondary: `rgba(${mainColor}, 0.6)`,
      disabled: `rgba(${mainColor}, 0.38)`
    },
    divider: `rgba(${mainColor}, 0.12)`,
    background: {
      paper: mode === 'light' ? whiteColor : '#312D4B',
      default: defaultBgColor()
    },
    action: {
      active: `rgba(${mainColor}, 0.54)`,
      hover: `rgba(${mainColor}, 0.04)`,
      selected: `rgba(${mainColor}, 0.08)`,
      disabled: `rgba(${mainColor}, 0.26)`,
      disabledBackground: `rgba(${mainColor}, 0.12)`,
      focus: `rgba(${mainColor}, 0.12)`
    }
  }
}

export default DefaultPalette
