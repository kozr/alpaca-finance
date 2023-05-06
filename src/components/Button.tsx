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
  buttonName?: string;
  onClick?: (e) => void;
  disabled?: boolean;
  children?: React.ReactNode;
};

const Button = ({
  size,
  iconLink,
  backgroundColor,
  destination,
  buttonName,
  onClick = (e) => { e.preventDefault() },
  disabled,
  children,
}: ButtonProps) => {

  const disabledStyle = disabled ? "opacity-50 cursor-not-allowed" : "";
  const onClickHandler = disabled ? (e) => { e.preventDefault(); } : onClick;

  return (
    <div className={`${disabledStyle} h-max w-max`}>
      <div
        className={`flex justify-center items-center content-center ${backgroundColor} h-14 ${BUTTON_WIDTH_ENUM[size]} rounded-lg p-2 cursor-pointer`}
      >
        {destination ? (
          <a href={destination} onClick={onClickHandler}>
            {iconLink ? (
              <Image src={iconLink} alt={buttonName} width={40} height={40} />
            ) : (
              <div className="text-lg font-bold">{children}</div>
            )}
          </a>
        ) : (
          <div onClick={onClickHandler} className="text-lg font-bold">{children}</div>
        )}
      </div>
      {buttonName && (
        <div className="mt-2 text-center text-xs">{buttonName}</div>
      )}
    </div>
  );
};

export default Button;