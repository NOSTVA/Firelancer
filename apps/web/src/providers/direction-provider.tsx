"use client";
import { FC, PropsWithChildren } from "react";
import { DirectionProvider as RadixDirectionProvider } from "@radix-ui/react-direction";

export const DirectionProvider: FC<
  PropsWithChildren & { dir: "rtl" | "ltr" }
> = ({ children, dir }) => {
  return <RadixDirectionProvider dir={dir}>{children}</RadixDirectionProvider>;
};
