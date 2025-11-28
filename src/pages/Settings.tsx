import { useState } from 'react';
import { Settings as SettingsIcon, User, Building, Database, Bell } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';

const Settings = () => {
  const { toast } = useToast();
  
  const [profile, setProfile] = useState({
    name: 'Admin',
    email: 'admin@pancong.com',
    phone: '081234567890',
  });

  const [business, setBusiness] = useState({
    name: 'UMKM Pancong Belokan',
    address: 'Jl. Belokan No. 123, Bandung',
    phone: '022-1234567',
  });

  const [notifications, setNotifications] = useState({
    lowStock: true,
    dailyReport: false,
    weeklyReport: true,
  });

  const handleSaveProfile = () => {
    toast({
      title: 'Berhasil',
      description: 'Profil berhasil diperbarui',
    });
  };

  const handleSaveBusiness = () => {
    toast({
      title: 'Berhasil',
      description: 'Informasi usaha berhasil diperbarui',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Pengaturan</h1>
        <p className="text-muted-foreground mt-1">Kelola pengaturan aplikasi</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList>
          <TabsTrigger value="profile" className="gap-2">
            <User className="w-4 h-4" />
            Profil
          </TabsTrigger>
          <TabsTrigger value="business" className="gap-2">
            <Building className="w-4 h-4" />
            Usaha
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2">
            <Bell className="w-4 h-4" />
            Notifikasi
          </TabsTrigger>
          <TabsTrigger value="database" className="gap-2">
            <Database className="w-4 h-4" />
            Database
          </TabsTrigger>
        </TabsList>

        {/* Profile Settings */}
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Pengaturan Profil
              </CardTitle>
              <CardDescription>
                Kelola informasi akun Anda
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nama</Label>
                <Input
                  id="name"
                  value={profile.name}
                  onChange={e => setProfile(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={profile.email}
                  onChange={e => setProfile(prev => ({ ...prev, email: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Nomor Telepon</Label>
                <Input
                  id="phone"
                  value={profile.phone}
                  onChange={e => setProfile(prev => ({ ...prev, phone: e.target.value }))}
                />
              </div>
              <Button onClick={handleSaveProfile}>Simpan Perubahan</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Business Settings */}
        <TabsContent value="business">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="w-5 h-5" />
                Informasi Usaha
              </CardTitle>
              <CardDescription>
                Kelola informasi usaha Anda
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="businessName">Nama Usaha</Label>
                <Input
                  id="businessName"
                  value={business.name}
                  onChange={e => setBusiness(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Alamat</Label>
                <Input
                  id="address"
                  value={business.address}
                  onChange={e => setBusiness(prev => ({ ...prev, address: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="businessPhone">Nomor Telepon</Label>
                <Input
                  id="businessPhone"
                  value={business.phone}
                  onChange={e => setBusiness(prev => ({ ...prev, phone: e.target.value }))}
                />
              </div>
              <Button onClick={handleSaveBusiness}>Simpan Perubahan</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Pengaturan Notifikasi
              </CardTitle>
              <CardDescription>
                Kelola preferensi notifikasi
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Peringatan Stok Menipis</Label>
                  <p className="text-sm text-muted-foreground">
                    Dapatkan notifikasi saat stok mencapai batas minimum
                  </p>
                </div>
                <Switch
                  checked={notifications.lowStock}
                  onCheckedChange={checked => setNotifications(prev => ({ ...prev, lowStock: checked }))}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Laporan Harian</Label>
                  <p className="text-sm text-muted-foreground">
                    Terima ringkasan transaksi harian
                  </p>
                </div>
                <Switch
                  checked={notifications.dailyReport}
                  onCheckedChange={checked => setNotifications(prev => ({ ...prev, dailyReport: checked }))}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Laporan Mingguan</Label>
                  <p className="text-sm text-muted-foreground">
                    Terima ringkasan transaksi mingguan
                  </p>
                </div>
                <Switch
                  checked={notifications.weeklyReport}
                  onCheckedChange={checked => setNotifications(prev => ({ ...prev, weeklyReport: checked }))}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Database Settings */}
        <TabsContent value="database">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5" />
                Koneksi Database
              </CardTitle>
              <CardDescription>
                Konfigurasi koneksi ke database MySQL
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 rounded-lg bg-muted/50 border border-border">
                <p className="text-sm text-muted-foreground mb-4">
                  Saat ini menggunakan <strong>Local Storage</strong> untuk menyimpan data.
                  <br />
                  Untuk mengintegrasikan dengan MySQL/Laravel backend:
                </p>
                <ol className="text-sm text-muted-foreground list-decimal list-inside space-y-2">
                  <li>Setup Laravel API dengan endpoint CRUD</li>
                  <li>Update file <code className="bg-muted px-1 rounded">src/services/api.ts</code></li>
                  <li>Ganti mock data dengan API calls</li>
                  <li>Configure CORS di Laravel</li>
                </ol>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="apiUrl">API Base URL (untuk integrasi nanti)</Label>
                <Input
                  id="apiUrl"
                  placeholder="http://localhost:8000/api"
                  disabled
                />
                <p className="text-xs text-muted-foreground">
                  Akan aktif setelah backend Laravel siap
                </p>
              </div>

              <Button disabled variant="outline">
                <Database className="w-4 h-4 mr-2" />
                Test Koneksi
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
