
import React, { useState, useEffect } from 'react';
import { analyzeDebts } from '../services/geminiService';
import { Debtor, Transaction } from '../types';
import { Icons } from '../constants';

interface AIInsightsProps {
  debtors: Debtor[];
  transactions: Transaction[];
}

const AIInsights: React.FC<AIInsightsProps> = ({ debtors, transactions }) => {
  const [insight, setInsight] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchInsights = async () => {
    setLoading(true);
    const result = await analyzeDebts(debtors, transactions);
    setInsight(result || "Không tìm thấy dữ liệu phân tích.");
    setLoading(false);
  };

  useEffect(() => {
    if (!insight) {
      fetchInsights();
    }
  }, []);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-3xl p-8 text-white mb-8 shadow-xl shadow-blue-200/50">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-sm">
              <Icons.AI /> AI Assistant
            </div>
            <h2 className="text-3xl font-bold">Phân tích Công nợ Thông minh</h2>
            <p className="text-blue-100/80 max-w-md">
              Hệ thống sử dụng trí tuệ nhân tạo để phân tích rủi ro, dự báo dòng tiền và đưa ra gợi ý thu hồi nợ tối ưu cho bạn.
            </p>
          </div>
          <button 
            onClick={fetchInsights}
            disabled={loading}
            className={`w-12 h-12 rounded-2xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all ${loading ? 'animate-spin' : ''}`}
          >
            <i className="fa-solid fa-rotate-right"></i>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 min-h-[400px]">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-full space-y-4 py-12">
            <div className="relative">
               <div className="w-16 h-16 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
               <div className="absolute inset-0 flex items-center justify-center text-blue-600">
                  <Icons.AI />
               </div>
            </div>
            <p className="text-slate-500 font-medium animate-pulse">AI đang phân tích dữ liệu của bạn...</p>
          </div>
        ) : insight ? (
          <div className="prose prose-slate max-w-none">
            {/* Simple Markdown Rendering alternative since we don't have a library */}
            <div className="whitespace-pre-wrap text-slate-700 leading-relaxed text-lg">
              {insight.split('\n').map((line, i) => (
                <p key={i} className={line.startsWith('#') ? 'font-bold text-slate-900 text-xl mt-4 mb-2' : 'mb-2'}>
                  {line}
                </p>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-20">
             <p className="text-slate-400">Bấm nút cập nhật để bắt đầu phân tích.</p>
          </div>
        )}
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100">
          <h4 className="font-bold text-emerald-800 flex items-center gap-2 mb-2">
            <i className="fa-solid fa-shield-halved"></i> Bảo mật dữ liệu
          </h4>
          <p className="text-emerald-700/80 text-sm">
            Dữ liệu của bạn được mã hóa và chỉ sử dụng cho mục đích phân tích trong phiên làm việc này.
          </p>
        </div>
        <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
          <h4 className="font-bold text-blue-800 flex items-center gap-2 mb-2">
            <i className="fa-solid fa-lightbulb"></i> Tips
          </h4>
          <p className="text-blue-700/80 text-sm">
            Để AI phân tích chính xác nhất, hãy cập nhật đầy đủ các ghi chú trong từng giao dịch.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AIInsights;
