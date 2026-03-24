import { useEffect } from "react";
import { useForm, Link } from "@inertiajs/react";
import {
    ShieldCheck,
    Mail,
    Lock,
    LogIn,
    ArrowLeft,
    UserPlus,
} from "lucide-react";

export default function LoginStaff({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: "",
        password: "",
        remember: false,
    });

    useEffect(() => {
        return () => reset("password");
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("login"));
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4 font-sans relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-600/10 rounded-full blur-[120px] -mr-64 -mt-64 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] -ml-64 -mb-64 pointer-events-none" />

            <div className="w-full max-w-md relative z-10">
                {/* Back */}
                <Link
                    href={route("welcome")}
                    className="inline-flex items-center space-x-2 text-slate-500 hover:text-orange-500 transition-colors mb-10 font-black text-xs uppercase tracking-widest"
                >
                    <ArrowLeft size={14} />
                    <span>Back to Portal</span>
                </Link>

                <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-10 shadow-2xl backdrop-blur-sm">
                    {/* Logo */}
                    <div className="flex flex-col items-center mb-10">
                        <div className="w-16 h-16 bg-orange-600 rounded-[1.5rem] flex items-center justify-center shadow-2xl shadow-orange-500/30 mb-5">
                            <ShieldCheck size={32} className="text-white" />
                        </div>
                        <h1 className="text-2xl font-black text-white uppercase tracking-tighter">
                            Barbaza FACED
                        </h1>
                        <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-1">
                            Municipality of Barbaza, Antique
                        </p>

                        {/* Role Badge */}
                        <div className="mt-5 flex items-center space-x-2 px-5 py-2.5 rounded-full border bg-orange-500/10 border-orange-500/30 text-orange-400">
                            <UserPlus size={14} className="shrink-0" />
                            <span className="text-[10px] font-black uppercase tracking-widest">
                                Barangay Staff Access
                            </span>
                        </div>
                        <p className="text-slate-600 text-[10px] font-bold text-center mt-3 max-w-xs leading-relaxed">
                            Household profiling and assistance registration for
                            your assigned barangay.
                        </p>

                        {/* Not staff? */}
                        <p className="text-slate-600 text-[10px] font-bold text-center mt-3">
                            Not a staff?{" "}
                            <Link
                                href={route("login")}
                                className="text-orange-500 hover:text-orange-400 transition-colors font-black uppercase tracking-widest underline underline-offset-2"
                            >
                                MSWDO / Admin login →
                            </Link>
                        </p>
                    </div>

                    {/* Status */}
                    {status && (
                        <div className="mb-6 px-4 py-3 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-emerald-400 text-xs font-bold text-center uppercase tracking-widest">
                            {status}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Email */}
                        <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                                    size={16}
                                />
                                <input
                                    type="email"
                                    value={data.email}
                                    onChange={(e) =>
                                        setData("email", e.target.value)
                                    }
                                    autoComplete="username"
                                    placeholder="staff@barbaza.gov.ph"
                                    className="w-full bg-white/5 border border-white/10 text-white placeholder-slate-600 rounded-2xl pl-11 pr-4 py-3.5 text-sm font-bold outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all"
                                />
                            </div>
                            {errors.email && (
                                <p className="text-red-400 text-xs font-bold mt-1.5">
                                    {errors.email}
                                </p>
                            )}
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <Lock
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                                    size={16}
                                />
                                <input
                                    type="password"
                                    value={data.password}
                                    onChange={(e) =>
                                        setData("password", e.target.value)
                                    }
                                    autoComplete="current-password"
                                    placeholder="••••••••"
                                    className="w-full bg-white/5 border border-white/10 text-white placeholder-slate-600 rounded-2xl pl-11 pr-4 py-3.5 text-sm font-bold outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all"
                                />
                            </div>
                            {errors.password && (
                                <p className="text-red-400 text-xs font-bold mt-1.5">
                                    {errors.password}
                                </p>
                            )}
                        </div>

                        {/* Remember + Forgot */}
                        <div className="flex items-center justify-between">
                            <label className="flex items-center space-x-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={data.remember}
                                    onChange={(e) =>
                                        setData("remember", e.target.checked)
                                    }
                                    className="w-4 h-4 rounded text-orange-600 border-slate-600 bg-slate-800"
                                />
                                <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">
                                    Remember me
                                </span>
                            </label>
                            {canResetPassword && (
                                <Link
                                    href={route("password.request")}
                                    className="text-slate-500 hover:text-orange-500 text-xs font-bold uppercase tracking-wider transition-colors"
                                >
                                    Forgot password?
                                </Link>
                            )}
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center space-x-2 shadow-2xl shadow-orange-600/20 transition-all active:scale-95 mt-2"
                        >
                            {processing ? (
                                <span className="animate-pulse">
                                    Signing in...
                                </span>
                            ) : (
                                <>
                                    <LogIn size={16} />
                                    <span>Sign In as Barangay Staff</span>
                                </>
                            )}
                        </button>

                        {/* Register */}
                        <p className="text-center text-slate-500 text-xs font-bold uppercase tracking-widest pt-2">
                            No account yet?{" "}
                            <Link
                                href={route("register.staff")}
                                className="text-orange-500 hover:text-orange-400 transition-colors"
                            >
                                Register here
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
