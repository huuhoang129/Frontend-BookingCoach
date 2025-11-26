// src/hooks/useNews.ts
import { useEffect, useState } from "react";
import { getAllNews } from "../../services/systemServices/newServices.ts";

interface Author {
  id: number;
  firstName: string;
  lastName: string;
}

interface NewsDetail {
  blockType: "text" | "image";
  content?: string;
  imageUrl?: string;
}

export interface News {
  id: number;
  title: string;
  thumbnail: string;
  createdAt: string;
  newsType: string;
  author: Author;
  details?: NewsDetail[];
}

export function useNews() {
  const [newsList, setNewsList] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await getAllNews();
        if (res && res.data && Array.isArray(res.data.data)) {
          setNewsList(res.data.data);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  // Lọc tin theo loại
  const newsItems = newsList.filter((n) => n.newsType === "News");
  const featureItems = newsList.filter((n) => n.newsType === "Featured");

  // Tin nổi bật
  const topNews = newsItems.slice(0, 2);
  const topFeatures = featureItems.slice(0, 3);

  return {
    newsList,
    loading,
    newsItems,
    featureItems,
    topNews,
    topFeatures,
  };
}
