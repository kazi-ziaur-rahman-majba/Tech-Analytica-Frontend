import {
	FaThLarge,
	FaListUl,
	FaAddressBook,
} from "react-icons/fa";
import type { IconType } from "react-icons";

export type MenuItem = {
  id: number;
  name: string;
  title: string;
  icon: IconType;
  path: string;
  subItems: Array<{ id: number; name: string; path: string }>;
};

export type MenuSection = {
  sectionName: string;
  items: MenuItem[];
};

const adminMenu: MenuSection[] = [
  {
    sectionName: "Main",
    items: [
      {
        id: 1,
        name: "Dashboard",
        title: "Dashboard",
        icon: FaThLarge,
        path: "/",
        subItems: [],
      },
    ],
  },
  {
    sectionName: "Tasks",
    items: [
      {
        id: 2,
        name: "Tasks",
        title: "Tasks",
        icon: FaListUl,
        path: "/tasks",
        subItems: [],
      },
      {
        id: 3,
        name: "Audit Logs",
        title: "Audit Logs",
        icon: FaAddressBook,
        path: "/audit-logs",
        subItems: [],
      },
    ],
  },
];

const userMenu: MenuSection[] = [
  {
    sectionName: "Tasks",
    items: [
      {
        id: 2,
        name: "Tasks",
        title: "Tasks",
        icon: FaListUl,
        path: "/my-tasks",
        subItems: [],
      },
    ],
  },
];

export const getMenuByRole = (role?: string): MenuSection[] =>
  role === "USER" ? userMenu : adminMenu;

export const menu = adminMenu;