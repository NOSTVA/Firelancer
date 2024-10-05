"use client";
import { getMainNavItems } from "@/lib/nav";
import { cn } from "@/lib/utils";
import { ChevronDown, Package2 } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

export function MainNav() {
  const pathname = usePathname();
  const navItems = getMainNavItems();

  return (
    <nav className='hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6'>
      <Link
        href='#'
        className='flex items-center gap-2 text-lg font-semibold md:text-base'
      >
        <Package2 className='h-6 w-6' />
        <span className='sr-only'>Acme Inc</span>
      </Link>

      {navItems.map((item) => {
        if (item.items) {
          return (
            <Popover key={item.label}>
              <PopoverTrigger
                className={cn(
                  "transition-colors hover:text-foreground inline-flex items-center justify-center",
                  pathname.startsWith(item.href)
                    ? "text-foreground"
                    : "text-foreground/60"
                )}
              >
                <span>{item.label}</span>
                <ChevronDown
                  className='relative top-[1px] ms-1 h-3 w-3'
                  aria-hidden='true'
                />
              </PopoverTrigger>
              <PopoverContent className='w-52 p-1 flex flex-col'>
                {item.items.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={cn(
                      "transition-colors hover:text-foreground hover:bg-secondary text-sm p-2",
                      pathname.startsWith(item.href)
                        ? "text-foreground"
                        : "text-foreground/60"
                    )}
                  >
                    {item.label}
                  </Link>
                ))}
              </PopoverContent>
            </Popover>
          );
        }

        return (
          <Link
            key={item.label}
            href={item.href}
            className={cn(
              "transition-colors hover:text-foreground",
              pathname.startsWith(item.href)
                ? "text-foreground"
                : "text-foreground/60"
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
