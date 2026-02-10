import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api, type ListSummary } from '../api';
import ListCard from '../components/ListCard';

export default function DirectoryPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [lists, setLists] = useState<ListSummary[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');

  const activeCategory = searchParams.get('category') || '';

  useEffect(() => {
    api.getCategories().then(({ categories }) => setCategories(categories));
  }, []);

  useEffect(() => {
    setLoading(true);
    const params: Record<string, string> = {};
    if (activeCategory) params.category = activeCategory;
    const q = searchParams.get('q');
    if (q) params.q = q;

    api.getLists(params)
      .then(({ lists }) => setLists(lists))
      .finally(() => setLoading(false));
  }, [activeCategory, searchParams]);

  const handleCategoryClick = (cat: string) => {
    const params = new URLSearchParams(searchParams);
    if (cat === activeCategory) {
      params.delete('category');
    } else {
      params.set('category', cat);
    }
    setSearchParams(params);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    if (searchQuery.trim()) {
      params.set('q', searchQuery.trim());
    } else {
      params.delete('q');
    }
    setSearchParams(params);
  };

  return (
    <div>
      <div className="directory-header">
        <h1>Explore Lists</h1>
      </div>

      <form onSubmit={handleSearch}>
        <div className="search-wrapper">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            className="search-input"
            placeholder="Search lists..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </form>

      <div className="directory-filters">
        <button
          className={`filter-chip ${!activeCategory ? 'active' : ''}`}
          onClick={() => handleCategoryClick('')}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            className={`filter-chip ${activeCategory === cat ? 'active' : ''}`}
            onClick={() => handleCategoryClick(cat)}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="loading">Loading...</div>
      ) : (
        <div className="list-grid">
          {lists.map((list) => (
            <ListCard key={`${list.owner}/${list.slug}`} list={list} />
          ))}
        </div>
      )}

      {!loading && lists.length === 0 && (
        <div className="empty-state">
          <p>No lists found matching your criteria.</p>
        </div>
      )}
    </div>
  );
}
