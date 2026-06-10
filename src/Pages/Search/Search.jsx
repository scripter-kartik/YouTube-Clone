import React, { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import PageLayout from "../../Components/Layout/PageLayout";
import VideoCard from "../../Components/VideoCard/VideoCard";
import { VideoGridSkeleton } from "../../Components/Skeleton/Skeleton";
import { searchVideos } from "../../utils/youtubeApi";
import "./Search.css";

const Search = ({ sidebar, isMobile }) => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [nextPageToken, setNextPageToken] = useState(null);

  const fetchResults = useCallback(
    async (pageToken = "", append = false) => {
      if (!query.trim()) {
        setVideos([]);
        setLoading(false);
        return;
      }
      try {
        if (append) setLoadingMore(true);
        else setLoading(true);
        setError(null);
        const data = await searchVideos(query, pageToken);
        setVideos((prev) =>
          append ? [...prev, ...(data.items || [])] : data.items || []
        );
        setNextPageToken(data.nextPageToken || null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [query]
  );

  useEffect(() => {
    setVideos([]);
    fetchResults();
  }, [fetchResults]);

  return (
    <PageLayout sidebar={sidebar} isMobile={isMobile}>
      <div className="page-header">
        <h1>Search results</h1>
        <p>
          {query
            ? `Showing results for "${query}"`
            : "Enter a search term in the navbar"}
        </p>
      </div>

      {loading && <VideoGridSkeleton />}
      {error && (
        <div className="error-state">
          <h3>Something went wrong</h3>
          <p>{error}</p>
          <button className="retry-btn" onClick={() => fetchResults()}>
            Try again
          </button>
        </div>
      )}
      {!loading && !error && videos.length === 0 && query && (
        <div className="empty-state">
          <h3>No results found</h3>
          <p>Try different keywords</p>
        </div>
      )}
      {!loading && !error && videos.length > 0 && (
        <>
          <div className="feed">
            {videos.map((item) => (
              <VideoCard key={item.id} item={item} />
            ))}
          </div>
          {nextPageToken && (
            <button
              className="load-more-btn"
              disabled={loadingMore}
              onClick={() => fetchResults(nextPageToken, true)}
            >
              {loadingMore ? "Loading..." : "Load more"}
            </button>
          )}
        </>
      )}
    </PageLayout>
  );
};

export default Search;
