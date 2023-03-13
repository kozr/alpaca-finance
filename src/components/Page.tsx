import React from "react";
import Button from "./Button";

type PageProps = {
  title: string;
  children: React.ReactNode;
};

const Page = ({ children, title }: PageProps) => {
  return (
    <>
      <div className="flex flex-row items-center content-center justify-between m-10 ">
        <Button
          size="small"
          iconLink="/vertical.svg"
          backgroundColor="bg-button-grey"
          destination="/"
        />
        <h1 className="text-md">{title}</h1>
        <Button
          size="small"
          iconLink="/person.svg"
          backgroundColor="bg-button-grey"
          destination="/"
        />
      </div>
      {children}
    </>
  );
};

export default Page;
