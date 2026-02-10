import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';

export interface User {
  username: string;
  displayName: string;
  passwordHash: string;
  isSample?: boolean;
  createdAt: string;
}

const USERS_FILE = path.join(process.cwd(), 'data', 'users.json');

function readUsers(): User[] {
  if (!fs.existsSync(USERS_FILE)) return [];
  return JSON.parse(fs.readFileSync(USERS_FILE, 'utf-8'));
}

function writeUsers(users: User[]): void {
  const dir = path.dirname(USERS_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

export function findUser(username: string): User | undefined {
  return readUsers().find((u) => u.username === username);
}

export function createUser(username: string, password: string, displayName: string, isSample = false): User {
  const users = readUsers();
  if (users.find((u) => u.username === username)) {
    throw new Error('Username already taken');
  }
  const user: User = {
    username,
    displayName,
    passwordHash: bcrypt.hashSync(password, 10),
    isSample,
    createdAt: new Date().toISOString(),
  };
  users.push(user);
  writeUsers(users);
  return user;
}

export function verifyPassword(user: User, password: string): boolean {
  return bcrypt.compareSync(password, user.passwordHash);
}

export function getAllUsers(): Omit<User, 'passwordHash'>[] {
  return readUsers().map(({ passwordHash, ...rest }) => rest);
}

export function getSampleUsers(): Omit<User, 'passwordHash'>[] {
  return readUsers()
    .filter((u) => u.isSample)
    .map(({ passwordHash, ...rest }) => rest);
}
