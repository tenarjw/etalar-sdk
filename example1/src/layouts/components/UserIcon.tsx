import { Icon, IconProps } from '@iconify/react';

const UserIcon = ({ icon, ...rest }: IconProps) => {
  return <Icon icon={icon} {...rest} />;
};

export default UserIcon;