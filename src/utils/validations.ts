export const validateEmail = (email: string): string | null => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!re.test(email)) {
    return "Invalid email address";
  }
  return null;
};
