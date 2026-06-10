import { API_KEY } from "../data";

const BASE = "https://www.googleapis.com/youtube/v3";

async function apiFetch(url) {
  const res = await fetch(url);
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error?.message || "YouTube API request failed");
  }
  return data;
}

export async function fetchPopularVideos(category, pageToken = "") {
  const token = pageToken ? `&pageToken=${pageToken}` : "";
  const cat = category && category !== 0 ? `&videoCategoryId=${category}` : "";
  return apiFetch(
    `${BASE}/videos?part=snippet,statistics,contentDetails&chart=mostPopular&regionCode=US&maxResults=20${cat}&key=${API_KEY}${token}`
  );
}

export async function fetchVideosByIds(ids) {
  if (!ids.length) return { items: [] };
  return apiFetch(
    `${BASE}/videos?part=snippet,statistics,contentDetails&id=${ids.join(",")}&key=${API_KEY}`
  );
}

export async function searchVideos(query, pageToken = "") {
  const token = pageToken ? `&pageToken=${pageToken}` : "";
  const searchData = await apiFetch(
    `${BASE}/search?part=snippet&type=video&maxResults=20&q=${encodeURIComponent(query)}&key=${API_KEY}${token}`
  );
  const ids = (searchData.items || [])
    .map((item) => item.id?.videoId)
    .filter(Boolean);
  if (!ids.length) {
    return { items: [], nextPageToken: searchData.nextPageToken };
  }
  const videos = await fetchVideosByIds(ids);
  return { items: videos.items || [], nextPageToken: searchData.nextPageToken };
}

export async function fetchVideoById(videoId) {
  const data = await fetchVideosByIds([videoId]);
  return data.items?.[0] || null;
}

export async function fetchChannel(channelId) {
  const data = await apiFetch(
    `${BASE}/channels?part=snippet,statistics&id=${channelId}&key=${API_KEY}`
  );
  return data.items?.[0] || null;
}

export async function fetchChannelVideos(channelId, pageToken = "") {
  const token = pageToken ? `&pageToken=${pageToken}` : "";
  const searchData = await apiFetch(
    `${BASE}/search?part=snippet&channelId=${channelId}&type=video&order=date&maxResults=20&key=${API_KEY}${token}`
  );
  const ids = (searchData.items || [])
    .map((item) => item.id?.videoId)
    .filter(Boolean);
  if (!ids.length) {
    return { items: [], nextPageToken: searchData.nextPageToken };
  }
  const videos = await fetchVideosByIds(ids);
  return { items: videos.items || [], nextPageToken: searchData.nextPageToken };
}

export async function fetchRelatedVideos(title, excludeId) {
  const keywords = title.split(" ").slice(0, 6).join(" ");
  const { items } = await searchVideos(keywords);
  return items.filter((v) => v.id !== excludeId).slice(0, 20);
}

export async function fetchComments(videoId, pageToken = "") {
  const token = pageToken ? `&pageToken=${pageToken}` : "";
  return apiFetch(
    `${BASE}/commentThreads?part=snippet&maxResults=20&videoId=${videoId}&key=${API_KEY}${token}`
  );
}

export function toVideoMeta(item) {
  return {
    id: item.id,
    categoryId: item.snippet.categoryId,
    title: item.snippet.title,
    thumbnail: item.snippet.thumbnails?.medium?.url,
    channelTitle: item.snippet.channelTitle,
    channelId: item.snippet.channelId,
  };
}
