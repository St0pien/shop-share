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
  categoryId: number;
  categoryName: string;
  spaceId: string;
  listQuantity: number;
}
