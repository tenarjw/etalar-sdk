import { HorizontalNavItemsType } from 'src/@core/layouts/types'

const navigation = (): HorizontalNavItemsType => {
  return (
    [
        {
          icon: 'mdi:home-outline',
          title: 'Katalog',
          externalLink: false,
          openInNewTab: false,
          path: '/home',
        },
        {
          title: 'Zapłata online',
          icon: 'mdi:lifebuoy',
          externalLink: false,
          openInNewTab: false,
          path:'/pay'
        } ,
        {
          title: 'Regulamin',
          icon: 'mdi:lifebuoy',
          externalLink: false,
          openInNewTab: true,
          path:'/regulamin_platnosci'
        }
      ]
  )
}

export default navigation
