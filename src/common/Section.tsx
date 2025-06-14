import React from "react";
import Title from "./Title";

interface CustomButtonProps {
  title: string;
  children: React.ReactNode;
}

const Section: React.FC<CustomButtonProps> = ({ title, children }) => {
  return (
    <div className="container mx-auto px-3 w-full ssm:max-w-[540px] sm:max-w-[720px] md:max-w-[960px] lg:max-w-[1140px] xl:max-w-[1320px] xxl:max-w-[1170px]">
      <div className="flex flex-wrap -mx-3 -mt-0">
        <Title text={title} />
      </div>
      <div className="flex flex-wrap -mx-3 -mt-0">{children}</div>
    </div>
  );
};

export default Section;
