import { useState } from 'react';
import { ArrowUpFromLine, Minus, Calendar, AlertTriangle } from 'lucide-react';
import { useInventory } from '@/contexts/InventoryContext';
import { getStockStatus } from '@/types/inventory';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';

const StockOut = () => {
  const { items, transactions, addTransaction } = useInventory();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    itemId: '',
    quantity: 0,
    notes: '',
  });

  const stockOutTransactions = transactions.filter(t => t.type === 'out');
  const selectedItem = items.find(i => i.id === formData.itemId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.itemId || formData.quantity <= 0) {
      toast({
        title: 'Error',
        description: 'Pilih item dan masukkan jumlah yang valid',
        variant: 'destructive',
      });
      return;
    }

    const item = items.find(i => i.id === formData.itemId);
    if (!item) return;

    if (formData.quantity > item.currentStock) {
      toast({
        title: 'Error',
        description: 'Jumlah melebihi stok yang tersedia',
        variant: 'destructive',
      });
      return;
    }

    try {
      await addTransaction({
        itemId: formData.itemId,
        itemName: item.name,
        type: 'out',
        quantity: formData.quantity,
        notes: formData.notes,
        date: new Date(),
        createdBy: 'Admin',
      });

      toast({
        title: 'Berhasil',
        description: `Stok ${item.name} berhasil dikurangi`,
      });

      setFormData({ itemId: '', quantity: 0, notes: '' });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Gagal mengurangi stok. Silakan coba lagi.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Stok Keluar</h1>
        <p className="text-muted-foreground mt-1">Catat penggunaan stok bahan baku</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Form */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Minus className="w-5 h-5" />
              Kurangi Stok
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Pilih Item</Label>
                <Select
                  value={formData.itemId}
                  onValueChange={value => setFormData(prev => ({ ...prev, itemId: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih item..." />
                  </SelectTrigger>
                  <SelectContent>
                    {items.map(item => {
                      const status = getStockStatus(item.currentStock, item.minStock);
                      return (
                        <SelectItem key={item.id} value={item.id}>
                          <div className="flex items-center gap-2">
                            <span>{item.name}</span>
                            <span className="text-muted-foreground">
                              ({item.currentStock} {item.unit})
                            </span>
                            {status !== 'normal' && (
                              <AlertTriangle className="w-3 h-3 text-warning" />
                            )}
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>

              {selectedItem && (
                <Alert className={
                  getStockStatus(selectedItem.currentStock, selectedItem.minStock) === 'danger'
                    ? 'border-destructive/50 bg-destructive/10'
                    : getStockStatus(selectedItem.currentStock, selectedItem.minStock) === 'warning'
                    ? 'border-warning/50 bg-warning/10'
                    : ''
                }>
                  <AlertDescription>
                    Stok tersedia: <strong>{selectedItem.currentStock} {selectedItem.unit}</strong>
                    <br />
                    Stok minimum: {selectedItem.minStock} {selectedItem.unit}
                  </AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="quantity">Jumlah</Label>
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  max={selectedItem?.currentStock || undefined}
                  value={formData.quantity || ''}
                  onChange={e => setFormData(prev => ({ ...prev, quantity: Number(e.target.value) }))}
                  placeholder="Masukkan jumlah"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Catatan</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={e => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Contoh: Produksi pancong batch 1"
                  rows={3}
                />
              </div>

              <Button type="submit" className="w-full" variant="default">
                <ArrowUpFromLine className="w-4 h-4 mr-2" />
                Simpan Stok Keluar
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* History */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Calendar className="w-5 h-5" />
              Riwayat Stok Keluar
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tanggal</TableHead>
                    <TableHead>Item</TableHead>
                    <TableHead>Jumlah</TableHead>
                    <TableHead>Catatan</TableHead>
                    <TableHead>Oleh</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stockOutTransactions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                        Belum ada riwayat stok keluar
                      </TableCell>
                    </TableRow>
                  ) : (
                    stockOutTransactions.map(transaction => (
                      <TableRow key={transaction.id}>
                        <TableCell>
                          {transaction.date.toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </TableCell>
                        <TableCell className="font-medium">{transaction.itemName}</TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="bg-primary/20 text-primary">
                            -{transaction.quantity}
                          </Badge>
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
      </div>
    </div>
  );
};

export default StockOut;
