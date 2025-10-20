// ** MUI Imports
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Type Import
import { Settings } from 'src/@core/context/settingsContext'

// ** Components
import ModeToggler from 'src/@core/layouts/components/shared-components/ModeToggler'
import LanguageDropdown from 'src/@core/layouts/components/shared-components/LanguageDropdown'
import ShortcutsDropdown, { ShortcutsType } from 'src/@core/layouts/components/shared-components/ShortcutsDropdown'
import { Button, Grid, Link } from '@mui/material';


////////
import { useEffect, useState } from 'react';
import {useTranslation} from "react-i18next";

import Flag from 'react-flagkit'

import i18n from '../../../configs/i18n'

///////////

import getShortcuts from '../Shortcuts';

interface Props {
  hidden: boolean
  settings: Settings
  toggleNavVisibility: () => void
  saveSettings: (values: Settings) => void
}



const setLanguage = (lang : string) => {   i18n.changeLanguage(lang) }

const AppBarContent = (props: Props) => {
  // ** Props
  const { hidden, settings, saveSettings, toggleNavVisibility } = props
  const [langIcon, setLangIcon] = useState<any>(null);

  const {t, i18n} = useTranslation();

  useEffect(() => {
      console.log('language', i18n.language)
      if (i18n.language) {
          setLangIcon(() =>
          {
            if (i18n.language === 'pl') return  <Flag country="PL" />;
            else if (i18n.language === 'ua') return  <Flag country="UA" />;
            else return <Flag country="GB"/> ;
        })
      }
  }, [i18n, i18n.language])


  return (
    <>
    <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <Grid container spacing={2}>
        {hidden && !settings.navHidden ? (
        <Grid item xs={2} md={2}>
        <Box className='actions-left' sx={{ mr: 2, display: 'flex', alignItems: 'center' }}>
          <IconButton color='inherit' sx={{ ml: -2.75 }} onClick={toggleNavVisibility}>
            <Icon icon='mdi:menu' />
          </IconButton>
          </Box>
        </Grid>
        ) : null}
        <Grid item xs={10} md={4} >
        <Box className='actions-left' sx={{  ml: 1, display: 'flex', alignItems: 'left' }}>
        <Link href="/">
            LOGO
          </Link>
      </Box>
        </Grid>
        <Grid item xs={12} md={4} >
        <Box className='actions-right' width={"100%"} sx={{ mr:2, display: 'flex',
        alignItems: 'center' }}>
        <Box>
        </Box>
        { /* t('Browse') */ }
        {/* 
        <ModeToggler settings={settings} saveSettings={saveSettings} />
        */}
      </Box>
        </Grid>
        <Grid item xs={12} md={4} >
        <Box className='actions-right' sx={{ display: 'flex', alignItems: 'center' }}>
 
      </Box>
        </Grid>
      </Grid>

    </Box>
    </>
  )
}

export default AppBarContent
