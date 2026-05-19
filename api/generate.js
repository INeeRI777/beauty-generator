export default async function handler(req, res) {
  return res.status(200).json({ test: 'dziala', key: !!process.env.ANTHROPIC_API_KEY });
}
