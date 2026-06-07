import React, { useCallback, useEffect, useState } from "react";
import "./PlayVideo.css";
import like from "../../assets/like.png";
import dislike from "../../assets/dislike.png";
import share from "../../assets/share.png";
import save from "../../assets/save.png";
import { API_KEY, value_converter } from "../../data";
import moment from "moment";
import { useParams } from "react-router-dom";

const PlayVideo = () => {
  const { videoId } = useParams();
  const [apiData, setApiData] = useState(null);
  const [channelData, setChannelData] = useState(null);
  const [commentData, setCommentData] = useState([]);

  const fetchVideoData = useCallback(async () => {
    try {
      const videoDetails_url = `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics,contentDetails&id=${videoId}&key=${API_KEY}`;
      const res = await fetch(videoDetails_url);
      if (!res.ok) {
        throw new Error("Failed to fetch video data");
      }
      const data = await res.json();
      setApiData(data.items[0]);
    } catch (error) {
      console.error("Error fetching video data:", error);
    }
  }, [videoId]);

  const fetchOtherData = useCallback(async () => {
    if (!apiData) {
      return;
    }

    try {
      // Fetching Channel Data
      const channelData_url = `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${apiData.snippet.channelId}&key=${API_KEY}`;
      const resChannel = await fetch(channelData_url);
      if (!resChannel.ok) {
        throw new Error("Failed to fetch channel data");
      }
      const dataChannel = await resChannel.json();
      setChannelData(dataChannel.items[0]);

      // Fetching Comment Data with Pagination
      let commentList = [];
      const fetchComments = async (pageToken = "") => {
        const comment_url = `https://www.googleapis.com/youtube/v3/commentThreads?part=snippet&maxResults=50&videoId=${videoId}&pageToken=${pageToken}&key=${API_KEY}`;
        const resComment = await fetch(comment_url);
        if (!resComment.ok) {
          throw new Error("Failed to fetch comment data");
        }
        const dataComment = await resComment.json();
        commentList = [...commentList, ...(dataComment.items || [])];
        if (dataComment.nextPageToken) {
          await fetchComments(dataComment.nextPageToken); // Recursive call to fetch next page
        }
      };

      await fetchComments(); // Start fetching comments
      setCommentData(commentList); // Once all comments are fetched, set the state
    } catch (error) {
      console.error("Error fetching other data:", error);
    }
  }, [apiData, videoId]);

  useEffect(() => {
    fetchVideoData();
  }, [fetchVideoData]);

  useEffect(() => {
    fetchOtherData();
  }, [fetchOtherData]);

  return (
    <div className="play-video">
      <iframe
        src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      ></iframe>
      <h3>{apiData ? apiData.snippet.title : "Title Here"}</h3>
      <div className="play-video-info">
        <p>
          {apiData ? value_converter(apiData.statistics.viewCount) : "16K"}
          Views &bull;{" "}
          {apiData
            ? moment(apiData.snippet.publishedAt).fromNow()
            : "some time ago"}
        </p>
        <div>
          <span>
            <img src={like} alt="" />
            {apiData ? value_converter(apiData.statistics.likeCount) : 155}
          </span>
          <span>
            <img src={dislike} alt="" />
          </span>
          <span>
            <img src={share} alt="" />
            Share
          </span>
          <span>
            <img src={save} alt="" />
            Save
          </span>
        </div>
      </div>
      <hr />
      <div className="publisher">
        <img
          src={channelData ? channelData.snippet.thumbnails.high.url : ""}
          alt=""
        />
        <div>
          <p>{apiData ? apiData.snippet.channelTitle : ""}</p>
          <span>
            {channelData
              ? value_converter(channelData.statistics.subscriberCount)
              : "1M"}{" "}
            Subscribers
          </span>
        </div>
        <button>Subscribe</button>
      </div>
      <div className="vid-description">
        <p>
          {apiData
            ? apiData.snippet.description.slice(0, 250)
            : "Description Here"}
        </p>
        <hr />
        <h4>
          {apiData ? value_converter(apiData.statistics.commentCount) : 102}{" "}
          Comments
        </h4>
        {commentData.map((item, index) => {
          return (
            <div key={index} className="comment">
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
          );
        })}
      </div>
    </div>
  );
};

export default PlayVideo;
