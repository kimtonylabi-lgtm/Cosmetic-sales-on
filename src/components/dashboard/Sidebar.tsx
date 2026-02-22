"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    Users,
    Beaker,
    LifeBuoy,
    Settings,
    UserCircle,
    ChevronDown,
    ChevronRight,
    ClipboardList,
    BarChart3,
    Package,
    FileText,
    Truck
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUserRole } from '@/hooks/useUserRole';

interface SidebarItemProps {
    icon: React.ElementType;
    label: string;
    href?: string;
    isActive?: boolean;
    isCollapsed?: boolean;
    children?: React.ReactNode;
    level?: number;
}

const SidebarItem = ({ icon: Icon, label, href, isActive, isCollapsed, children, level = 0 }: SidebarItemProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const hasChildren = !!children;

    const content = (
        <div
            className={cn(
                "flex items-center justify-between px-4 py-2 cursor-pointer transition-colors duration-200",
                isActive ? "bg-ocean-teal/10 text-ocean-teal font-semibold" : "text-slate-400 hover:bg-slate-800 hover:text-white",
                level > 0 && "pl-8"
            )}
            onClick={() => hasChildren && setIsOpen(!isOpen)}
        >
            <div className="flex items-center gap-3">
                <Icon className="w-5 h-5" />
                {!isCollapsed && <span className="text-sm">{label}</span>}
            </div>
            {hasChildren && !isCollapsed && (
                isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />
            )}
        </div>
    );

    if (href && !hasChildren) {
        return <Link href={href}>{content}</Link>;
    }

    return (
        <div>
            {content}
            {isOpen && !isCollapsed && children}
        </div>
    );
};

export const Sidebar = () => {
    const pathname = usePathname();
    const { isAdmin, isManager, isSalesTeam, isSampleTeam, isSupportTeam } = useUserRole();
    const [isCollapsed, setIsCollapsed] = useState(false);

    return (
        <aside className={cn(
            "h-screen bg-[#0F172A] border-r border-slate-800 flex flex-col transition-all duration-300",
            isCollapsed ? "w-16" : "w-64"
        )}>
            {/* Brand Header */}
            <div className="h-16 flex items-center px-4 border-b border-slate-800">
                <div className="w-8 h-8 rounded bg-ocean-teal flex items-center justify-center font-bold text-white">C</div>
                {!isCollapsed && <span className="ml-3 font-bold text-white tracking-tight">SALES ON</span>}
            </div>

            {/* Main Navigation */}
            <nav className="flex-1 overflow-y-auto py-4 no-scrollbar">
                {/* Quick Access */}
                <div className="mb-6">
                    {!isCollapsed && <p className="px-4 text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-2">Quick Access</p>}
                    <SidebarItem
                        icon={ClipboardList}
                        label="My Tasks"
                        href="/dashboard/tasks"
                        isActive={pathname === '/dashboard/tasks'}
                        isCollapsed={isCollapsed}
                    />
                </div>

                {/* Executive - Manager/Admin only */}
                {(isManager || isAdmin) && (
                    <div className="mb-6">
                        {!isCollapsed && <p className="px-4 text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-2">Executive</p>}
                        <SidebarItem
                            icon={BarChart3}
                            label="Head Dashboard"
                            href="/dashboard/executive"
                            isActive={pathname.startsWith('/dashboard/executive')}
                            isCollapsed={isCollapsed}
                        />
                    </div>
                )}

                {/* Team Operations */}
                <div className="mb-6">
                    {!isCollapsed && <p className="px-4 text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-2">Operations</p>}

                    {/* Sales Team */}
                    {(isSalesTeam || isAdmin) && (
                        <SidebarItem icon={LayoutDashboard} label="Sales Team" isCollapsed={isCollapsed}>
                            <SidebarItem icon={Users} label="Lead Management" href="/dashboard/sales/leads" level={1} isCollapsed={isCollapsed} />
                            <SidebarItem icon={Package} label="Sample Request" href="/dashboard/sales/samples" level={1} isCollapsed={isCollapsed} />
                        </SidebarItem>
                    )}

                    {/* Sample Team */}
                    {(isSampleTeam || isAdmin) && (
                        <SidebarItem icon={Beaker} label="Sample Team" isCollapsed={isCollapsed}>
                            <SidebarItem icon={FileText} label="Request List" href="/dashboard/sample/requests" level={1} isCollapsed={isCollapsed} />
                            <SidebarItem icon={Truck} label="Logistics" href="/dashboard/sample/logistics" level={1} isCollapsed={isCollapsed} />
                        </SidebarItem>
                    )}

                    {/* Sales Support Team */}
                    {(isSupportTeam || isAdmin) && (
                        <SidebarItem icon={LifeBuoy} label="Sales Support" isCollapsed={isCollapsed}>
                            <SidebarItem icon={ClipboardList} label="Order Check" href="/dashboard/support/orders" level={1} isCollapsed={isCollapsed} />
                        </SidebarItem>
                    )}
                </div>
            </nav>

            {/* System & Profile (Sticky Bottom) */}
            <div className="mt-auto border-t border-slate-800 p-2">
                <SidebarItem
                    icon={Settings}
                    label="Settings"
                    href="/dashboard/settings"
                    isActive={pathname === '/dashboard/settings'}
                    isCollapsed={isCollapsed}
                />
                <SidebarItem
                    icon={UserCircle}
                    label="Profile"
                    href="/dashboard/profile"
                    isActive={pathname === '/dashboard/profile'}
                    isCollapsed={isCollapsed}
                />
            </div>
        </aside>
    );
};
