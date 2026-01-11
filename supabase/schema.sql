-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create inventory_items table
CREATE TABLE IF NOT EXISTS inventory_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  unit VARCHAR(50) NOT NULL,
  current_stock DECIMAL(10, 2) NOT NULL DEFAULT 0,
  min_stock DECIMAL(10, 2) NOT NULL DEFAULT 0,
  price DECIMAL(12, 2) NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create stock_transactions table
CREATE TABLE IF NOT EXISTS stock_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  item_id UUID NOT NULL REFERENCES inventory_items(id) ON DELETE CASCADE,
  item_name VARCHAR(255) NOT NULL, -- Denormalized for historical records
  type VARCHAR(10) NOT NULL CHECK (type IN ('in', 'out')),
  quantity DECIMAL(10, 2) NOT NULL,
  notes TEXT,
  date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  created_by VARCHAR(255) NOT NULL DEFAULT 'Admin',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_inventory_items_category ON inventory_items(category);
CREATE INDEX IF NOT EXISTS idx_inventory_items_name ON inventory_items(name);
CREATE INDEX IF NOT EXISTS idx_stock_transactions_item_id ON stock_transactions(item_id);
CREATE INDEX IF NOT EXISTS idx_stock_transactions_type ON stock_transactions(type);
CREATE INDEX IF NOT EXISTS idx_stock_transactions_date ON stock_transactions(date DESC);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_inventory_items_updated_at
  BEFORE UPDATE ON inventory_items
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE inventory_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock_transactions ENABLE ROW LEVEL SECURITY;

-- Create policies for inventory_items (allow all operations for authenticated users)
-- For now, we'll allow all operations. In production, you may want to restrict based on user roles
CREATE POLICY "Allow all operations on inventory_items" ON inventory_items
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Create policies for stock_transactions (allow all operations for authenticated users)
CREATE POLICY "Allow all operations on stock_transactions" ON stock_transactions
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Optional: Create a view for low stock items
CREATE OR REPLACE VIEW low_stock_items AS
SELECT 
  id,
  name,
  category,
  unit,
  current_stock,
  min_stock,
  price,
  CASE 
    WHEN current_stock <= min_stock * 0.5 THEN 'danger'
    WHEN current_stock <= min_stock THEN 'warning'
    ELSE 'normal'
  END as status
FROM inventory_items
WHERE current_stock <= min_stock;

-- Optional: Create a function to get dashboard stats
CREATE OR REPLACE FUNCTION get_dashboard_stats()
RETURNS TABLE (
  total_items BIGINT,
  total_stock_in DECIMAL,
  total_stock_out DECIMAL,
  low_stock_count BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    (SELECT COUNT(*) FROM inventory_items)::BIGINT as total_items,
    (SELECT COALESCE(SUM(quantity), 0) FROM stock_transactions WHERE type = 'in') as total_stock_in,
    (SELECT COALESCE(SUM(quantity), 0) FROM stock_transactions WHERE type = 'out') as total_stock_out,
    (SELECT COUNT(*) FROM inventory_items WHERE current_stock <= min_stock)::BIGINT as low_stock_count;
END;
$$ LANGUAGE plpgsql;


