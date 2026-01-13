
import React, { useRef } from 'react';
import { AppState, DebtorType } from '../types';
import { Icons } from '../constants';

interface SettingsProps {
  state: AppState;
  onImport: (data: AppState) => void;
}

const Settings: React.FC<SettingsProps> = ({ state, onImport }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 1. Export JSON for Backup
  const handleExportJSON = () => {
    const dataStr = JSON.stringify(state, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `smartdebt-backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // 2. Import JSON from Backup
  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (json.debtors && json.transactions) {
          onImport(json);
        } else {
          alert("File không đúng định dạng SmartDebt!");
        }
      } catch (err) {
        alert("Lỗi khi đọc file!");
      }
    };
    reader.readAsText(file);
    e.target.value = ''; // Reset input
  };

  // 3. Export CSV for Google Sheets
  const handleExportCSV = () => {
    // Header
    let csvContent = "\uFEFF"; // BOM for UTF-8 support in Excel
    csvContent += "Tên đối tác,Số điện thoại,Loại,Số dư nợ,Cập nhật cuối\n";
    
    // Rows
    state.debtors.forEach(d => {
      const type = d.type === DebtorType.CUSTOMER ? "Khách hàng" : "Nhà cung cấp";
      csvContent += `"${d.name}","${d.phone}","${type}",${d.totalBalance},"${new Date(d.lastUpdated).toLocaleDateString('vi-VN')}"\n`;
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `danh-sach-cong-no-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Backup Card */}
      <div className="bg-white rounded-[2rem] p-6 md:p-8 shadow-sm border border-slate-100">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center text-xl shadow-sm">
            <Icons.Download />
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-800">Dự phòng & Khôi phục</h3>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Lưu dữ liệu lên Google Drive / Email</p>
          </div>
        </div>

        <p className="text-sm text-slate-500 mb-6 leading-relaxed">
          Tải file dự phòng về máy tính và tải lên <strong>Google Drive</strong> của bạn. Khi cần khôi phục dữ liệu ở máy khác, hãy tải file đó về và nhấn "Nhập dữ liệu".
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button 
            onClick={handleExportJSON}
            className="flex items-center justify-center gap-2 bg-slate-900 text-white py-4 rounded-2xl font-bold shadow-lg hover:bg-black active:scale-[0.98] transition-all text-sm uppercase tracking-widest"
          >
            <Icons.Download /> Xuất dự phòng
          </button>
          
          <button 
            onClick={handleImportClick}
            className="flex items-center justify-center gap-2 bg-white text-slate-900 border-2 border-slate-100 py-4 rounded-2xl font-bold hover:border-blue-200 active:scale-[0.98] transition-all text-sm uppercase tracking-widest"
          >
            <Icons.Upload /> Nhập dữ liệu
          </button>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept=".json" 
            className="hidden" 
          />
        </div>
      </div>

      {/* Google Sheets Export Card */}
      <div className="bg-white rounded-[2rem] p-6 md:p-8 shadow-sm border border-slate-100">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center text-xl shadow-sm">
            <Icons.FileExcel />
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-800">Xuất Google Sheets</h3>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Xem báo cáo chi tiết</p>
          </div>
        </div>

        <p className="text-sm text-slate-500 mb-6 leading-relaxed">
          Xuất danh sách công nợ hiện tại ra file CSV. Bạn có thể mở file này bằng <strong>Google Sheets</strong> để in ấn hoặc làm báo cáo chuyên sâu.
        </p>

        <button 
          onClick={handleExportCSV}
          className="w-full flex items-center justify-center gap-2 bg-emerald-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-emerald-100 hover:bg-emerald-700 active:scale-[0.98] transition-all text-sm uppercase tracking-widest"
        >
          <Icons.FileExcel /> Xuất cho Google Sheets
        </button>
      </div>

      {/* Info Card */}
      <div className="bg-amber-50 rounded-2xl p-6 border border-amber-100">
        <h4 className="font-bold text-amber-800 flex items-center gap-2 mb-2 text-sm">
          <i className="fa-solid fa-circle-info"></i> Lời khuyên
        </h4>
        <p className="text-amber-700/80 text-xs font-medium leading-relaxed">
          Để đảm bảo an toàn tuyệt đối, bạn nên thực hiện <strong>Xuất dự phòng</strong> mỗi tuần một lần và lưu vào một thư mục cố định trên Google Drive của mình.
        </p>
      </div>
    </div>
  );
};

export default Settings;
