// GuestLayout is not used by our custom auth pages
// but kept for Breeze compatibility (password reset, email verify pages)
import { Link } from '@inertiajs/react';
import { ShieldCheck } from 'lucide-react';

export default function GuestLayout({ children }) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4 font-sans relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-600/10 rounded-full blur-[120px] -mr-64 -mt-64 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] -ml-64 -mb-64 pointer-events-none" />

            <div className="w-full max-w-md relative z-10">
                <div className="flex justify-center mb-8">
                    <Link href={route('welcome')}>
                        <div className="w-14 h-14 bg-orange-600 rounded-[1.2rem] flex items-center justify-center shadow-2xl shadow-orange-500/30 hover:scale-110 transition-transform">
                            <ShieldCheck size={28} className="text-white" />
                        </div>
                    </Link>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-10 shadow-2xl">
                    {children}
                </div>
            </div>
        </div>
    );
}