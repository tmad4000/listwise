import matter from 'gray-matter';
import fs from 'fs';
import path from 'path';

export type Visibility = 'public' | 'unlisted' | 'private';

export interface ListMeta {
  title: string;
  description: string;
  category: string;
  tags: string[];
  created: string;
  updated: string;
  visibility: Visibility;
}

export interface ListData {
  meta: ListMeta;
  content: string;
  owner: string;
  slug: string;
}

export interface ListSummary {
  title: string;
  description: string;
  category: string;
  tags: string[];
  owner: string;
  slug: string;
  updated: string;
  visibility: Visibility;
}

const DATA_DIR = path.join(process.cwd(), 'data');

export function getDataDir(): string {
  return DATA_DIR;
}

export function parseListFile(filePath: string): { meta: ListMeta; content: string } {
  const raw = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(raw);
  // Support legacy `public: true/false` and new `visibility` field
  let visibility: Visibility = 'public';
  if (data.visibility) {
    visibility = data.visibility;
  } else if (data.public === false) {
    visibility = 'unlisted';
  }

  return {
    meta: {
      title: data.title || 'Untitled',
      description: data.description || '',
      category: data.category || 'uncategorized',
      tags: data.tags || [],
      created: data.created || new Date().toISOString(),
      updated: data.updated || new Date().toISOString(),
      visibility,
    },
    content: content.trim(),
  };
}

export function serializeList(meta: ListMeta, content: string): string {
  return matter.stringify(content, meta as unknown as Record<string, unknown>);
}

export function getAllLists(filters?: {
  category?: string;
  tag?: string;
  user?: string;
  q?: string;
  viewer?: string; // authenticated user requesting the lists
}): ListSummary[] {
  const lists: ListSummary[] = [];

  if (!fs.existsSync(DATA_DIR)) return lists;

  const owners = fs.readdirSync(DATA_DIR).filter((d) => {
    const full = path.join(DATA_DIR, d);
    return fs.statSync(full).isDirectory();
  });

  for (const owner of owners) {
    if (filters?.user && owner !== filters.user) continue;

    const ownerDir = path.join(DATA_DIR, owner);
    const files = fs.readdirSync(ownerDir).filter((f) => f.endsWith('.md'));

    for (const file of files) {
      const filePath = path.join(ownerDir, file);
      const { meta } = parseListFile(filePath);

      // public: shown to everyone in browse
      // unlisted: not in browse, but accessible by direct URL
      // private: only visible to owner
      if (meta.visibility === 'private' && owner !== filters?.viewer) continue;
      if (meta.visibility === 'unlisted') continue; // never in browse results

      const slug = file.replace(/\.md$/, '');
      const summary: ListSummary = {
        title: meta.title,
        description: meta.description,
        category: meta.category,
        tags: meta.tags,
        owner,
        slug,
        updated: meta.updated,
        visibility: meta.visibility,
      };

      if (filters?.category && meta.category !== filters.category) continue;
      if (filters?.tag && !meta.tags.includes(filters.tag)) continue;
      if (filters?.q) {
        const q = filters.q.toLowerCase();
        const match =
          meta.title.toLowerCase().includes(q) ||
          meta.description.toLowerCase().includes(q) ||
          meta.tags.some((t) => t.toLowerCase().includes(q));
        if (!match) continue;
      }

      lists.push(summary);
    }
  }

  lists.sort((a, b) => new Date(b.updated).getTime() - new Date(a.updated).getTime());
  return lists;
}

export function getList(owner: string, slug: string): ListData | null {
  const filePath = path.join(DATA_DIR, owner, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;

  const { meta, content } = parseListFile(filePath);
  return { meta, content, owner, slug };
}

export function saveList(owner: string, slug: string, meta: ListMeta, content: string): void {
  const ownerDir = path.join(DATA_DIR, owner);
  if (!fs.existsSync(ownerDir)) {
    fs.mkdirSync(ownerDir, { recursive: true });
  }
  const filePath = path.join(ownerDir, `${slug}.md`);
  fs.writeFileSync(filePath, serializeList(meta, content));
}

export function deleteList(owner: string, slug: string): boolean {
  const filePath = path.join(DATA_DIR, owner, `${slug}.md`);
  if (!fs.existsSync(filePath)) return false;
  fs.unlinkSync(filePath);
  return true;
}

export function getCategories(): string[] {
  const lists = getAllLists();
  const cats = new Set(lists.map((l) => l.category));
  return [...cats].sort();
}
