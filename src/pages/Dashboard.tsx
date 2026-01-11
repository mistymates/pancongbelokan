import { 
  Package, 
  TrendingUp, 
  TrendingDown,
  AlertTriangle, 
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { useInventory } from '@/contexts/InventoryContext';
import { getStockStatus } from '@/types/inventory';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Dashboard = () => {
  const { items, transactions, stats, isLoading } = useInventory();

  // Prepare weekly chart data from transactions (last 7 days)
  const getLast7DaysData = () => {
    const days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      date.setHours(0, 0, 0, 0); // Reset to start of day
      return {
        date: new Date(date),
        dayName: date.toLocaleDateString('id-ID', { weekday: 'short' }),
        masuk: 0,
        keluar: 0,
      };
    });

    // Group transactions by day
    transactions.forEach(transaction => {
      const transactionDate = new Date(transaction.date);
      transactionDate.setHours(0, 0, 0, 0);
      
      const dayIndex = days.findIndex(day => {
        const dayDate = new Date(day.date);
        dayDate.setHours(0, 0, 0, 0);
        return dayDate.getTime() === transactionDate.getTime();
      });

      if (dayIndex !== -1) {
        if (transaction.type === 'in') {
          days[dayIndex].masuk += transaction.quantity;
        } else {
          days[dayIndex].keluar += transaction.quantity;
        }
      }
    });

    return days.map(day => ({
      name: day.dayName,
      masuk: day.masuk,
      keluar: day.keluar,
    }));
  };

  const chartData = getLast7DaysData();

  // Prepare trend data (last 6 weeks)
  const getTrendData = () => {
    const now = new Date();
    const weeks = Array.from({ length: 6 }, (_, i) => {
      // Calculate week start (Monday) for each of the last 6 weeks
      const weekStart = new Date(now);
      weekStart.setDate(now.getDate() - (5 - i) * 7);
      weekStart.setHours(0, 0, 0, 0);
      
      // Get Monday of that week
      const day = weekStart.getDay();
      const diff = weekStart.getDate() - day + (day === 0 ? -6 : 1);
      weekStart.setDate(diff);

      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      weekEnd.setHours(23, 59, 59, 999);

      return {
        weekStart: new Date(weekStart),
        weekEnd: new Date(weekEnd),
        weekNumber: 6 - i,
        value: 0,
      };
    });

    // Calculate total stock out (usage) for each week
    transactions.forEach(transaction => {
      if (transaction.type === 'out') {
        const transactionDate = new Date(transaction.date);
        
        weeks.forEach(week => {
          if (transactionDate >= week.weekStart && transactionDate <= week.weekEnd) {
            week.value += transaction.quantity;
          }
        });
      }
    });

    return weeks.map(week => ({
      name: `W${week.weekNumber}`,
      value: Math.round(week.value * 100) / 100, // Round to 2 decimal places
    }));
  };

  const trendData = getTrendData();

  const lowStockItems = items.filter(item => getStockStatus(item.currentStock, item.minStock) !== 'normal');
  const recentTransactions = transactions.slice(0, 5);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Memuat data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Selamat datang di Sistem Inventaris Pancong Belokan</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Total Item</span>
              <Package className="w-4 h-4 text-primary" />
            </div>
            <div className="text-2xl font-bold text-foreground">{stats.totalItems}</div>
            <div className="flex items-center gap-1 text-xs text-success mt-1">
              <ArrowUpRight className="w-3 h-3" />
              +3 minggu ini
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Stok Masuk</span>
              <TrendingUp className="w-4 h-4 text-success" />
            </div>
            <div className="text-2xl font-bold text-foreground">{stats.totalStockIn}</div>
            <div className="flex items-center gap-1 text-xs text-success mt-1">
              <ArrowUpRight className="w-3 h-3" />
              +12% dari kemarin
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Stok Keluar</span>
              <TrendingDown className="w-4 h-4 text-primary" />
            </div>
            <div className="text-2xl font-bold text-foreground">{stats.totalStockOut}</div>
            <div className="flex items-center gap-1 text-xs text-destructive mt-1">
              <ArrowDownRight className="w-3 h-3" />
              -5% dari kemarin
            </div>
          </CardContent>
        </Card>

        <Card className="bg-destructive/10 border-destructive/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Stok Menipis</span>
              <AlertTriangle className="w-4 h-4 text-destructive" />
            </div>
            <div className="text-2xl font-bold text-destructive">{stats.lowStockCount}</div>
            <div className="text-xs text-destructive mt-1">
              Perlu restock segera
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Aktivitas Stok Mingguan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48">
              {chartData.some(day => day.masuk > 0 || day.keluar > 0) ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false}
                      tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false}
                      tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                    />
                    <Bar dataKey="masuk" fill="hsl(var(--success))" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="keluar" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                  Belum ada aktivitas stok dalam 7 hari terakhir
                </div>
              )}
            </div>
            <div className="flex items-center justify-center gap-6 mt-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-success" />
                <span className="text-xs text-muted-foreground">Stok Masuk</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-primary" />
                <span className="text-xs text-muted-foreground">Stok Keluar</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Tren Pemakaian</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48">
              {trendData.some(week => week.value > 0) ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trendData}>
                    <defs>
                      <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false}
                      tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false}
                      tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="value" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={2}
                      fillOpacity={1} 
                      fill="url(#colorValue)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                  Belum ada data pemakaian dalam 6 minggu terakhir
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tables */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Low Stock Alert */}
        <Card>
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-base">Peringatan Stok Menipis</CardTitle>
            <Link to="/inventory">
              <Button variant="ghost" size="sm">Lihat Semua</Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {lowStockItems.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Semua stok dalam kondisi aman
                </p>
              ) : (
                lowStockItems.slice(0, 4).map(item => {
                  const status = getStockStatus(item.currentStock, item.minStock);
                  return (
                    <div key={item.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <div>
                        <p className="font-medium text-foreground">{item.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {item.currentStock} / {item.minStock} {item.unit}
                        </p>
                      </div>
                      <Badge variant={status === 'danger' ? 'destructive' : 'secondary'}>
                        {status === 'danger' ? 'Kritis' : 'Menipis'}
                      </Badge>
                    </div>
                  );
                })
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <Card>
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-base">Transaksi Terakhir</CardTitle>
            <Link to="/reports">
              <Button variant="ghost" size="sm">Lihat Semua</Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentTransactions.map(transaction => (
                <div key={transaction.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      transaction.type === 'in' ? 'bg-success/20' : 'bg-primary/20'
                    }`}>
                      {transaction.type === 'in' ? (
                        <ArrowDownRight className="w-4 h-4 text-success" />
                      ) : (
                        <ArrowUpRight className="w-4 h-4 text-primary" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{transaction.itemName}</p>
                      <p className="text-xs text-muted-foreground">
                        {transaction.date.toLocaleDateString('id-ID')}
                      </p>
                    </div>
                  </div>
                  <span className={`font-semibold ${
                    transaction.type === 'in' ? 'text-success' : 'text-primary'
                  }`}>
                    {transaction.type === 'in' ? '+' : '-'}{transaction.quantity}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
