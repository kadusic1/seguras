import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getMessagesPage } from "@/features/messages/queries";
import { ITEMS_PER_PAGE } from "@/lib/pagination";
import { MessagesClient } from "./client";

export default async function MessagesPage() {
  const session = await auth();
  if (!session?.accessToken) {
    redirect("/login");
  }

  const initialData = await getMessagesPage(
    1,
    ITEMS_PER_PAGE,
    session.accessToken,
  );

  return <MessagesClient initialData={initialData} />;
}
