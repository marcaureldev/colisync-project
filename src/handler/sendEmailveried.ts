export const sendEmailVeried = async ({
  email,
  redirectLink,
  otp,
}: {
  redirectLink: string;
  email: string;
  otp: string;
}) => {
  const redirectLinkEncoded = `${redirectLink}&otp=${otp}`;
  try {
  } catch (error) {}
};
