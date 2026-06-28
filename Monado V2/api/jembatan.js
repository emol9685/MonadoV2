export default async function handler(req, res) {
  // Konfigurasi CORS agar bisa dipanggil dari berbagai sumber (jika diperlukan)
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Tangani preflight request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Mengambil parameter URL target dari query (contoh: /api/jembatan?url=https://script.google.com/...)
  const targetUrl = req.query.url;

  if (!targetUrl) {
    return res.status(400).json({ error: 'Parameter "url" wajib diisi' });
  }

  try {
    // Siapkan opsi untuk melakukan fetch ke URL target
    const fetchOptions = {
      method: req.method,
      headers: {
        'Content-Type': req.headers['content-type'] || 'application/json',
      }
    };

    // Teruskan body request jika method bukan GET atau HEAD
    if (!['GET', 'HEAD'].includes(req.method) && req.body) {
      // Jika body berupa object (sudah di-parse), jadikan string JSON
      fetchOptions.body = typeof req.body === 'object' ? JSON.stringify(req.body) : req.body;
    }

    // Lakukan request (proxy) ke target
    const response = await fetch(targetUrl, fetchOptions);
    const data = await response.text();

    // Coba kembalikan sebagai JSON jika memungkinkan, jika tidak kembalikan sebagai teks
    try {
      const jsonData = JSON.parse(data);
      return res.status(response.status).json(jsonData);
    } catch (e) {
      return res.status(response.status).send(data);
    }
    
  } catch (error) {
    console.error('Error pada API Proxy:', error);
    return res.status(500).json({ 
      error: 'Terjadi kesalahan pada Jembatan Proxy', 
      details: error.message 
    });
  }
}
