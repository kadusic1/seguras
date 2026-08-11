import { getRequestConfig } from "next-intl/server";

export default getRequestConfig(async () => {
  const locale = "en";

  const [navbar, common] = await Promise.all([
    import(`../../messages/${locale}/navbar.json`),
    import(`../../messages/${locale}/common.json`),
  ]);

  return {
    locale,
    messages: {
      Navbar: navbar.default,
      Common: common.default,
    },
  };
});
