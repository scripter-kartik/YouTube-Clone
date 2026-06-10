import React, { useCallback, useEffect, useState } from "react";
import "./Recommended.css";
import "../Skeleton/Skeleton.css";
import { value_converter, formatDuration } from "../../data";
import { Link, useParams } from "react-router-dom";
import { fetchRelatedVideos, fetchVideoById } from "../../utils/youtubeApi";

const Recommended = () => {
  const { videoId } = useParams();
  const [apiData, setApiData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const video = await fetchVideoById(videoId);
      if (!video) {
        setApiData([]);
        return;
      }
      const related = await fetchRelatedVideos(video.snippet.title, videoId);
      setApiData(related);
    } catch {
      setApiData([]);
    } finally {
      setLoading(false);
    }
  }, [videoId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) {
    return (
      <div className="recommended">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="side-video-list skeleton-side">
            <div className="skeleton side-skeleton-thumb" />
            <div className="skeleton side-skeleton-text" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="recommended">
      <h3 className="recommended-title">Up next</h3>
      {apiData.map((item) => (
        <Link
          to={`/video/${item.snippet.categoryId}/${item.id}`}
          key={item.id}
          className="side-video-list"
        >
          <div className="side-thumb-wrap">
            <img src={item.snippet.thumbnails.medium.url} alt="" loading="lazy" />
            {item.contentDetails?.duration && (
              <span className="duration-badge">
                {formatDuration(item.contentDetails.duration)}
              </span>
            )}
          </div>
          <div className="vid-info">
            <h4>{item.snippet.title}</h4>
            <p>{item.snippet.channelTitle}</p>
            <p>{value_converter(item.statistics.viewCount)} Views</p>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default Recommended;
