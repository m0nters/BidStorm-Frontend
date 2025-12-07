export interface CategoryResponse {
  id: number;
  name: string;
  slug: string;
  parentId: number | null;
  children?: CategoryResponse[];
  createdAt: string;
  isParent: boolean;
  childrenCount: number;
}
