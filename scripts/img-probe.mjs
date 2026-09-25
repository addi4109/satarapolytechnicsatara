/* Read image dimensions of the 4 leadership photos. */
const urls = [
  'https://res.cloudinary.com/yjiggwb7/image/upload/v1787475748/mj3teklkowdrqktopkct.webp',
  'https://res.cloudinary.com/yjiggwb7/image/upload/v1787475906/igodnkp5dirzf9edpy9k.webp',
  'https://res.cloudinary.com/yjiggwb7/image/upload/v1787476841/fayypnrnzdzmgcpxl2nt.jpg',
  'https://res.cloudinary.com/yjiggwb7/image/upload/v1788495457/xccvjtvhbhdsbczmxrif.png',
];
for (const u of urls) {
  const res = await fetch(u);
  const buf = Buffer.from(await res.arrayBuffer());
  // PNG: IHDR at offset 16 (big-endian width/height)
  if (buf[0] === 0x89 && buf[1] === 0x50) {
    console.log(u.split('/').pop(), 'PNG', buf.readUInt32BE(16), 'x', buf.readUInt32BE(20));
    continue;
  }
  // JPEG: scan SOF markers
  if (buf[0] === 0xff && buf[1] === 0xd8) {
    let i = 2, w = 0, h = 0;
    while (i < buf.length - 9) {
      if (buf[i] !== 0xff) { i++; continue; }
      const marker = buf[i + 1];
      if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) {
        h = buf.readUInt16BE(i + 5); w = buf.readUInt16BE(i + 7); break;
      }
      i += 2 + buf.readUInt16BE(i + 2);
    }
    console.log(u.split('/').pop(), 'JPEG', w, 'x', h);
    continue;
  }
  // WEBP: VP8 / VP8L / VP8X
  if (buf.slice(8, 12).toString() === 'VP8X') {
    const w = 1 + ((buf[24] | (buf[25] << 8) | (buf[26] << 16)) & 0xffffff);
    const h = 1 + ((buf[27] | (buf[28] << 8) | (buf[29] << 16)) & 0xffffff);
    console.log(u.split('/').pop(), 'WEBP-extended', w, 'x', h);
    continue;
  }
  if (buf.slice(12, 16).toString() === 'VP8 ') {
    // lossy keyframe: frame header after 3-byte partition size
    const o = 20;
    const w = buf.readUInt16LE(o) & 0x3fff, h = buf.readUInt16LE(o + 2) & 0x3fff;
    console.log(u.split('/').pop(), 'WEBP-lossy', w, 'x', h);
    continue;
  }
  if (buf.slice(12, 16).toString() === 'VP8L') {
    const b = buf[21] | (buf[22] << 8) | (buf[23] << 16) | (buf[24] << 24);
    console.log(u.split('/').pop(), 'WEBP-lossless', (b & 0x3fff) + 1, 'x', ((b >> 14) & 0x3fff) + 1);
    continue;
  }
  console.log(u.split('/').pop(), 'unknown format');
}
