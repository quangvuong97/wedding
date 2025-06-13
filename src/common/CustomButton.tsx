import { Button } from "antd";
import type { ButtonProps } from "antd";
import React from "react";

interface CustomButtonProps extends ButtonProps {
  text?: string;
  icon?: React.ReactNode;
  className?: string;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  text,
  icon,
  className = "",
  children,
  ...rest
}) => {
  return (
    <div className={`relative inline-block`}>
      <div className="absolute top-[5px] left-[5px] w-full h-full border-[1px] border-[#1e8267]"></div>

      <Button
        {...rest}
        icon={icon}
        className={
          "!bg-[#1e8267] !text-white !border-none !rounded-none shadow-none font-muli font-semibold" +
          className
        }
      >
        {text ?? children}
      </Button>
    </div>
  );
};

export default CustomButton;
