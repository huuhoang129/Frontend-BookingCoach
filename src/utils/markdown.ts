//src/utils/markdown.ts

// Tách markdown thành các block text / image
export function parseMarkdownToBlocks(content: string) {
  const blocks: {
    blockType: "text" | "image";
    content?: string;
    imageUrl?: string;
  }[] = [];

  const lines = content.split("\n");

  for (let line of lines) {
    line = line.trim();
    if (!line) continue;

    // Kiểm tra dòng có chứa ảnh markdown ![](url)
    const imgMatch = line.match(/!\[.*?\]\((.*?)\)/);

    if (imgMatch) {
      let imageUrl = imgMatch[1];

      // Bỏ prefix backend nếu tồn tại (tránh lưu URL tuyệt đối)
      const backendPrefix = `${import.meta.env.VITE_BACKEND_URL}/upload/`;
      if (imageUrl.startsWith(backendPrefix)) {
        imageUrl = imageUrl.replace(backendPrefix, "");
      }

      blocks.push({ blockType: "image", imageUrl });
    } else {
      blocks.push({ blockType: "text", content: line });
    }
  }

  return blocks;
}

// Chuyển danh sách block → markdown
export function blocksToMarkdown(
  blocks: {
    blockType: "text" | "image";
    content?: string;
    imageUrl?: string;
  }[]
): string {
  if (!Array.isArray(blocks)) return "";

  return blocks
    .map((block) => {
      // Render markdown ảnh
      if (block.blockType === "image" && block.imageUrl) {
        const backendPrefix = `${import.meta.env.VITE_BACKEND_URL}/upload/`;

        // Nếu ảnh không phải http → prepend backend URL
        const url = block.imageUrl.startsWith("http")
          ? block.imageUrl
          : `${backendPrefix}${block.imageUrl}`;

        return `![image](${url})`;
      }

      // Render text
      return block.content || "";
    })
    .join("\n\n");
}
