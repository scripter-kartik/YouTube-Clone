import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import PageLayout from "../../Components/Layout/PageLayout";
import { VideoGridSkeleton } from "../../Components/Skeleton/Skeleton";
import { clearHistory, getHistory } from "../../utils/storage";
import { fetchVideosByIds } from "../../utils/youtubeApi";
import VideoCard from "../../Components/VideoCard/VideoCard";

const History = ({ sidebar, isMobile }) => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadHistory = async () => {
    const history = getHistory();
    if (!history.length) {
      setVideos([]);
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const data = await fetchVideosByIds(history.map((v) => v.id));
      const order = new Map(history.map((v, i) => [v.id, i]));
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
    loadHistory();
  }, []);

  const handleClear = () => {
    clearHistory();
    setVideos([]);
  };

  const historyMeta = getHistory();

  return (
    <PageLayout sidebar={sidebar} isMobile={isMobile}>
      <div className="page-header page-header-actions">
        <div>
          <h1>Watch history</h1>
          <p>{historyMeta.length} videos watched</p>
        </div>
        {videos.length > 0 && (
          <button className="clear-btn" onClick={handleClear}>
            Clear history
          </button>
        )}
      </div>

      {loading && <VideoGridSkeleton />}
      {!loading && videos.length === 0 && (
        <div className="empty-state">
          <h3>No watch history yet</h3>
          <p>Videos you watch will appear here</p>
          <Link to="/" className="retry-btn" style={{ display: "inline-block" }}>
            Browse videos
          </Link>
        </div>
      )}
      {!loading && videos.length > 0 && (
        <div className="feed">
          {videos.map((item) => {
            const meta = historyMeta.find((h) => h.id === item.id);
            return (
              <div key={item.id} className="history-item">
                <VideoCard item={item} />
                {meta?.viewedAt && (
                  <span className="history-time">
                    Watched {moment(meta.viewedAt).fromNow()}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      )}
    </PageLayout>
  );
};

export default History;
