import { Link, useLocation } from "react-router-dom";
import { cn } from "../../lib/utils";
import { Button } from "../../components/ui/button";
import {
  BarChart3,
  CalendarCheck,
  Folder,
  Home,
  Link2,
  Users,
  Settings,
  CalendarSync,
  Plus,
  HelpCircle,
  CreditCard,
} from "lucide-react";
import { useAuth } from "../../store/hooks";
import { useMemo } from "react";
import { ScrollArea } from "../ui/scroll-area";

interface SidebarItemProps {
  readonly icon: React.ReactNode;
  readonly label: string;
  readonly href: string;
  readonly active: boolean;
  readonly disabled?: boolean;
}

function SidebarItem({
  icon,
  label,
  href,
  active,
  disabled,
}: SidebarItemProps) {
  return (
    <Link to={href}>
      <Button
        variant="ghost"
        className={cn(
          "w-full justify-start gap-2",
          active && "bg-accent text-accent-foreground",
          disabled && "hidden"
        )}
      >
        {icon}
        <span className="ml-3">{label}</span>
      </Button>
    </Link>
  );
}

export default function DashboardSidebar({
  closeMenu,
  isMobile = false,
}: {
  readonly closeMenu?: () => void;
  readonly isMobile?: boolean;
}) {
  const location = useLocation();
  const { isAdmin, user } = useAuth();

  const menuItems = useMemo(
    () => [
      {
        icon: <Home size={18} />,
        label: "Dashboard",
        href: "/dashboard",
      },
      {
        icon: <CalendarCheck size={18} />,
        label: "Schedule",
        href: "/dashboard/schedule",
      },
      {
        icon: <Link2 size={18} />,
        label: "Social Accounts",
        href: "/dashboard/accounts",
      },
      {
        icon: <CalendarSync size={18} />,
        label: "Posts",
        href: "/dashboard/posts",
      },
      {
        icon: <CalendarSync size={18} />,
        label: "Post Flow",
        href: "/dashboard/post-flow",
      },
      {
        icon: <Folder size={18} />,
        label: "Collections",
        href: "/dashboard/collections",
      },
      {
        icon: <Users size={18} />,
        label: "Teams",
        href: "/dashboard/teams",
        disabled: user?.userType === "individual",
      },
      {
        icon: <BarChart3 size={18} />,
        label: "Analytics",
        href: "/dashboard/analytics",
      },
      // {
      //   icon: <BarChart3 size={18} />,
      //   label: "Billing",
      //   href: "/dashboard/billing",
      // },
    ],
    [isAdmin, user]
  );

  const bottomNavItems = [
    {
      label: "Settings",
      href: "/settings",
      icon: <Settings className="h-5 w-5" />,
    },
    {
      label: "Billing",
      href: "/dashboard/billing",
      icon: <CreditCard className="h-5 w-5" />,
    },
    {
      label: "Help & Support",
      href: "/help",
      icon: <HelpCircle className="h-5 w-5" />,
    },
  ];

  const handleNavigation = (path: string) => {
    if (closeMenu && isMobile) {
      closeMenu();
    }
  };

  return (
    <aside
      className={cn(
        "h-full min-w-[220px] border-r bg-background px-3 py-4",
        isMobile ? "flex-col" : "w-64"
      )}
    >
      <ScrollArea className="flex-1">
        <div className="flex flex-col gap-2 p-4">
          <Button asChild className="mb-4">
            <Link to="/dashboard/create-post">
              <Plus className="mr-2 h-4 w-4" />
              Create Post
            </Link>
          </Button>
          <nav className="space-y-1">
            {menuItems.map((item) => (
              <SidebarItem
                key={item.href}
                icon={item.icon}
                label={item.label}
                href={item.href}
                active={location.pathname === item.href}
                disabled={item.disabled}
              />
              // <Button
              //   key={item.href}
              //   variant={
              //     location.pathname === item.href ? "secondary" : "ghost"
              //   }
              //   className={cn(
              //     "w-full justify-start",
              //     location.pathname === item.href
              //       ? "bg-muted font-medium"
              //       : "font-normal"
              //   )}
              //   asChild
              //   onClick={() => handleNavigation(item.href)}
              // >
              //   <Link to={item.href}>
              //     {item.icon}
              //     <span className="ml-3">{item.label}</span>
              //   </Link>
              // </Button>
            ))}
          </nav>
        </div>
      </ScrollArea>

      {/* <div className="mt-auto pt-4 border-t">
        <SidebarItem
          icon={<Settings size={18} />}
          label="Settings"
          href="/settings"
          active={location.pathname === "/settings"}
        />
      </div> */}
      <div className="flex flex-col gap-2 border-t p-4">
        <nav className="space-y-1">
          {bottomNavItems.map((item) => (
            // <Button
            //   key={item.href}
            //   variant="ghost"
            //   className="w-full justify-start font-normal"
            //   asChild
            //   onClick={() => handleNavigation(item.href)}
            // >
            //   <Link to={item.href}>
            //     {item.icon}
            //     <span className="ml-3">{item.label}</span>
            //   </Link>
            // </Button>
            <SidebarItem
              key={item.href}
              icon={item.icon}
              label={item.label}
              href={item.href}
              active={location.pathname === item.href}
            />
          ))}
        </nav>
      </div>
    </aside>

    // <aside
    //   className={cn(
    //     "flex h-screen border-r bg-background",
    //     isMobile ? "flex-col" : "w-64"
    //   )}
    // >
    //   <ScrollArea className="flex-1">
    //     <div className="flex flex-col gap-2 p-4">
    //       <Button asChild className="mb-4">
    //         <Link to="/dashboard/create-post">
    //           <Plus className="mr-2 h-4 w-4" />
    //           Create Post
    //         </Link>
    //       </Button>

    //       <nav className="space-y-1">
    //         {menuItems.map((item) => (
    //           <Button
    //             key={item.href}
    //             variant={
    //               location.pathname === item.href ? "secondary" : "ghost"
    //             }
    //             className={cn(
    //               "w-full justify-start",
    //               location.pathname === item.href
    //                 ? "bg-muted font-medium"
    //                 : "font-normal"
    //             )}
    //             asChild
    //             onClick={() => handleNavigation(item.href)}
    //           >
    //             <Link to={item.href}>
    //               {item.icon}
    //               <span className="ml-3">{item.label}</span>
    //             </Link>
    //           </Button>
    //         ))}
    //       </nav>
    //     </div>
    //   </ScrollArea>

    //   <div className="flex flex-col gap-2 border-t p-4">
    //     <nav className="space-y-1">
    //       {bottomNavItems.map((item) => (
    //         <Button
    //           key={item.href}
    //           variant="ghost"
    //           className="w-full justify-start font-normal"
    //           asChild
    //           onClick={() => handleNavigation(item.href)}
    //         >
    //           <Link to={item.href}>
    //             {item.icon}
    //             <span className="ml-3">{item.label}</span>
    //           </Link>
    //         </Button>
    //       ))}
    //     </nav>
    //   </div>
    // </aside>
  );
}

