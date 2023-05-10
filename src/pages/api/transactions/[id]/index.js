import get from './get'

export default async function handler(req, res) {
  switch (req.method) {
    case "GET":
      await get(req, res);
      break;
    default:
      res.setHeader('Allow', ['GET'])
      res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}