import { getRequestConfig } from "next-intl/server";

export default getRequestConfig(async () => {
  const locale = "en";

  const [
    navbar,
    common,
    footer,
    home,
    services,
    about,
    jobs,
    placeholders,
    news,
    contact,
    applications,
    messages,
    login,
  ] = await Promise.all([
    import(`../../messages/${locale}/navbar.json`),
    import(`../../messages/${locale}/common.json`),
    import(`../../messages/${locale}/footer.json`),
    import(`../../messages/${locale}/home.json`),
    import(`../../messages/${locale}/services.json`),
    import(`../../messages/${locale}/about.json`),
    import(`../../messages/${locale}/jobs.json`),
    import(`../../messages/${locale}/placeholders.json`),
    import(`../../messages/${locale}/news.json`),
    import(`../../messages/${locale}/contact.json`),
    import(`../../messages/${locale}/applications.json`),
    import(`../../messages/${locale}/messages.json`),
    import(`../../messages/${locale}/login.json`),
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
      Jobs: jobs.default,
      Placeholders: placeholders.default,
      News: news.default,
      Contact: contact.default,
      Applications: applications.default,
      Messages: messages.default,
      Login: login.default,
    },
  };
});
