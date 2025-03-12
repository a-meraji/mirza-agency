import fs from "fs";
import path from "path";
import matter from "gray-matter";

export function getBlogContent(slug: string) {
  const filePath = path.join(process.cwd(), "src/content/blogs", `${slug}.md`);
  const fileContent = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(fileContent);

  return { metadata: data, content };
}

export function getBlogList() {
  const blogsDir = path.join(process.cwd(), "src/content/blogs");
  const files = fs.readdirSync(blogsDir);

  return files.map((file) => {
    const slug = file.replace(".md", "");
    const { metadata } = getBlogContent(slug);
    return { slug, ...metadata };
  });
}

