import Layout from '@/Components/Layout';
import { Link, router, usePage } from '@inertiajs/react';
import { Plus, Search, Filter, Eye, Edit, FileCheck, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

const STATUS_COLORS = {
    'Submitted':  'bg-orange-600 text-white',
    'Returned':   'bg-amber-500 text-white',
    'Validated':  'bg-emerald-600 text-white',
};

const DAMAGE_COLORS = {
    'None':               'bg-slate-100 text-slate-500',
    'Partially Damaged':  'bg-orange-100 text-orange-700',
    'Totally Damaged':    'bg-red-600 text-white',
};

export default function RecordsList({ records, filters }) {
    const { auth } = usePage().props;
    const user = auth.user;
    const isAdmin = user.role === 'MSWDO / Admin';

    const [search, setSearch]   = useState(filters?.search || '');
    const [status, setStatus]   = useState(filters?.status || '');
    const [barangay, setBarangay] = useState(filters?.barangay || '');

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('records.index'), { search, status, barangay }, { preserveState: true });
    };

    const handleValidate = (id) => {
        if (!confirm('Mark this record as Validated?')) return;
        router.patch(route('records.validate', id));
    };

    const handleReturn = (id) => {
        if (!confirm('Return this record for revision?')) return;
        router.patch(route('records.return', id));
    };

    return (
        <Layout>
            <div className="space-y-8">

                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">
                            FACED Records
                        </h2>
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">
                            Household Profiling — Family Assistance Card
                        </p>
                    </div>
                    <Link
                        href={route('records.create')}
                        className="bg-orange-600 text-white px-5 py-3 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center space-x-2 shadow-lg shadow-orange-500/20 hover:bg-orange-700 transition-all shrink-0"
                    >
                        <Plus size={16} />
                        <span>New Record</span>
                    </Link>
                </div>

                {/* Filters */}
                <form onSubmit={handleSearch} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {/* Search */}
                        <div className="md:col-span-2 relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                            <input
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                placeholder="Search by name or serial number..."
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-sm font-bold text-slate-900 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all"
                            />
                        </div>

                        {/* Status */}
                        <div className="relative">
                            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                            <select
                                value={status}
                                onChange={e => setStatus(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm font-bold text-slate-900 outline-none focus:border-orange-500 appearance-none"
                            >
                                <option value="">All Statuses</option>
                                <option value="Submitted">Submitted</option>
                                <option value="Returned">Returned</option>
                                <option value="Validated">Validated</option>
                            </select>
                        </div>

                        {/* Barangay — admin only */}
                        {isAdmin && (
                            <div className="relative">
                                <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                                <select
                                    value={barangay}
                                    onChange={e => setBarangay(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm font-bold text-slate-900 outline-none focus:border-orange-500 appearance-none"
                                >
                                    <option value="">All Barangays</option>
                                    {['Binangbang','Cadiao','Capuyas','Esparar','Guintas','Ipil','Jinalinan','Luntao','Magtulis','Mayabay','Nalupa','Poblacion'].map(b => (
                                        <option key={b} value={b}>{b}</option>
                                    ))}
                                </select>
                            </div>
                        )}

                        <button
                            type="submit"
                            className="bg-slate-900 text-white px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-slate-800 transition-all"
                        >
                            Search
                        </button>
                    </div>
                </form>

                {/* Table */}
                <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[900px]">
                            <thead>
                                <tr className="bg-slate-900 text-[10px] font-black uppercase tracking-widest text-white">
                                    <th className="px-6 py-4 text-left w-36">Serial No.</th>
                                    <th className="px-6 py-4 text-left w-48">Household Head</th>
                                    <th className="px-6 py-4 text-left w-32">Barangay</th>
                                    <th className="px-6 py-4 text-left w-28">Status</th>
                                    <th className="px-6 py-4 text-left w-36">Shelter Damage</th>
                                    <th className="px-6 py-4 text-center w-20">VAI</th>
                                    <th className="px-6 py-4 text-left w-28">Date Filed</th>
                                    <th className="px-6 py-4 text-center w-32">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {records.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={8} className="px-6 py-16 text-center text-slate-300 font-black uppercase tracking-widest text-xs">
                                            No records found
                                        </td>
                                    </tr>
                                ) : records.data.map(record => (
                                    <tr key={record.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <span className="font-mono text-[10px] font-black text-slate-500 tracking-widest">
                                                {record.serial_number}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="font-black text-slate-900 text-sm block truncate max-w-[180px]">
                                                {record.last_name}, {record.first_name}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm font-bold text-slate-500 whitespace-nowrap">
                                            {record.barangay}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider whitespace-nowrap ${STATUS_COLORS[record.status]}`}>
                                                {record.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider whitespace-nowrap ${DAMAGE_COLORS[record.shelter_damage]}`}>
                                                {record.shelter_damage}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="flex flex-col items-center space-y-1">
                                                <span className="font-black text-slate-900 text-sm">{record.vai_score}</span>
                                                <div className="w-12 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                                                    <div
                                                        className="bg-orange-600 h-full rounded-full"
                                                        style={{ width: `${Math.min(record.vai_score, 100)}%` }}
                                                    />
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm font-bold text-slate-400 whitespace-nowrap">
                                            {record.date_registered}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-center space-x-1">
                                                {/* View */}
                                                <Link
                                                    href={route('records.show', record.id)}
                                                    className="p-2 text-slate-400 hover:text-orange-600 hover:bg-orange-50 rounded-xl transition-all"
                                                    title="View"
                                                >
                                                    <Eye size={15} />
                                                </Link>

                                                {/* Edit — only if not validated */}
                                                {record.status !== 'Validated' && (
                                                    <Link
                                                        href={route('records.edit', record.id)}
                                                        className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all"
                                                        title="Edit"
                                                    >
                                                        <Edit size={15} />
                                                    </Link>
                                                )}

                                                {/* Validate — admin only, submitted records */}
                                                {isAdmin && record.status === 'Submitted' && (
                                                    <button
                                                        onClick={() => handleValidate(record.id)}
                                                        className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all"
                                                        title="Validate"
                                                    >
                                                        <FileCheck size={15} />
                                                    </button>
                                                )}

                                                {/* Return — admin only, submitted records */}
                                                {isAdmin && record.status === 'Submitted' && (
                                                    <button
                                                        onClick={() => handleReturn(record.id)}
                                                        className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-xl transition-all"
                                                        title="Return for revision"
                                                    >
                                                        <RotateCcw size={15} />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {records.last_page > 1 && (
                        <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                                Showing {records.from}–{records.to} of {records.total} records
                            </p>
                            <div className="flex items-center space-x-2">
                                {records.links.map((link, i) => (
                                    <button
                                        key={i}
                                        disabled={!link.url}
                                        onClick={() => link.url && router.get(link.url)}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all
                                            ${link.active
                                                ? 'bg-orange-600 text-white'
                                                : link.url
                                                    ? 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                                    : 'bg-slate-50 text-slate-300 cursor-not-allowed'
                                            }`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
}