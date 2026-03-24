import Layout from '@/Components/Layout';
import { useForm, router } from '@inertiajs/react';
import { UserPlus, Trash2, Shield, MapPin, X } from 'lucide-react';
import { useState } from 'react';

const BARANGAYS = ['Binangbang','Cadiao','Capuyas','Esparar','Guintas','Ipil','Jinalinan','Luntao','Magtulis','Mayabay','Nalupa','Poblacion'];

export default function UserManagement({ accounts }) {
    const [adding, setAdding] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        name:                  '',
        email:                 '',
        password:              '',
        password_confirmation: '',
        role:                  'Barangay Staff',
        assigned_barangay:     '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('users.store'), {
            onSuccess: () => { reset(); setAdding(false); }
        });
    };

    const handleDelete = (id) => {
        if (!confirm('Are you sure you want to delete this account?')) return;
        router.delete(route('users.destroy', id));
    };

    return (
        <Layout>
            <div className="space-y-8">

                {/* Header */}
                <div className="flex justify-between items-start">
                    <div>
                        <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">
                            User Management
                        </h2>
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">
                            Manage LGU Staff System Access
                        </p>
                    </div>
                    <button
                        onClick={() => setAdding(!adding)}
                        className="bg-orange-600 text-white px-5 py-3 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center space-x-2 shadow-lg shadow-orange-500/20 hover:bg-orange-700 transition-all shrink-0"
                    >
                        <UserPlus size={16} />
                        <span>New Account</span>
                    </button>
                </div>

                {/* Add Form */}
                {adding && (
                    <div className="bg-white p-8 rounded-[2rem] border border-orange-100 shadow-xl relative">
                        <button
                            onClick={() => setAdding(false)}
                            className="absolute top-6 right-6 text-slate-300 hover:text-black transition-colors"
                        >
                            <X size={20} />
                        </button>
                        <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6">
                            Create New Account
                        </h4>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {/* Name */}
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">
                                        Full Name
                                    </label>
                                    <input
                                        value={data.name}
                                        onChange={e => setData('name', e.target.value)}
                                        placeholder="Juan Dela Cruz"
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all"
                                    />
                                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                                </div>

                                {/* Email */}
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        value={data.email}
                                        onChange={e => setData('email', e.target.value)}
                                        placeholder="user@barbaza.gov.ph"
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all"
                                    />
                                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                                </div>

                                {/* Role */}
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">
                                        Role
                                    </label>
                                    <select
                                        value={data.role}
                                        onChange={e => setData('role', e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all"
                                    >
                                        <option value="Barangay Staff">Barangay Staff</option>
                                        <option value="MSWDO / Admin">MSWDO / Admin</option>
                                    </select>
                                </div>

                                {/* Assigned Barangay */}
                                {data.role === 'Barangay Staff' && (
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">
                                            Assigned Barangay
                                        </label>
                                        <select
                                            value={data.assigned_barangay}
                                            onChange={e => setData('assigned_barangay', e.target.value)}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all"
                                        >
                                            <option value="">Select Barangay</option>
                                            {BARANGAYS.map(b => <option key={b} value={b}>{b}</option>)}
                                        </select>
                                        {errors.assigned_barangay && <p className="text-red-500 text-xs mt-1">{errors.assigned_barangay}</p>}
                                    </div>
                                )}

                                {/* Password */}
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">
                                        Password
                                    </label>
                                    <input
                                        type="password"
                                        value={data.password}
                                        onChange={e => setData('password', e.target.value)}
                                        placeholder="••••••••"
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all"
                                    />
                                    {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                                </div>

                                {/* Confirm Password */}
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">
                                        Confirm Password
                                    </label>
                                    <input
                                        type="password"
                                        value={data.password_confirmation}
                                        onChange={e => setData('password_confirmation', e.target.value)}
                                        placeholder="••••••••"
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className="bg-slate-900 text-white px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-slate-800 transition-all disabled:opacity-50"
                            >
                                {processing ? 'Creating...' : 'Create Account'}
                            </button>
                        </form>
                    </div>
                )}

                {/* Accounts Table */}
                <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[800px]">
                            <thead>
                                <tr className="bg-slate-900 text-[10px] font-black uppercase tracking-widest text-white">
                                    <th className="px-6 py-4 text-left w-48">Name</th>
                                    <th className="px-6 py-4 text-left w-56">Email</th>
                                    <th className="px-6 py-4 text-left w-36">Role</th>
                                    <th className="px-6 py-4 text-left w-36">Barangay</th>
                                    <th className="px-6 py-4 text-left w-28">Created</th>
                                    <th className="px-6 py-4 text-center w-20">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {accounts.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-16 text-center text-slate-300 font-black uppercase tracking-widest text-xs">
                                            No accounts found
                                        </td>
                                    </tr>
                                ) : accounts.map(account => (
                                    <tr key={account.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <span className="font-black text-slate-900 block truncate max-w-[180px]">
                                                {account.name}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm font-bold text-slate-500 block truncate max-w-[210px]">
                                                {account.email}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider whitespace-nowrap
                                                ${account.role === 'MSWDO / Admin'
                                                    ? 'bg-slate-900 text-white'
                                                    : 'bg-orange-100 text-orange-700'
                                                }`}>
                                                <Shield size={10} />
                                                <span>{account.role}</span>
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            {account.assigned_barangay ? (
                                                <span className="inline-flex items-center space-x-1 text-sm font-bold text-slate-600">
                                                    <MapPin size={12} className="text-orange-500 shrink-0" />
                                                    <span>{account.assigned_barangay}</span>
                                                </span>
                                            ) : (
                                                <span className="text-slate-300 font-bold">—</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-sm font-bold text-slate-400 whitespace-nowrap">
                                            {account.created_at?.split('T')[0]}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <button
                                                onClick={() => handleDelete(account.id)}
                                                className="p-2 text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </Layout>
    );
}