import axios from 'axios';
import { GEMINI_API_KEY } from '../config';

const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`;

interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
  }>;
}

export const getGeminiResponse = async (prompt: string): Promise<string> => {
  if (GEMINI_API_KEY === 'YOUR_GEMINI_API_KEY_HERE') {
    throw new Error('API Key belum diatur. Silakan edit file config.ts');
  }

  try {
    const response = await axios.post<GeminiResponse>(API_URL, {
      contents: [{
        parts: [{
          text: prompt
        }]
      }]
    });

    if (response.data.candidates && response.data.candidates.length > 0) {
      return response.data.candidates[0].content.parts[0].text;
    } else {
      throw new Error('Respons dari API tidak valid atau kosong.');
    }
  } catch (error)_ {
    if (axios.isAxiosError(error)) {
      console.error('Axios error calling Gemini API:', error.response?.data || error.message);
      throw new Error(`Gagal berkomunikasi dengan Gemini API: ${error.response?.status}`);
    } else {
      console.error('Unknown error calling Gemini API:', error);
      throw new Error('Terjadi kesalahan yang tidak diketahui saat memanggil Gemini API.');
    }
  }
};
