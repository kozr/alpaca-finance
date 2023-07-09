import Image from "next/image";

const BUTTON_WIDTH_ENUM = Object.freeze({
  small: "w-18",
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
  onClick = () => {},
  disabled,
  children,
}: ButtonProps) => {

  const disabledStyle = disabled ? "opacity-50 cursor-not-allowed" : "";
  const fontStyles = size === "small" ? "text-sm" : "text-lg font-bold";

  const onClickHandler = (e) => {
    if (disabled) {
      e.preventDefault();
    } else {
      onClick(e);
    }
  };

  return (
    <div className={`${disabledStyle} h-max w-max`} onClick={onClickHandler}>
      <div
        className={`flex justify-center items-center content-center ${backgroundColor} h-14 ${BUTTON_WIDTH_ENUM[size]} rounded-lg p-2 cursor-pointer active:bg-gray-300`}
      >
        {destination ? (
          <a href={destination}>
            {iconLink ? (
              <Image src={iconLink} alt={buttonName} width={40} height={40} />
            ) : (
              <div className={fontStyles}>{children}</div>
            )}
          </a>
        ) : (
          <div className={fontStyles}>{children}</div>
        )}
      </div>
      {buttonName && (
        <div className="mt-2 text-center text-xs">{buttonName}</div>
      )}
    </div>
  );
};

export default Button;