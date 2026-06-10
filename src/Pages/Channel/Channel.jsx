import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PageLayout from "../../Components/Layout/PageLayout";
import VideoCard from "../../Components/VideoCard/VideoCard";
import { VideoGridSkeleton } from "../../Components/Skeleton/Skeleton";
import { useApp } from "../../context/AppContext";
import { value_converter } from "../../data";
import { fetchChannel, fetchChannelVideos } from "../../utils/youtubeApi";
import "./Channel.css";

const Channel = ({ sidebar, isMobile }) => {
  const { channelId } = useParams();
  const { toggleSubscribe, isChannelSubscribed } = useApp();
  const [channel, setChannel] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [nextPageToken, setNextPageToken] = useState(null);

  const subscribed = isChannelSubscribed(channelId);

  const loadChannel = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [channelData, videoData] = await Promise.all([
        fetchChannel(channelId),
        fetchChannelVideos(channelId),
      ]);
      setChannel(channelData);
      setVideos(videoData.items || []);
      setNextPageToken(videoData.nextPageToken || null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [channelId]);

  useEffect(() => {
    loadChannel();
  }, [loadChannel]);

  const handleSubscribe = () => {
    if (!channel) return;
    toggleSubscribe({
      channelId,
      title: channel.snippet.title,
      thumbnail: channel.snippet.thumbnails.default.url,
    });
  };

  const loadMore = async () => {
    if (!nextPageToken) return;
    try {
      setLoadingMore(true);
      const data = await fetchChannelVideos(channelId, nextPageToken);
      setVideos((prev) => [...prev, ...(data.items || [])]);
      setNextPageToken(data.nextPageToken || null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingMore(false);
    }
  };

  return (
    <PageLayout sidebar={sidebar} isMobile={isMobile}>
      {loading && <VideoGridSkeleton count={6} />}
      {error && (
        <div className="error-state">
          <h3>Channel not found</h3>
          <p>{error}</p>
          <button className="retry-btn" onClick={loadChannel}>
            Try again
          </button>
        </div>
      )}
      {!loading && !error && channel && (
        <>
          <div className="channel-banner">
            <img
              className="channel-avatar"
              src={channel.snippet.thumbnails.high?.url || channel.snippet.thumbnails.default.url}
              alt=""
            />
            <div className="channel-info">
              <h1>{channel.snippet.title}</h1>
              <p>
                {value_converter(channel.statistics.subscriberCount)} subscribers
                &bull; {value_converter(channel.statistics.videoCount)} videos
              </p>
              <p className="channel-desc">
                {channel.snippet.description?.slice(0, 150)}
              </p>
              <button
                className={`subscribe-btn ${subscribed ? "subscribed" : ""}`}
                onClick={handleSubscribe}
              >
                {subscribed ? "Subscribed" : "Subscribe"}
              </button>
            </div>
          </div>
          <h2 className="channel-videos-title">Videos</h2>
          <div className="feed">
            {videos.map((item) => (
              <VideoCard key={item.id} item={item} />
            ))}
          </div>
          {nextPageToken && (
            <button
              className="load-more-btn"
              disabled={loadingMore}
              onClick={loadMore}
            >
              {loadingMore ? "Loading..." : "Load more"}
            </button>
          )}
        </>
      )}
    </PageLayout>
  );
};

export default Channel;
