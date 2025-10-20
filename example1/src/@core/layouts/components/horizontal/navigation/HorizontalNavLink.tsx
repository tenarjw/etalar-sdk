// ** React Imports
import { ElementType, Fragment } from 'react';

// ** Next Imports
import Link from 'next/link';
import { useRouter } from 'next/router';

// ** MUI Imports
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import List from '@mui/material/List';
import MuiListItem, { ListItemProps } from '@mui/material/ListItem';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import ListItemIcon from '@mui/material/ListItemIcon';

// ** Configs Imports
import themeConfig from 'src/configs/themeConfig';

// ** Types
import { NavLink, Settings } from 'src/@core/layouts/types'

// ** Custom Components Imports
import UserIcon from 'src/layouts/components/UserIcon'
import Translations from 'src/layouts/components/Translations'
import CanViewNavLink from 'src/layouts/components/acl/CanViewNavLink'

// ** Utils
import { handleURLQueries } from 'src/@core/layouts/utils';

/////////////////////

interface Props {
  item: NavLink;
  settings: Settings;
  hasParent: boolean;
}

const StyledListItem = styled(MuiListItem)<ListItemProps & { component?: ElementType; href: string; target?: '_blank' | undefined }>(
  ({ theme }) => ({
    width: 'auto',
    paddingTop: theme.spacing(2.25),
    paddingBottom: theme.spacing(2.25),
    color: theme.palette.customColors.navText,
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: theme.palette.customColors.navHoverBg,
      color: theme.palette.customColors.navHoverText,
      '& .MuiTypography-root, & .MuiListItemIcon-root': {
        color: theme.palette.customColors.navHoverText,
      },
    },
    '&.active': {
      color: theme.palette.customColors.navSelectedText,
      backgroundImage: theme.palette.customColors.navSelectedGradient,
      boxShadow: theme.shadows[3],
      '& .MuiTypography-root, & .MuiListItemIcon-root': {
        color: theme.palette.customColors.navSelectedText,
      },
    },
  })
);

const HorizontalNavLink = ({ item, settings, hasParent }: Props) => {
  const router = useRouter();
  const { menuTextTruncate } = themeConfig;

  const icon = item.icon || themeConfig.navSubItemIcon;
  const Wrapper = !hasParent ? List : Fragment;

  const isNavLinkActive = () => {
    if (router.pathname === item.path || handleURLQueries(router, item.path)) {
      return true;
    }
    return false;
  };

  return (
    <CanViewNavLink navLink={item}>
      <Wrapper {...(!hasParent ? { component: 'div', sx: { py: settings.skin === 'bordered' ? 2.625 : 2.75 } } : {})}>
        <StyledListItem
          component={Link}
          disabled={item.disabled}
          {...(item.disabled && { tabIndex: -1 })}
          className={isNavLinkActive() ? 'active' : ''}
          target={item.openInNewTab ? '_blank' : undefined}
          href={item.path === undefined ? '/' : `${item.path}`}
          onClick={e => {
            if (item.path === undefined) {
              e.preventDefault();
              e.stopPropagation();
            }
          }}
          sx={{
            ...(item.disabled ? { pointerEvents: 'none' } : {}),
            ...(!hasParent ? { px: 5.5, borderRadius: 3.5 } : { px: 5 }),
          }}
        >
          <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                ...(menuTextTruncate && { overflow: 'hidden' }),
              }}
            >
              <ListItemIcon sx={{ color: 'inherit', mr: hasParent ? 3 : 2.5 }}>
                <UserIcon icon={icon} fontSize={icon === themeConfig.navSubItemIcon ? '0.875rem' : '1.375rem'} />
              </ListItemIcon>
              <Typography {...(menuTextTruncate && { noWrap: true })}>
                <Translations text={item.title} />
              </Typography>
            </Box>
            {item.badgeContent && (
              <Chip
                label={item.badgeContent}
                color={item.badgeColor || 'primary'}
                sx={{
                  ml: 1.6,
                  height: 20,
                  fontWeight: 500,
                  '& .MuiChip-label': { px: 1.5, textTransform: 'capitalize' },
                }}
              />
            )}
          </Box>
        </StyledListItem>
      </Wrapper>
    </CanViewNavLink>
  );
};

export default HorizontalNavLink;