import { Router } from 'express';
import { nanoid } from 'nanoid';
import { getAllLists, getList, saveList, deleteList, getCategories, type ListMeta } from '../utils/frontmatter.js';
import { slugify } from '../utils/slugify.js';
import { optionalAuth, requireAuth, signEditToken, verifyEditToken } from '../middleware/auth.js';

export const listsRouter = Router();

// Browse all public lists (+ own private lists if logged in)
listsRouter.get('/', optionalAuth, (req, res) => {
  const { category, tag, user, q } = req.query;
  const lists = getAllLists({
    category: category as string,
    tag: tag as string,
    user: user as string,
    q: q as string,
    viewer: req.user?.username,
  });
  res.json({ lists });
});

// Get categories
listsRouter.get('/categories', (_req, res) => {
  res.json({ categories: getCategories() });
});

// Get single list
listsRouter.get('/:owner/:slug', optionalAuth, (req, res) => {
  const owner = req.params.owner as string;
  const slug = req.params.slug as string;
  const list = getList(owner, slug);
  if (!list) {
    res.status(404).json({ error: 'List not found' });
    return;
  }
  // Private lists only visible to the owner
  if (list.meta.visibility === 'private' && req.user?.username !== owner) {
    res.status(404).json({ error: 'List not found' });
    return;
  }
  res.json(list);
});

// Create list
listsRouter.post('/', optionalAuth, (req, res) => {
  const { title, description, category, tags, content, visibility } = req.body;

  if (!title || !content) {
    res.status(400).json({ error: 'title and content are required' });
    return;
  }

  const owner = req.user?.username || '_anonymous';
  const slug = req.user ? slugify(title) : nanoid(8);

  // Ensure unique slug
  let finalSlug = slug;
  if (getList(owner, finalSlug)) {
    finalSlug = `${slug}-${nanoid(4)}`;
  }

  const now = new Date().toISOString();
  const meta: ListMeta = {
    title,
    description: description || '',
    category: category || 'uncategorized',
    tags: tags || [],
    created: now,
    updated: now,
    visibility: visibility || 'public',
  };

  saveList(owner, finalSlug, meta, content);

  const response: Record<string, unknown> = {
    owner,
    slug: finalSlug,
    meta,
  };

  // For anonymous lists, return an edit token
  if (!req.user) {
    response.editToken = signEditToken(owner, finalSlug);
  }

  res.status(201).json(response);
});

// Update list
listsRouter.put('/:owner/:slug', optionalAuth, (req, res) => {
  const owner = req.params.owner as string;
  const slug = req.params.slug as string;
  const existing = getList(owner, slug);

  if (!existing) {
    res.status(404).json({ error: 'List not found' });
    return;
  }

  // Check authorization
  const isOwner = req.user?.username === owner;
  const editToken = req.headers['x-edit-token'] as string;
  const tokenValid = editToken ? verifyEditToken(editToken) : null;
  const hasEditAccess = tokenValid && tokenValid.owner === owner && tokenValid.slug === slug;

  if (!isOwner && !hasEditAccess) {
    res.status(403).json({ error: 'Not authorized to edit this list' });
    return;
  }

  const { title, description, category, tags, content, visibility } = req.body;

  const meta: ListMeta = {
    title: title ?? existing.meta.title,
    description: description ?? existing.meta.description,
    category: category ?? existing.meta.category,
    tags: tags ?? existing.meta.tags,
    created: existing.meta.created,
    updated: new Date().toISOString(),
    visibility: visibility ?? existing.meta.visibility,
  };

  saveList(owner, slug, meta, content ?? existing.content);
  res.json({ owner, slug, meta });
});

// Delete list
listsRouter.delete('/:owner/:slug', requireAuth, (req, res) => {
  const owner = req.params.owner as string;
  const slug = req.params.slug as string;

  if (req.user!.username !== owner) {
    res.status(403).json({ error: 'Not authorized to delete this list' });
    return;
  }

  if (!deleteList(owner, slug)) {
    res.status(404).json({ error: 'List not found' });
    return;
  }

  res.json({ deleted: true });
});
