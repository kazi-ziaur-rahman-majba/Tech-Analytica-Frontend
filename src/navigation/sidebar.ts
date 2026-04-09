import {
	FaThLarge,
	FaListUl,

	FaAddressBook,

} from "react-icons/fa";

export const menu = [
  {
    sectionName: "Main",
    items: [
      {
        id: 1,
        name: "Dashboard",
        title: "Dashboard",
        icon: FaThLarge,
        path: "/tasks",
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