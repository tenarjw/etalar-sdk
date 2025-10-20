// ** React Imports
import { Fragment, SyntheticEvent, useState, useEffect } from 'react';

// ** Next Import
import { useRouter } from 'next/router';

// ** MUI Imports
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Fade from '@mui/material/Fade';
import List from '@mui/material/List';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import ListItemIcon from '@mui/material/ListItemIcon';
import { styled, useTheme } from '@mui/material/styles';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import MuiListItem, { ListItemProps } from '@mui/material/ListItem';

// ** Third Party Imports
import clsx from 'clsx';
import { usePopper } from 'react-popper';

// ** Configs Imports
import themeConfig from 'src/configs/themeConfig';

// ** Types
import { NavGroup, Settings } from 'src/@core/layouts/types'

// ** Custom Components
import Icon from 'src/@core/components/icon'
// ** Custom Components Imports
import HorizontalNavItems from './HorizontalNavItems'
import UserIcon from 'src/layouts/components/UserIcon'
import Translations from 'src/layouts/components/Translations'
import CanViewNavGroup from 'src/layouts/components/acl/CanViewNavGroup'

// ** Utils
import { hasActiveChild } from 'src/@core/layouts/utils';

///////////////////////////////////////////

interface Props {
  item: NavGroup;
  settings: Settings;
  hasParent?: boolean;
}

// ** Styled Components
const ListItem = styled(MuiListItem)<ListItemProps>(({ theme }) => ({
  cursor: 'pointer',
  paddingTop: theme.spacing(2.25),
  paddingBottom: theme.spacing(2.25),
  color: theme.palette.customColors.navText,
  '&:hover': {
    backgroundColor: theme.palette.customColors.navHoverBg,
    color: theme.palette.customColors.navHoverText,
    '& .MuiTypography-root, & .MuiListItemIcon-root, & svg': {
      color: theme.palette.customColors.navHoverText,
    },
  },
}));

const NavigationMenu = styled(Paper)(({ theme }) => ({
  overflowY: 'auto',
  overflowX: 'hidden',
  padding: theme.spacing(2, 0),
  maxHeight: 'calc(100vh - 13rem)',
  backgroundColor: theme.palette.customColors.navSubMenuBg,
  ...(themeConfig.menuTextTruncate ? { width: 260 } : { minWidth: 260 }),
  '& > .MuiList-root': {
    paddingTop: 0,
    paddingBottom: 0,
  },
}));

