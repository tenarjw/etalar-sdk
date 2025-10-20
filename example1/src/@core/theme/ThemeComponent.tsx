
// !!!
// https://grok.com/share/bGVnYWN5LWNvcHk%3D_aa40b21a-198d-49dc-a37a-58939607e168

// ** React Imports
import { ReactNode, useState } from 'react'

// ** MUI Imports
import { deepmerge } from '@mui/utils'
import { Theme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import GlobalStyles from '@mui/material/GlobalStyles'
import { ThemeProvider, createTheme, responsiveFontSizes } from '@mui/material/styles'
import { ThemeProvider as StyledThemeProvider } from 'styled-components';

// ** Type Imports
import { Settings } from 'src/@core/context/settingsContext'

// ** Theme Config
import themeConfig from 'src/configs/themeConfig'

// ** Direction component for LTR or RTL
import Direction from 'src/layouts/components/Direction'

// ** Theme Override Imports
import overrides from './overrides'
import typography from './typography'

// ** Theme
import themeOptions from './ThemeOptions'
import UserThemeOptions from 'src/layouts/UserThemeOptions'

// ** Global Styles
import GlobalStyling from './globalStyles'

interface Props {
  settings: Settings
  children: ReactNode
}

const ThemeComponent = (props: Props) => {
  // ** Props
  const { settings, children } = props

  // ** Merged ThemeOptions of Core and User
  const coreThemeConfig = themeOptions(settings)


  // ** Pass ThemeOptions to CreateTheme Function to create partial theme without component overrides
  let theme = createTheme({...coreThemeConfig,
      /* zmiana wszystkich wielkosci czcionek */
      typography: {
          fontSize: settings.fontSize
        },
      })
  

  // ** Deep Merge Component overrides of core and user
  const mergeComponentOverrides = (theme: Theme, settings: Settings) =>
    deepmerge({ ...overrides(theme, settings) }, UserThemeOptions()?.components)

  // ** Deep Merge Typography of core and user
  const mergeTypography = (theme: Theme) => deepmerge(typography(theme), UserThemeOptions()?.typography)

  // ** Continue theme creation and pass merged component overrides to CreateTheme function
  theme = createTheme(theme, {
    components: { ...mergeComponentOverrides(theme, settings) },
    typography: { ...mergeTypography(theme) }
  })

  // ** Set responsive font sizes to true
  if (themeConfig.responsiveFontSizes) {
    theme = responsiveFontSizes(theme)
  }
  //alert(JSON.stringify(coreThemeConfig))
  return (
    <ThemeProvider theme={theme}>
      <StyledThemeProvider theme={theme}>
      <Direction direction={settings.direction}>
        <CssBaseline />
        <GlobalStyles styles={() => GlobalStyling(theme) as any} />
        {children}
      </Direction>
      </StyledThemeProvider>
    </ThemeProvider>
  )
}

export default ThemeComponent
