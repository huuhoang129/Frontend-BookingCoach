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
    const imgMatch = line.match(/!\[.*?\]\((.*?)\)/);
    if (imgMatch) {
      let imageUrl = imgMatch[1];
      const backendPrefix = `${import.meta.env.VITE_BACKEND_URL}/upload/`;
      if (imageUrl.startsWith(backendPrefix)) {
        imageUrl = imageUrl.replace(backendPrefix, "");
      }

      blocks.push({
        blockType: "image",
        imageUrl,
      });
    } else {
      blocks.push({
        blockType: "text",
        content: line,
      });
    }
  }

  return blocks;
}

// blocks → markdown
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
      if (block.blockType === "image" && block.imageUrl) {
        const backendPrefix = `${import.meta.env.VITE_BACKEND_URL}/upload/`;
        const url = block.imageUrl.startsWith("http")
          ? block.imageUrl
          : `${backendPrefix}${block.imageUrl}`;

        return `![image](${url})`;
      }
      return block.content || "";
    })
    .join("\n\n");
}
