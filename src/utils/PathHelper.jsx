export const getSlug = () => {
  return localStorage.getItem("slug");
};

export const getBasePath = () => {
  const slug = getSlug();
  return slug ? `/${slug}` : "/org"; // fallback
};