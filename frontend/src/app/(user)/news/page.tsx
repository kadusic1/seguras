import { auth } from "@/auth";
import { getNewsPage } from "@/features/news/queries";
import { NewsClient } from "./client";

export default async function NewsPage() {
  const [session, initialData] = await Promise.all([
    auth(),
    getNewsPage(1, 10),
  ]);

  return <NewsClient initialData={initialData} isAdmin={!!session} />;
}
