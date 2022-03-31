import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";
import remarkGfm from "remark-gfm";
import orderBy from "lodash/orderBy";
import { format } from "date-fns";

export const guidesDirectory = path.join(process.cwd(), "guides");
export const blogDirectory = path.join(process.cwd(), "blog");

export interface PostData {
  id: string;
  date: string;
  formattedDate: string;
  title: string;
  description: string;
  excerpt: string;
  author?: string;
}

export interface Post extends PostData {
  contentHtml: string;
  excerptHtml: string;
}

export async function getSortedPostsData(directory: string): Promise<Post[]> {
  // Get file names under /posts
  const fileNames = fs.readdirSync(directory);
  const allPostsData = await Promise.all(
    fileNames.map(async (fileName) => {
      // Remove ".md" from file name to get id
      const id = fileName.replace(/\.md$/, "");

      return getPostData(directory, id);
    })
  );

  // Sort posts by date
  return orderBy(allPostsData, ["date"], ["desc"]);
}

export function getAllPostIds(directory: string) {
  const fileNames = fs.readdirSync(directory);

  // Returns an array that looks like this:
  // [
  //   {
  //     params: {
  //       id: 'ssg-ssr'
  //     }
  //   },
  //   {
  //     params: {
  //       id: 'pre-rendering'
  //     }
  //   }
  // ]
  return fileNames.map((fileName) => {
    return {
      params: {
        id: fileName.replace(/\.md$/, ""),
      },
    };
  });
}

export async function getPostData(
  directory: string,
  id: string
): Promise<Post> {
  const fullPath = path.join(directory, `${id}.md`);
  const fileContents = fs.readFileSync(fullPath, "utf8");

  // Use gray-matter to parse the post metadata section
  const matterResult = matter(fileContents, { excerpt: true });

  // Use remark to convert markdown into HTML string
  const processedContent = await remark()
    .use(html)
    .use(remarkGfm)
    .process(matterResult.content);
  const contentHtml = processedContent.toString();

  const excerpt = await remark()
    .use(html)
    .use(remarkGfm)
    .process(matterResult.excerpt || "");
  const excerptHtml = excerpt.toString();

  const formattedDate = format(new Date(matterResult.data.date), "PPPP");

  // Combine the data with the id and contentHtml
  return {
    ...matterResult.data,
    formattedDate: formattedDate,
    id,
    contentHtml,
    excerptHtml,
    excerpt: matterResult.excerpt || "",
  } as Post;
}
