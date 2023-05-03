import { sendPaymentRequestedNotice } from '@/utilities/bullmq'

export default async function handler(req, res) {
  const { isSuccessful, error } = await sendPaymentRequestedNotice('woody.andygrant@gmail.com', 'Andy', 100)

  if (!isSuccessful) {
    console.error(`sendPaymentRequestedNotice: ${JSON.stringify(error)}`)
    return res.status(500).json({ error: error })
  }

  console.log(`Successfully scheduled email job: sendPaymentRequestedNotice.`)
  res.status(200).json({ data: { isSuccessful } })
}
