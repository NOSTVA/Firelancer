import { siteNavigation } from "@/static/next.json";

export function getMainNavItems() {
  return Object.values(siteNavigation.mainNav);
}
