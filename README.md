## Tech Stack
- Vite
- React
- TypeScript
- shadcn-ui
- Tailwind CSS
- Supabase (Database)
- React Query (Data Fetching)

## Getting Started

### 1. Clone the repository
```sh
git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>
```

### 2. Install dependencies
```sh
npm install
```

### 3. Set up Supabase
1. buat file .env
2. isi env:
```sh
VITE_SUPABASE_URL=https://ijomtgpsdhebsyhcmoyh.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlqb210Z3BzZGhlYnN5aGNtb3loIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjczMzE5MDUsImV4cCI6MjA4MjkwNzkwNX0.ZYHvxfTsJheigxpNQv6KMmio9lY7BKYjX3cZAxsiMJ4
```

### 4. Start the development server
```sh
npm run dev
```

## Build for production
```sh
npm run build
```

## Preview production build
```sh
npm run preview
```

## Dokumentasi Halaman

Aplikasi ini terdiri dari beberapa halaman utama untuk mengelola inventaris bahan baku. Berikut penjelasan fungsi setiap halaman:

### 📊 Dashboard (`/`)
Halaman utama yang menampilkan ringkasan dan statistik inventaris.

**Fitur:**
- **Statistik Cards**: Menampilkan total item, total stok masuk, total stok keluar, dan jumlah item dengan stok menipis
- **Aktivitas Stok Mingguan**: Grafik batang (bar chart) yang menampilkan aktivitas stok masuk dan keluar dalam 7 hari terakhir
- **Tren Pemakaian**: Grafik area yang menampilkan tren penggunaan stok dalam 6 minggu terakhir
- **Peringatan Stok Menipis**: Daftar item yang stoknya sudah mencapai atau di bawah batas minimum
- **Transaksi Terakhir**: Daftar 5 transaksi terbaru (stok masuk/keluar)

**Kegunaan**: Memberikan gambaran cepat tentang kondisi inventaris dan aktivitas transaksi.

---

### 📦 Inventaris (`/inventory`)
Halaman untuk mengelola data item inventaris (bahan baku).

**Fitur:**
- **Daftar Item**: Tabel yang menampilkan semua item dengan informasi:
  - Nama item
  - Kategori
  - Stok saat ini dan stok minimum
  - Harga per satuan
  - Status stok (Aman/Menipis/Kritis)
- **Tambah Item**: Form untuk menambahkan item baru dengan field:
  - Nama item
  - Kategori (Bahan Utama, Bahan Tambahan, Bumbu, Kemasan, Peralatan)
  - Satuan (kg, gram, liter, ml, butir, pcs, pack)
  - Stok saat ini
  - Stok minimum
  - Harga
- **Edit Item**: Form untuk mengubah informasi item yang sudah ada
- **Hapus Item**: Fitur untuk menghapus item dari inventaris
- **Pencarian**: Fitur search untuk mencari item berdasarkan nama atau kategori

**Kegunaan**: Mengelola master data bahan baku yang digunakan dalam produksi.

---

### ⬇️ Stok Masuk (`/stock-in`)
Halaman untuk mencatat penambahan stok bahan baku.

**Fitur:**
- **Form Stok Masuk**: Form untuk mencatat stok masuk dengan field:
  - Pilih item (dropdown dari daftar item yang ada)
  - Jumlah stok yang masuk
  - Catatan (opsional, misalnya: "Pembelian dari supplier X")
- **Riwayat Stok Masuk**: Tabel yang menampilkan semua transaksi stok masuk dengan informasi:
  - Tanggal transaksi
  - Nama item
  - Jumlah yang ditambahkan
  - Catatan
  - Dibuat oleh

**Kegunaan**: Mencatat setiap kali ada penambahan stok, misalnya dari pembelian atau produksi.

---

### ⬆️ Stok Keluar (`/stock-out`)
Halaman untuk mencatat pengurangan stok bahan baku.

**Fitur:**
- **Form Stok Keluar**: Form untuk mencatat penggunaan stok dengan field:
  - Pilih item (dengan indikator stok tersedia)
  - Jumlah stok yang digunakan
  - Catatan (opsional, misalnya: "Produksi pancong batch 1")
- **Peringatan Stok**: Alert yang menampilkan informasi stok tersedia dan stok minimum saat memilih item
- **Validasi**: Sistem mencegah pengurangan stok melebihi stok yang tersedia
- **Riwayat Stok Keluar**: Tabel yang menampilkan semua transaksi stok keluar

