import express from 'express';
import axios from 'axios';
import * as cheerio from 'cheerio';

const app = express();
const router = express.Router();

function toBase64(str) {
  return Buffer.from(str).toString('base64');
}

const headers = {
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
  'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 Chrome/120.0.0.0 Mobile Safari/537.36',
  'Referer': 'https://m.webtoons.com/id/',
  'Accept-Language': 'id-ID',
  'Cookie': 'locale=id; countryCode=ID;'
};

router.get('/img', async (req, res) => {
  try {
    const id = req.query.id;
    if (!id) return res.status(400).send('Missing id');
    const url = Buffer.from(id, 'base64').toString('utf-8');
    
    const response = await axios.get(url, {
      responseType: 'stream',
      headers: {
        'Referer': 'https://m.webtoons.com/id/',
        'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 Chrome/120.0.0.0 Mobile Safari/537.36',
        'Accept': 'image/webp,image/apng,image/*,*/*;q=0.8',
        'Cookie': 'locale=id; countryCode=ID;'
      }
    });

    res.set({
      'Content-Type': response.headers['content-type'],
      'Cache-Control': 'public, max-age=600',
    });
    response.data.pipe(res);
  } catch (e) {
    res.status(500).send('Error');
  }
});

router.get('/home', async (req, res) => {
  try {
    const url = 'https://m.webtoons.com/id/';
    const { data } = await axios.get(url, { headers });
    
    const $ = cheerio.load(data);
    const allData = [];
    
    $('._titleItem').each((_, el) => {
      const titleNo = $(el).attr('data-title-no');
      const href = $(el).attr('href');
      const imgEl = $(el).find('img');
      let imgUrl = imgEl.attr('src') || imgEl.attr('data-src');
      if (imgUrl && imgUrl.startsWith('//')) imgUrl = 'https:' + imgUrl;
      const title = $(el).find('.subj, .title').first().text().trim();
      const author = $(el).find('.author').first().text().trim();
      const genre = $(el).find('.genre').first().text().trim() || 'Comic';
      
      if (titleNo && title) {
        allData.push({
          title_no: titleNo,
          title: title,
          author: author,
          genre: genre,
          image: imgUrl ? `/api/img?id=${toBase64(imgUrl)}` : null,
          likes: 0,
          url: href.startsWith('http') ? href : `https://m.webtoons.com${href}`
        });
      }
    });
    
    // Deduplicate
    const unique = [];
    const seen = new Set();
    for (const item of allData) {
      if (!seen.has(item.title_no)) {
        seen.add(item.title_no);
        unique.push(item);
      }
    }
    
    res.json(unique);
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});

router.get('/comics', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const type = req.query.type || 'original';
    const genre = req.query.genre || 'all';

    const targetUrl = type === 'original'
      ? `https://m.webtoons.com/id/originals?genre=${genre}`
      : `https://m.webtoons.com/id/canvas?genre=${genre}`;

    const { data } = await axios.get(targetUrl, { headers });

    const allData = [];
    const scriptMatch = data.match(/var\s+initialState\s*=\s*(\{[\s\S]*?\});/);
    if (!scriptMatch) return res.json([]);

    let parsed = null;
    try {
      parsed = JSON.parse(scriptMatch[1].replace(/([{,]\s*)(\w+)(\s*:)/g, '$1"$2"$3'));
    } catch (e) {
      const fallbackMatch = scriptMatch[1].match(/"titleList"\s*:\s*(\[.*?\])/s);
      if (fallbackMatch) {
        try {
          parsed = { titleList: JSON.parse(fallbackMatch[1]) };
        } catch (e2) {}
      }
    }

    if (parsed) {
       const list = parsed.titleList || parsed.scheduleList || [];
       if (Array.isArray(list)) {
          list.forEach((item) => {
            const imgUrl = item.posterThumbnail || item.thumbnailMobile;
            const originalUrl = imgUrl ? `https://webtoon-phinf.pstatic.net${imgUrl}?type=q70` : null;
            allData.push({
              title_no: item.titleNo || 0,
              title: item.title || '',
              author: item.writingAuthorName || '',
              genre: item.representGenre || '',
              image: originalUrl ? `/api/img?id=${toBase64(originalUrl)}` : null,
              likes: item.likeitCount || 0,
              url: `https://m.webtoons.com/id/${item.representGenreSeoCode || 'genre'}/${item.titleGroupName || ''}/list?title_no=${item.titleNo || 0}`
            });
          });
       }
    }
    res.json(allData);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.get('/detail', async (req, res) => {
  try {
    const url = req.query.url;
    if (!url) return res.status(400).json({ error: 'Missing url' });

    const { data } = await axios.get(url, { headers });
    const isCanvas = url.includes('/canvas/');
    const firstEpisodeNo = parseInt((data.match(/"firstEpisodeNo"\s*:\s*(\d+)/) || [])[1] || 0);
    const lastEpisodeNo = parseInt((data.match(/"lastEpisodeNo"\s*:\s*(\d+)/) || [])[1] || 0);
    const totalEpisodeCount = parseInt((data.match(/"totalEpisodeCount"\s*:\s*(\d+)/) || [])[1] || 0);
    const titleNoVal = (data.match(/"titleNo"\s*:\s*(\d+)/) || [])[1] || '';
    
    const episodes = [];
    for (let ep = firstEpisodeNo; ep <= lastEpisodeNo; ep++) {
      episodes.push({
        episode_no: ep,
        url: `https://m.webtoons.com/id/${isCanvas ? 'canvas' : 'originals'}/dummy/ep/viewer?title_no=${titleNoVal}&episode_no=${ep}`
      });
    }

    const title = (data.match(/"title"\s*:\s*"([^"]+)"/) || data.match(/"readingTitle"\s*:\s*"([^"]+)"/) || [])[1] || '';
    const synopsis = (data.match(/"synopsis"\s*:\s*"([^"]+)"/) || data.match(/"readingSynopsis"\s*:\s*"([^"]+)"/) || [])[1] || '';
    const readCount = parseInt((data.match(/"readCount"\s*:\s*(\d+)/) || [])[1] || 0);
    const favoriteCount = parseInt((data.match(/"favoriteCount"\s*:\s*(\d+)/) || [])[1] || 0);
    const genreName = (data.match(/"displayName"\s*:\s*"([^"]+)"/) || [])[1] || '';
    const authorName = (data.match(/"name"\s*:\s*"([^"]+)"/) || [])[1] || '';
    const tagMatch = data.match(/"tagList"\s*:\s*\[([^\]]+)\]/);
    const tags = tagMatch ? (tagMatch[1].match(/"([^"]+)"/g) || []).map(t => t.replace(/"/g, '')) : [];
    
    const bgMatch = data.match(/"bgImageUrl"\s*:\s*"([^"]+)"/) || data.match(/"thumbnailUrl"\s*:\s*"([^"]+)"/);
    const bgUrl = bgMatch ? `https://webtoon-phinf.pstatic.net${bgMatch[1]}` : null;

    res.json({
      type: isCanvas ? 'canvas' : 'original',
      title_no: titleNoVal,
      title: title,
      synopsis: synopsis,
      author: authorName,
      genre: genreName,
      stats: { reads: readCount, favorites: favoriteCount },
      tags,
      total_episodes: totalEpisodeCount,
      episodes: episodes.reverse(),
      image: bgUrl ? `/api/img?id=${toBase64(bgUrl)}` : null
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.get('/read', async (req, res) => {
  try {
    const url = req.query.url;
    if (!url) return res.status(400).json({ error: 'Missing url' });

    const { data } = await axios.get(url, { headers });
    const imageMatch = data.match(/var\s+imageList\s*=\s*(\[[\s\S]*?\]);/);
    const episodeMatch = data.match(/var\s+episode\s*=\s*(\{[\s\S]*?\});/);
    const nextMatch = data.match(/nextEpisodeUrl\s*:\s*"([^"]+)"/);

    let images = [];
    if (imageMatch) {
      try {
        images = JSON.parse(imageMatch[1].replace(/([{,]\s*)(\w+)(\s*:)/g, '$1"$2"$3').replace(/,\s*}/g, '}').replace(/,\s*\]/g, ']'));
      } catch (e) {
        images = [];
      }
    }

    let episodeData = null;
    if (episodeMatch) {
      try {
        episodeData = JSON.parse(episodeMatch[1].replace(/([{,]\s*)(\w+)(\s*:)/g, '$1"$2"$3'));
      } catch (e) {
        episodeData = null;
      }
    }

    let nextRaw = nextMatch ? nextMatch[1].replace(/&amp;/g, '&') : '';
    let nextUrl = nextRaw ? (nextRaw.startsWith('https://') ? nextRaw : `https://m.webtoons.com${nextRaw}`) : null;

    res.json({
      episode: episodeData?.name || '',
      images: images.filter(img => img.url && !img.url.toLowerCase().includes('warning') && !img.url.toLowerCase().includes('campaign')).map(img => ({
        url: img.url ? `/api/img?id=${toBase64(img.url)}` : '',
        width: img.width || 0,
        height: img.height || 0
      })),
      next: nextUrl,
      title_no: episodeData?.titleNo
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.get('/search', async (req, res) => {
  try {
    const keyword = req.query.keyword;
    if (!keyword) return res.json({ original: [], canvas: [] });
    
    let allOriginal = [];
    let allCanvas = [];
    let start = 1;
    
    while (start <= 100) {
      const url = `https://m.webtoons.com/id/search/result?keyword=${encodeURIComponent(keyword)}&searchType=ALL&start=${start}`;
      const { data } = await axios.get(url, { headers });
      if (!data || !data.success) break;
      
      const original = data.result.webtoonResult.titleList || [];
      const canvas = data.result.challengeResult.titleList || [];
      if (!original.length && !canvas.length) break;
      
      original.forEach(item => {
        const imgUrl = item.thumbnailMobile ? `https://webtoon-phinf.pstatic.net${item.thumbnailMobile}?type=q70` : null;
        allOriginal.push({
          title_no: item.titleNo,
          title: item.title,
          author: item.writingAuthorName,
          image: imgUrl ? `/api/img?id=${toBase64(imgUrl)}` : null,
          genre: item.representGenre || null,
          url: item.titleGroupName ? `https://m.webtoons.com/id/${item.representGenreSeoCode || 'genre'}/${item.titleGroupName}/list?title_no=${item.titleNo}` : null
        });
      });
      
      canvas.forEach(item => {
        const imgUrl = item.thumbnailMobile ? `https://webtoon-phinf.pstatic.net${item.thumbnailMobile}?type=q70` : null;
        allCanvas.push({
          title_no: item.titleNo,
          title: item.title,
          author: item.writingAuthorName,
          image: imgUrl ? `/api/img?id=${toBase64(imgUrl)}` : null,
          reads: item.readCount,
          url: `https://m.webtoons.com/id/canvas/${item.title.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()}/list?title_no=${item.titleNo}`
        });
      });
      start += 10;
    }
    res.json({ original: allOriginal, canvas: allCanvas });
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});

router.get('/jadwal', async (req, res) => {
  const hari = req.query.hari;
  const dayMap = {
    'senin': 'MONDAY', 'selasa': 'TUESDAY', 'rabu': 'WEDNESDAY',
    'kamis': 'THURSDAY', 'jumat': 'FRIDAY', 'sabtu': 'SATURDAY', 'minggu': 'SUNDAY'
  };
  const genreMap = {
    'ACTION': 'Aksi', 'COMEDY': 'Komedi', 'DRAMA': 'Drama',
    'FANTASY': 'Fantasi', 'HORROR': 'Horor', 'ROMANCE': 'Romantis',
    'ROMANTIC_FANTASY': 'Kerajaan', 'THRILLER': 'Thriller', 'SLICE_OF_LIFE': 'Slice of Life'
  };
  if (!dayMap[hari]) return res.json([]);
  
  try {
    const url = `https://m.webtoons.com/id/originals/${dayMap[hari]}/title?sortOrder=MANA`;
    const { data } = await axios.get(url, { headers });
    
    if (Array.isArray(data)) {
      const results = data.map(item => {
        const imgUrl = item.posterThumbnail ? `https://webtoon-phinf.pstatic.net${item.posterThumbnail}?type=q70` : null;
        return {
          title_no: item.titleNo || 0,
          title: item.title || '',
          author: item.writingAuthorName || '',
          genre: genreMap[item.representGenre] || item.representGenre || '',
          image: imgUrl ? `/api/img?id=${toBase64(imgUrl)}` : null,
          likes: item.likeitCount || 0,
          url: `https://m.webtoons.com/id/${item.representGenreSeoCode || 'genre'}/${item.titleGroupName || ''}/list?title_no=${item.titleNo || 0}`
        };
      });
      res.json(results);
    } else {
      res.json([]);
    }
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});

app.use('/api', router);
export default app;
