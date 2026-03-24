import { Link, usePage } from '@inertiajs/react';
import {
    LayoutDashboard, FileText, BarChart2,
    ShieldAlert, Users, LogOut, ShieldCheck, Menu, X
} from 'lucide-react';
import { useState } from 'react';

export default function Layout({ children }) {
    const { auth } = usePage().props;
    const user = auth.user;
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const navItems = [
        {
            label: 'Dashboard',
            href: route('dashboard'),
            icon: LayoutDashboard,
            active: route().current('dashboard'),
            roles: ['Barangay Staff', 'MSWDO / Admin'],
        },
        {
            label: 'FACED Records',
            href: route('records.index'),
            icon: FileText,
            active: route().current('records.*'),
            roles: ['Barangay Staff', 'MSWDO / Admin'],
        },
        {
            label: 'Reports',
            href: route('reports.index'),
            icon: BarChart2,
            active: route().current('reports.*'),
            roles: ['Barangay Staff', 'MSWDO / Admin'],
        },
        {
            label: 'SitRep / DROMIC',
            href: route('sitrep.index'),
            icon: ShieldAlert,
            active: route().current('sitrep.*'),
            roles: ['MSWDO / Admin'],
        },
        {
            label: 'User Management',
            href: route('users.index'),
            icon: Users,
            active: route().current('users.*'),
            roles: ['MSWDO / Admin'],
        },
    ];

    const visibleNav = navItems.filter(item => item.roles.includes(user.role));

    return (
        <div className="min-h-screen bg-slate-50 flex">
            {/* Sidebar */}
            <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-slate-900 flex flex-col transition-all duration-300 shrink-0`}>
                {/* Logo */}
                <div className="p-6 border-b border-white/10 flex items-center justify-between">
                    {sidebarOpen && (
                        <div>
                            <div className="flex items-center space-x-2">
                                <div className="bg-orange-600 p-1.5 rounded-lg">
                                    <ShieldCheck size={18} className="text-white" />
                                </div>
                                <span className="text-white font-black text-sm uppercase tracking-tight">Barbaza FACED</span>
                            </div>
                            <p className="text-slate-500 text-[9px] font-bold uppercase tracking-widest mt-1 ml-8">
                                MSWDO Portal
                            </p>
                        </div>
                    )}
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="text-slate-400 hover:text-white transition-colors p-1"
                    >
                        {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
                    </button>
                </div>

                {/* Nav Items */}
                <nav className="flex-1 p-4 space-y-1">
                    {visibleNav.map(item => (
                        <Link
                            key={item.label}
                            href={item.href}
                            className={`flex items-center space-x-3 px-3 py-3 rounded-xl transition-all group
                                ${item.active
                                    ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/20'
                                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                                }`}
                        >
                            <item.icon size={20} className="shrink-0" />
                            {sidebarOpen && (
                                <span className="text-xs font-black uppercase tracking-wide">
                                    {item.label}
                                </span>
                            )}
                        </Link>
                    ))}
                </nav>

                {/* User Info */}
                <div className="p-4 border-t border-white/10">
                    <div className={`flex items-center ${sidebarOpen ? 'space-x-3' : 'justify-center'} mb-3`}>
                        <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center shrink-0">
                            <span className="text-white text-xs font-black">
                                {user.name.charAt(0).toUpperCase()}
                            </span>
                        </div>
                        {sidebarOpen && (
                            <div className="overflow-hidden">
                                <p className="text-white text-xs font-black truncate">{user.name}</p>
                                <p className="text-slate-500 text-[9px] font-bold uppercase tracking-wider truncate">
                                    {user.role}
                                </p>
                            </div>
                        )}
                    </div>
                    <Link
                        href={route('logout')}
                        method="post"
                        as="button"
                        className={`w-full flex items-center ${sidebarOpen ? 'space-x-2' : 'justify-center'} px-3 py-2 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all`}
                    >
                        <LogOut size={16} />
                        {sidebarOpen && <span className="text-xs font-black uppercase tracking-wide">Logout</span>}
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto">
                {/* Top Bar */}
                <header className="bg-white border-b border-slate-100 px-8 py-4 flex items-center justify-between sticky top-0 z-30 shadow-sm">
                    <div>
                        <h1 className="text-sm font-black text-slate-900 uppercase tracking-tight">
                            Municipality of Barbaza, Antique
                        </h1>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                            Family Assistance Card in Emergencies and Disasters
                        </p>
                    </div>
                    <div className="flex items-center space-x-3">
                        {user.assigned_barangay && (
                            <span className="bg-orange-50 text-orange-600 border border-orange-200 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                                Brgy. {user.assigned_barangay}
                            </span>
                        )}
                        <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                            {user.role}
                        </span>
                    </div>
                </header>

                {/* Flash Messages */}
                <FlashMessages />

                {/* Page Content */}
                <div className="p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}

function FlashMessages() {
    const { flash } = usePage().props;
    const [visible, setVisible] = useState(true);

    if (!visible) return null;
    if (!flash?.success && !flash?.error) return null;

    return (
        <div className={`mx-8 mt-6 px-6 py-4 rounded-2xl flex items-center justify-between font-bold text-sm
            ${flash.success
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}
        >
            <span>{flash.success || flash.error}</span>
            <button onClick={() => setVisible(false)} className="ml-4 opacity-60 hover:opacity-100">
                <X size={16} />
            </button>
        </div>
    );
}