**Kegunaan**: Mencatat setiap kali stok digunakan, misalnya untuk produksi atau penjualan.

---

### 📈 Laporan (`/reports`)
Halaman untuk melihat laporan dan analisis data inventaris.

**Fitur:**
- **Summary Cards**: Ringkasan statistik:
  - Total nilai stok (harga × stok)
  - Total item
  - Total stok masuk
  - Total stok keluar
- **Tab Laporan Stok**: Tabel lengkap semua item dengan:
  - Informasi lengkap setiap item
  - Total nilai per item (harga × stok)
  - Status stok
- **Tab Riwayat Transaksi**: Tabel semua transaksi dengan filter:
  - Semua transaksi
  - Hanya stok masuk
  - Hanya stok keluar
- **Tab Stok Menipis**: Daftar item yang stoknya di bawah batas minimum dengan informasi:
  - Stok saat ini vs stok minimum
  - Jumlah kekurangan
  - Status (Menipis/Kritis)
- **Export**: Fitur untuk export data (akan tersedia setelah integrasi backend)

**Kegunaan**: Menganalisis data inventaris, melihat tren penggunaan, dan mengidentifikasi item yang perlu restock.

---

### ⚙️ Pengaturan (`/settings`)
Halaman untuk mengelola pengaturan aplikasi.

**Fitur:**
- **Tab Profil**: Pengaturan informasi akun pengguna:
  - Nama
  - Email
  - Nomor telepon
- **Tab Usaha**: Informasi tentang usaha:
  - Nama usaha
  - Alamat
  - Nomor telepon
- **Tab Notifikasi**: Pengaturan preferensi notifikasi:
  - Peringatan stok menipis
  - Laporan harian
  - Laporan mingguan
- **Tab Database**: Informasi tentang koneksi database:
  - Status koneksi (saat ini menggunakan Supabase)
  - Konfigurasi untuk integrasi backend (jika diperlukan)

**Kegunaan**: Mengelola konfigurasi aplikasi dan preferensi pengguna.

---

## Activity Diagram

Berikut adalah activity diagram untuk setiap fitur utama dalam aplikasi:

### 1. Tambah Item Baru

```mermaid
flowchart TD
    A[User membuka halaman Inventaris] --> B[Klik tombol Tambah Item]
    B --> C[Dialog form terbuka]
    C --> D[User mengisi form]
    D --> E{Validasi form}
    E -->|Form tidak lengkap| F[Tampilkan error toast]
    F --> D
    E -->|Form lengkap| G[Submit form]
    G --> H{Check Supabase configured?}
    H -->|Ya| I[Insert ke Supabase]
    H -->|Tidak| J[Simpan ke local state]
    I --> K{Success?}
    K -->|Ya| L[Tampilkan success toast]
    K -->|Tidak| M[Tampilkan error toast]
    M --> D
    J --> L
    L --> N[Refresh daftar item]
    N --> O[Tutup dialog]
    O --> P[Selesai]
```

### 2. Edit Item

```mermaid
flowchart TD
    A[User melihat daftar item] --> B[Klik tombol Edit]
    B --> C[Dialog edit terbuka]
    C --> D[Form terisi dengan data item]
    D --> E[User mengubah data]
    E --> F[User klik Simpan]
    F --> G{Validasi form}
    G -->|Tidak valid| H[Tampilkan error toast]
    H --> E
    G -->|Valid| I{Check Supabase configured?}
    I -->|Ya| J[Update ke Supabase]
    I -->|Tidak| K[Update local state]
    J --> L{Success?}
    L -->|Ya| M[Tampilkan success toast]
    L -->|Tidak| N[Tampilkan error toast]
    N --> E
    K --> M
    M --> O[Refresh daftar item]
    O --> P[Tutup dialog]
    P --> Q[Selesai]
```

### 3. Hapus Item

```mermaid
flowchart TD
    A[User melihat daftar item] --> B[Klik tombol Hapus]
    B --> C[Alert dialog konfirmasi muncul]
    C --> D{User konfirmasi?}
    D -->|Batal| E[Tutup dialog]
    E --> F[Selesai]
    D -->|Hapus| G{Check Supabase configured?}
    G -->|Ya| H[Delete dari Supabase]
    G -->|Tidak| I[Hapus dari local state]
    H --> J{Success?}
    J -->|Ya| K[Tampilkan success toast]
    J -->|Tidak| L[Tampilkan error toast]
    L --> F
    I --> K
    K --> M[Refresh daftar item]
    M --> N[Selesai]
```

