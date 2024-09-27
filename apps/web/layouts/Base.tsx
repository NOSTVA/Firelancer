import type { FC, PropsWithChildren } from "react";

const BaseLayout: FC<PropsWithChildren> = ({ children }) => {
  return <div className="h-screen">{children}</div>;
};

export default BaseLayout;
