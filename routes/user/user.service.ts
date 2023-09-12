import bcrypt from 'bcrypt';

export async function hashText(plainText: string) {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(plainText, salt);
  return hashedPassword;
}
