export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'Brak klucza API na serwerze' });

  const { prompt } = req.body;
  if (!prompt) return res.status(400).json({ error: 'Brak promptu' });

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 4000,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ 
        error: data.error?.message || JSON.stringify(data),
        type: data.error?.type
      });
    }

    const raw = data.content[0].text;
    const clean = raw.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(clean);
    return res.status(200).json(parsed);

  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
