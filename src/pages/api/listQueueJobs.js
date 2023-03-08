import { emailCancelRequest, listJobs } from '@/utilities/bullmq'

export default async function handler(req, res) {
  // async function emailCancelRequest(email, requesterName, amount)
  const data = JSON.parse(req.body)
  const { isSuccessful, error, jobs } = await listJobs(data['queueName'])

  if (!isSuccessful) {
    console.error(`emailCancelRequest: ${JSON.stringify(error)}`)
    return res.status(500).json({ error: error })
  }

  console.log(`Successfully listed job: listJobs.`)
  res.status(200).json({ data: { isSuccessful, jobs } })
}
