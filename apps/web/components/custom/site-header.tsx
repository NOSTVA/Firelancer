import { MainNav } from "./main-nav";
import { MobileNav } from "./mobile-nav";
import { ModeToggle } from "./mode-toggle";
import { SignOutForm } from "../forms/sign-out/sign-out-form";

export async function SiteHeader() {
  return (
    <header className='sticky z-50 top-0 flex h-16 items-center gap-4 border-b bg-background'>
      <div className='container mx-auto px-4 md:px-6 flex flex-row'>
        <MainNav />
        <MobileNav />
        <div className='flex flex-1 items-center justify-between space-x-2 md:justify-end'>
          <nav className='flex items-center gap-4 ms-auto'>
            <SignOutForm />
            <ModeToggle />
          </nav>
        </div>
      </div>
    </header>
  );
}
