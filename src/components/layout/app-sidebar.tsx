'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuBadge,
} from '@/components/ui/sidebar';
import {
  BarChartBig,
  UsersRound,
  MessageSquare,
  User,
  Settings,
  LogOut,
  Swords,
  LayoutDashboard,
  Bell,
} from 'lucide-react';
import Logo from '../logo';
import { useFirebase, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';

const menuItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/find-teammates', label: 'Find Teammates', icon: UsersRound },
  { href: '/notifications', label: 'Notifications', icon: Bell, notificationKey: 'requests' },
  { href: '/messages', label: 'Messages', icon: MessageSquare },
  { href: '/team', label: 'My Team', icon: Swords },
];

const bottomMenuItems = [
    { href: '/profile', label: 'My Profile', icon: User },
    { href: '#', label: 'Settings', icon: Settings },
    { href: '/login', label: 'Logout', icon: LogOut },
]

export function AppSidebar() {
  const pathname = usePathname();
  const { user, firestore } = useFirebase();

  const requestsQuery = useMemoFirebase(() => {
    if (!user) return null;
    return query(
        collection(firestore, "requests"),
        where('toUid', '==', user.uid),
        where('status', '==', 'pending')
    );
  }, [firestore, user]);

  const { data: pendingRequests } = useCollection(requestsQuery);
  const notificationCount = pendingRequests?.length || 0;

  return (
    <Sidebar collapsible="icon" variant="sidebar">
      <SidebarHeader>
        <Logo />
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.label}>
              <Link href={item.href} legacyBehavior passHref>
                <SidebarMenuButton
                  isActive={pathname === item.href}
                  tooltip={item.label}
                  asChild
                >
                  <a>
                    <item.icon />
                    <span>{item.label}</span>
                    {item.notificationKey === 'requests' && notificationCount > 0 && <SidebarMenuBadge>{notificationCount}</SidebarMenuBadge>}
                  </a>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
         <SidebarMenu>
          {bottomMenuItems.map((item) => (
            <SidebarMenuItem key={item.label}>
              <Link href={item.href} legacyBehavior passHref>
                <SidebarMenuButton
                  isActive={pathname === item.href}
                  tooltip={item.label}
                  asChild
                >
                  <a>
                    <item.icon />
                    <span>{item.label}</span>
                  </a>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
        <div className="flex items-center gap-2 p-2">
            <Avatar className='size-8'>
                <AvatarImage src={user?.photoURL ?? undefined} alt={user?.displayName ?? ''} data-ai-hint="person face" />
                <AvatarFallback>{user?.displayName?.charAt(0) ?? 'U'}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col group-data-[collapsible=icon]:hidden">
                <span className="text-sm font-semibold">{user?.displayName}</span>
                <span className="text-xs text-muted-foreground">Pro Member</span>
            </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
