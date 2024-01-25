
export interface MenuItem {
  id?: number;
  label?: string;
  icon?: string;
  link?: any;
  expanded?: boolean;
  subItems?: any;
  isTitle?: boolean;
  badge?: any;
  parentId?: number;
}
