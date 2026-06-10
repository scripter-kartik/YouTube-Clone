import React, { useCallback, useEffect, useState } from "react";
import "./Feed.css";
import VideoCard from "../VideoCard/VideoCard";
import { VideoGridSkeleton } from "../Skeleton/Skeleton";
import { fetchPopularVideos } from "../../utils/youtubeApi";

const Feed = ({ category }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [nextPageToken, setNextPageToken] = useState(null);

  const fetchData = useCallback(
    async (pageToken = "", append = false) => {
      try {
        if (append) setLoadingMore(true);
        else setLoading(true);
        setError(null);
        const response = await fetchPopularVideos(category, pageToken);
        setData((prev) =>
          append ? [...prev, ...(response.items || [])] : response.items || []
        );
        setNextPageToken(response.nextPageToken || null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [category]
  );

  useEffect(() => {
    setData([]);
    fetchData();
  }, [fetchData]);

  if (loading) return <VideoGridSkeleton />;
  if (error) {
    return (
      <div className="error-state">
        <h3>Failed to load videos</h3>
        <p>{error}</p>
        <button className="retry-btn" onClick={() => fetchData()}>
          Try again
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="feed">
        {data.map((item) => (
          <VideoCard key={item.id} item={item} />
        ))}
      </div>
      {nextPageToken && (
        <button
          className="load-more-btn"
          disabled={loadingMore}
          onClick={() => fetchData(nextPageToken, true)}
        >
          {loadingMore ? "Loading..." : "Load more"}
        </button>
      )}
    </>
  );
};

export default Feed;
