export { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";

// For local development, redirect to the login page instead of OAuth
export const getLoginUrl = () => {
  return "/login";
};

