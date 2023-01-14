// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import supabase from '../../utilities/supabase'

export default async function handler(req, res) {
  const { data, error } = await supabase
    .from('test')
    .select()

  if (error) {
    console.error(`error: ${JSON.stringify(error)}`)
    return res.status(500).json({ error: error })
  }

  console.log(`successfully connected to database.`)
  res.status(200)
}
