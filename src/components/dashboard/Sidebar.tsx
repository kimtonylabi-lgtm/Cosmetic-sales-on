"use client";

import React, { useState, useEffect } from 'react';
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
    Truck,
    ChevronLeft,
    Menu,
    UserCog,
    Target,
    Activity,
    Calculator,
    ShoppingCart,
    BookUser,
    FlaskConical,
    Factory,
    TrendingUp,
    PackageCheck,
    CalendarCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
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
                "flex items-center justify-between px-4 py-2.5 cursor-pointer transition-all duration-200 group relative",
                isActive
                    ? "bg-ocean-teal/15 text-ocean-teal border-r-2 border-ocean-teal shadow-[inset_-10px_0_20px_-15px_rgba(13,148,136,0.3)]"
                    : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-100",
                level > 0 && !isCollapsed && "pl-10",
                isCollapsed && "justify-center px-0"
            )}
            onClick={() => hasChildren && setIsOpen(!isOpen)}
        >
            <div className={cn("flex items-center gap-3 relative z-10", isCollapsed && "justify-center")}>
                <Icon className={cn("w-5 h-5 transition-transform group-hover:scale-110", isActive && "text-ocean-teal")} />
                {!isCollapsed && (
                    <span className={cn("text-sm tracking-wide", isActive ? "font-semibold" : "font-medium")}>
                        {label}
                    </span>
                )}
            </div>

            {isActive && !isCollapsed && (
                <motion.div
                    layoutId="activeIndicator"
                    className="absolute left-0 top-0 bottom-0 w-1 bg-ocean-teal shadow-[0_0_15px_rgba(13,148,136,0.5)]"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
            )}

            {hasChildren && !isCollapsed && (
                <div className="transition-transform duration-200">
                    {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </div>
            )}

            {/* Tooltip for collapsed state */}
            {isCollapsed && (
                <div className="absolute left-full ml-4 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 whitespace-nowrap border border-slate-700 shadow-xl">
                    {label}
                </div>
            )}
        </div>
    );

    if (href && !hasChildren) {
        return <Link href={href}>{content}</Link>;
    }

    return (
        <div className="w-full">
            {content}
            <AnimatePresence>
                {isOpen && !isCollapsed && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2, ease: "easeInOut" }}
                        className="overflow-hidden bg-slate-900/30"
                    >
                        {children}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export const Sidebar = () => {
    const pathname = usePathname();
    const { isAdmin, isManager, isSalesTeam, isSampleTeam, isSupportTeam } = useUserRole();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <aside className={cn(
            "h-screen bg-[#020617] border-r border-slate-800/50 flex flex-col transition-all duration-300 relative z-40",
            isCollapsed ? "w-20" : "w-64"
        )}>
            {/* Brand Header */}
            <div className="h-16 flex items-center px-5 border-b border-slate-800/50 mb-4">
                <div className="flex items-center gap-3 overflow-hidden">
                    <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-gradient-to-br from-ocean-teal to-ocean-dark flex items-center justify-center shadow-lg shadow-ocean-teal/20">
                        <span className="font-bold text-white text-lg">C</span>
                    </div>
                    {!isCollapsed && (
                        <motion.span
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="font-bold text-slate-100 tracking-tight text-lg"
                        >
                            SALES ON
                        </motion.span>
                    )}
                </div>
            </div>

            {/* Collapse Toggle */}
            <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-white hover:bg-ocean-teal transition-all z-50 shadow-lg"
            >
                {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
            </button>

            {/* Main Navigation */}
            <nav className="flex-1 overflow-y-auto py-2 no-scrollbar px-2 space-y-1">
                {/* Quick Access */}
                <div className="mb-4">
                    {!isCollapsed && <p className="px-4 text-[10px] uppercase tracking-[0.2em] text-slate-500 font-bold mb-3 opacity-60">General</p>}
                    <SidebarItem
                        icon={LayoutDashboard}
                        label="대시보드"
                        href="/dashboard"
                        isActive={pathname === '/dashboard'}
                        isCollapsed={isCollapsed}
                    />
                    <SidebarItem
                        icon={ClipboardList}
                        label="내 할일"
                        href="/dashboard/tasks"
                        isActive={pathname === '/dashboard/tasks'}
                        isCollapsed={isCollapsed}
                    />
                </div>

                {/* Executive Section */}
                {(isManager || isAdmin) && (
                    <div className="mb-4">
                        {!isCollapsed && <p className="px-4 text-[10px] uppercase tracking-[0.2em] text-slate-500 font-bold mb-3 opacity-60">Admin</p>}
                        <SidebarItem
                            icon={BarChart3}
                            label="총괄 현황"
                            href="/dashboard/executive"
                            isActive={pathname.startsWith('/dashboard/executive')}
                            isCollapsed={isCollapsed}
                        />
                        <SidebarItem
                            icon={UserCog}
                            label="사용자 관리"
                            href="/dashboard/admin/users"
                            isActive={pathname.startsWith('/dashboard/admin/users')}
                            isCollapsed={isCollapsed}
                        />
                    </div>
                )}

                {/* Operations Section */}
                <div className="mb-4">
                    {!isCollapsed && <p className="px-4 text-[10px] uppercase tracking-[0.2em] text-slate-500 font-bold mb-3 opacity-60">Operations</p>}

                    {/* 영업팀 */}
                    {(isSalesTeam || isAdmin) && (
                        <SidebarItem icon={Users} label="영업팀" isCollapsed={isCollapsed} isActive={pathname.includes('/sales/')}>
                            <SidebarItem icon={Target} label="영업기획" href="/dashboard/sales/planning" level={1} isCollapsed={isCollapsed} isActive={pathname === '/dashboard/sales/planning'} />
                            <SidebarItem icon={Activity} label="영업활동" href="/dashboard/sales/activities" level={1} isCollapsed={isCollapsed} isActive={pathname === '/dashboard/sales/activities'} />
                            <SidebarItem icon={Calculator} label="견적관리" href="/dashboard/sales/quotes" level={1} isCollapsed={isCollapsed} isActive={pathname === '/dashboard/sales/quotes'} />
                            <SidebarItem icon={Package} label="샘플요청" href="/dashboard/sales/samples" level={1} isCollapsed={isCollapsed} isActive={pathname === '/dashboard/sales/samples'} />
                            <SidebarItem icon={ShoppingCart} label="수주관리" href="/dashboard/sales/orders" level={1} isCollapsed={isCollapsed} isActive={pathname === '/dashboard/sales/orders'} />
                            <SidebarItem icon={BookUser} label="고객관리" href="/dashboard/sales/customers" level={1} isCollapsed={isCollapsed} isActive={pathname === '/dashboard/sales/customers'} />
                        </SidebarItem>
                    )}

                    {/* 샘플팀 */}
                    {(isSampleTeam || isAdmin) && (
                        <SidebarItem icon={FlaskConical} label="샘플팀" isCollapsed={isCollapsed} isActive={pathname.includes('/sample/')}>
                            <SidebarItem icon={ClipboardList} label="샘플접수관리" href="/dashboard/sample/reception" level={1} isCollapsed={isCollapsed} isActive={pathname === '/dashboard/sample/reception'} />
                            <SidebarItem icon={Factory} label="샘플제작관리" href="/dashboard/sample/production" level={1} isCollapsed={isCollapsed} isActive={pathname === '/dashboard/sample/production'} />
                        </SidebarItem>
                    )}

                    {/* 영업지원팀 */}
                    {(isSupportTeam || isAdmin) && (
                        <SidebarItem icon={LifeBuoy} label="영업지원팀" isCollapsed={isCollapsed} isActive={pathname.includes('/support/')}>
                            <SidebarItem icon={BarChart3} label="원가관리" href="/dashboard/support/costing" level={1} isCollapsed={isCollapsed} isActive={pathname === '/dashboard/support/costing'} />
                            <SidebarItem icon={TrendingUp} label="매출관리" href="/dashboard/support/revenue" level={1} isCollapsed={isCollapsed} isActive={pathname === '/dashboard/support/revenue'} />
                            <SidebarItem icon={PackageCheck} label="출고관리" href="/dashboard/support/shipping" level={1} isCollapsed={isCollapsed} isActive={pathname === '/dashboard/support/shipping'} />
                            <SidebarItem icon={CalendarCheck} label="마감관리" href="/dashboard/support/closing" level={1} isCollapsed={isCollapsed} isActive={pathname === '/dashboard/support/closing'} />
                        </SidebarItem>
                    )}
                </div>
            </nav>

            {/* Bottom Section */}
            <div className="p-2 border-t border-slate-800/50 space-y-1">
                <SidebarItem
                    icon={Settings}
                    label="설정"
                    href="/dashboard/settings"
                    isActive={pathname === '/dashboard/settings'}
                    isCollapsed={isCollapsed}
                />
                <SidebarItem
                    icon={UserCircle}
                    label="프로필"
                    href="/dashboard/profile"
                    isActive={pathname === '/dashboard/profile'}
                    isCollapsed={isCollapsed}
                />
            </div>
        </aside>
    );
};
