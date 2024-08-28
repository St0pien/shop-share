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
  id: string;
  name: string;
  createdAt: Date;
  itemsQuantity: number;
}
