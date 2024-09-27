"use client";
import type { FC, PropsWithChildren } from "react";

const BaseLayout: FC<PropsWithChildren> = ({ children }) => {
  return <div className="w-full flex flex-col">{children}</div>;
};

export default BaseLayout;
