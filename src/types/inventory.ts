export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  unit: string;
  currentStock: number;
  minStock: number;
  price: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface StockTransaction {
  id: string;
  itemId: string;
  itemName: string;
  type: 'in' | 'out';
  quantity: number;
  notes: string;
  date: Date;
  createdBy: string;
}

export interface DashboardStats {
  totalItems: number;
  totalStockIn: number;
  totalStockOut: number;
  lowStockCount: number;
}

export type StockStatus = 'normal' | 'warning' | 'danger';

export const getStockStatus = (current: number, min: number): StockStatus => {
  if (current <= min * 0.5) return 'danger';
  if (current <= min) return 'warning';
  return 'normal';
};
