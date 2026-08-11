import { getRequestConfig } from "next-intl/server";

export default getRequestConfig(async () => {
  const locale = "en";

  const [navbar, common, footer] = await Promise.all([
    import(`../../messages/${locale}/navbar.json`),
    import(`../../messages/${locale}/common.json`),
    import(`../../messages/${locale}/footer.json`),
  ]);

  return {
    locale,
    messages: {
      Navbar: navbar.default,
      Common: common.default,
      Footer: footer.default,
    },
  };
});
