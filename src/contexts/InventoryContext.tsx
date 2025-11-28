import React, { createContext, useContext, useState, ReactNode } from 'react';
import { InventoryItem, StockTransaction, DashboardStats } from '@/types/inventory';
import { mockInventoryItems, mockTransactions } from '@/data/mockData';

interface InventoryContextType {
  items: InventoryItem[];
  transactions: StockTransaction[];
  stats: DashboardStats;
  addItem: (item: Omit<InventoryItem, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateItem: (id: string, item: Partial<InventoryItem>) => void;
  deleteItem: (id: string) => void;
  addTransaction: (transaction: Omit<StockTransaction, 'id'>) => void;
  getItemById: (id: string) => InventoryItem | undefined;
}

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

export const InventoryProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<InventoryItem[]>(mockInventoryItems);
  const [transactions, setTransactions] = useState<StockTransaction[]>(mockTransactions);

  const stats: DashboardStats = {
    totalItems: items.length,
    totalStockIn: transactions.filter(t => t.type === 'in').reduce((sum, t) => sum + t.quantity, 0),
    totalStockOut: transactions.filter(t => t.type === 'out').reduce((sum, t) => sum + t.quantity, 0),
    lowStockCount: items.filter(item => item.currentStock <= item.minStock).length,
  };

  const addItem = (item: Omit<InventoryItem, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newItem: InventoryItem = {
      ...item,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setItems(prev => [...prev, newItem]);
  };

  const updateItem = (id: string, updates: Partial<InventoryItem>) => {
    setItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, ...updates, updatedAt: new Date() } : item
      )
    );
  };

  const deleteItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const addTransaction = (transaction: Omit<StockTransaction, 'id'>) => {
    const newTransaction: StockTransaction = {
      ...transaction,
      id: Date.now().toString(),
    };
    setTransactions(prev => [newTransaction, ...prev]);

    // Update item stock
    setItems(prev =>
      prev.map(item => {
        if (item.id === transaction.itemId) {
          const newStock =
            transaction.type === 'in'
              ? item.currentStock + transaction.quantity
              : item.currentStock - transaction.quantity;
          return { ...item, currentStock: Math.max(0, newStock), updatedAt: new Date() };
        }
        return item;
      })
    );
  };

  const getItemById = (id: string) => items.find(item => item.id === id);

  return (
    <InventoryContext.Provider
      value={{
        items,
        transactions,
        stats,
        addItem,
        updateItem,
        deleteItem,
        addTransaction,
        getItemById,
      }}
    >
      {children}
    </InventoryContext.Provider>
  );
};

export const useInventory = () => {
  const context = useContext(InventoryContext);
  if (!context) {
    throw new Error('useInventory must be used within an InventoryProvider');
  }
  return context;
};
