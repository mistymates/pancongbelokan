import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { InventoryItem, StockTransaction, DashboardStats } from '@/types/inventory';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

interface InventoryContextType {
  items: InventoryItem[];
  transactions: StockTransaction[];
  stats: DashboardStats;
  isLoading: boolean;
  addItem: (item: Omit<InventoryItem, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateItem: (id: string, item: Partial<InventoryItem>) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
  addTransaction: (transaction: Omit<StockTransaction, 'id'>) => Promise<void>;
  getItemById: (id: string) => InventoryItem | undefined;
}

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

// Helper function to transform database row to InventoryItem
const transformInventoryItem = (row: any): InventoryItem => ({
  id: row.id,
  name: row.name,
  category: row.category,
  unit: row.unit,
  currentStock: Number(row.current_stock),
  minStock: Number(row.min_stock),
  price: Number(row.price),
  createdAt: new Date(row.created_at),
  updatedAt: new Date(row.updated_at),
});

// Helper function to transform database row to StockTransaction
const transformStockTransaction = (row: any): StockTransaction => ({
  id: row.id,
  itemId: row.item_id,
  itemName: row.item_name,
  type: row.type,
  quantity: Number(row.quantity),
  notes: row.notes || '',
  date: new Date(row.date),
  createdBy: row.created_by,
});

// Fetch inventory items
const fetchInventoryItems = async (): Promise<InventoryItem[]> => {
  try {
    // If Supabase is not configured, return empty array
    if (!isSupabaseConfigured() || !supabase) {
      console.warn('Supabase environment variables not set. Using empty data. Please configure your .env file.');
      return [];
    }

    const { data, error } = await supabase
      .from('inventory_items')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching inventory items:', error);
      return []; // Return empty array instead of throwing
    }
    return data?.map(transformInventoryItem) || [];
  } catch (error) {
    console.error('Unexpected error fetching inventory items:', error);
    return []; // Return empty array on any error
  }
};

// Fetch stock transactions
const fetchStockTransactions = async (): Promise<StockTransaction[]> => {
  try {
    // If Supabase is not configured, return empty array
    if (!isSupabaseConfigured() || !supabase) {
      console.warn('Supabase environment variables not set. Using empty data. Please configure your .env file.');
      return [];
    }

    const { data, error } = await supabase
      .from('stock_transactions')
      .select('*')
      .order('date', { ascending: false });

    if (error) {
      console.error('Error fetching stock transactions:', error);
      return []; // Return empty array instead of throwing
    }
    return data?.map(transformStockTransaction) || [];
  } catch (error) {
    console.error('Unexpected error fetching stock transactions:', error);
    return []; // Return empty array on any error
  }
};

