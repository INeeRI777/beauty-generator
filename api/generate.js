export default async function handler(req, res) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  
  let body = req.body;
  if (typeof body === 'string') {
    body = JSON.parse(body);
  }
  
  const prompt = body?.prompt;
  
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-3-5-haiku-20241022',
      max_tokens: 1024,
      messages: [{ role: 'user', content: prompt || 'test' }],
    }),
  });

  const data = await response.json();
  console.log('STATUS:', response.status, 'DATA:', JSON.stringify(data).slice(0, 200));
  return res.status(response.status).json(data);
}
