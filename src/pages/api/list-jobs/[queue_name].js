import { listJobs } from '@/utilities/bullmq'

export default async function handler(req, res) {
  const { queue_name } = req.query
  const { isSuccessful, error, jobs } = await listJobs(queue_name)

  if (!isSuccessful) {
    console.error(`sendPaymentRequestedNotice: ${JSON.stringify(error)}`)
    return res.status(500).json({ error: error })
  }

  console.log(`Successfully listed job: listJobs.`)
  res.status(200).json(jobs)
}