### 4. Stok Masuk

```mermaid
flowchart TD
    A[User membuka halaman Stok Masuk] --> B[Pilih item dari dropdown]
    B --> C[Input jumlah stok masuk]
    C --> D[Input catatan opsional]
    D --> E[Klik Simpan Stok Masuk]
    E --> F{Validasi input}
    F -->|Jumlah <= 0| G[Tampilkan error toast]
    G --> C
    F -->|Valid| H{Check Supabase configured?}
    H -->|Ya| I[Insert transaksi ke Supabase]
    H -->|Tidak| J[Simpan transaksi ke local state]
    I --> K{Success?}
    K -->|Ya| L[Update stok item di Supabase]
    K -->|Tidak| M[Tampilkan error toast]
    M --> C
    J --> N[Update stok item di local state]
    L --> O{Update success?}
    O -->|Ya| P[Tampilkan success toast]
    O -->|Tidak| Q[Tampilkan error toast]
    Q --> C
    N --> P
    P --> R[Refresh riwayat transaksi]
    R --> S[Reset form]
    S --> T[Selesai]
```

### 5. Stok Keluar

```mermaid
flowchart TD
    A[User membuka halaman Stok Keluar] --> B[Pilih item dari dropdown]
    B --> C[Tampilkan info stok tersedia]
    C --> D[Input jumlah stok keluar]
    D --> E[Input catatan opsional]
    E --> F[Klik Simpan Stok Keluar]
    F --> G{Validasi input}
    G -->|Jumlah <= 0| H[Tampilkan error toast]
    G -->|Jumlah > stok tersedia| I[Tampilkan error: stok tidak cukup]
    H --> D
    I --> D
    G -->|Valid| J{Check Supabase configured?}
    J -->|Ya| K[Insert transaksi ke Supabase]
    J -->|Tidak| L[Simpan transaksi ke local state]
    K --> M{Success?}
    M -->|Ya| N[Update stok item di Supabase]
    M -->|Tidak| O[Tampilkan error toast]
    O --> D
    L --> P[Update stok item di local state]
    N --> Q{Update success?}
    Q -->|Ya| R[Tampilkan success toast]
    Q -->|Tidak| S[Tampilkan error toast]
    S --> D
    P --> R
    R --> T[Refresh riwayat transaksi]
    T --> U[Reset form]
    U --> V[Selesai]
```

### 6. Lihat Dashboard

```mermaid
flowchart TD
    A[User membuka Dashboard] --> B{Loading state}
    B -->|Loading| C[Tampilkan loading message]
    B -->|Loaded| D{Check Supabase configured?}
    D -->|Ya| E[Fetch items dari Supabase]
    D -->|Tidak| F[Gunakan local state]
    E --> G{Success?}
    G -->|Ya| H[Fetch transactions dari Supabase]
    G -->|Tidak| I[Tampilkan data kosong]
    F --> H
    H --> J{Success?}
    J -->|Ya| K[Hitung statistik]
    J -->|Tidak| L[Tampilkan data kosong]
    K --> M[Generate chart data 7 hari]
    M --> N[Generate trend data 6 minggu]
    N --> O[Filter low stock items]
    O --> P[Ambil 5 transaksi terbaru]
    P --> Q[Render semua komponen]
    Q --> R[Dashboard ditampilkan]
    I --> R
    L --> R
    C --> D
```

### 7. Lihat Laporan

```mermaid
flowchart TD
    A[User membuka halaman Laporan] --> B{Check Supabase configured?}
    B -->|Ya| C[Fetch items dari Supabase]
    B -->|Tidak| D[Gunakan local state]
    C --> E[Fetch transactions dari Supabase]
    D --> E
    E --> F[Hitung total nilai stok]
    F --> G[Hitung total stok masuk/keluar]
    G --> H[Filter low stock items]
    H --> I[User memilih tab]
    I --> J{Tab yang dipilih?}
    J -->|Laporan Stok| K[Tampilkan tabel semua item]
    J -->|Riwayat Transaksi| L[User pilih filter]
    J -->|Stok Menipis| M[Tampilkan tabel low stock]
    L --> N{Filter type?}
    N -->|Semua| O[Tampilkan semua transaksi]
    N -->|Masuk| P[Filter transaksi masuk]
    N -->|Keluar| Q[Filter transaksi keluar]
    P --> R[Tampilkan tabel transaksi]
    Q --> R
    O --> R
    K --> S[User klik Export]
    R --> S
    M --> S
    S --> T[Tampilkan toast: fitur akan datang]
    T --> U[Selesai]
```

