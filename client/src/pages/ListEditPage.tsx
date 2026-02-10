import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api, type Visibility } from '../api';
import { useAuth } from '../context/AuthContext';
import ListRenderer from '../components/ListRenderer';

export default function ListEditPage() {
  const { username, slug } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const isEdit = !!slug;
  const owner = username || '';

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState('');
  const [content, setContent] = useState('');
  const [visibility, setVisibility] = useState<Visibility>('public');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(isEdit);

  useEffect(() => {
    if (!isEdit) return;
    api.getList(owner, slug!)
      .then((list) => {
        setTitle(list.meta.title);
        setDescription(list.meta.description);
        setCategory(list.meta.category);
        setTags(list.meta.tags.join(', '));
        setContent(list.content);
        setVisibility(list.meta.visibility);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [isEdit, owner, slug]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    try {
      const tagList = tags.split(',').map((t) => t.trim()).filter(Boolean);

      if (isEdit) {
        const editToken = localStorage.getItem(`listwise_edit_${owner}_${slug}`);
        await api.updateList(owner, slug!, {
          title, description, category, tags: tagList, content, visibility,
        }, editToken || undefined);
        navigate(`/u/${owner}/${slug}`);
      } else {
        const result = await api.createList({
          title, description, category, tags: tagList, content, visibility,
        });
        if (result.editToken) {
          localStorage.setItem(`listwise_edit_${result.owner}_${result.slug}`, result.editToken);
        }
        if (result.owner === '_anonymous') {
          navigate(`/list/${result.slug}`);
        } else {
          navigate(`/u/${result.owner}/${result.slug}`);
        }
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 24 }}>
        {isEdit ? 'Edit List' : 'Create New List'}
      </h1>

      {error && <div className="form-error" style={{ marginBottom: 16 }}>{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Title</label>
          <input
            className="form-input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Best Coffee Shops in SF"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Description</label>
          <input
            className="form-input"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="A short description of your list"
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Category</label>
            <input
              className="form-input"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="e.g., food, events, wellness"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Tags (comma-separated)</label>
            <input
              className="form-input"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="e.g., sf, coffee, remote-work"
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Visibility</label>
          <select
            className="form-input"
            value={visibility}
            onChange={(e) => setVisibility(e.target.value as Visibility)}
          >
            <option value="public">Public — discoverable in explore and search</option>
            <option value="unlisted">Unlisted — anyone with the link can view</option>
            <option value="private">Private — only you can view</option>
          </select>
        </div>

        <div className="editor-layout">
          <div className="editor-pane">
            <div className="editor-pane-label">Markdown</div>
            <textarea
              className="form-input form-textarea"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={'## Section Title\n\n### Item Name\n**Where:** Location\n**When:** Date/Time\n\nDescription of the item...\n\n> A great quote about it\n\n[Link text →](https://example.com)'}
              required
            />
          </div>
          <div className="editor-pane">
            <div className="editor-pane-label">Preview</div>
            <div className="preview-pane">
              {content ? (
                <ListRenderer content={content} />
              ) : (
                <div className="empty-state" style={{ padding: 24 }}>
                  <p>Start typing to see a preview</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div style={{ marginTop: 20, display: 'flex', gap: 8 }}>
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? 'Saving...' : isEdit ? 'Save Changes' : 'Create List'}
          </button>
          <button type="button" className="btn" onClick={() => navigate(-1)}>Cancel</button>
        </div>

        {!user && !isEdit && (
          <p style={{ marginTop: 12, fontSize: 13, color: 'var(--text-tertiary)' }}>
            You're not logged in. Your list will be created anonymously and you'll receive an edit token.
          </p>
        )}
      </form>
    </div>
  );
}
