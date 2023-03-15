import Image from "next/image";

const BUTTON_WIDTH_ENUM = Object.freeze({
  small: "w-14",
  large: "w-40",
});

type ButtonProps = {
  size: "small" | "large";
  iconLink?: string;
  backgroundColor: string;
  destination?: string;
  onClick?: () => void;
  buttonName?: string;
  children?: React.ReactNode;
};

const Button = ({
  size,
  iconLink,
  backgroundColor,
  destination,
  buttonName,
  onClick = () => {},
  children,
}: ButtonProps) => {

  return (
    <div className={`h-max w-max`}>
      <div
        className={`flex justify-center items-center content-center ${backgroundColor} h-14 ${BUTTON_WIDTH_ENUM[size]} rounded-lg p-2`}
      >
        {destination ? (
          <a href={destination}>
            {iconLink ? (
              <Image src={iconLink} onClick={onClick} alt="deposit" width={40} height={40} />
            ) : (
                <div onClick={onClick} className="text-lg font-bold">{children}</div>
            )}
          </a>
        ) : (
          <div onClick={onClick} className="text-lg font-bold">{children}</div>
        )}
      </div>
      {buttonName && (
        <div className="mt-2 text-center text-xs">{buttonName}</div>
      )}
    </div>
  );
};

export default Button;
