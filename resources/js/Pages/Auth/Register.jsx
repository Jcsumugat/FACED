import { useEffect } from 'react';
import { useForm, Link } from '@inertiajs/react';
import { ShieldCheck, Mail, Lock, User, ArrowLeft, ShieldAlert } from 'lucide-react';

const inputClass = 'w-full bg-white/5 border border-white/10 text-white placeholder-slate-600 rounded-2xl pl-11 pr-4 py-3.5 text-sm font-bold outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all';
const labelClass = 'block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name:                  '',
        email:                 '',
        password:              '',
        password_confirmation: '',
        role:                  'MSWDO / Admin',
        assigned_barangay:     null,
    });

    useEffect(() => {
        return () => reset('password', 'password_confirmation');
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('register'));
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4 font-sans relative overflow-hidden py-10">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-600/10 rounded-full blur-[120px] -mr-64 -mt-64 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] -ml-64 -mb-64 pointer-events-none" />

            <div className="w-full max-w-md relative z-10">
                {/* Back */}
                <Link
                    href={route('login')}
                    className="inline-flex items-center space-x-2 text-slate-500 hover:text-orange-500 transition-colors mb-10 font-black text-xs uppercase tracking-widest"
                >
                    <ArrowLeft size={14} />
                    <span>Back to Admin Login</span>
                </Link>

                <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-10 shadow-2xl backdrop-blur-sm">
                    {/* Logo */}
                    <div className="flex flex-col items-center mb-10">
                        <div className="w-16 h-16 bg-orange-600 rounded-[1.5rem] flex items-center justify-center shadow-2xl shadow-orange-500/30 mb-5">
                            <ShieldCheck size={32} className="text-white" />
                        </div>
                        <h1 className="text-2xl font-black text-white uppercase tracking-tighter">
                            Create Admin Account
                        </h1>
                        <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-1">
                            Barbaza FACED System
                        </p>

                        {/* Role Badge */}
                        <div className="mt-5 flex items-center space-x-2 px-5 py-2.5 rounded-full border bg-slate-800 border-slate-600 text-slate-200">
                            <ShieldAlert size={14} className="shrink-0 text-orange-400" />
                            <span className="text-[10px] font-black uppercase tracking-widest">
                                MSWDO / Admin Access
                            </span>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Name */}
                        <div>
                            <label className={labelClass}>Full Name</label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={e => setData('name', e.target.value)}
                                    placeholder="Juan Dela Cruz"
                                    className={inputClass}
                                />
                            </div>
                            {errors.name && <p className="text-red-400 text-xs font-bold mt-1.5">{errors.name}</p>}
                        </div>

                        {/* Email */}
                        <div>
                            <label className={labelClass}>Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                                <input
                                    type="email"
                                    value={data.email}
                                    onChange={e => setData('email', e.target.value)}
                                    placeholder="admin@barbaza.gov.ph"
                                    className={inputClass}
                                />
                            </div>
                            {errors.email && <p className="text-red-400 text-xs font-bold mt-1.5">{errors.email}</p>}
                        </div>

                        {/* Password */}
                        <div>
                            <label className={labelClass}>Password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                                <input
                                    type="password"
                                    value={data.password}
                                    onChange={e => setData('password', e.target.value)}
                                    placeholder="••••••••"
                                    className={inputClass}
                                />
                            </div>
                            {errors.password && <p className="text-red-400 text-xs font-bold mt-1.5">{errors.password}</p>}
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label className={labelClass}>Confirm Password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                                <input
                                    type="password"
                                    value={data.password_confirmation}
                                    onChange={e => setData('password_confirmation', e.target.value)}
                                    placeholder="••••••••"
                                    className={inputClass}
                                />
                            </div>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center space-x-2 shadow-2xl shadow-orange-600/20 transition-all active:scale-95 mt-2"
                        >
                            {processing
                                ? <span className="animate-pulse">Creating account...</span>
                                : <span>Create Admin Account</span>
                            }
                        </button>

                        {/* Login link */}
                        <p className="text-center text-slate-500 text-xs font-bold uppercase tracking-widest pt-2">
                            Already have an account?{' '}
                            <Link href={route('login')} className="text-orange-500 hover:text-orange-400 transition-colors">
                                Sign In as Admin
                            </Link>
                        </p>
                    </form>
                </div>

                <p className="text-center text-slate-700 text-[10px] font-bold uppercase tracking-widest mt-8">
                    Powered by LGU Barbaza · DSWD Region VI · RA 10173
                </p>
            </div>
        </div>
    );
}