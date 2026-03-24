import Layout from '@/Components/Layout';
import { router } from '@inertiajs/react';
import { BarChart2, Filter, Calendar, Printer } from 'lucide-react';
import { useState } from 'react';

const BARANGAYS = ['Binangbang','Cadiao','Capuyas','Esparar','Guintas','Ipil','Jinalinan','Luntao','Magtulis','Mayabay','Nalupa','Poblacion'];
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

const formatCurrency = (amount) => new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(amount);

export default function Reports({ records, barangay_stats, summary, filters }) {
    const [localFilters, setLocalFilters] = useState(filters);

    const handleFilter = () => {
        router.get(route('reports.index'), localFilters, { preserveState: true });
    };

    return (
        <Layout>
            <div className="space-y-8">
                <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center space-x-3">
                            <BarChart2 className="text-orange-600" size={28} />
                            <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Operational Reports</h3>
                        </div>
                        <button onClick={() => window.print()}
                            className="bg-slate-900 text-white px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest flex items-center space-x-2 hover:bg-slate-800 transition-all">
                            <Printer size={16} />
                            <span>Print Report</span>
                        </button>
                    </div>

                    {/* Filters */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8 bg-slate-50 p-6 rounded-2xl border border-slate-100">
                        <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Month</label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                                <select value={localFilters.month || ''} onChange={e => setLocalFilters({...localFilters, month: e.target.value})}
                                    className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold outline-none">
                                    <option value="">All Months</option>
                                    {MONTHS.map((m, i) => <option key={m} value={i + 1}>{m}</option>)}
                                </select>
                            </div>
                        </div>
                        <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Barangay</label>
                            <div className="relative">
                                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                                <select value={localFilters.barangay || ''} onChange={e => setLocalFilters({...localFilters, barangay: e.target.value})}
                                    className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold outline-none">
                                    <option value="">All Barangays</option>
                                    {BARANGAYS.map(b => <option key={b} value={b}>{b}</option>)}
                                </select>
                            </div>
                        </div>
                        <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Min. VAI Score</label>
                            <input type="number" min="0" max="110" value={localFilters.min_vai || ''}
                                onChange={e => setLocalFilters({...localFilters, min_vai: e.target.value})}
                                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold outline-none" />
                        </div>
                        <div className="flex items-end">
                            <button onClick={handleFilter}
                                className="w-full bg-orange-600 text-white py-2.5 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-orange-700 transition-all">
                                Apply Filters
                            </button>
                        </div>
                    </div>

                    {/* Summary Cards */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        {[
                            { label: 'Total Families', value: summary.total_families },
                            { label: 'Total Persons',  value: summary.total_persons },
                            { label: 'Total Aid Value', value: formatCurrency(summary.total_aid) },
                            { label: 'Active Barangays', value: summary.active_barangays },
                        ].map(item => (
                            <div key={item.label} className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{item.label}</p>
                                <p className="text-xl font-black text-slate-900">{item.value}</p>
                            </div>
                        ))}
                    </div>

                    {/* Barangay Summary Table */}
                    <div className="mb-10">
                        <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-4 flex items-center">
                            <span className="w-3 h-3 bg-orange-600 rounded mr-2" />
                            Barangay Summary
                        </h4>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest">
                                    <tr>
                                        <th className="px-6 py-4">Barangay</th>
                                        <th className="px-6 py-4 text-center">Families</th>
                                        <th className="px-6 py-4 text-center">Persons</th>
                                        <th className="px-6 py-4 text-center">Totally Damaged</th>
                                        <th className="px-6 py-4 text-right">Total Aid</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {barangay_stats.length === 0 && (
                                        <tr><td colSpan={5} className="px-6 py-10 text-center text-slate-300 font-black uppercase">No data</td></tr>
                                    )}
                                    {barangay_stats.map(b => (
                                        <tr key={b.name} className="hover:bg-slate-50 font-bold">
                                            <td className="px-6 py-4">{b.name}</td>
                                            <td className="px-6 py-4 text-center">{b.families}</td>
                                            <td className="px-6 py-4 text-center">{b.persons}</td>
                                            <td className="px-6 py-4 text-center">{b.totally_damaged}</td>
                                            <td className="px-6 py-4 text-right font-black text-orange-600">{formatCurrency(b.assistance_value)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Detailed Household Table */}
                    <div>
                        <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-4 flex items-center">
                            <span className="w-3 h-3 bg-orange-600 rounded mr-2" />
                            Detailed Household Report
                        </h4>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest">
                                    <tr>
                                        <th className="px-6 py-4">Household Head</th>
                                        <th className="px-6 py-4">Barangay</th>
                                        <th className="px-6 py-4 text-center">VAI Score</th>
                                        <th className="px-6 py-4 text-center">Shelter</th>
                                        <th className="px-6 py-4 text-right">Aid Received</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {records.length === 0 && (
                                        <tr><td colSpan={5} className="px-6 py-10 text-center text-slate-300 font-black uppercase">No records found</td></tr>
                                    )}
                                    {records.map(r => (
                                        <tr key={r.id} className="hover:bg-slate-50 font-bold">
                                            <td className="px-6 py-4">{r.last_name}, {r.first_name}</td>
                                            <td className="px-6 py-4 text-slate-500">{r.barangay}</td>
                                            <td className="px-6 py-4 text-center font-black">{r.vai_score}</td>
                                            <td className="px-6 py-4 text-center text-[10px] font-black uppercase">{r.shelter_damage}</td>
                                            <td className="px-6 py-4 text-right text-orange-600 font-black">{formatCurrency(r.total_aid)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}