import { useState, useEffect } from "react";
import { message } from "antd";
import {
  getAllNews,
  createNews,
  updateNews,
  getNewsById,
  deleteNews,
} from "../services/systemServices/newServices.ts";
import { parseMarkdownToBlocks, blocksToMarkdown } from "../utils/markdown";
import { toBase64 } from "../utils/base64";

interface Author {
  id: number;
  firstName: string;
  lastName: string;
}

export interface News {
  id: number;
  thumbnail: string;
  title: string;
  author: Author;
  status: string;
  newsType: string;
}

async function getThumbnailBase64(
  thumbnail: any[],
  isEdit = false
): Promise<string | undefined | null> {
  if (!Array.isArray(thumbnail) || thumbnail.length === 0) {
    return isEdit ? undefined : null;
  }
  const file = thumbnail[0];
  if (file.originFileObj instanceof Blob) {
    return await toBase64(file.originFileObj);
  }
  return isEdit ? undefined : null;
}

export function useNews() {
  const [newsList, setNewsList] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedNews, setSelectedNews] = useState<any>(null);

  // filter
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [typeFilter, setTypeFilter] = useState<string>("");

  const fetchNews = async () => {
    setLoading(true);
    try {
      const res = await getAllNews();
      if (res.data?.errCode === 0) {
        setNewsList(res.data.data || []);
      } else {
        message.error(res.data?.errMessage || "Lỗi tải tin tức");
      }
    } catch (e) {
      console.error(e);
      message.error("Không thể tải danh sách tin tức");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  // CRUD
  const handleCreateSubmit = async (values: any, cb?: () => void) => {
    const thumbnailBase64 = await getThumbnailBase64(values.thumbnail, false);
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (!user.id) return message.error("Bạn cần đăng nhập");

    const payload = {
      title: values.title,
      thumbnailBase64,
      authorId: user.id,
      status: values.status,
      newsType: values.newsType,
      blocks: parseMarkdownToBlocks(values.content),
    };

    try {
      const res = await createNews(payload);
      if (res.data?.errCode === 0) {
        message.success("Thêm tin tức thành công");
        cb?.(); // 👈 chỉ gọi nếu có
        fetchNews();
      } else {
        message.error(res.data?.errMessage || "Thêm thất bại");
      }
    } catch {
      message.error("Không thể gửi dữ liệu");
    }
  };

  const handleEditSubmit = async (values: any, cb?: () => void) => {
    const thumbnailBase64 = await getThumbnailBase64(values.thumbnail, true);
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (!user.id) return message.error("Bạn cần đăng nhập");

    const payload: any = {
      id: selectedNews.id,
      title: values.title,
      authorId: user.id,
      status: values.status,
      newsType: values.newsType,
      blocks: parseMarkdownToBlocks(values.content),
    };

    if (thumbnailBase64 !== undefined)
      payload.thumbnailBase64 = thumbnailBase64;

    try {
      const res = await updateNews(payload);
      if (res.data?.errCode === 0) {
        message.success("Cập nhật thành công");
        cb?.(); // 👈 chỉ gọi nếu có
        fetchNews();
      } else {
        message.error(res.data?.errMessage || "Cập nhật thất bại");
      }
    } catch {
      message.error("Không thể cập nhật");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const res = await deleteNews(id);
      if (res.data?.errCode === 0) {
        message.success("Xoá thành công");
        fetchNews();
      } else {
        message.error(res.data?.errMessage || "Xoá thất bại");
      }
    } catch {
      message.error("Không thể xoá tin tức");
    }
  };

  const handleGetById = async (id: number, onOpen: () => void) => {
    const res = await getNewsById(id);
    if (res.data?.errCode === 0) {
      const detail = res.data.data;
      setSelectedNews({
        id: detail.id,
        title: detail.title,
        status: detail.status,
        newsType: detail.newsType,
        content: blocksToMarkdown(detail.details || []),
        thumbnail: detail.thumbnail
          ? [
              {
                uid: "-1",
                url: detail.thumbnail,
                name: "thumbnail.png",
                status: "done",
              },
            ]
          : [],
      });
      onOpen();
    }
  };

  return {
    newsList,
    loading,
    selectedNews,
    setSelectedNews,
    statusFilter,
    setStatusFilter,
    typeFilter,
    setTypeFilter,
    fetchNews,
    handleCreateSubmit,
    handleEditSubmit,
    handleDelete,
    handleGetById,
  };
}
