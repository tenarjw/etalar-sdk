import { ShortcutsType } from 'src/@core/layouts/components/shared-components/ShortcutsDropdown'
import {useTranslation} from "react-i18next";

function getShortcuts(){
  const {t, i18n} = useTranslation();
  const shortcuts: ShortcutsType[] = [
    {
      title: t('Correspondence'),
      url: '/documents',
      subtitle: t("with the Admin"),
      icon: 'mdi:receipt-text-outline'
    },
    {
      title: t('Calendar'),
      url: '/calendar',
      subtitle: t('Events & Schedule'),
      icon: 'mdi:account-outline'
    },
    {
      title: t('Passwords'),
      url: '/password',
      subtitle: t('Password Manager'),
      icon: 'mdi:account-outline'
    }
  ]

  return (shortcuts)
}

export default getShortcuts;