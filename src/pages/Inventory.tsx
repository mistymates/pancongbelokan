import { useState } from 'react';
import { Plus, Search, Edit, Trash2, Package } from 'lucide-react';
import { useInventory } from '@/contexts/InventoryContext';
import { getStockStatus } from '@/types/inventory';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { categories, units } from '@/data/mockData';
import { useToast } from '@/hooks/use-toast';

const Inventory = () => {
  const { items, addItem, updateItem, deleteItem } = useInventory();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<typeof items[0] | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    unit: '',
    currentStock: 0,
    minStock: 0,
    price: 0,
  });

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const resetForm = () => {
    setFormData({
      name: '',
      category: '',
      unit: '',
      currentStock: 0,
      minStock: 0,
      price: 0,
    });
  };

  const handleAdd = () => {
    if (!formData.name || !formData.category || !formData.unit) {
      toast({
        title: 'Error',
        description: 'Mohon lengkapi semua field yang diperlukan',
        variant: 'destructive',
      });
      return;
    }

    addItem(formData);
    toast({
      title: 'Berhasil',
      description: 'Item berhasil ditambahkan',
    });
    resetForm();
    setIsAddOpen(false);
  };

  const handleEdit = () => {
    if (!editingItem) return;

    updateItem(editingItem.id, formData);
    toast({
      title: 'Berhasil',
      description: 'Item berhasil diperbarui',
    });
    setIsEditOpen(false);
    setEditingItem(null);
    resetForm();
  };

  const handleDelete = () => {
    if (!deleteId) return;

    deleteItem(deleteId);
    toast({
      title: 'Berhasil',
      description: 'Item berhasil dihapus',
    });
    setDeleteId(null);
  };

  const openEditDialog = (item: typeof items[0]) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      category: item.category,
      unit: item.unit,
      currentStock: item.currentStock,
      minStock: item.minStock,
      price: item.price,
    });
    setIsEditOpen(true);
  };

  const ItemForm = ({ onSubmit, submitLabel }: { onSubmit: () => void; submitLabel: string }) => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nama Item</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
          placeholder="Masukkan nama item"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Kategori</Label>
          <Select
            value={formData.category}
            onValueChange={value => setFormData(prev => ({ ...prev, category: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Pilih kategori" />
            </SelectTrigger>
            <SelectContent>
              {categories.map(cat => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Satuan</Label>
          <Select
            value={formData.unit}
            onValueChange={value => setFormData(prev => ({ ...prev, unit: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Pilih satuan" />
            </SelectTrigger>
            <SelectContent>
              {units.map(unit => (
                <SelectItem key={unit} value={unit}>{unit}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="currentStock">Stok Saat Ini</Label>
          <Input
            id="currentStock"
            type="number"
            value={formData.currentStock}
            onChange={e => setFormData(prev => ({ ...prev, currentStock: Number(e.target.value) }))}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="minStock">Stok Minimum</Label>
          <Input
            id="minStock"
            type="number"
            value={formData.minStock}
            onChange={e => setFormData(prev => ({ ...prev, minStock: Number(e.target.value) }))}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="price">Harga (Rp)</Label>
          <Input
            id="price"
            type="number"
            value={formData.price}
            onChange={e => setFormData(prev => ({ ...prev, price: Number(e.target.value) }))}
          />
        </div>
      </div>

      <Button onClick={onSubmit} className="w-full">
        {submitLabel}
      </Button>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Inventaris</h1>
          <p className="text-muted-foreground mt-1">Kelola data bahan baku</p>
        </div>

        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="w-4 h-4 mr-2" />
              Tambah Item
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Tambah Item Baru</DialogTitle>
            </DialogHeader>
            <ItemForm onSubmit={handleAdd} submitLabel="Tambah Item" />
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Cari item atau kategori..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            Daftar Item ({filteredItems.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama Item</TableHead>
                  <TableHead>Kategori</TableHead>
                  <TableHead>Stok</TableHead>
                  <TableHead>Min. Stok</TableHead>
                  <TableHead>Harga</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredItems.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      Tidak ada item ditemukan
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredItems.map(item => {
                    const status = getStockStatus(item.currentStock, item.minStock);
                    return (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell>{item.category}</TableCell>
                        <TableCell>{item.currentStock} {item.unit}</TableCell>
                        <TableCell>{item.minStock} {item.unit}</TableCell>
                        <TableCell>Rp {item.price.toLocaleString('id-ID')}</TableCell>
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
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => openEditDialog(item)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setDeleteId(item.id)}
                            >
                              <Trash2 className="w-4 h-4 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Item</DialogTitle>
          </DialogHeader>
          <ItemForm onSubmit={handleEdit} submitLabel="Simpan Perubahan" />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Item?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak dapat dibatalkan. Item akan dihapus secara permanen.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Inventory;
