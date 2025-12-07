import bcrypt from 'bcryptjs';

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export function generateEmployeeId(count: number) {
  return `EMP${String(count + 1).padStart(4, '0')}`;
}
