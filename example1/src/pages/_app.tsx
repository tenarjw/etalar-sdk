// ** Next Imports
import Head from 'next/head'
import { Router } from 'next/router'
import type { NextPage } from 'next'
import type { AppProps } from 'next/app'

// ** Store Imports
import { store } from 'src/store'
import { Provider } from 'react-redux'

// ** Loader Import
import NProgress from 'nprogress'

// i18n
import i18n from 'src/configs/i18n'; // (needs to be bundled ;))
import { I18nextProvider } from 'react-i18next';


// ** Config Imports
import themeConfig from 'src/configs/themeConfig'

import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

// ** Component Imports
import UserLayout from 'src/layouts/UserLayout'
import AclGuard from 'src/@core/components/auth/AclGuard' // bez tego nie ma menu
import ThemeComponent from 'src/@core/theme/ThemeComponent'
import WindowWrapper from 'src/@core/components/window-wrapper' // stopka i nagłówek

// ** Contexts
import { AuthProvider } from 'src/context/AuthContext'
import { SettingsConsumer, SettingsProvider } from 'src/@core/context/settingsContext'

// ** Prismjs Styles
import 'prismjs'
import 'prismjs/themes/prism-tomorrow.css'
import 'prismjs/components/prism-jsx'
import 'prismjs/components/prism-tsx'

// ** React Perfect Scrollbar Style
import 'react-perfect-scrollbar/dist/css/styles.css'

// ** Global css styles
import '../../styles/globals.css'

import React from 'react'


// ** Extend App Props with Emotion
type ExtendedAppProps = AppProps & {
  Component: NextPage
  //emotionCache: EmotionCache
}

// ** Pace Loader
if (themeConfig.routingLoader) {
  Router.events.on('routeChangeStart', () => {
    NProgress.start()
  })
  Router.events.on('routeChangeError', () => {
    NProgress.done()
  })
  Router.events.on('routeChangeComplete', () => {
    NProgress.done()
  })
}


// ** Configure JSS & ClassName
const App = (props: ExtendedAppProps) => {
  const { Component,  pageProps } = props

  // Variables
  const contentHeightFixed = Component.contentHeightFixed ?? false
  const getLayout =
    Component.getLayout ?? (page => <UserLayout contentHeightFixed={contentHeightFixed}>{page}</UserLayout>)

  const setConfig = Component.setConfig ?? undefined

  const guestGuard = Component.guestGuard ?? false

  const pageRoles = Component.roles ?? [] // Użyj nowej właściwości z next.d.ts
  

  return (
    <Provider store={store}>
      <I18nextProvider i18n={i18n as any}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
       <Head>
          <title>{`${themeConfig.templateName}`}</title>
          <meta
            name='description'
            content={`${themeConfig.templateName} `}
          />
          <meta name='keywords' content='Rezerwacje' />
          <meta name='viewport' content='initial-scale=1, width=device-width' />

        </Head>


        <AuthProvider>
          <SettingsProvider {...(setConfig ? { pageSettings: setConfig() } : {})}>
            <SettingsConsumer>
              {({ settings }) => {
                return (
                  <ThemeComponent settings={settings}>
                    <WindowWrapper>
                        <AclGuard pageRoles={pageRoles} guestGuard={guestGuard}>
                          {getLayout(<Component {...pageProps} />)}
                        </AclGuard>
                    </WindowWrapper>
                   </ThemeComponent>
                )
              }}
            </SettingsConsumer>
          </SettingsProvider>
        </AuthProvider>
        </LocalizationProvider>
      </I18nextProvider>
    </Provider>
  )
}

export default App


