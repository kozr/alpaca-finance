// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import supabase from '../../utilities/supabase'

export default async function handler(req, res) {
  const { data, error } = await supabase
    .from('test')
    .select()

  if (error) {
    console.error(`error: ${error}`)
  } else {
    console.log(`data: ${data}`)
  }
  res.status(200).json({ name: data })
}
