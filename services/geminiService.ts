
import { GoogleGenAI, Type } from "@google/genai";
import { Debtor, Transaction } from "../types";

export const analyzeDebts = async (debtors: Debtor[], transactions: Transaction[]) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const summary = debtors.map(d => ({
    name: d.name,
    type: d.type === 'CUSTOMER' ? 'Khách hàng (Phải thu)' : 'Nhà cung cấp (Phải trả)',
    balance: d.totalBalance,
    lastUpdate: d.lastUpdated
  }));

  const prompt = `
    Dưới đây là danh sách công nợ của tôi:
    ${JSON.stringify(summary, null, 2)}
    
    Hãy đóng vai một chuyên gia tư vấn tài chính. 
    1. Phân tích tình hình công nợ hiện tại (tổng nợ phải thu, tổng nợ phải trả).
    2. Chỉ ra các rủi ro (ví dụ: nợ quá tập trung vào 1 khách hàng, hoặc nợ quá lớn).
    3. Đưa ra 3 lời khuyên hành động cụ thể để tối ưu dòng tiền.
    
    Hãy viết bằng tiếng Việt, ngắn gọn, súc tích, định dạng Markdown.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("AI Analysis Error:", error);
    return "Không thể kết nối với trí tuệ nhân tạo lúc này. Vui lòng thử lại sau.";
  }
};
