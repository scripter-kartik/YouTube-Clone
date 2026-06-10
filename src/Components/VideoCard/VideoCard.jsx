import React from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import { formatDuration, value_converter } from "../../data";
import { addToHistory } from "../../utils/storage";
import { toVideoMeta } from "../../utils/youtubeApi";
import "./VideoCard.css";

const VideoCard = ({ item, className = "card" }) => {
  const duration = item.contentDetails?.duration
    ? formatDuration(item.contentDetails.duration)
    : null;

  const handleClick = () => {
    addToHistory(toVideoMeta(item));
  };

  return (
    <Link
      to={`/video/${item.snippet.categoryId}/${item.id}`}
      className={className}
      onClick={handleClick}
    >
      <div className="thumb-wrap">
        <img src={item.snippet.thumbnails.medium.url} alt="" loading="lazy" />
        {duration && <span className="duration-badge">{duration}</span>}
      </div>
      <h2>{item.snippet.title}</h2>
      <h3>{item.snippet.channelTitle}</h3>
      <p>
        {value_converter(item.statistics?.viewCount || 0)} views &bull;{" "}
        {moment(item.snippet.publishedAt).fromNow()}
      </p>
    </Link>
  );
};

export default VideoCard;
