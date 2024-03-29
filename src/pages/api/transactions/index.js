import create from './create'

export default async function handler(req, res) {
  switch (req.method) {
    case "POST":
      await create(req, res);
      break;
    default:
      res.setHeader('Allow', ['POST'])
      res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}