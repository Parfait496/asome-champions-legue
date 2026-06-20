export default async function handler(req, res) {
  const { id } = req.query

  try {
    const apiUrl = process.env.VITE_API_URL || 'https://asome-champions-legue-production.up.railway.app/api'
    const response = await fetch(`${apiUrl}/news/${id}/`)
    const post = await response.json()

    const title = post.title || 'ASOME Champions League'
    const description = post.excerpt || 'Campus Football Tournament'
    const image = post.cover_image_url || 'https://asome-champions-legue.vercel.app/icon-512.png'
    const url = `https://asome-champions-legue.vercel.app/news/${id}`

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>${title}</title>
  <meta property="og:title" content="${title}" />
  <meta property="og:description" content="${description}" />
  <meta property="og:image" content="${image}" />
  <meta property="og:url" content="${url}" />
  <meta property="og:type" content="article" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${title}" />
  <meta name="twitter:description" content="${description}" />
  <meta name="twitter:image" content="${image}" />
  <meta http-equiv="refresh" content="0; url=${url}" />
</head>
<body>
  <p>Redirecting to <a href="${url}">${title}</a>...</p>
</body>
</html>
    `

    res.setHeader('Content-Type', 'text/html')
    res.status(200).send(html)
  } catch (err) {
    res.redirect(302, 'https://asome-champions-legue.vercel.app/news')
  }
}