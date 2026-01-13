
import React, { useState } from 'react';
import { Icons } from '../constants';

interface LoginPageProps {
  onLogin: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  
  // Form states
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isLoginMode && formData.password !== formData.confirmPassword) {
      alert("Mật khẩu xác nhận không khớp!");
      return;
    }

    setIsLoading(true);
    // Giả lập xử lý API (Đăng ký hoặc Đăng nhập)
    setTimeout(() => {
      onLogin();
      setIsLoading(false);
    }, 1200);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 p-8 md:p-12 animate-in fade-in zoom-in duration-500">
        <div className="flex flex-col items-center mb-10">
          <div className="w-20 h-20 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-3xl flex items-center justify-center text-white text-4xl shadow-xl shadow-blue-200 mb-6 rotate-3 hover:rotate-0 transition-transform duration-300">
            <Icons.Wallet />
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">SmartDebt</h1>
          <p className="text-slate-400 text-sm text-center mt-2 font-medium">
            {isLoginMode ? 'Chào mừng bạn quay trở lại' : 'Bắt đầu quản lý tài chính ngay hôm nay'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLoginMode && (
            <div className="animate-in slide-in-from-top-4 duration-300">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2 ml-1">Họ và tên</label>
              <input 
                name="name"
                type="text"
                required
                className="w-full px-6 py-4 rounded-2xl border border-slate-100 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all bg-slate-50/50 font-medium"
                placeholder="Nguyễn Văn A"
                value={formData.name}
                onChange={handleInputChange}
              />
            </div>
          )}

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2 ml-1">Email hoặc Số điện thoại</label>
            <input 
              name="email"
              type="text"
              required
              className="w-full px-6 py-4 rounded-2xl border border-slate-100 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all bg-slate-50/50 font-medium"
              placeholder="admin@smartdebt.vn"
              value={formData.email}
              onChange={handleInputChange}
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2 ml-1">Mật khẩu</label>
            <div className="relative">
              <input 
                name="password"
                type="password"
                required
                className="w-full px-6 py-4 rounded-2xl border border-slate-100 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all bg-slate-50/50 font-medium"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleInputChange}
              />
            </div>
          </div>

          {!isLoginMode && (
            <div className="animate-in slide-in-from-top-2 duration-300">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2 ml-1">Xác nhận mật khẩu</label>
              <input 
                name="confirmPassword"
                type="password"
                required
                className="w-full px-6 py-4 rounded-2xl border border-slate-100 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all bg-slate-50/50 font-medium"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleInputChange}
              />
            </div>
          )}

          {isLoginMode && (
            <div className="flex items-center justify-between px-1 py-1">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input type="checkbox" className="w-4 h-4 rounded-lg text-blue-600 border-slate-200 focus:ring-0 transition-all" />
                <span className="text-xs text-slate-500 font-medium group-hover:text-slate-700">Ghi nhớ</span>
              </label>
              <button type="button" className="text-xs text-blue-600 font-bold hover:text-blue-700 transition-colors">Quên mật khẩu?</button>
            </div>
          )}

          <button 
            type="submit"
            disabled={isLoading}
            className="w-full bg-slate-900 text-white py-5 rounded-2xl font-bold shadow-xl shadow-slate-200 active:scale-[0.97] transition-all flex items-center justify-center gap-3 mt-6 uppercase tracking-widest text-sm"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <>{isLoginMode ? 'Đăng nhập ngay' : 'Tạo tài khoản'}</>
            )}
          </button>
        </form>

        <div className="mt-10 text-center">
          <p className="text-sm text-slate-500 font-medium">
            {isLoginMode ? 'Chưa có tài khoản?' : 'Đã có tài khoản?'}
            <button 
              onClick={() => {
                setIsLoginMode(!isLoginMode);
                setFormData({ name: '', email: '', password: '', confirmPassword: '' });
              }}
              className="text-blue-600 font-extrabold hover:text-blue-700 ml-2 transition-colors inline-flex items-center gap-1 group"
            >
              {isLoginMode ? 'Đăng ký ngay' : 'Đăng nhập ngay'}
              <i className="fa-solid fa-arrow-right text-[10px] group-hover:translate-x-1 transition-transform"></i>
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
