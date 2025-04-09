// src/components/SearchBar.jsx
import React, { useState, useEffect } from 'react';
import { useGetUserByUsernameQuery, useGetUserRepoQuery } from './Redux/githubApi';

function SearchBar({darkMode}) {
  const [username, setUsername] = useState('');
  const [search, setSearch] = useState('');
  const [sortType, setSortType] = useState('stars');

  const { data, isLoading, error } = useGetUserByUsernameQuery(search, {
    skip: !search,
  });
  const {
    data: repos = [],
    isLoading: repoLoading,
    error: repoError,
  } = useGetUserRepoQuery(search, {
    skip: !search,
  });

  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(username.trim());
  };

  const sortedRepos = [...repos].sort((a, b) => {
    if (sortType === 'stars') return b.stargazers_count - a.stargazers_count;
    if (sortType === 'name') return a.name.localeCompare(b.name);
    if (sortType === 'recent') return new Date(b.updated_at) - new Date(a.updated_at);
    return 0;
  });

  const containerStyle = {
    maxWidth: 600,
    margin: '0 auto',
    padding: 20,
    minHeight: '100vh',
    transition: 'all 0.3s ease',
  };

  const skeletonStyle = {
    backgroundColor: darkMode ? '#2d3748' : '#e2e8f0',
    height: 20,
    marginBottom: 10,
    borderRadius: 4,
    animation: 'pulse 1.5s infinite ease-in-out',
  };

  return (
    <div style={containerStyle}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
        <h1>GitHub User Finder</h1>

      </div>

      <form onSubmit={handleSearch} style={{ display: 'flex', marginBottom: 20 }}>
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Search GitHub username"
          style={{
            flex: 1,
            padding: '8px',
            fontSize: '16px',
            border: '1px solid #ccc',
            borderRadius: '4px 0 0 4px',
          }}
        />
        <button
          type="submit"
          style={{
            padding: '8px 16px',
            fontSize: '16px',
            backgroundColor: '#4f46e5',
            color: '#fff',
            border: 'none',
            borderRadius: '0 4px 4px 0',
            cursor: 'pointer',
          }}
        >
          Search
        </button>
      </form>

      {isLoading ? (
        <div>
          {[...Array(5)].map((_, i) => (
            <div key={i} style={skeletonStyle}></div>
          ))}
        </div>
      ) : error ? (
        <p style={{ color: 'red' }}>User not found.</p>
      ) : (
        data && (
          <div
            style={{
              border: '1px solid #ddd',
              padding: 20,
              borderRadius: 8,
              textAlign: 'center',
              backgroundColor: darkMode ? '#2d3748' : '#f9f9f9',
            }}
          >
            <img
              src={data.avatar_url}
              alt={data.login}
              style={{ width: 80, height: 80, borderRadius: '50%' }}
            />
            <h2 style={{ marginTop: 10 }}>{data.name || data.login}</h2>
            <p>Location: {data.location || 'Null'}</p>
            <p>Bio: {data.bio || 'Null'}</p>
            <p>Followers: {data.followers}</p>
            <a
              href={data.html_url}
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration:'none' }}
            >
              Visit profile
            </a>

            {repoLoading ? (
              <div>
                {[...Array(3)].map((_, i) => (
                  <div key={i} style={skeletonStyle}></div>
                ))}
              </div>
            ) : (
              <div style={{ marginTop: 20 }}>
                <label>
                  Sort by:{' '}
                  <select
                    value={sortType}
                    onChange={(e) => setSortType(e.target.value)}
                    style={{ padding: 6, borderRadius: 4 }}
                  >
                    <option value="stars">Stars</option>
                    <option value="name">Name</option>
                    <option value="recent">Most Recent</option>
                  </select>
                </label>
                {sortedRepos.slice(0, 9).map((repo) => (
                  <div
                    key={repo.id}
                    style={{
                      padding: 10,
                      marginTop: 10,
                      backgroundColor: darkMode ? '#1a202c' : '#fff',
                      borderRadius: 4,
                      border: '1px solid #ccc',
                      textAlign: 'left',
                    }}
                  >
                    <p style={{ fontWeight: 'bold', fontSize: '20px' }}>{repo.name}</p>
                    <p>Description: {repo.description || 'None'}</p>
                    <p>⭐ {repo.stargazers_count} | 🍴 {repo.forks_count}</p>
                    <p>🧑‍💻 Language: {repo.language || 'N/A'}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )
      )}
    </div>
  );
}

export default SearchBar;