const HorizontalNavGroup = (props: Props) => {
  const { item, hasParent, settings } = props;
  const theme = useTheme();
  const router = useRouter();
  const { skin, direction } = settings;
  const { navSubItemIcon, menuTextTruncate, horizontalMenuToggle, horizontalMenuAnimation } = themeConfig;

  const popperOffsetHorizontal = direction === 'rtl' ? 22 : -22;
  const popperPlacement = direction === 'rtl' ? 'bottom-end' : 'bottom-start';
  const popperPlacementSubMenu = direction === 'rtl' ? 'left-start' : 'right-start';

  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [popperElement, setPopperElement] = useState(null);
  const [anchorEl, setAnchorEl] = useState<Element | null>(null);
  const [referenceElement, setReferenceElement] = useState(null);

  const { styles, attributes, update } = usePopper(referenceElement, popperElement, {
    placement: hasParent ? popperPlacementSubMenu : popperPlacement,
    modifiers: [{ name: 'offset', options: { offset: hasParent ? [-8, 15] : [popperOffsetHorizontal, 5] } }],
  });

  const handleGroupOpen = (event: SyntheticEvent) => {
    setAnchorEl(event.currentTarget);
    setMenuOpen(true);
    update?.();
  };

  const handleGroupClose = () => {
    setAnchorEl(null);
    setMenuOpen(false);
  };

  const handleMenuToggleOnClick = (event: SyntheticEvent) => {
    if (anchorEl) {
      handleGroupClose();
    } else {
      handleGroupOpen(event);
    }
  };

  useEffect(() => {
    handleGroupClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.asPath]);

  const icon = item.icon || navSubItemIcon;
  const toggleIcon = direction === 'rtl' ? 'mdi:chevron-left' : 'mdi:chevron-right';

  const Wrapper = horizontalMenuToggle === 'click' ? ClickAwayListener : 'div';
  const WrapperProps = horizontalMenuToggle === 'click' ? { onClickAway: handleGroupClose } : { onMouseLeave: handleGroupClose };

  return (
    <CanViewNavGroup navGroup={item}>
      {/* @ts-ignore */}
      <Wrapper {...WrapperProps}>
        <Fragment>
          <List component='div' sx={{ py: skin === 'bordered' ? 2.625 : 2.75 }}>
            <ListItem
              aria-haspopup='true'
              onMouseEnter={handleGroupOpen}
              className={clsx('menu-group', { 'Mui-selected': hasActiveChild(item, router.asPath) })}
              {...(horizontalMenuToggle === 'click' ? { onClick: handleMenuToggleOnClick } : {})}
              sx={{
                ...(menuOpen ? { backgroundColor: 'action.hover' } : {}),
                ...(!hasParent
                  ? {
                      borderRadius: 3.5,
                      '&.Mui-selected': {
                        color: 'common.white',
                        backgroundImage: theme.palette.customColors.navSelectedGradient,
                        '& .MuiTypography-root, & .MuiListItemIcon-root, & svg': {
                          color: 'inherit',
                        },
                      },
                    }
                  : { px: 5 }),
              }}
            >
              <Box
                sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                ref={setReferenceElement}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    ...(menuTextTruncate && { overflow: 'hidden' }),
                  }}
                >
                  <ListItemIcon sx={{ color: 'inherit', mr: hasParent ? 3 : 2.5 }}>
                    <UserIcon icon={icon} fontSize={icon === navSubItemIcon ? '0.875rem' : '1.375rem'} />
                  </ListItemIcon>
                  <Typography {...(menuTextTruncate && { noWrap: true })}>
                    <Translations text={item.title} />
                  </Typography>
                </Box>
                <Box sx={{ ml: 1.6, display: 'flex', alignItems: 'center' }}>
                  {item.badgeContent && (
                    <Chip
                      label={item.badgeContent}
                      color={item.badgeColor || 'primary'}
                      sx={{ mr: 1.6, height: 20, fontWeight: 500, '& .MuiChip-label': { px: 1.5, textTransform: 'capitalize' } }}
                    />
                  )}
                  <Icon icon={hasParent ? toggleIcon : 'mdi:chevron-down'} />
                </Box>
              </Box>
            </ListItem>
          </List>
          <Fade in={menuOpen} timeout={{ exit: 300, enter: 400 }}>
            <Box
              style={styles.popper}
              ref={setPopperElement}
              {...attributes.popper}
              sx={{
                zIndex: theme.zIndex.appBar,
                ...(!horizontalMenuAnimation && { display: menuOpen ? 'block' : 'none' }),
                ...(hasParent ? { position: 'fixed !important' } : { pt: skin === 'bordered' ? 5.5 : 5.75 }),
              }}
            >
              <NavigationMenu
                sx={{
                  ...(hasParent ? { overflowY: 'auto', overflowX: 'visible', maxHeight: 'calc(100vh - 21rem)' } : {}),
                  ...(skin === 'bordered' ? { boxShadow: 0, border: `1px solid ${theme.palette.divider}` } : { boxShadow: 4 }),
                }}
              >
                <HorizontalNavItems {...props} hasParent horizontalNavItems={item.children} />
              </NavigationMenu>
            </Box>
          </Fade>
        </Fragment>
      </Wrapper>
    </CanViewNavGroup>
  );
};

export default HorizontalNavGroup;