export const InventoryProvider = ({ children }: { children: ReactNode }) => {
  const queryClient = useQueryClient();
  const isConfigured = isSupabaseConfigured();

  // Local state for when Supabase is not configured
  const [localItems, setLocalItems] = useState<InventoryItem[]>([]);
  const [localTransactions, setLocalTransactions] = useState<StockTransaction[]>([]);

  // Fetch inventory items (only if Supabase is configured)
  const { data: dbItems = [], isLoading: itemsLoading } = useQuery({
    queryKey: ['inventory-items'],
    queryFn: fetchInventoryItems,
    retry: false,
    enabled: isConfigured, // Only fetch if Supabase is configured
    onError: (error) => {
      console.error('Failed to fetch inventory items:', error);
    },
  });

  // Fetch stock transactions (only if Supabase is configured)
  const { data: dbTransactions = [], isLoading: transactionsLoading } = useQuery({
    queryKey: ['stock-transactions'],
    queryFn: fetchStockTransactions,
    retry: false,
    enabled: isConfigured, // Only fetch if Supabase is configured
    onError: (error) => {
      console.error('Failed to fetch stock transactions:', error);
    },
  });

  // Use database data if configured, otherwise use local state
  const items = isConfigured ? dbItems : localItems;
  const transactions = isConfigured ? dbTransactions : localTransactions;

  const isLoading = isConfigured ? (itemsLoading || transactionsLoading) : false;

  // Calculate stats
  const stats: DashboardStats = {
    totalItems: items.length,
    totalStockIn: transactions
      .filter(t => t.type === 'in')
      .reduce((sum, t) => sum + t.quantity, 0),
    totalStockOut: transactions
      .filter(t => t.type === 'out')
      .reduce((sum, t) => sum + t.quantity, 0),
    lowStockCount: items.filter(item => item.currentStock <= item.minStock).length,
  };

  // Add item mutation
  const addItemMutation = useMutation({
    mutationFn: async (item: Omit<InventoryItem, 'id' | 'createdAt' | 'updatedAt'>) => {
      if (!isSupabaseConfigured() || !supabase) {
        // Fallback to local state
        const newItem: InventoryItem = {
          ...item,
          id: Date.now().toString(),
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        setLocalItems(prev => [...prev, newItem]);
        return newItem;
      }

      const { data, error } = await supabase
        .from('inventory_items')
        .insert({
          name: item.name,
          category: item.category,
          unit: item.unit,
          current_stock: item.currentStock,
          min_stock: item.minStock,
          price: item.price,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      if (isConfigured) {
        queryClient.invalidateQueries({ queryKey: ['inventory-items'] });
      }
    },
  });

  // Update item mutation
  const updateItemMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<InventoryItem> }) => {
      if (!isSupabaseConfigured() || !supabase) {
        // Fallback to local state
        setLocalItems(prev =>
          prev.map(item =>
            item.id === id ? { ...item, ...updates, updatedAt: new Date() } : item
          )
        );
        return { id, ...updates };
      }

      const updateData: any = {};
      if (updates.name !== undefined) updateData.name = updates.name;
      if (updates.category !== undefined) updateData.category = updates.category;
      if (updates.unit !== undefined) updateData.unit = updates.unit;
      if (updates.currentStock !== undefined) updateData.current_stock = updates.currentStock;
      if (updates.minStock !== undefined) updateData.min_stock = updates.minStock;
      if (updates.price !== undefined) updateData.price = updates.price;

      const { data, error } = await supabase
        .from('inventory_items')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      if (isConfigured) {
        queryClient.invalidateQueries({ queryKey: ['inventory-items'] });
      }
    },
  });

  // Delete item 
  const deleteItemMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!isSupabaseConfigured() || !supabase) {
        // Fallback to local state
        setLocalItems(prev => prev.filter(item => item.id !== id));
        setLocalTransactions(prev => prev.filter(t => t.itemId !== id));
        return;
      }

      const { error } = await supabase
        .from('inventory_items')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      if (isConfigured) {
        queryClient.invalidateQueries({ queryKey: ['inventory-items'] });
        queryClient.invalidateQueries({ queryKey: ['stock-transactions'] });
      }
    },
  });

  // Add transaction mutation
  const addTransactionMutation = useMutation({
    mutationFn: async (transaction: Omit<StockTransaction, 'id'>) => {
      if (!isSupabaseConfigured() || !supabase) {
        // Fallback to local state
        const newTransaction: StockTransaction = {
          ...transaction,
          id: Date.now().toString(),
        };
        setLocalTransactions(prev => [newTransaction, ...prev]);

        // Update item stock in local state
        setLocalItems(prev =>
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

        return newTransaction;
      }

      // add the transaction
      const { data: transactionData, error: transactionError } = await supabase
        .from('stock_transactions')
        .insert({
          item_id: transaction.itemId,
          item_name: transaction.itemName,
          type: transaction.type,
          quantity: transaction.quantity,
          notes: transaction.notes || null,
          date: transaction.date.toISOString(),
          created_by: transaction.createdBy,
        })
        .select()
        .single();

      if (transactionError) throw transactionError;

      // update the item's stock
      const item = items.find(i => i.id === transaction.itemId);
      if (item) {
        const newStock =
          transaction.type === 'in'
            ? item.currentStock + transaction.quantity
            : item.currentStock - transaction.quantity;

        const { error: updateError } = await supabase
          .from('inventory_items')
          .update({ current_stock: Math.max(0, newStock) })
          .eq('id', transaction.itemId);

        if (updateError) throw updateError;
      }

      return transactionData;
    },
    onSuccess: () => {
      if (isConfigured) {
        queryClient.invalidateQueries({ queryKey: ['stock-transactions'] });
        queryClient.invalidateQueries({ queryKey: ['inventory-items'] });
      }
    },
  });

  const addItem = async (item: Omit<InventoryItem, 'id' | 'createdAt' | 'updatedAt'>) => {
    await addItemMutation.mutateAsync(item);
  };

  const updateItem = async (id: string, updates: Partial<InventoryItem>) => {
    await updateItemMutation.mutateAsync({ id, updates });
  };

  const deleteItem = async (id: string) => {
    await deleteItemMutation.mutateAsync(id);
  };

  const addTransaction = async (transaction: Omit<StockTransaction, 'id'>) => {
    await addTransactionMutation.mutateAsync(transaction);
  };

  const getItemById = (id: string) => items.find(item => item.id === id);

  return (
    <InventoryContext.Provider
      value={{
        items,
        transactions,
        stats,
        isLoading,
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
