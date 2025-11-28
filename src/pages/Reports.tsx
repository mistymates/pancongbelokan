import { useState } from 'react';
import { FileText, Download, Filter, Calendar } from 'lucide-react';
import { useInventory } from '@/contexts/InventoryContext';
import { getStockStatus } from '@/types/inventory';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';

const Reports = () => {
  const { items, transactions } = useInventory();
  const { toast } = useToast();
  const [transactionFilter, setTransactionFilter] = useState<'all' | 'in' | 'out'>('all');

  const filteredTransactions = transactions.filter(t => {
    if (transactionFilter === 'all') return true;
    return t.type === transactionFilter;
  });

  const handleExport = (type: 'inventory' | 'transactions') => {
    // In production, this would generate a proper CSV/Excel file
    toast({
      title: 'Export',
      description: `Fitur export ${type === 'inventory' ? 'inventaris' : 'transaksi'} akan tersedia setelah integrasi backend`,
    });
  };

  // Calculate summary stats
  const totalValue = items.reduce((sum, item) => sum + item.price * item.currentStock, 0);
  const lowStockItems = items.filter(item => getStockStatus(item.currentStock, item.minStock) !== 'normal');
  const totalIn = transactions.filter(t => t.type === 'in').reduce((sum, t) => sum + t.quantity, 0);
  const totalOut = transactions.filter(t => t.type === 'out').reduce((sum, t) => sum + t.quantity, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Laporan</h1>
          <p className="text-muted-foreground mt-1">Ringkasan data inventaris dan transaksi</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Total Nilai Stok</p>
            <p className="text-xl font-bold text-foreground mt-1">
              Rp {totalValue.toLocaleString('id-ID')}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Total Item</p>
            <p className="text-xl font-bold text-foreground mt-1">{items.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Stok Masuk (Total)</p>
            <p className="text-xl font-bold text-success mt-1">+{totalIn}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Stok Keluar (Total)</p>
            <p className="text-xl font-bold text-primary mt-1">-{totalOut}</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="inventory" className="space-y-4">
        <TabsList>
          <TabsTrigger value="inventory">Laporan Stok</TabsTrigger>
          <TabsTrigger value="transactions">Riwayat Transaksi</TabsTrigger>
          <TabsTrigger value="lowstock">Stok Menipis</TabsTrigger>
        </TabsList>

        {/* Inventory Report */}
        <TabsContent value="inventory">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-base">
                <FileText className="w-5 h-5" />
                Laporan Stok Saat Ini
              </CardTitle>
              <Button variant="outline" size="sm" onClick={() => handleExport('inventory')}>
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>No</TableHead>
                      <TableHead>Nama Item</TableHead>
                      <TableHead>Kategori</TableHead>
                      <TableHead>Stok</TableHead>
                      <TableHead>Min. Stok</TableHead>
                      <TableHead>Harga Satuan</TableHead>
                      <TableHead>Total Nilai</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {items.map((item, index) => {
                      const status = getStockStatus(item.currentStock, item.minStock);
                      return (
                        <TableRow key={item.id}>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell className="font-medium">{item.name}</TableCell>
                          <TableCell>{item.category}</TableCell>
                          <TableCell>{item.currentStock} {item.unit}</TableCell>
                          <TableCell>{item.minStock} {item.unit}</TableCell>
                          <TableCell>Rp {item.price.toLocaleString('id-ID')}</TableCell>
                          <TableCell>Rp {(item.price * item.currentStock).toLocaleString('id-ID')}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                status === 'normal'
                                  ? 'default'
                                  : status === 'warning'
                                  ? 'secondary'
                                  : 'destructive'
                              }
                            >
                              {status === 'normal' ? 'Aman' : status === 'warning' ? 'Menipis' : 'Kritis'}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Transaction History */}
        <TabsContent value="transactions">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-base">
                <Calendar className="w-5 h-5" />
                Riwayat Transaksi
              </CardTitle>
              <div className="flex items-center gap-2">
                <Select
                  value={transactionFilter}
                  onValueChange={(value: 'all' | 'in' | 'out') => setTransactionFilter(value)}
                >
                  <SelectTrigger className="w-[150px]">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua</SelectItem>
                    <SelectItem value="in">Stok Masuk</SelectItem>
                    <SelectItem value="out">Stok Keluar</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="sm" onClick={() => handleExport('transactions')}>
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tanggal</TableHead>
                      <TableHead>Tipe</TableHead>
                      <TableHead>Item</TableHead>
                      <TableHead>Jumlah</TableHead>
                      <TableHead>Catatan</TableHead>
                      <TableHead>Oleh</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTransactions.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                          Tidak ada transaksi
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredTransactions.map(transaction => (
                        <TableRow key={transaction.id}>
                          <TableCell>
                            {transaction.date.toLocaleDateString('id-ID', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </TableCell>
                          <TableCell>
                            <Badge variant={transaction.type === 'in' ? 'default' : 'secondary'}>
                              {transaction.type === 'in' ? 'Masuk' : 'Keluar'}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-medium">{transaction.itemName}</TableCell>
                          <TableCell>
                            <span className={transaction.type === 'in' ? 'text-success' : 'text-primary'}>
                              {transaction.type === 'in' ? '+' : '-'}{transaction.quantity}
                            </span>
                          </TableCell>
                          <TableCell className="text-muted-foreground max-w-[200px] truncate">
                            {transaction.notes || '-'}
                          </TableCell>
                          <TableCell>{transaction.createdBy}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Low Stock Report */}
        <TabsContent value="lowstock">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <FileText className="w-5 h-5" />
                Item Stok Menipis ({lowStockItems.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {lowStockItems.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  Semua stok dalam kondisi aman
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nama Item</TableHead>
                        <TableHead>Kategori</TableHead>
                        <TableHead>Stok Saat Ini</TableHead>
                        <TableHead>Stok Minimum</TableHead>
                        <TableHead>Kekurangan</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {lowStockItems.map(item => {
                        const status = getStockStatus(item.currentStock, item.minStock);
                        const shortage = item.minStock - item.currentStock;
                        return (
                          <TableRow key={item.id}>
                            <TableCell className="font-medium">{item.name}</TableCell>
                            <TableCell>{item.category}</TableCell>
                            <TableCell>{item.currentStock} {item.unit}</TableCell>
                            <TableCell>{item.minStock} {item.unit}</TableCell>
                            <TableCell className="text-destructive">
                              {shortage > 0 ? `${shortage} ${item.unit}` : '-'}
                            </TableCell>
                            <TableCell>
                              <Badge variant={status === 'danger' ? 'destructive' : 'secondary'}>
                                {status === 'danger' ? 'Kritis' : 'Menipis'}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Reports;
