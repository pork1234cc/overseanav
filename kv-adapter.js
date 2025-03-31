import { kv } from '@vercel/kv';

// 用户相关操作
export async function getUser(username) {
  const users = await kv.get('users') || [];
  return users.find(user => user.username === username);
}

export async function createUser(user) {
  const users = await kv.get('users') || [];
  const newUser = { ...user, id: users.length + 1 };
  users.push(newUser);
  await kv.set('users', users);
  return newUser;
}

// 网站相关操作
export async function getSites() {
  return await kv.get('sites') || [];
}

export async function createSite(site) {
  const sites = await kv.get('sites') || [];
  const newSite = { ...site, id: sites.length + 1 };
  sites.push(newSite);
  await kv.set('sites', sites);
  return newSite;
} 