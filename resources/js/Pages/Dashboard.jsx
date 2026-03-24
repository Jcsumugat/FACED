import Layout from '@/Components/Layout';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { Users, Home, ShieldAlert, CheckCircle } from 'lucide-react';

export default function Dashboard({ stats, barangay_data, damage_data, top_vulnerable }) {
    const statCards = [
        { title: 'Total Households', value: stats.total_households,  icon: Home,        color: 'bg-slate-900' },
        { title: 'Total Persons',    value: stats.total_persons,     icon: Users,       color: 'bg-orange-600' },
        { title: 'Validated Records', value: stats.validated,        icon: CheckCircle, color: 'bg-emerald-600' },
        { title: 'Totally Damaged',  value: stats.total_damage,      icon: ShieldAlert, color: 'bg-red-600' },
    ];

    const COLORS = ['#ea580c', '#f97316', '#0f172a'];

    return (
        <Layout>
            <div className="space-y-8">
                {/* Stat Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {statCards.map(card => (
                        <div key={card.title} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center space-x-5 hover:shadow-md transition-all group">
                            <div className={`${card.color} p-4 rounded-2xl text-white group-hover:scale-110 transition-transform`}>
                                <card.icon size={24} />
                            </div>
                            <div>
                                <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">{card.title}</p>
                                <p className="text-3xl font-black text-slate-900 mt-1">{card.value.toLocaleString()}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
                        <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight mb-6">Shelter Damage Breakdown</h3>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={damage_data} cx="50%" cy="50%" innerRadius={60} outerRadius={85} paddingAngle={6} dataKey="value" stroke="none">
                                        {damage_data.map((_, i) => (
                                            <Cell key={i} fill={COLORS[i]} />
                                        ))}
                                    </Pie>
                                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
                                    <Legend iconType="circle" wrapperStyle={{ fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase' }} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
                        <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight mb-6">Records by Barangay</h3>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={barangay_data}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="name" tick={{ fontSize: 9, fontWeight: 700, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                                    <YAxis tick={{ fontSize: 9, fontWeight: 700, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
                                    <Bar dataKey="count" fill="#ea580c" radius={[8, 8, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Top Vulnerable */}
                <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">High Priority Households (VAI Index)</h3>
                        <span className="bg-orange-600 text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest">
                            Action Required
                        </span>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100">
                                    <th className="pb-4 text-left">Household Head</th>
                                    <th className="pb-4 text-left">Barangay</th>
                                    <th className="pb-4 text-left">Status</th>
                                    <th className="pb-4 text-left">Damage</th>
                                    <th className="pb-4 text-center">VAI Score</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {top_vulnerable.map(r => (
                                    <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="py-4 font-black text-slate-900">{r.last_name}, {r.first_name}</td>
                                        <td className="py-4 text-sm font-bold text-slate-500">{r.barangay}</td>
                                        <td className="py-4">
                                            <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider
                                                ${r.status === 'Validated' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                                                {r.status}
                                            </span>
                                        </td>
                                        <td className="py-4">
                                            <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase
                                                ${r.shelter_damage === 'Totally Damaged' ? 'bg-orange-600 text-white' :
                                                  r.shelter_damage === 'Partially Damaged' ? 'bg-orange-100 text-orange-700' :
                                                  'bg-slate-100 text-slate-500'}`}>
                                                {r.shelter_damage}
                                            </span>
                                        </td>
                                        <td className="py-4">
                                            <div className="flex items-center justify-center space-x-3">
                                                <div className="w-20 bg-slate-100 h-2 rounded-full overflow-hidden">
                                                    <div className="bg-orange-600 h-full rounded-full" style={{ width: `${Math.min(r.vai_score, 100)}%` }} />
                                                </div>
                                                <span className="font-black text-slate-900 w-8">{r.vai_score}</span>
                                            </div>
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