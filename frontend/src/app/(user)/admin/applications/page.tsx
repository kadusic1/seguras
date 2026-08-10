import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getApplicationsPage } from "@/features/jobs/queries";
import { ITEMS_PER_PAGE } from "@/lib/pagination";
import { ApplicationsClient } from "./client";

export default async function ApplicationsPage() {
  const session = await auth();
  if (!session?.accessToken) {
    redirect("/login");
  }

  const initialData = await getApplicationsPage(
    1,
    ITEMS_PER_PAGE,
    session.accessToken,
  );

  return <ApplicationsClient initialData={initialData} />;
}
