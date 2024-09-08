export interface SpaceInfo {
  id: string;
  name: string;
  createdAt: Date;
  listQuantity: number;
  itemsQuantity: number;
  categoriesQuantity: number;
  membersQuantity: number;
}

export interface CategoryInfo {
  id: number;
  name: string;
  createdAt: Date;
  itemsQuantity: number;
  spaceId: string;
}

export interface ItemInfo {
  id: number;
  name: string;
  createdAt: Date;
  spaceId: string;
  listQuantity: number;
  category?: {
    id: number;
    name: string;
  };
}

export interface ListInfo {
  id: number;
  name: string;
  createdAt: Date;
  spaceId: string;
  itemsQuantity: number;
}

export interface ListItemInfo {
  spaceId: string;
  list: {
    id: number;
    name: string;
  };
  item: {
    id: number;
    name: string;
  };
  category?: {
    id: number;
    name: string;
  };
}
