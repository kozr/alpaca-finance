import React from "react";
import Button from "./Button";

type PageProps = {
  title: string;
  children: React.ReactNode;
};

const Page = ({ children, title }: PageProps) => {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex flex-row items-center content-center justify-between m-10">
        <Button
          disabled
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
          destination="/feed"
        />
      </div>
      <div className="mx-10 flex-1">
        {children}
      </div>
    </div>
  );
};

export default Page;