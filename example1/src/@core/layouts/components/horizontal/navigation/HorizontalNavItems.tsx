// src/navigation/HorizontalNavItems.tsx

import HorizontalNavLink from './HorizontalNavLink';
import HorizontalNavGroup from './HorizontalNavGroup';
import { NavLink, NavGroup, 
       HorizontalNavItemsType, Settings } from  'src/@core/layouts/types'; 

interface Props {
  hasParent?: boolean;
  horizontalNavItems?: HorizontalNavItemsType;
  settings: Settings; // <-- Dodaj jawnie 'settings' do propsów
}

const resolveComponent = (item: NavGroup | NavLink) => {
  if ((item as NavGroup).children) return HorizontalNavGroup;
  return HorizontalNavLink;
};

const HorizontalNavItems = (props: Props) => {
  const { horizontalNavItems, settings } = props; // <-- Pobierz 'settings' z propsów

  const RenderMenuItems = horizontalNavItems?.map((item: NavGroup | NavLink, index: number) => {
    const TagName = resolveComponent(item) as any;
    
    // Przekazuj 'settings' jawnie do każdego dziecka
    return <TagName {...props} key={index} item={item} settings={settings} />;
  });

  return <>{RenderMenuItems}</>;
};

export default HorizontalNavItems;