import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
export const isGeminiConfigured = Boolean(apiKey);

// Safe fallback: if no API key, provide a mock chat session so the app doesn't crash
export const startChat = () => {
  if (!apiKey) {
    // Minimal mock compatible with the parts we use in MiniBotPage
    return {
      async sendMessage(input: string) {
        // Çeşitli eğitici ve çocuk dostu cevaplar
        const replies = [
          `Harika soru! "${input}" ile ilgili eğlenceli bir deney yapalım! 🔬`,
          "Bilimi seviyorum! Bu konuda basit bir deney önerebilirim. 🌟",
          "Merak ettin mi? Güvenli malzemelerle küçük bir keşif yapalım! 🧪",
          "Bu çok ilginç! Evde kolayca deneyebileceğin bir şey var. ⚡",
          "Bilim çok eğlenceli! Bu konuda neler düşünüyorsun? 🤔",
          "Hayal gücün süper! Basit malzemelerle test edelim. 🎨",
        ];
        // Rasgele ama input'a dayalı seçim
        const index = input.length % replies.length;
        const text = replies[index];
        return { response: { text: () => text } } as any;
      },
    } as any;
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  return model.startChat({
    history: [
      {
        role: 'user',
        parts: [
          {
            text:
              "ROLE: You are MiniBot, a friendly Turkish science guide for kids (ages 4–10).\nGOALS: Encourage curiosity, keep answers SHORT (1–3 cümle), simple, fun.\nSTYLE: Sade Türkçe, sıcak ve pozitif. 2–3 uygun emoji, farklı kullan (tek tip tekrar etme).\nSAFETY: Tehlikeli adımlarda uyar ve yetişkin gözetimini hatırlat.\nINTERACTION: Çocuğa tek bir net soru sor (evet/hayır ya da basit seçeneklerle).\nDIVERSITY: Aynı öneriyi arka arkaya tekrarlama; farklı fikirler üret.\nEXAMPLES: Basit benzetmeler, günlük eşyalardan örnekler.\nOUTPUT: Kısa, düzenli, 1–2 satır + 1 soru.",
          },
        ],
      },
      {
        role: 'model',
        parts: [
          {
            text:
              "Merhaba! Ben MiniBot! 🤖 Bilimi eğlenceli hale getirelim! Bugün neye merak ettin? ✨",
          },
        ],
      },
    ],
    generationConfig: {
      maxOutputTokens: 200,
    },
  });
};


