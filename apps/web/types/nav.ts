export enum Context {
  ANY,
  FREELANCER,
  CLIENT,
}

export interface NavItem {
  label?: string | undefined;
  disabled?: boolean | undefined;
  href: string;
  context: Context;
}

export interface NavItemWithChildren extends NavItem {
  items?: NavItemWithChildren[];
}

export interface SiteNavigation {
  mainNav: Record<
    "work" | "reports" | "findTalent" | "findWork" | "messages",
    NavItemWithChildren
  >;
}
