import {
    LuLayoutDashboard,
    LuHandCoins,
    LuWalletMinimal,
    LuLogOut,
} from "react-icons/lu";

export const SIDE_MENU_DATA = [
    {
        id: "1",
        name: "Dashboard",
        icon: LuLayoutDashboard ,
        link: "/dashboard",
    },
    {
        id: "2",
        name: "Income",
        icon: LuWalletMinimal ,
        link: "/income",
    },
    {
        id: "3",
        name: "Expense",
        icon: LuHandCoins ,
        link: "/expense",
    },
    {
        id: "4",
        name: "Logout",
        icon: LuLogOut ,
        link: "/logout",
    },
];