import { MenuItem } from './menu.model';

export const MENU: MenuItem[] = [
  {
    label: 'Main',
    isTitle: true
  },
  {
    label: 'Dashboard',
    icon: 'home',
    link: '/dashboard'
  },
];


export const ADMIN: MenuItem[] = [
  {
    label: 'Admin',
    isTitle: true
  },
  {
    label: 'Syncronizar',
    icon: 'refresh-cw',
    link: '/sync',
  },
  {
    label: 'Usuários',
    icon: 'user-plus',
    link: '/users/register',
  },
  {
    label: 'Permissões',
    icon: 'table',
    link: '/permission',
  },
  {
    label: 'Contas',
    isTitle: true
  },
];