// import { useLocation } from 'wouter';
// import { cn } from '@/lib/utils';
// import {
//   CalendarDays,
//   LayoutDashboard,
//   Rss,
//   FolderClosed,
//   Users2,
//   Settings,
//   BarChart3,
//   HelpCircle,
//   Plus,
//   BookOpenCheck,
//   CreditCard
// } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { ScrollArea } from '@/components/ui/scroll-area';
// import { Link } from 'wouter';

// interface SidebarProps {
//   closeMenu?: () => void;
//   isMobile?: boolean;
// }

// export default function DashboardSidebar({ closeMenu, isMobile = false }: SidebarProps) {
//   const [location] = useLocation();

//   const handleNavigation = (path: string) => {
//     if (closeMenu && isMobile) {
//       closeMenu();
//     }
//   };

//   const navItems = [
//     {
//       title: 'Dashboard',
//       href: '/dashboard',
//       icon: <LayoutDashboard className="h-5 w-5" />,
//     },
//     {
//       title: 'Schedule',
//       href: '/dashboard/schedule',
//       icon: <CalendarDays className="h-5 w-5" />,
//     },
//     {
//       title: 'Analytics',
//       href: '/dashboard/analytics',
//       icon: <BarChart3 className="h-5 w-5" />,
//     },
//     {
//       title: 'Content Library',
//       href: '/dashboard/content',
//       icon: <BookOpenCheck className="h-5 w-5" />,
//     },
//     {
//       title: 'Social Accounts',
//       href: '/dashboard/accounts',
//       icon: <Rss className="h-5 w-5" />,
//     },
//     {
//       title: 'Collections',
//       href: '/dashboard/collections',
//       icon: <FolderClosed className="h-5 w-5" />,
//     },
//     {
//       title: 'Team',
//       href: '/dashboard/team',
//       icon: <Users2 className="h-5 w-5" />,
//     },
//   ];

//   const bottomNavItems = [
//     {
//       title: 'Settings',
//       href: '/settings',
//       icon: <Settings className="h-5 w-5" />,
//     },
//     {
//       title: 'Billing',
//       href: '/settings/billing',
//       icon: <CreditCard className="h-5 w-5" />,
//     },
//     {
//       title: 'Help & Support',
//       href: '/help',
//       icon: <HelpCircle className="h-5 w-5" />,
//     },
//   ];

//   return (
//     <aside className={cn(
//       "flex h-screen border-r bg-background",
//       isMobile ? "flex-col" : "w-64"
//     )}>
//       <ScrollArea className="flex-1">
//         <div className="flex flex-col gap-2 p-4">
//           <Button asChild className="mb-4">
//             <Link href="/dashboard/create-post">
//               <Plus className="mr-2 h-4 w-4" />
//               Create Post
//             </Link>
//           </Button>

//           <nav className="space-y-1">
//             {navItems.map((item) => (
//               <Button
//                 key={item.href}
//                 variant={location === item.href ? "secondary" : "ghost"}
//                 className={cn(
//                   "w-full justify-start",
//                   location === item.href
//                     ? "bg-muted font-medium"
//                     : "font-normal"
//                 )}
//                 asChild
//                 onClick={() => handleNavigation(item.href)}
//               >
//                 <Link href={item.href}>
//                   {item.icon}
//                   <span className="ml-3">{item.title}</span>
//                 </Link>
//               </Button>
//             ))}
//           </nav>
//         </div>
//       </ScrollArea>

//       <div className="flex flex-col gap-2 border-t p-4">
//         <nav className="space-y-1">
//           {bottomNavItems.map((item) => (
//             <Button
//               key={item.href}
//               variant="ghost"
//               className="w-full justify-start font-normal"
//               asChild
//               onClick={() => handleNavigation(item.href)}
//             >
//               <Link href={item.href}>
//                 {item.icon}
//                 <span className="ml-3">{item.title}</span>
//               </Link>
//             </Button>
//           ))}
//         </nav>
//       </div>
//     </aside>
//   );
// }
