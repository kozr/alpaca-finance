import Button from '@/components/Button'
import Page from '@/components/Page'

const RequestOptions = () => {
  return (
    <Page title="request options">
      <div className="flex flex-col items-center justify-center">
        <Button size={'large'} backgroundColor='bg-positive-green' destination='/request/evenly' buttonName="Split evenly" />
        <Button size={'large'} backgroundColor='bg-positive-green' destination='/request/individually' buttonName="Select individually" />
      </div>
    </Page>
  )
}

export default RequestOptions