import create from './create'
import get from './get'

export default async function handler(req, res) {
  switch (req.method) {
    case "GET":
      await get(req, res);
      break;
    case "POST":
      await create(req, res);
      break;
    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE'])
      res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}