### 8. Pencarian Item

```mermaid
flowchart TD
    A[User membuka halaman Inventaris] --> B[User mengetik di search box]
    B --> C{Input kosong?}
    C -->|Ya| D[Tampilkan semua item]
    C -->|Tidak| E[Filter items berdasarkan query]
    E --> F{Match dengan nama?}
    F -->|Ya| G[Tambahkan ke hasil]
    F -->|Tidak| H{Match dengan kategori?}
    H -->|Ya| G
    H -->|Tidak| I[Skip item]
    G --> J{Ada item lain?}
    I --> J
    J -->|Ya| E
    J -->|Tidak| K[Tampilkan hasil filter]
    D --> L[Selesai]
    K --> L
```

---

## Struktur Data

### InventoryItem
```typescript
{
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
```

### StockTransaction
```typescript
{
  id: string;
  itemId: string;
  itemName: string;
  type: 'in' | 'out';
  quantity: number;
  notes: string;
  date: Date;
  createdBy: string;
}
```

---

## Entity Relationship Diagram (ERD)

Berikut adalah ERD yang menggambarkan struktur database aplikasi inventaris:

### ERD Database Schema

```mermaid
erDiagram
    INVENTORY_ITEMS {
        uuid id PK "PRIMARY KEY, AUTO GENERATE"
        varchar name "NOT NULL"
        varchar category "NOT NULL"
        varchar unit "NOT NULL"
        decimal current_stock "NOT NULL, DEFAULT 0"
        decimal min_stock "NOT NULL, DEFAULT 0"
        decimal price "NOT NULL, DEFAULT 0"
        timestamp created_at "DEFAULT NOW()"
        timestamp updated_at "DEFAULT NOW(), AUTO UPDATE"
    }
    
    STOCK_TRANSACTIONS {
        uuid id PK "PRIMARY KEY, AUTO GENERATE"
        uuid item_id FK "NOT NULL, FOREIGN KEY"
        varchar item_name "NOT NULL, DENORMALIZED"
        varchar type "NOT NULL, CHECK (in|out)"
        decimal quantity "NOT NULL"
        text notes "NULLABLE"
        timestamp date "NOT NULL, DEFAULT NOW()"
        varchar created_by "NOT NULL, DEFAULT 'Admin'"
        timestamp created_at "DEFAULT NOW()"
    }
    
    LOW_STOCK_ITEMS {
        uuid id "FROM inventory_items"
        varchar name "FROM inventory_items"
        varchar category "FROM inventory_items"
        varchar unit "FROM inventory_items"
        decimal current_stock "FROM inventory_items"
        decimal min_stock "FROM inventory_items"
        decimal price "FROM inventory_items"
        varchar status "COMPUTED (normal|warning|danger)"
    }
    
    INVENTORY_ITEMS ||--o{ STOCK_TRANSACTIONS : "has many"
    INVENTORY_ITEMS ||--o| LOW_STOCK_ITEMS : "view"
```

### Penjelasan ERD

#### 1. Entity: `inventory_items`
Tabel utama untuk menyimpan data item inventaris (bahan baku).

**Primary Key:**
- `id` (UUID) - Identifier unik untuk setiap item

**Attributes:**
- `name` (VARCHAR 255) - Nama item, wajib diisi
- `category` (VARCHAR 100) - Kategori item (Bahan Utama, Bahan Tambahan, dll)
- `unit` (VARCHAR 50) - Satuan pengukuran (kg, liter, pcs, dll)
- `current_stock` (DECIMAL 10,2) - Stok saat ini, default 0
- `min_stock` (DECIMAL 10,2) - Batas minimum stok untuk peringatan
- `price` (DECIMAL 12,2) - Harga per satuan
- `created_at` (TIMESTAMP) - Waktu pembuatan record
- `updated_at` (TIMESTAMP) - Waktu update terakhir (auto-update via trigger)

**Indexes:**
- Index pada `category` untuk mempercepat filter berdasarkan kategori
- Index pada `name` untuk mempercepat pencarian

