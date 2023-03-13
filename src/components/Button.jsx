import Link from 'next/link'
import Image from 'next/image'

const BUTTON_WIDTH_ENUM = Object.freeze({
  'small': 'w-14',
  'large': 'w-40'
})

const Button = ({ size, iconLink, backgroundColor, destination, buttonName, children }) => {
  return (
    <div className={`h-max w-max`}>
      <div className={`flex justify-center items-center content-center ${backgroundColor} h-14 ${BUTTON_WIDTH_ENUM[size]} rounded-lg p-2`}>
        <a href={destination}>
          {
            iconLink ? 
            <Image src={iconLink} alt='deposit' width={40} height={40} /> 
            : 
            <div className='text-lg font-bold'>{children}</div>
          }
        </a>
      </div>
      { buttonName && <div className='mt-2 text-center text-xs'>{ buttonName }</div> }
    </div>
  )
}

export default Button