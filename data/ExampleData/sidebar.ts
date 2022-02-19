import {
  ArchiveIcon as ArchiveIconOutline,
  BanIcon,
  FlagIcon,
  InboxIcon,
  PencilAltIcon,
  UserCircleIcon,
} from "@heroicons/react/outline";

export const sidebarNavigation = [
  { name: "Open", href: "/a/dashboard", icon: InboxIcon, current: true },
  { name: "Archive", href: "#", icon: ArchiveIconOutline, current: false },
  { name: "Customers", href: "#", icon: UserCircleIcon, current: false },
  { name: "Flagged", href: "#", icon: FlagIcon, current: false },
  { name: "Spam", href: "#", icon: BanIcon, current: false },
  { name: "Drafts", href: "#", icon: PencilAltIcon, current: false },
];