#### 2. Entity: `stock_transactions`
Tabel untuk menyimpan riwayat transaksi stok masuk dan keluar.

**Primary Key:**
- `id` (UUID) - Identifier unik untuk setiap transaksi

**Foreign Key:**
- `item_id` (UUID) - Reference ke `inventory_items.id` dengan CASCADE DELETE

**Attributes:**
- `item_name` (VARCHAR 255) - Nama item (denormalized untuk historical records)
- `type` (VARCHAR 10) - Tipe transaksi: 'in' (masuk) atau 'out' (keluar), dengan CHECK constraint
- `quantity` (DECIMAL 10,2) - Jumlah stok yang ditransaksikan
- `notes` (TEXT) - Catatan tambahan (opsional)
- `date` (TIMESTAMP) - Tanggal transaksi, default NOW()
- `created_by` (VARCHAR 255) - User yang membuat transaksi, default 'Admin'
- `created_at` (TIMESTAMP) - Waktu pembuatan record

**Indexes:**
- Index pada `item_id` untuk mempercepat join dengan inventory_items
- Index pada `type` untuk mempercepat filter berdasarkan tipe transaksi
- Index pada `date` (DESC) untuk mempercepat sorting berdasarkan tanggal

#### 3. View: `low_stock_items`
View yang menampilkan item dengan stok di bawah batas minimum.

**Computed Attributes:**
- `status` - Status stok yang dihitung:
  - `'danger'` - Stok <= 50% dari min_stock
  - `'warning'` - Stok <= min_stock
  - `'normal'` - Stok > min_stock

**Filter:**
- Hanya menampilkan item dimana `current_stock <= min_stock`

#### 4. Function: `get_dashboard_stats()`
Function untuk menghitung statistik dashboard.

**Returns:**
- `total_items` (BIGINT) - Total jumlah item
- `total_stock_in` (DECIMAL) - Total stok masuk
- `total_stock_out` (DECIMAL) - Total stok keluar
- `low_stock_count` (BIGINT) - Jumlah item dengan stok menipis

### Relationship

**One-to-Many: `inventory_items` → `stock_transactions`**
- Satu item dapat memiliki banyak transaksi
- Foreign key: `stock_transactions.item_id` → `inventory_items.id`
- CASCADE DELETE: Jika item dihapus, semua transaksinya juga dihapus
- Denormalization: `item_name` disimpan di transaksi untuk menjaga historical data

### Constraints & Rules

1. **Primary Keys**: Setiap tabel memiliki UUID sebagai primary key
2. **Foreign Key Constraint**: `item_id` harus reference ke `inventory_items.id`
3. **Check Constraint**: `type` hanya boleh 'in' atau 'out'
4. **NOT NULL Constraints**: Field penting tidak boleh NULL
5. **Default Values**: Timestamp fields memiliki default NOW()
6. **Auto Update Trigger**: `updated_at` di `inventory_items` otomatis update saat record diubah
7. **Row Level Security (RLS)**: Enabled untuk kedua tabel (dengan policy allow all untuk development)

### Indexes untuk Performance

- `idx_inventory_items_category` - Untuk filter berdasarkan kategori
- `idx_inventory_items_name` - Untuk pencarian berdasarkan nama
- `idx_stock_transactions_item_id` - Untuk join dengan inventory_items
- `idx_stock_transactions_type` - Untuk filter berdasarkan tipe transaksi
- `idx_stock_transactions_date` - Untuk sorting berdasarkan tanggal (DESC)

---

## Fitur Utama

- ✅ Manajemen inventaris bahan baku
- ✅ Pencatatan stok masuk dan keluar
- ✅ Dashboard dengan statistik dan grafik
- ✅ Sistem peringatan stok menipis
- ✅ Laporan dan analisis data
- ✅ Integrasi dengan Supabase untuk penyimpanan data
- ✅ Fallback ke local state jika Supabase belum dikonfigurasi
- ✅ UI responsif dengan Tailwind CSS dan shadcn/ui

## Catatan

- Aplikasi dapat berjalan tanpa Supabase (menggunakan local state), tetapi data akan hilang saat refresh halaman
- Untuk penyimpanan data persisten, pastikan Supabase sudah dikonfigurasi sesuai `SUPABASE_SETUP.md`
- Semua operasi CRUD sudah terintegrasi dengan Supabase jika dikonfigurasi
