import { Link } from '@inertiajs/react';
import { ShieldCheck, LogIn, UserPlus, ShieldAlert } from 'lucide-react';

export default function Welcome() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4 font-sans relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-600/10 rounded-full blur-[120px] -mr-64 -mt-64 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] -ml-64 -mb-64 pointer-events-none" />

            <div className="max-w-4xl w-full relative z-10">
                {/* Header */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center justify-center w-24 h-24 bg-orange-600 rounded-[2rem] shadow-2xl shadow-orange-500/30 mb-8 animate-pulse">
                        <ShieldCheck size={48} className="text-white" />
                    </div>
                    <h1 className="text-5xl font-black text-white tracking-tighter uppercase italic">
                        Barbaza FACED
                    </h1>
                    <p className="text-slate-400 mt-4 text-xl font-medium tracking-tight uppercase">
                        Household Profiling & Assistance System
                    </p>
                    <div className="mt-6 flex flex-col items-center gap-2">
                        <span className="px-5 py-2 bg-white/5 text-orange-500 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-[0.3em] shadow-sm">
                            Official Barbaza Portal
                        </span>
                        <span className="text-slate-600 text-[10px] font-bold uppercase tracking-widest">
                            Municipality of Barbaza, Antique — MSWDO Digital System
                        </span>
                    </div>
                </div>

                {/* Portal Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto">

                    {/* Barangay Staff — goes to LoginStaff */}
                    <Link
                        href={route('login.staff')}
                        className="group bg-white/5 hover:bg-white/10 border border-white/5 hover:border-orange-500/50 p-10 rounded-[2.5rem] transition-all duration-500 shadow-2xl flex flex-col items-center text-center transform hover:-translate-y-2"
                    >
                        <div className="w-20 h-20 bg-orange-500/10 rounded-3xl flex items-center justify-center text-orange-500 mb-8 group-hover:scale-110 transition-transform duration-500">
                            <UserPlus size={36} />
                        </div>
                        <h3 className="text-2xl font-black text-white mb-3 group-hover:text-orange-500 transition-colors uppercase tracking-tight">
                            Barangay Staff
                        </h3>
                        <p className="text-slate-500 text-sm leading-relaxed mb-8">
                            Household profiling and initial assistance registration for your assigned barangay.
                        </p>
                        <span className="mt-auto bg-orange-600 group-hover:bg-orange-700 px-6 py-2.5 rounded-full text-white font-black text-[10px] uppercase tracking-widest flex items-center shadow-lg transition-all">
                            Access Portal <LogIn size={14} className="ml-2" />
                        </span>
                    </Link>

                    {/* MSWDO Admin — goes to Login */}
                    <Link
                        href={route('login')}
                        className="group bg-white/5 hover:bg-white/10 border border-white/5 hover:border-orange-500/50 p-10 rounded-[2.5rem] transition-all duration-500 shadow-2xl flex flex-col items-center text-center transform hover:-translate-y-2"
                    >
                        <div className="w-20 h-20 bg-orange-500/10 rounded-3xl flex items-center justify-center text-orange-500 mb-8 group-hover:scale-110 transition-transform duration-500">
                            <ShieldAlert size={36} />
                        </div>
                        <h3 className="text-2xl font-black text-white mb-3 group-hover:text-orange-500 transition-colors uppercase tracking-tight">
                            MSWDO / Admin
                        </h3>
                        <p className="text-slate-500 text-sm leading-relaxed mb-8">
                            Full validation, approval workflow, system reporting, and user account management.
                        </p>
                        <span className="mt-auto bg-orange-600 group-hover:bg-orange-700 px-6 py-2.5 rounded-full text-white font-black text-[10px] uppercase tracking-widest flex items-center shadow-lg transition-all">
                            Access Portal <LogIn size={14} className="ml-2" />
                        </span>
                    </Link>
                </div>

                {/* Footer */}
                <p className="text-center text-slate-700 text-[10px] font-bold uppercase tracking-widest mt-16">
                    Powered by LGU Barbaza · DSWD Region VI · Data Privacy Act RA 10173
                </p>
            </div>
        </div>
    );
}