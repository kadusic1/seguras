import { auth } from "@/auth";
import { getNewsPage } from "@/features/news/queries";
import { ITEMS_PER_PAGE } from "@/lib/pagination";
import { NewsClient } from "./client";

export default async function NewsPage() {
  const [session, initialData] = await Promise.all([
    auth(),
    getNewsPage(1, ITEMS_PER_PAGE),
  ]);

  return <NewsClient initialData={initialData} isAdmin={!!session} />;
}
