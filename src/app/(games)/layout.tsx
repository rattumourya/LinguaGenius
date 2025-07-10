'use client';

import {
  AppWindow,
  LayoutGrid,
  MessageSquareQuote,
  MicVocal,
  SearchCheck,
  SlidersHorizontal,
  UsersRound,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Logo } from '@/components/Logo';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';

const menuItems = [
  {
    href: '/dashboard',
    label: 'Dashboard',
    icon: LayoutGrid,
  },
  {
    href: '/scrabble',
    label: 'Scrabble',
    icon: AppWindow,
  },
  {
    href: '/balderdash',
    label: 'Balderdash',
    icon: MessageSquareQuote,
  },
  {
    href: '/articulate',
    label: 'Articulate',
    icon: MicVocal,
  },
  {
    href: '/role-play',
    label: 'Role-Play',
    icon: UsersRound,
  },
  {
    href: '/grammar-detective',
    label: 'Grammar Detective',
    icon: SearchCheck,
  },
  {
    href: '/',
    label: 'Change Settings',
    icon: SlidersHorizontal,
  },
];

export default function GamesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <Logo />
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === item.href}
                  tooltip={item.label}
                >
                  <Link href={item.href}>
                    <item.icon />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-14 items-center justify-between border-b bg-background/80 px-4 backdrop-blur-sm md:hidden">
          <Logo />
          <SidebarTrigger />
        </header>
        <main className="flex-1 p-4 md:p-6 lg:p-8">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
