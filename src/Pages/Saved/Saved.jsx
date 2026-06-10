import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PageLayout from "../../Components/Layout/PageLayout";
import VideoCard from "../../Components/VideoCard/VideoCard";
import { VideoGridSkeleton } from "../../Components/Skeleton/Skeleton";
import { useApp } from "../../context/AppContext";
import { fetchVideosByIds } from "../../utils/youtubeApi";

const Saved = ({ sidebar, isMobile }) => {
  const { getSavedVideos, savedVersion } = useApp();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadSaved = async () => {
    const saved = getSavedVideos();
    if (!saved.length) {
      setVideos([]);
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const data = await fetchVideosByIds(saved.map((v) => v.id));
      const order = new Map(saved.map((v, i) => [v.id, i]));
      const sorted = (data.items || []).sort(
        (a, b) => (order.get(a.id) ?? 0) - (order.get(b.id) ?? 0)
      );
      setVideos(sorted);
    } catch {
      setVideos([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSaved();
  }, [savedVersion]);

  return (
    <PageLayout sidebar={sidebar} isMobile={isMobile}>
      <div className="page-header">
        <h1>Saved videos</h1>
        <p>{getSavedVideos().length} videos in your library</p>
      </div>

      {loading && <VideoGridSkeleton />}
      {!loading && videos.length === 0 && (
        <div className="empty-state">
          <h3>No saved videos</h3>
          <p>Click Save on any video to add it here</p>
          <Link to="/" className="retry-btn" style={{ display: "inline-block" }}>
            Browse videos
          </Link>
        </div>
      )}
      {!loading && videos.length > 0 && (
        <div className="feed">
          {videos.map((item) => (
            <VideoCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </PageLayout>
  );
};

export default Saved;
