function formatPrice(value, currency) {
    if (!value) return '';
    if (value >= 10000000) return `${(value / 10000000).toFixed(1)} Cr`;
    if (value >= 100000) return `${(value / 100000).toFixed(1)} Lac`;
    return `${value.toLocaleString()} ${currency}`;
}

export default async function handler(req, res) {
    const userAgent = req.headers['user-agent'] || '';
    const isBot = /whatsapp|facebookexternalhit|twitterbot|linkedinbot|slackbot|telegrambot|opengraph|og-preview|iframely|prerender|crawl|bot|spider/i.test(userAgent);
    const { id } = req.query;

    if (!isBot) {
        // Real user — redirect to /index.html which is NOT caught by the /property/:id rewrite
        // React Router will read the original URL and render the correct page
        res.setHeader('Content-Type', 'text/html');
        return res.send(`<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <script>
      // Push the correct path so React Router renders /property/${id}
      history.replaceState(null, '', '/property/${id}');
    </script>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/assets/index.js"></script>
  </body>
</html>`);
    }

    try {
        const response = await fetch(`https://api.denivs.com/api/properties/${id}/og`);

        if (!response.ok) throw new Error('Property not found');

        const { data } = await response.json();

        const title = data.title || 'Property on Denivs';
        const price = formatPrice(data.price, data.currency);
        const city = data.city || '';
        const description = data.description
            ? data.description.slice(0, 150) + '...'
            : `${data.propertyType} for sale${city ? ` in ${city}` : ''}${price ? ` at ₹${price}` : ''}`;
        const image = data.image || 'https://denivs.com/og-default.jpg';

        res.setHeader('Content-Type', 'text/html');
        res.send(`<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>${title}</title>

    <!-- Open Graph (WhatsApp, Facebook) -->
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:image" content="${image}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:url" content="https://denivs.com/property/${id}" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="Denivs" />

    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${title}" />
    <meta name="twitter:description" content="${description}" />
    <meta name="twitter:image" content="${image}" />
  </head>
  <body>
    <script>window.location.replace('/property/${id}')</script>
  </body>
</html>`);

    } catch (e) {
        res.redirect(302, '/');
    }
}