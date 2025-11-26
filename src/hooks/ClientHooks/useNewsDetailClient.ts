// src/hooks/useNewsDetail.ts
import { useEffect, useState } from "react";
import { getNewsById } from "../../services/systemServices/newServices.ts";

interface Block {
  id: number;
  blockType: "text" | "image";
  content?: string;
  imageUrl?: string;
}

interface Author {
  id: number;
  firstName: string;
  lastName: string;
}

export interface NewsDetail {
  id: number;
  title: string;
  thumbnail: string;
  createdAt: string;
  author: Author;
  details: Block[];
}

export function useNewsDetail(id?: string) {
  const [news, setNews] = useState<NewsDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        if (!id) return;

        const res = await getNewsById(Number(id));
        if (res.data.errCode === 0) {
          setNews(res.data.data);
        }
      } catch (err) {
        console.error("Lỗi lấy chi tiết tin tức:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [id]);

  return {
    news,
    loading,
  };
}
