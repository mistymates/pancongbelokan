import { useState } from 'react';
import { ArrowDownToLine, Plus, Calendar } from 'lucide-react';
import { useInventory } from '@/contexts/InventoryContext';
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
import { useToast } from '@/hooks/use-toast';

const StockIn = () => {
  const { items, transactions, addTransaction } = useInventory();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    itemId: '',
    quantity: 0,
    notes: '',
  });

  const stockInTransactions = transactions.filter(t => t.type === 'in');

  const handleSubmit = (e: React.FormEvent) => {
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

    addTransaction({
      itemId: formData.itemId,
      itemName: item.name,
      type: 'in',
      quantity: formData.quantity,
      notes: formData.notes,
      date: new Date(),
      createdBy: 'Admin',
    });

    toast({
      title: 'Berhasil',
      description: `Stok ${item.name} berhasil ditambahkan`,
    });

    setFormData({ itemId: '', quantity: 0, notes: '' });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Stok Masuk</h1>
        <p className="text-muted-foreground mt-1">Catat penambahan stok bahan baku</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Form */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Plus className="w-5 h-5" />
              Tambah Stok Masuk
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
                    {items.map(item => (
                      <SelectItem key={item.id} value={item.id}>
                        {item.name} ({item.currentStock} {item.unit})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="quantity">Jumlah</Label>
                <Input
                  id="quantity"
                  type="number"
                  min="1"
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
                  placeholder="Tambahkan catatan (opsional)"
                  rows={3}
                />
              </div>

              <Button type="submit" className="w-full">
                <ArrowDownToLine className="w-4 h-4 mr-2" />
                Simpan Stok Masuk
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* History */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Calendar className="w-5 h-5" />
              Riwayat Stok Masuk
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
                  {stockInTransactions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                        Belum ada riwayat stok masuk
                      </TableCell>
                    </TableRow>
                  ) : (
                    stockInTransactions.map(transaction => (
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
                          <Badge variant="default" className="bg-success/20 text-success">
                            +{transaction.quantity}
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

export default StockIn;
