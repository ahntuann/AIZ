import { NextResponse } from "next/server";

// Chọn model. Llama 3 8B là miễn phí, siêu nhanh và rất thông minh
const MODEL = "llama-3.3-70b-versatile";
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_API_KEY = process.env.GROQ_API_KEY;

console.log("GROQ API KEY ĐƯỢC LOAD:", GROQ_API_KEY);

export async function POST(req: Request) {
  if (!GROQ_API_KEY) {
    return NextResponse.json(
      { error: "Chưa cài đặt GROQ_API_KEY" },
      { status: 500 }
    );
  }

  try {
    const body = await req.json();
    // Lấy thông tin từ frontend (frontend không cần thay đổi)
    const { role, level, messages } = body;

    // --- Đây là phần Prompt mới, chuẩn cho Groq/Llama 3 ---
    const systemPrompt = {
      role: "system",
      content: `Bạn là một nhà tuyển dụng AI chuyên nghiệp tên 'InterviewerAI'. Bạn đang phỏng vấn một ứng viên cho vị trí ${role} (trình độ ${level}).
      Nhiệm vụ của bạn:
      1. Chỉ hỏi TỪNG CÂU HỎI MỘT.
      2. Nếu mảng tin nhắn rỗng, hãy chào và hỏi câu đầu tiên.
      3. Dựa vào câu trả lời của ứng viên (tin nhắn 'user' cuối cùng), hãy hỏi câu tiếp theo.
      4. Cố gắng hỏi tổng cộng 10 câu.
      5. Sau khi ứng viên trả lời câu thứ 10, thay vì hỏi tiếp, hãy đưa ra một đánh giá chi tiết BẮT ĐẦU BẰNG '---ĐÁNH GIÁ CUỘC PHỎNG VẤN---'.
      Phần đánh giá phải có:
      - Điểm mạnh: [phân tích]
      - Điểm cần cải thiện: [phân tích]
      - Gợi ý: [gợi ý]
      - Tổng kết: [kết luận]
      ---KẾT THÚC ĐÁNH GIÁ---`,
    };

    // Kết hợp prompt hệ thống với lịch sử chat
    // 'messages' từ frontend đã có format [{role: 'user', content: '...'}, {role: 'assistant', content: '...'}]
    const apiMessages = [systemPrompt, ...messages];
    // ----------------------------------------------------

    // Gọi API Groq
    const response = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: MODEL,
        messages: apiMessages, // Gửi mảng tin nhắn đã có system prompt
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Groq API Error:", errorText);
      return NextResponse.json(
        { error: "Lỗi API từ Groq", details: errorText },
        { status: 500 }
      );
    }

    const data = await response.json();

    // Lấy nội dung trả lời (chuẩn OpenAI)
    const reply =
      data.choices[0]?.message?.content || "Tôi không thể trả lời lúc này.";

    return NextResponse.json({ reply });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Lỗi hệ thống" }, { status: 500 });
  }
}
