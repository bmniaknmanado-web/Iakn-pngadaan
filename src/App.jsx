import React, { useState, useEffect } from 'react';
import { ChevronDown, Home, FileText, Settings, BarChart3, AlertCircle, CheckCircle, Clock, LogOut, Upload, Eye, EyeOff, ArrowRight, User, Download, Filter, Plus, Edit2, Trash2, FolderOpen } from 'lucide-react';

export default function IaknPengadaanFinal() {
  // ============= STATE MANAGEMENT =============
  const [currentPage, setCurrentPage] = useState('landing');
  const [selectedYear, setSelectedYear] = useState(2026);
  const [selectedMonth, setSelectedMonth] = useState('Januari');
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [activeSubmenu, setActiveSubmenu] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  
  // State untuk packages dengan detail lengkap
  const [packages, setPackages] = useState({
    2026: {
      pengadaan: [
        { 
          id: 'PKG-2026-001', 
          name: 'Pengadaan Laptop', 
          type: 'Barang',
          status: 'selesai', 
          value: 25000000,
          memo: 'memo_file.pdf',
          pejabatProgress: 'pemilihan',
          ppkProgress: 'ongoing',
          documents: [],
          createdAt: new Date().toISOString(),
          keterangan: 'Laptop untuk kebutuhan administrasi'
        },
        { 
          id: 'PKG-2026-002', 
          name: 'Pengadaan Printer', 
          type: 'Barang',
          status: 'memo', 
          value: 5000000,
          memo: null,
          documents: [],
          createdAt: new Date().toISOString(),
          keterangan: 'Printer untuk bagian keuangan'
        },
      ],
      pemeliharaan: [
        { 
          id: 'PEM-2026-001', 
          name: 'Pemeliharaan AC', 
          type: 'Pemeliharaan Rutin',
          status: 'selesai', 
          value: 3000000,
          memo: 'memo_file.pdf',
          pejabatProgress: 'pemilihan',
          ppkProgress: 'ongoing',
          documents: [],
          createdAt: new Date().toISOString(),
          keterangan: 'Pemeliharaan rutin AC di kantor pusat'
        },
      ]
    },
    2025: {
      pengadaan: [],
      pemeliharaan: []
    },
    2024: {
      pengadaan: [],
      pemeliharaan: []
    },
    2023: {
      pengadaan: [],
      pemeliharaan: []
    },
    2022: {
      pengadaan: [],
      pemeliharaan: []
    }
  });

  const [showGoogleDriveModal, setShowGoogleDriveModal] = useState(false);
  const [googleDriveMessage, setGoogleDriveMessage] = useState('');

  const availableYears = [2026, 2025, 2024, 2023, 2022];
  const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

  const pengadaanTypes = ['Barang', 'Pekerjaan Konstruksi', 'Jasa Konsultansi', 'Jasa Lainnya'];
  const pemeliharaanTypes = ['Pemeliharaan Rutin', 'Pemeliharaan Keadaan Darurat'];

  // ============= LOGIN HANDLER =============
  const handleLogin = () => {
    setLoginError('');
    if (loginUsername === 'admin' && loginPassword === 'admin123') {
      setIsLoggedIn(true);
      setUserRole('admin');
      setCurrentPage('dashboard');
      setLoginUsername('');
      setLoginPassword('');
      setShowPassword(false);
    } else {
      setLoginError('Username atau password salah. Coba: admin / admin123');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserRole(null);
    setCurrentPage('landing');
    setLoginUsername('');
    setLoginPassword('');
  };

  // ============= FORMAT CURRENCY =============
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(value);
  };

  // ============= GOOGLE DRIVE INTEGRATION =============
  const handleCreateGoogleDriveFolder = (packageName, packageId) => {
    // Simulasi Google Drive integration
    setGoogleDriveMessage(`Membuat folder "${packageName}" di Google Drive...`);
    setShowGoogleDriveModal(true);
    
    setTimeout(() => {
      setGoogleDriveMessage(`✅ Folder "${packageName}" berhasil dibuat di Google Drive!\n\nFolder ID: ${packageId}-GDrive-${Date.now()}\n\nAnda dapat mulai mengupload dokumen ke folder ini.`);
    }, 2000);
  };

  // ============= EXPORT TO PDF =============
  const exportToPDF = () => {
    const currentData = packages[selectedYear];
    const totalPengadaan = currentData.pengadaan.length;
    const totalPemeliharaan = currentData.pemeliharaan.length;
    const totalValuePengadaan = currentData.pengadaan.reduce((sum, p) => sum + p.value, 0);
    const totalValuePemeliharaan = currentData.pemeliharaan.reduce((sum, p) => sum + p.value, 0);

    // Format template laporan
    let content = `KEMENTERIAN AGAMA REPUBLIK INDONESIA
INSTITUT AGAMA KRISTEN NEGERI (IAKN) MANADO
Jalan Bougenville, Tateli Satu, Kecamatan Mandolang, Kabupaten Minahasa
Telepon (0431) 831732 Faksimile (0431) 831733
Website : www.iakn-manado.ac.id; e-mail : info@iakn.manado.ac.id

LAPORAN PENGADAAN DAN PEMELIHARAAN
SARANA DAN PRASARANA IAKN MANADO

================================================================================

Jumlah Paket Pengadaan IAKN Manado per ${selectedMonth} periode tahun anggaran ${selectedYear} adalah ${totalPengadaan} Paket dengan total anggaran sebesar ${formatCurrency(totalValuePengadaan)} dengan rincian sebagai berikut:

`;

    // Tabel Pengadaan
    content += `\nDAFTAR PENGADAAN:\n`;
    content += `${'No'.padEnd(5)} | ${'Nama Pengadaan'.padEnd(30)} | ${'Jenis'.padEnd(25)} | ${'Nilai (Rp)'.padEnd(20)} | ${'Keterangan'.padEnd(30)}\n`;
    content += `${'-'.repeat(120)}\n`;
    
    currentData.pengadaan.forEach((pkg, idx) => {
      content += `${String(idx + 1).padEnd(5)} | ${pkg.name.substring(0, 28).padEnd(30)} | ${pkg.type.substring(0, 23).padEnd(25)} | ${formatCurrency(pkg.value).padEnd(20)} | ${pkg.keterangan.substring(0, 28).padEnd(30)}\n`;
    });

    content += `\n\nJumlah Paket Pemeliharaan IAKN Manado per ${selectedMonth} periode tahun anggaran ${selectedYear} adalah ${totalPemeliharaan} paket/kegiatan dengan total anggaran sebesar ${formatCurrency(totalValuePemeliharaan)} dengan rincian sebagai berikut:

DAFTAR PEMELIHARAAN:\n`;
    content += `${'No'.padEnd(5)} | ${'Nama Pemeliharaan'.padEnd(30)} | ${'Jenis'.padEnd(25)} | ${'Nilai (Rp)'.padEnd(20)} | ${'Keterangan'.padEnd(30)}\n`;
    content += `${'-'.repeat(120)}\n`;
    
    currentData.pemeliharaan.forEach((pkg, idx) => {
      content += `${String(idx + 1).padEnd(5)} | ${pkg.name.substring(0, 28).padEnd(30)} | ${pkg.type.substring(0, 23).padEnd(25)} | ${formatCurrency(pkg.value).padEnd(20)} | ${pkg.keterangan.substring(0, 28).padEnd(30)}\n`;
    });

    content += `\n\nDemikian laporan ini dibuat sebagai bentuk pertanggungjawaban pengadaan dan pemeliharaan sarana dan prasarana.

Manado, ${new Date().toLocaleDateString('id-ID')}

Kepala Bagian Umum dan Layanan Akademik
Max Bastian Tumbel`;

    // Create and download PDF (menggunakan teknik canvas + img)
    const element = document.createElement('div');
    element.innerHTML = `<pre style="font-family: Arial, sans-serif; white-space: pre-wrap; word-wrap: break-word; padding: 20px;">${content}</pre>`;
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Laporan_Pengadaan_${selectedYear}_${selectedMonth}.txt`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);

    alert('Laporan berhasil diunduh! (Format TXT untuk compatibilitas maksimal)');
  };

  // ============= EXPORT TO EXCEL =============
  const exportToExcel = () => {
    const currentData = packages[selectedYear];
    
    // Buat CSV content
    let csvContent = 'data:text/csv;charset=utf-8,';
    
    // Header
    csvContent += `LAPORAN PENGADAAN DAN PEMELIHARAAN IAKN MANADO\n`;
    csvContent += `Bulan: ${selectedMonth}, Tahun: ${selectedYear}\n\n`;
    
    // Tabel Pengadaan
    csvContent += `DAFTAR PENGADAAN\n`;
    csvContent += `No,Nama Pengadaan,Jenis,Nilai (Rp),Keterangan\n`;
    
    currentData.pengadaan.forEach((pkg, idx) => {
      csvContent += `${idx + 1},"${pkg.name}","${pkg.type}",${pkg.value},"${pkg.keterangan}"\n`;
    });
    
    csvContent += `\n\nDAFTAR PEMELIHARAAN\n`;
    csvContent += `No,Nama Pemeliharaan,Jenis,Nilai (Rp),Keterangan\n`;
    
    currentData.pemeliharaan.forEach((pkg, idx) => {
      csvContent += `${idx + 1},"${pkg.name}","${pkg.type}",${pkg.value},"${pkg.keterangan}"\n`;
    });

    // Download
    const link = document.createElement('a');
    link.setAttribute('href', encodeURI(csvContent));
    link.setAttribute('download', `Laporan_Pengadaan_${selectedYear}_${selectedMonth}.csv`);
    link.click();

    alert('File Excel (CSV) berhasil diunduh!');
  };

  // ============= ADD/EDIT PACKAGE =============
  const [editingPackage, setEditingPackage] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    value: 0,
    keterangan: ''
  });

  const handleAddPackage = (packageType) => {
    setEditingPackage(null);
    setFormData({ name: '', type: packageType === 'pengadaan' ? pengadaanTypes[0] : pemeliharaanTypes[0], value: 0, keterangan: '' });
    setCurrentPage(`admin-add-${packageType}`);
  };

  const handleSavePackage = (packageType) => {
    if (!formData.name || !formData.type || formData.value <= 0) {
      alert('Semua field harus diisi dan nilai harus lebih dari 0');
      return;
    }

    const newPackage = {
      id: editingPackage?.id || `${packageType === 'pengadaan' ? 'PKG' : 'PEM'}-${selectedYear}-${String(Date.now()).slice(-4)}`,
      name: formData.name,
      type: formData.type,
      status: 'memo',
      value: parseFloat(formData.value),
      memo: null,
      documents: [],
      createdAt: new Date().toISOString(),
      keterangan: formData.keterangan
    };

    setPackages(prev => {
      const updated = { ...prev };
      if (editingPackage) {
        // Update existing
        const idx = updated[selectedYear][packageType].findIndex(p => p.id === editingPackage.id);
        if (idx >= 0) updated[selectedYear][packageType][idx] = { ...updated[selectedYear][packageType][idx], ...newPackage };
      } else {
        // Add new
        updated[selectedYear][packageType].push(newPackage);
      }
      return updated;
    });

    // Buat Google Drive folder
    handleCreateGoogleDriveFolder(formData.name, newPackage.id);

    setCurrentPage('dashboard');
    alert(editingPackage ? 'Paket berhasil diupdate!' : 'Paket berhasil ditambahkan!');
  };

  const handleDeletePackage = (packageType, id) => {
    if (window.confirm('Yakin ingin menghapus paket ini?')) {
      setPackages(prev => ({
        ...prev,
        [selectedYear]: {
          ...prev[selectedYear],
          [packageType]: prev[selectedYear][packageType].filter(p => p.id !== id)
        }
      }));
    }
  };

  const handleEditPackage = (packageType, id) => {
    const pkg = packages[selectedYear][packageType].find(p => p.id === id);
    if (pkg) {
      setEditingPackage(pkg);
      setFormData({
        name: pkg.name,
        type: pkg.type,
        value: pkg.value,
        keterangan: pkg.keterangan
      });
      setCurrentPage(`admin-add-${packageType}`);
    }
  };

  // ============= LOGIN PAGE =============
  const LoginPage = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-900 rounded-full mb-4">
              <User className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Login</h1>
            <p className="text-gray-600">Sistem Pengadaan & Pemeliharaan IAKN Manado</p>
          </div>

          {loginError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-red-800 text-sm">{loginError}</p>
            </div>
          )}

          <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Username</label>
              <input
                type="text"
                value={loginUsername}
                onChange={(e) => setLoginUsername(e.target.value)}
                placeholder="Masukkan username"
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-900 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="Masukkan password"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-900 focus:ring-2 focus:ring-blue-100"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-900 text-white font-semibold py-2.5 rounded-lg hover:bg-blue-800 transition-all"
            >
              Masuk
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-600 mb-3 font-semibold">Demo Credentials:</p>
            <div className="bg-gray-50 rounded-lg p-3 space-y-1 text-xs text-gray-700">
              <p><span className="font-semibold">Username:</span> admin</p>
              <p><span className="font-semibold">Password:</span> admin123</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // ============= LANDING PAGE =============
  const LandingPage = () => (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="text-center max-w-2xl mx-auto">
        <div className="mb-12">
          <div className="text-sm font-semibold text-blue-900 tracking-widest mb-4">SISTEM MANAJEMEN</div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">Pengadaan & Pemeliharaan</h1>
          <h2 className="text-3xl md:text-4xl font-semibold text-blue-900 mb-8">IAKN Manado</h2>
          <p className="text-lg text-gray-600 leading-relaxed">Platform terpadu untuk manajemen pengadaan barang dan pemeliharaan fasilitas Institut Agama Kristen Negeri Manado</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 space-y-6">
          <div>
            <p className="text-gray-600 font-medium mb-6">Pilih Akses</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => {
                  setSelectedYear(2026);
                  setIsLoggedIn(false);
                  setUserRole(null);
                  setCurrentPage('dashboard');
                }}
                className="px-8 py-3 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700 transition-all"
              >
                Akses Pengguna
              </button>
              <button
                onClick={() => setCurrentPage('login')}
                className="px-8 py-3 bg-blue-900 text-white font-semibold rounded-lg hover:bg-blue-800 transition-all"
              >
                Admin Login
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // ============= CETAK LAPORAN PAGE (USER) =============
  const CetakLaporanPage = () => {
    const currentData = packages[selectedYear];
    const totalPengadaan = currentData.pengadaan.length;
    const totalPemeliharaan = currentData.pemeliharaan.length;
    const totalValuePengadaan = currentData.pengadaan.reduce((sum, p) => sum + p.value, 0);
    const totalValuePemeliharaan = currentData.pemeliharaan.reduce((sum, p) => sum + p.value, 0);

    return (
      <div className="p-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Cetak Laporan</h2>
          <p className="text-gray-600 mt-2">Unduh laporan pengadaan dan pemeliharaan dalam format PDF atau Excel</p>
        </div>

        {/* Filter Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filter Laporan
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Tahun</label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-900"
              >
                {availableYears.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Bulan</label>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-900"
              >
                {months.map(month => (
                  <option key={month} value={month}>{month}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Preview Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h4 className="font-semibold text-blue-900 mb-2">Total Pengadaan</h4>
            <p className="text-3xl font-bold text-blue-900 mb-2">{totalPengadaan}</p>
            <p className="text-sm text-blue-800">Nilai: {formatCurrency(totalValuePengadaan)}</p>
          </div>
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
            <h4 className="font-semibold text-orange-900 mb-2">Total Pemeliharaan</h4>
            <p className="text-3xl font-bold text-orange-900 mb-2">{totalPemeliharaan}</p>
            <p className="text-sm text-orange-800">Nilai: {formatCurrency(totalValuePemeliharaan)}</p>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <h4 className="font-semibold text-green-900 mb-2">Total Keseluruhan</h4>
            <p className="text-3xl font-bold text-green-900 mb-2">{totalPengadaan + totalPemeliharaan}</p>
            <p className="text-sm text-green-800">Nilai: {formatCurrency(totalValuePengadaan + totalValuePemeliharaan)}</p>
          </div>
        </div>

        {/* Download Buttons */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Download Laporan</h3>
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={exportToPDF}
              className="flex-1 px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-all flex items-center justify-center gap-2"
            >
              <Download className="w-5 h-5" />
              Download PDF
            </button>
            <button
              onClick={exportToExcel}
              className="flex-1 px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-all flex items-center justify-center gap-2"
            >
              <Download className="w-5 h-5" />
              Download Excel
            </button>
          </div>
        </div>

        {/* Data Tables */}
        <div className="grid grid-cols-1 gap-8">
          {/* Tabel Pengadaan */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-blue-900 text-white p-6">
              <h3 className="text-lg font-bold">Daftar Pengadaan</h3>
              <p className="text-blue-100 text-sm mt-1">{totalPengadaan} paket</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100 border-b border-gray-300">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">No</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Nama Pengadaan</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Jenis</th>
                    <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">Nilai (Rp)</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Keterangan</th>
                  </tr>
                </thead>
                <tbody>
                  {currentData.pengadaan.map((pkg, idx) => (
                    <tr key={pkg.id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="px-6 py-3 text-sm text-gray-900">{idx + 1}</td>
                      <td className="px-6 py-3 text-sm text-gray-900 font-medium">{pkg.name}</td>
                      <td className="px-6 py-3 text-sm text-gray-600">{pkg.type}</td>
                      <td className="px-6 py-3 text-sm text-right font-semibold">{formatCurrency(pkg.value)}</td>
                      <td className="px-6 py-3 text-sm text-gray-600">{pkg.keterangan}</td>
                    </tr>
                  ))}
                  {currentData.pengadaan.length === 0 && (
                    <tr>
                      <td colSpan="5" className="px-6 py-8 text-center text-gray-500">Tidak ada data pengadaan</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Tabel Pemeliharaan */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-orange-600 text-white p-6">
              <h3 className="text-lg font-bold">Daftar Pemeliharaan</h3>
              <p className="text-orange-100 text-sm mt-1">{totalPemeliharaan} paket</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100 border-b border-gray-300">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">No</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Nama Pemeliharaan</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Jenis</th>
                    <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">Nilai (Rp)</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Keterangan</th>
                  </tr>
                </thead>
                <tbody>
                  {currentData.pemeliharaan.map((pkg, idx) => (
                    <tr key={pkg.id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="px-6 py-3 text-sm text-gray-900">{idx + 1}</td>
                      <td className="px-6 py-3 text-sm text-gray-900 font-medium">{pkg.name}</td>
                      <td className="px-6 py-3 text-sm text-gray-600">{pkg.type}</td>
                      <td className="px-6 py-3 text-sm text-right font-semibold">{formatCurrency(pkg.value)}</td>
                      <td className="px-6 py-3 text-sm text-gray-600">{pkg.keterangan}</td>
                    </tr>
                  ))}
                  {currentData.pemeliharaan.length === 0 && (
                    <tr>
                      <td colSpan="5" className="px-6 py-8 text-center text-gray-500">Tidak ada data pemeliharaan</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ============= ADMIN DATA MANAGER PAGE =============
  const AdminDataManagerPage = () => {
    const currentData = packages[selectedYear];

    return (
      <div className="p-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Kelola Data Paket</h2>
          <p className="text-gray-600 mt-2">Tambah, edit, dan hapus data paket pengadaan dan pemeliharaan</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8">
          <button
            onClick={() => setActiveMenu('data-pengadaan')}
            className={`px-6 py-2 rounded-lg font-semibold transition-all ${
              activeMenu === 'data-pengadaan'
                ? 'bg-blue-900 text-white'
                : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
            }`}
          >
            Pengadaan
          </button>
          <button
            onClick={() => setActiveMenu('data-pemeliharaan')}
            className={`px-6 py-2 rounded-lg font-semibold transition-all ${
              activeMenu === 'data-pemeliharaan'
                ? 'bg-blue-900 text-white'
                : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
            }`}
          >
            Pemeliharaan
          </button>
        </div>

        {/* Add Button */}
        <button
          onClick={() => handleAddPackage(activeMenu === 'data-pengadaan' ? 'pengadaan' : 'pemeliharaan')}
          className="mb-6 px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-all flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Tambah Paket Baru
        </button>

        {/* Data Tables */}
        {activeMenu === 'data-pengadaan' ? (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-blue-900 text-white p-6">
              <h3 className="text-lg font-bold">Data Pengadaan</h3>
              <p className="text-blue-100 text-sm mt-1">{currentData.pengadaan.length} paket</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100 border-b border-gray-300">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold">No</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Nama</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Jenis</th>
                    <th className="px-6 py-3 text-right text-sm font-semibold">Nilai (Rp)</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Keterangan</th>
                    <th className="px-6 py-3 text-center text-sm font-semibold">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {currentData.pengadaan.map((pkg, idx) => (
                    <tr key={pkg.id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="px-6 py-3 text-sm">{idx + 1}</td>
                      <td className="px-6 py-3 text-sm font-medium">{pkg.name}</td>
                      <td className="px-6 py-3 text-sm">{pkg.type}</td>
                      <td className="px-6 py-3 text-sm text-right">{formatCurrency(pkg.value)}</td>
                      <td className="px-6 py-3 text-sm text-gray-600">{pkg.keterangan}</td>
                      <td className="px-6 py-3 text-center space-x-2">
                        <button
                          onClick={() => handleEditPackage('pengadaan', pkg.id)}
                          className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-900 rounded hover:bg-blue-200 text-sm font-medium"
                        >
                          <Edit2 className="w-4 h-4" /> Edit
                        </button>
                        <button
                          onClick={() => handleDeletePackage('pengadaan', pkg.id)}
                          className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 text-red-900 rounded hover:bg-red-200 text-sm font-medium"
                        >
                          <Trash2 className="w-4 h-4" /> Hapus
                        </button>
                      </td>
                    </tr>
                  ))}
                  {currentData.pengadaan.length === 0 && (
                    <tr>
                      <td colSpan="6" className="px-6 py-8 text-center text-gray-500">Tidak ada data pengadaan</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-orange-600 text-white p-6">
              <h3 className="text-lg font-bold">Data Pemeliharaan</h3>
              <p className="text-orange-100 text-sm mt-1">{currentData.pemeliharaan.length} paket</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100 border-b border-gray-300">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold">No</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Nama</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Jenis</th>
                    <th className="px-6 py-3 text-right text-sm font-semibold">Nilai (Rp)</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Keterangan</th>
                    <th className="px-6 py-3 text-center text-sm font-semibold">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {currentData.pemeliharaan.map((pkg, idx) => (
                    <tr key={pkg.id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="px-6 py-3 text-sm">{idx + 1}</td>
                      <td className="px-6 py-3 text-sm font-medium">{pkg.name}</td>
                      <td className="px-6 py-3 text-sm">{pkg.type}</td>
                      <td className="px-6 py-3 text-sm text-right">{formatCurrency(pkg.value)}</td>
                      <td className="px-6 py-3 text-sm text-gray-600">{pkg.keterangan}</td>
                      <td className="px-6 py-3 text-center space-x-2">
                        <button
                          onClick={() => handleEditPackage('pemeliharaan', pkg.id)}
                          className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-900 rounded hover:bg-blue-200 text-sm font-medium"
                        >
                          <Edit2 className="w-4 h-4" /> Edit
                        </button>
                        <button
                          onClick={() => handleDeletePackage('pemeliharaan', pkg.id)}
                          className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 text-red-900 rounded hover:bg-red-200 text-sm font-medium"
                        >
                          <Trash2 className="w-4 h-4" /> Hapus
                        </button>
                      </td>
                    </tr>
                  ))}
                  {currentData.pemeliharaan.length === 0 && (
                    <tr>
                      <td colSpan="6" className="px-6 py-8 text-center text-gray-500">Tidak ada data pemeliharaan</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    );
  };

  // ============= ADD/EDIT PACKAGE PAGE =============
  const AddEditPackagePage = ({ packageType }) => {
    const typeLabel = packageType === 'pengadaan' ? 'Pengadaan' : 'Pemeliharaan';
    const typeOptions = packageType === 'pengadaan' ? pengadaanTypes : pemeliharaanTypes;

    return (
      <div className="p-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900">{editingPackage ? 'Edit' : 'Tambah'} Paket {typeLabel}</h2>
          <p className="text-gray-600 mt-2">Isi semua informasi paket {typeLabel.toLowerCase()}</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 max-w-2xl">
          <form onSubmit={(e) => { e.preventDefault(); handleSavePackage(packageType); }} className="space-y-6">
            {/* Nama Paket */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Nama Paket</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder={`Contoh: ${packageType === 'pengadaan' ? 'Pengadaan Laptop untuk Admins' : 'Pemeliharaan AC Ruang Rapat'}`}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-900 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* Jenis */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Jenis {typeLabel}</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-900 focus:ring-2 focus:ring-blue-100"
              >
                {typeOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-2">
                {packageType === 'pengadaan' 
                  ? 'Pilih: Barang, Pekerjaan Konstruksi, Jasa Konsultansi, atau Jasa Lainnya'
                  : 'Pilih: Pemeliharaan Rutin atau Pemeliharaan Keadaan Darurat'
                }
              </p>
            </div>

            {/* Nilai Paket */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Nilai Paket (Rp)</label>
              <input
                type="number"
                value={formData.value}
                onChange={(e) => setFormData({ ...formData, value: parseFloat(e.target.value) || 0 })}
                placeholder="Contoh: 25000000"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-900 focus:ring-2 focus:ring-blue-100"
              />
              <p className="text-sm text-gray-600 mt-2">Nilai: {formatCurrency(formData.value)}</p>
            </div>

            {/* Keterangan */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Keterangan</label>
              <textarea
                value={formData.keterangan}
                onChange={(e) => setFormData({ ...formData, keterangan: e.target.value })}
                placeholder="Contoh: Untuk kebutuhan administrasi kantor pusat"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-900 focus:ring-2 focus:ring-blue-100 resize-none"
                rows="4"
              />
            </div>

            {/* Google Drive Notice */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
              <FolderOpen className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-blue-900">Google Drive Integration</p>
                <p className="text-sm text-blue-800 mt-1">Setelah paket disimpan, folder akan otomatis dibuat di Google Drive dengan nama paket ini.</p>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-4">
              <button
                type="submit"
                className="flex-1 px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-all"
              >
                {editingPackage ? 'Update Paket' : 'Simpan Paket Baru'}
              </button>
              <button
                type="button"
                onClick={() => setCurrentPage('dashboard')}
                className="flex-1 px-6 py-3 bg-gray-400 text-white font-semibold rounded-lg hover:bg-gray-500 transition-all"
              >
                Batal
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // ============= ADMIN PANEL =============
  const AdminPanel = () => {
    return (
      <div className="p-8">
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Admin Panel</h2>
            <p className="text-gray-600 mt-2">Kelola sistem pengadaan & pemeliharaan tahun {selectedYear}</p>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-all flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h4 className="font-semibold text-blue-900 mb-2">Total Pengadaan</h4>
            <p className="text-3xl font-bold text-blue-900">{packages[selectedYear].pengadaan.length}</p>
            <p className="text-sm text-blue-800 mt-2">Nilai: {formatCurrency(packages[selectedYear].pengadaan.reduce((sum, p) => sum + p.value, 0))}</p>
          </div>
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
            <h4 className="font-semibold text-orange-900 mb-2">Total Pemeliharaan</h4>
            <p className="text-3xl font-bold text-orange-900">{packages[selectedYear].pemeliharaan.length}</p>
            <p className="text-sm text-orange-800 mt-2">Nilai: {formatCurrency(packages[selectedYear].pemeliharaan.reduce((sum, p) => sum + p.value, 0))}</p>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <h4 className="font-semibold text-green-900 mb-2">Grand Total</h4>
            <p className="text-3xl font-bold text-green-900">{packages[selectedYear].pengadaan.length + packages[selectedYear].pemeliharaan.length}</p>
            <p className="text-sm text-green-800 mt-2">Nilai: {formatCurrency(packages[selectedYear].pengadaan.reduce((sum, p) => sum + p.value, 0) + packages[selectedYear].pemeliharaan.reduce((sum, p) => sum + p.value, 0))}</p>
          </div>
        </div>

        {/* Admin Menu */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <button
            onClick={() => setActiveMenu('data-pengadaan')}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-all text-left border-l-4 border-blue-900 hover:border-blue-700"
          >
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-xl font-bold text-gray-900">Kelola Data</h3>
              <FileText className="w-6 h-6 text-blue-900 opacity-50" />
            </div>
            <p className="text-gray-600">Tambah, edit, hapus paket pengadaan dan pemeliharaan</p>
          </button>

          <button
            onClick={() => setCurrentPage('admin-upload')}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-all text-left border-l-4 border-orange-600 hover:border-orange-500"
          >
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-xl font-bold text-gray-900">Upload Dokumen</h3>
              <Upload className="w-6 h-6 text-orange-600 opacity-50" />
            </div>
            <p className="text-gray-600">Unggah laporan, BAST, kuitansi ke Google Drive</p>
          </button>
        </div>
      </div>
    );
  };

  // ============= ADMIN UPLOAD DOCUMENTS PAGE =============
  const AdminUploadPage = () => {
    const [selectedPkg, setSelectedPkg] = useState(null);
    const [docType, setDocType] = useState('Laporan Pengadaan');
    const [uploadMessage, setUploadMessage] = useState('');

    const allPackages = [
      ...packages[selectedYear].pengadaan.map(p => ({ ...p, typeCategory: 'pengadaan' })),
      ...packages[selectedYear].pemeliharaan.map(p => ({ ...p, typeCategory: 'pemeliharaan' }))
    ];

    const handleDocumentUpload = () => {
      if (!selectedPkg) {
        alert('Pilih paket terlebih dahulu');
        return;
      }

      const fileInput = document.createElement('input');
      fileInput.type = 'file';
      fileInput.accept = '.pdf,.doc,.docx';
      fileInput.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
          // Simulasi upload ke Google Drive
          setUploadMessage(`📤 Mengupload ${file.name} ke folder "${selectedPkg.name}"...`);
          
          setTimeout(() => {
            setUploadMessage(`✅ File ${file.name} berhasil diupload ke Google Drive!\n\nFile Location: IAKN Manado/Pengadaan-Pemeliharaan/${selectedYear}/${selectedPkg.name}/\n\nFile dapat diakses melalui link yang telah dibagikan.`);
            
            // Update package documents
            setPackages(prev => {
              const updated = { ...prev };
              const pkgToUpdate = selectedPkg.typeCategory === 'pengadaan'
                ? updated[selectedYear].pengadaan.find(p => p.id === selectedPkg.id)
                : updated[selectedYear].pemeliharaan.find(p => p.id === selectedPkg.id);
              
              if (pkgToUpdate) {
                pkgToUpdate.documents.push({
                  name: file.name,
                  type: docType,
                  uploadedAt: new Date().toLocaleString('id-ID'),
                  size: (file.size / 1024).toFixed(2) + ' KB'
                });
              }
              return updated;
            });
          }, 2000);
        }
      };
      fileInput.click();
    };

    return (
      <div className="p-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Upload Dokumen Paket</h2>
          <p className="text-gray-600 mt-2">Unggah dokumen (Laporan, BAST, Kuitansi) ke Google Drive</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Upload Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
              {/* Select Package */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Pilih Paket</label>
                <select
                  value={selectedPkg?.id || ''}
                  onChange={(e) => {
                    const pkg = allPackages.find(p => p.id === e.target.value);
                    setSelectedPkg(pkg);
                  }}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-900 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="">-- Pilih Paket --</option>
                  {allPackages.map(pkg => (
                    <option key={pkg.id} value={pkg.id}>
                      [{pkg.typeCategory === 'pengadaan' ? 'P' : 'M'}] {pkg.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Select Document Type */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Jenis Dokumen</label>
                <select
                  value={docType}
                  onChange={(e) => setDocType(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-900 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="Laporan Pengadaan">Laporan Pengadaan</option>
                  <option value="BAST (Berita Acara Serah Terima)">BAST (Berita Acara Serah Terima)</option>
                  <option value="Kuitansi">Kuitansi</option>
                  <option value="Dokumen Lainnya">Dokumen Lainnya</option>
                </select>
              </div>

              {/* Upload Button */}
              <button
                onClick={handleDocumentUpload}
                className="w-full px-6 py-3 bg-blue-900 text-white font-semibold rounded-lg hover:bg-blue-800 transition-all flex items-center justify-center gap-2"
              >
                <Upload className="w-5 h-5" />
                Pilih File dan Upload
              </button>

              {/* Message */}
              {uploadMessage && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-blue-900 text-sm whitespace-pre-line">{uploadMessage}</p>
                </div>
              )}
            </div>
          </div>

          {/* Package Info */}
          {selectedPkg && (
            <div className="bg-white rounded-lg shadow-md p-6 h-fit sticky top-8">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Info Paket</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-gray-600">Nama</p>
                  <p className="font-semibold text-gray-900">{selectedPkg.name}</p>
                </div>
                <div>
                  <p className="text-gray-600">Jenis</p>
                  <p className="font-semibold text-gray-900">{selectedPkg.type}</p>
                </div>
                <div>
                  <p className="text-gray-600">Nilai</p>
                  <p className="font-semibold text-gray-900">{formatCurrency(selectedPkg.value)}</p>
                </div>
                <div>
                  <p className="text-gray-600">Google Drive Folder</p>
                  <p className="font-mono text-xs bg-gray-100 p-2 rounded mt-1 break-all">{selectedPkg.id}-folder</p>
                </div>
                {selectedPkg.documents.length > 0 && (
                  <div className="pt-3 border-t border-gray-200">
                    <p className="text-gray-600 font-semibold mb-2">Dokumen Terupload:</p>
                    <div className="space-y-2">
                      {selectedPkg.documents.map((doc, idx) => (
                        <div key={idx} className="bg-gray-50 p-2 rounded text-xs">
                          <p className="font-semibold text-gray-900">{doc.name}</p>
                          <p className="text-gray-600">{doc.type} • {doc.size}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  // ============= SIDEBAR NAVIGATION =============
  const Sidebar = () => (
    <div className="w-64 bg-blue-900 text-white min-h-screen p-6 shadow-lg flex flex-col overflow-y-auto">
      <div className="mb-8">
        <h3 className="text-xl font-bold mb-1">IAKN Manado</h3>
        <p className="text-blue-200 text-xs">{userRole === 'admin' ? '👨‍💼 Admin' : 'Pengguna'}</p>
      </div>

      {userRole === 'admin' && (
        <div className="mb-8 pb-8 border-b border-blue-800">
          <p className="text-xs font-semibold text-blue-200 mb-3">GANTI TAHUN</p>
          <select
            value={selectedYear}
            onChange={(e) => {
              setSelectedYear(parseInt(e.target.value));
              setActiveMenu('admin');
              setCurrentPage('dashboard');
            }}
            className="w-full px-3 py-2 rounded bg-blue-800 text-white border border-blue-700 text-sm focus:outline-none"
          >
            {availableYears.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
      )}

      <nav className="space-y-2 flex-1">
        {userRole === 'admin' ? (
          <>
            <button
              onClick={() => { setCurrentPage('dashboard'); setActiveMenu('admin'); }}
              className={`w-full text-left px-4 py-3 rounded-lg font-medium flex items-center gap-3 transition-all ${
                currentPage === 'dashboard' && userRole === 'admin' ? 'bg-orange-600 text-white' : 'text-blue-100 hover:bg-blue-800'
              }`}
            >
              <Home className="w-5 h-5" />
              Admin Dashboard
            </button>

            <button
              onClick={() => { setCurrentPage('admin-data'); setActiveMenu('data-pengadaan'); }}
              className={`w-full text-left px-4 py-3 rounded-lg font-medium flex items-center gap-3 transition-all ${
                currentPage === 'admin-data' ? 'bg-orange-600 text-white' : 'text-blue-100 hover:bg-blue-800'
              }`}
            >
              <FileText className="w-5 h-5" />
              Kelola Data Paket
            </button>

            <button
              onClick={() => setCurrentPage('admin-upload')}
              className={`w-full text-left px-4 py-3 rounded-lg font-medium flex items-center gap-3 transition-all ${
                currentPage === 'admin-upload' ? 'bg-orange-600 text-white' : 'text-blue-100 hover:bg-blue-800'
              }`}
            >
              <Upload className="w-5 h-5" />
              Upload Dokumen
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => { setCurrentPage('dashboard'); setActiveMenu('dashboard'); }}
              className={`w-full text-left px-4 py-3 rounded-lg font-medium flex items-center gap-3 transition-all ${
                currentPage === 'dashboard' ? 'bg-orange-600 text-white' : 'text-blue-100 hover:bg-blue-800'
              }`}
            >
              <Home className="w-5 h-5" />
              Dashboard
            </button>

            <button
              onClick={() => { setCurrentPage('cetak-laporan'); setActiveMenu('laporan'); }}
              className={`w-full text-left px-4 py-3 rounded-lg font-medium flex items-center gap-3 transition-all ${
                currentPage === 'cetak-laporan' ? 'bg-orange-600 text-white' : 'text-blue-100 hover:bg-blue-800'
              }`}
            >
              <Download className="w-5 h-5" />
              Cetak Laporan
            </button>
          </>
        )}
      </nav>

      <div className="pt-6 border-t border-blue-800">
        {userRole === 'admin' ? (
          <button
            onClick={handleLogout}
            className="w-full px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-all flex items-center justify-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        ) : (
          <p className="text-xs text-blue-300 text-center">© 2026 IAKN Manado</p>
        )}
      </div>
    </div>
  );

  // ============= SIMPLE DASHBOARD FOR USER =============
  const Dashboard = () => {
    const currentData = packages[selectedYear];
    return (
      <div className="p-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Dashboard Tahun {selectedYear}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-md p-8 border-l-4 border-blue-900">
            <p className="text-gray-600 text-sm font-semibold mb-1">PAKET PENGADAAN</p>
            <h3 className="text-4xl font-bold text-gray-900">{currentData.pengadaan.length}</h3>
            <p className="text-sm text-gray-600 mt-2">Nilai Total: {formatCurrency(currentData.pengadaan.reduce((sum, p) => sum + p.value, 0))}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-8 border-l-4 border-orange-600">
            <p className="text-gray-600 text-sm font-semibold mb-1">PAKET PEMELIHARAAN</p>
            <h3 className="text-4xl font-bold text-gray-900">{currentData.pemeliharaan.length}</h3>
            <p className="text-sm text-gray-600 mt-2">Nilai Total: {formatCurrency(currentData.pemeliharaan.reduce((sum, p) => sum + p.value, 0))}</p>
          </div>
        </div>
      </div>
    );
  };

  // ============= GOOGLE DRIVE MODAL =============
  const GoogleDriveModal = () => {
    if (!showGoogleDriveModal) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-8">
          <div className="text-center">
            <FolderOpen className="w-12 h-12 text-blue-900 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Google Drive Integration</h3>
            <p className="text-gray-600 text-sm whitespace-pre-line mb-6">{googleDriveMessage}</p>
            <button
              onClick={() => setShowGoogleDriveModal(false)}
              className="px-6 py-2 bg-blue-900 text-white font-semibold rounded-lg hover:bg-blue-800 transition-all"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    );
  };

  // ============= MAIN RENDER =============
  if (!isLoggedIn && currentPage === 'login') {
    return <LoginPage />;
  }

  if (!isLoggedIn && currentPage === 'landing') {
    return <LandingPage />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      <div className="flex-1 overflow-auto max-h-screen">
        {currentPage === 'dashboard' && (userRole === 'admin' ? <AdminPanel /> : <Dashboard />)}
        {currentPage === 'cetak-laporan' && <CetakLaporanPage />}
        {currentPage === 'admin-data' && <AdminDataManagerPage />}
        {currentPage === 'admin-add-pengadaan' && <AddEditPackagePage packageType="pengadaan" />}
        {currentPage === 'admin-add-pemeliharaan' && <AddEditPackagePage packageType="pemeliharaan" />}
        {currentPage === 'admin-upload' && <AdminUploadPage />}
      </div>

      <GoogleDriveModal />
    </div>
  );
}
