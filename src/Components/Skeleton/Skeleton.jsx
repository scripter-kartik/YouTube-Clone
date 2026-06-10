import React from "react";
import "./Skeleton.css";

export const VideoCardSkeleton = () => (
  <div className="skeleton-card">
    <div className="skeleton skeleton-thumb" />
    <div className="skeleton skeleton-title" />
    <div className="skeleton skeleton-text" />
    <div className="skeleton skeleton-text short" />
  </div>
);

export const VideoGridSkeleton = ({ count = 8 }) => (
  <div className="feed">
    {Array.from({ length: count }).map((_, i) => (
      <VideoCardSkeleton key={i} />
    ))}
  </div>
);

export const PlayerSkeleton = () => (
  <div className="player-skeleton">
    <div className="skeleton skeleton-player" />
    <div className="skeleton skeleton-title" />
    <div className="skeleton skeleton-text" />
  </div>
);

export default VideoGridSkeleton;
