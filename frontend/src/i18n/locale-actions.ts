"use server";

import { cookies } from "next/headers";
import { type Locale, localeCookieName } from "./locale";

export async function setUserLocale(locale: Locale) {
  const cookieStore = await cookies();
  cookieStore.set(localeCookieName, locale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365, // 1 year
    sameSite: "lax",
  });
}
