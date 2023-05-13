import post from './post'

export default async function handler(req, res) {
  switch (req.method) {
    case "POST":
      await post(req, res);
      break;
    default:
      res.setHeader('Allow', ['POST'])
      res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}