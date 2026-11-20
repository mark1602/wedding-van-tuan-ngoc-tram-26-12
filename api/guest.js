const fs = require('fs');
const path = require('path');

const BASE = 'https://wedding-van-tuan-ngoc-tram-26-12.vercel.app';
const SUF = ' | Thiệp cưới Văn Tuấn & Ngọc Trâm';
const PRE = /^(Chị|Cô|Thầy|Anh|Em|Chú|Bác|Bạn|Gia đình|C\.)/;
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const html = fs.readFileSync(path.join(process.cwd(), 'for/_default/index.html'), 'utf8');
let MAP = {};
try {
  const m = html.match(/window\.GUEST_MAP=(\{[\s\S]*?\});<\/script>/);
  if (m) MAP = JSON.parse(m[1]);
} catch (e) {}

module.exports = (req, res) => {
  let slug = '';
  try {
    slug = String((req.query && req.query.slug) || new URL(req.url, BASE).searchParams.get('slug') || '').toLowerCase();
  } catch (e) {}
  const g = MAP[slug];
  let out = html;
  if (g && g.name) {
    const n = g.name;
    const title = 'Trân trọng kính mời ' + (PRE.test(n) ? '' : 'Bạn ') + n + SUF;
    const desc = 'Đến dự buổi tiệc chung vui cùng gia đình — Thứ Bảy 26.12.2026.';
    const t = esc(title), d = esc(desc);
    out = out
      .replace(/<title>[\s\S]*?<\/title>/, '<title>' + t + '</title>')
      .replace(/(<meta property="og:title" content=")[^"]*(")/, '$1' + t + '$2')
      .replace(/(<meta name="description" content=")[^"]*(")/, '$1' + d + '$2')
      .replace(/(<meta property="og:description" content=")[^"]*(")/, '$1' + d + '$2');
    if (/<meta property="og:url"/.test(out)) {
      out = out.replace(/(<meta property="og:url" content=")[^"]*(")/, '$1' + BASE + '/for/' + esc(slug) + '$2');
    } else {
      out = out.replace('</head>', '<meta property="og:url" content="' + BASE + '/for/' + esc(slug) + '">\n</head>');
    }
  }
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=86400');
  res.status(200).send(out);
};
