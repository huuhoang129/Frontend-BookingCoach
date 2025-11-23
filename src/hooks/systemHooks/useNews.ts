// src/hooks/systemHooks/useNews.ts
import { useState, useEffect } from "react";
import {
  getAllNews,
  createNews,
  updateNews,
  getNewsById,
  deleteNews,
} from "../../services/systemServices/newServices.ts";
import { parseMarkdownToBlocks, blocksToMarkdown } from "../../utils/markdown";
import { toBase64 } from "../../utils/base64";
import { AppNotification } from "../../components/Notification/AppNotification";

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

  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState<string | null>(null);

  const { contextHolder, notifySuccess, notifyError } = AppNotification();

  const fetchNews = async () => {
    setLoading(true);
    try {
      const res = await getAllNews();
      if (res.data?.errCode === 0) {
        setNewsList(res.data.data || []);
      } else {
        notifyError("Lỗi hệ thống", res.data?.errMessage);
      }
    } catch {
      notifyError("Lỗi hệ thống", "Không thể tải danh sách tin tức.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  // thêm mới tin tức
  const handleCreateSubmit = async (values: any, cb?: () => void) => {
    const thumbnailBase64 = await getThumbnailBase64(values.thumbnail, false);

    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (!user.id) return notifyError("Lỗi hệ thống", "Bạn cần đăng nhập.");

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
        notifySuccess("Thành công", res.data.errMessage);
        cb?.();
        fetchNews();
      } else {
        notifyError("Lỗi hệ thống", res.data?.errMessage);
      }
    } catch {
      notifyError("Lỗi hệ thống", "Không thể thêm tin tức.");
    }
  };

  // cập nhật tin tức
  const handleEditSubmit = async (values: any, cb?: () => void) => {
    const thumbnailBase64 = await getThumbnailBase64(values.thumbnail, true);

    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (!user.id) return notifyError("Lỗi hệ thống", "Bạn cần đăng nhập.");

    const payload: any = {
      id: selectedNews.id,
      title: values.title,
      authorId: user.id,
      status: values.status,
      newsType: values.newsType,
      blocks: parseMarkdownToBlocks(values.content),
    };

    if (thumbnailBase64 !== undefined) {
      payload.thumbnailBase64 = thumbnailBase64;
    }

    try {
      const res = await updateNews(payload);
      if (res.data?.errCode === 0) {
        notifySuccess("Thành công", res.data.errMessage);
        cb?.();
        fetchNews();
      } else {
        notifyError("Lỗi hệ thống", res.data?.errMessage);
      }
    } catch {
      notifyError("Lỗi hệ thống", "Không thể cập nhật tin tức.");
    }
  };

  // xóa tin tức
  const handleDelete = async (id: number) => {
    try {
      const res = await deleteNews(id);
      if (res.data?.errCode === 0) {
        notifySuccess("Thành công", res.data.errMessage);
        fetchNews();
      } else {
        notifyError("Lỗi hệ thống", res.data?.errMessage);
      }
    } catch {
      notifyError("Lỗi hệ thống", "Không thể xoá tin tức.");
    }
  };

  // lấy chi tiết tin tức theo id
  const handleGetById = async (id: number, onOpen: () => void) => {
    try {
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
      } else {
        notifyError("Lỗi hệ thống", res.data?.errMessage);
      }
    } catch {
      notifyError("Lỗi hệ thống", "Không thể tải chi tiết tin tức.");
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
    contextHolder,
  };
}
