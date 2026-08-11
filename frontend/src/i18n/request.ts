import { getRequestConfig } from "next-intl/server";

export default getRequestConfig(async () => {
  const locale = "en";

  const [navbar, common, footer, home, services, about] = await Promise.all([
    import(`../../messages/${locale}/navbar.json`),
    import(`../../messages/${locale}/common.json`),
    import(`../../messages/${locale}/footer.json`),
    import(`../../messages/${locale}/home.json`),
    import(`../../messages/${locale}/services.json`),
    import(`../../messages/${locale}/about.json`),
  ]);

  return {
    locale,
    messages: {
      Navbar: navbar.default,
      Common: common.default,
      Footer: footer.default,
      Home: home.default,
      Services: services.default,
      About: about.default,
    },
  };
});
