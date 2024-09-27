import { SiteNavigation } from "@/types/nav";
import site_navigation from "./navigation.json" assert { type: "json" };

export const siteNavigation = site_navigation as SiteNavigation;
