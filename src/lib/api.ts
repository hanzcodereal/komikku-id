import axios from 'axios';

export async function getComics(page: number = 1, type: 'original' | 'canvas' = 'original', genre: string = 'all') {
  try {
    const { data } = await axios.get(`/api/comics?page=${page}&type=${type}&genre=${genre}`);
    return data || [];
  } catch (e) {
    console.error("Failed to fetch comics");
    return [];
  }
}

export async function getJadwal(hari: string) {
  try {
    const { data } = await axios.get(`/api/jadwal?hari=${hari}`);
    return data || [];
  } catch (e) {
    console.error("Failed to fetch jadwal");
    return [];
  }
}

export async function searchComic(keyword: string) {
  try {
    const { data } = await axios.get(`/api/search?keyword=${encodeURIComponent(keyword)}`);
    return data || { original: [], canvas: [] };
  } catch (e) {
    console.error("Search failed");
    return { original: [], canvas: [] };
  }
}

export async function getDetail(url: string) {
  try {
    const { data } = await axios.get(`/api/detail?url=${encodeURIComponent(url)}`);
    return data;
  } catch (e) {
    console.error("Detail failed");
    return null;
  }
}

export async function getRead(url: string) {
  try {
    const { data } = await axios.get(`/api/read?url=${encodeURIComponent(url)}`);
    return data;
  } catch (e) {
    console.error("Read failed");
    return null;
  }
}

export async function getHome() {
  try {
    const { data } = await axios.get(`/api/home`);
    return data || [];
  } catch (e) {
    console.error("Failed to fetch home");
    return [];
  }
}
