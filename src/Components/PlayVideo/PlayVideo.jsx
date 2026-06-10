import React, { useCallback, useEffect, useState } from "react";
import "./PlayVideo.css";
import like from "../../assets/like.png";
import dislike from "../../assets/dislike.png";
import share from "../../assets/share.png";
import save from "../../assets/save.png";
import { value_converter } from "../../data";
import moment from "moment";
import { Link, useParams } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import { addToHistory } from "../../utils/storage";
import {
  fetchChannel,
  fetchComments,
  fetchVideoById,
  toVideoMeta,
} from "../../utils/youtubeApi";
import { PlayerSkeleton } from "../Skeleton/Skeleton";

const PlayVideo = () => {
  const { videoId } = useParams();
  const { toggleSave, toggleSubscribe, isVideoSaved, isChannelSubscribed, showToast } =
    useApp();
  const [apiData, setApiData] = useState(null);
  const [channelData, setChannelData] = useState(null);
  const [commentData, setCommentData] = useState([]);
  const [commentToken, setCommentToken] = useState(null);
  const [loadingComments, setLoadingComments] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [descExpanded, setDescExpanded] = useState(false);
  const [liked, setLiked] = useState(false);

  const loadVideo = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      setDescExpanded(false);
      setLiked(false);
      const video = await fetchVideoById(videoId);
      if (!video) throw new Error("Video not found");
      setApiData(video);
      addToHistory(toVideoMeta(video));

      const channel = await fetchChannel(video.snippet.channelId);
      setChannelData(channel);

      const comments = await fetchComments(videoId);
      setCommentData(comments.items || []);
      setCommentToken(comments.nextPageToken || null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [videoId]);

  useEffect(() => {
    loadVideo();
  }, [loadVideo]);

  const loadMoreComments = async () => {
    if (!commentToken || loadingComments) return;
    try {
      setLoadingComments(true);
      const data = await fetchComments(videoId, commentToken);
      setCommentData((prev) => [...prev, ...(data.items || [])]);
      setCommentToken(data.nextPageToken || null);
    } catch (err) {
      showToast("Could not load more comments");
    } finally {
      setLoadingComments(false);
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: apiData?.snippet.title, url });
        return;
      } catch {
        /* user cancelled */
      }
    }
    await navigator.clipboard.writeText(url);
    showToast("Link copied to clipboard");
  };

  const handleSave = () => {
    if (!apiData) return;
    toggleSave(toVideoMeta(apiData));
  };

  const handleSubscribe = () => {
    if (!apiData || !channelData) return;
    toggleSubscribe({
      channelId: apiData.snippet.channelId,
      title: apiData.snippet.channelTitle,
      thumbnail: channelData.snippet.thumbnails.default.url,
    });
  };

  if (loading) return <PlayerSkeleton />;
  if (error) {
    return (
      <div className="play-video error-state">
        <h3>Video unavailable</h3>
        <p>{error}</p>
        <button className="retry-btn" onClick={loadVideo}>
          Try again
        </button>
      </div>
    );
  }

  const description = apiData.snippet.description || "";
  const showExpand = description.length > 250;
  const displayDesc = descExpanded ? description : description.slice(0, 250);
  const saved = isVideoSaved(videoId);
  const subscribed = isChannelSubscribed(apiData.snippet.channelId);

  return (
    <div className="play-video">
      <iframe
        src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
        title={apiData.snippet.title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      />
      <h3>{apiData.snippet.title}</h3>
      <div className="play-video-info">
        <p>
          {value_converter(apiData.statistics.viewCount)} Views &bull;{" "}
          {moment(apiData.snippet.publishedAt).fromNow()}
        </p>
        <div>
          <span
            className={`action-btn ${liked ? "active" : ""}`}
            onClick={() => setLiked((p) => !p)}
          >
            <img src={like} alt="" />
            {value_converter(apiData.statistics.likeCount)}
          </span>
          <span className="action-btn">
            <img src={dislike} alt="" />
          </span>
          <span className="action-btn" onClick={handleShare}>
            <img src={share} alt="" />
            Share
          </span>
          <span
            className={`action-btn ${saved ? "active" : ""}`}
            onClick={handleSave}
          >
            <img src={save} alt="" />
            {saved ? "Saved" : "Save"}
          </span>
        </div>
      </div>
      <hr />
      <div className="publisher">
        <Link to={`/channel/${apiData.snippet.channelId}`}>
          <img
            src={channelData?.snippet.thumbnails.high?.url || ""}
            alt=""
          />
        </Link>
        <div>
          <Link to={`/channel/${apiData.snippet.channelId}`}>
            <p>{apiData.snippet.channelTitle}</p>
          </Link>
          <span>
            {value_converter(channelData?.statistics.subscriberCount || 0)}{" "}
            Subscribers
          </span>
        </div>
        <button
          className={subscribed ? "subscribed" : ""}
          onClick={handleSubscribe}
        >
          {subscribed ? "Subscribed" : "Subscribe"}
        </button>
      </div>
      <div className="vid-description">
        <p>
          {displayDesc}
          {showExpand && !descExpanded && "..."}
        </p>
        {showExpand && (
          <button
            className="show-more-btn"
            onClick={() => setDescExpanded((p) => !p)}
          >
            {descExpanded ? "Show less" : "Show more"}
          </button>
        )}
        <hr />
        <h4>
          {value_converter(apiData.statistics.commentCount)} Comments
        </h4>
        {commentData.length === 0 && (
          <p className="no-comments">No comments yet</p>
        )}
        {commentData.map((item) => (
          <div key={item.id} className="comment">
            <img
              src={item.snippet.topLevelComment.snippet.authorProfileImageUrl}
              alt=""
            />
            <div>
              <h3>
                {item.snippet.topLevelComment.snippet.authorDisplayName}{" "}
                <span>
                  {moment(
                    item.snippet.topLevelComment.snippet.publishedAt
                  ).fromNow()}
                </span>
              </h3>
              <p>{item.snippet.topLevelComment.snippet.textDisplay}</p>
              <div className="comment-action">
                <img src={like} alt="" />
                <span>
                  {value_converter(
                    item.snippet.topLevelComment.snippet.likeCount
                  )}
                </span>
                <img src={dislike} alt="" />
              </div>
            </div>
          </div>
        ))}
        {commentToken && (
          <button
            className="load-more-btn"
            disabled={loadingComments}
            onClick={loadMoreComments}
          >
            {loadingComments ? "Loading..." : "Load more comments"}
          </button>
        )}
      </div>
    </div>
  );
};

export default PlayVideo;
