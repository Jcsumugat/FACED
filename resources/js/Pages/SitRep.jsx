import Layout from '@/Components/Layout';
import { useForm } from '@inertiajs/react';
import { useState } from 'react';
import { ShieldAlert, Send, CheckCircle2, Loader, Save, FileText } from 'lucide-react';

const labelClass = 'block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5';
const inputClass = 'w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500';

export default function SitRep({ stats, saved }) {
    const [generating, setGenerating] = useState(false);
    const [step, setStep] = useState(1);

    const { data, setData, post, processing } = useForm({
        sitrep_number: saved?.sitrep_number || '001',
        date:          saved?.date || new Date().toISOString().split('T')[0],
        period_from:   saved?.period_from || '',
        period_to:     saved?.period_to || '',
        disaster_type: saved?.disaster_type || 'Typhoon',
        disaster_name: saved?.disaster_name || '',
        disaster_date: saved?.disaster_date || '',
        prepared_by:   saved?.prepared_by || '',
        position:      saved?.position || '',
        office:        saved?.office || '',
        summary:       saved?.summary || '',
    });

    const handleGenerateSummary = async () => {
        setGenerating(true);
        try {
            const res = await fetch(route('sitrep.generate'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
                },
                body: JSON.stringify({
                    disaster_type:     data.disaster_type,
                    disaster_name:     data.disaster_name,
                    disaster_date:     data.disaster_date,
                    families:          stats.families,
                    persons:           stats.persons,
                    barangays:         stats.barangays,
                    totally_damaged:   stats.totally_damaged,
                    partially_damaged: stats.partially_damaged,
                }),
            });
            const json = await res.json();
            setData('summary', json.summary);
        } catch (e) {
            console.error('Failed to generate summary', e);
        } finally {
            setGenerating(false);
        }
    };

    const handleSave = () => {
        post(route('sitrep.store'));
    };

    const statCards = [
        { label: 'Affected Barangays', value: stats.barangays },
        { label: 'Affected Families',  value: stats.families },
        { label: 'Affected Persons',   value: stats.persons },
        { label: 'Totally Damaged',    value: stats.totally_damaged },
        { label: 'Partially Damaged',  value: stats.partially_damaged },
        { label: 'PWD',                value: stats.pwd },
        { label: 'Senior Citizens',    value: stats.senior },
        { label: 'Pregnant/Lactating', value: stats.pregnant },
    ];

    return (
        <Layout>
            <div className="space-y-8">

                {/* Header — full width, matches Dashboard/UserManagement style */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <div className="bg-orange-600 p-3 rounded-2xl shadow-lg shadow-orange-500/20">
                            <ShieldAlert size={28} className="text-white" />
                        </div>
                        <div>
                            <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">
                                SitRep / DROMIC
                            </h2>
                            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">
                                Situation Report Generator — Validated Records Only
                            </p>
                        </div>
                    </div>

                    {/* Step indicator pill on the right */}
                    <div className="flex items-center space-x-2 bg-white border border-slate-200 px-5 py-2.5 rounded-2xl shadow-sm">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Step</span>
                        <span className="text-lg font-black text-orange-600">{step}</span>
                        <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">of 3</span>
                    </div>
                </div>

                {/* Step Tabs */}
                <div className="flex space-x-2">
                    {['Disaster Info', 'Statistics', 'Summary & Save'].map((label, i) => (
                        <button
                            key={i}
                            onClick={() => setStep(i + 1)}
                            className={`px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all
                                ${step === i + 1
                                    ? 'bg-slate-900 text-white shadow-lg'
                                    : 'bg-white text-slate-400 border border-slate-200 hover:border-slate-400 hover:text-slate-600'
                                }`}
                        >
                            {i + 1}. {label}
                        </button>
                    ))}
                </div>

                {/* Step 1: Disaster Info */}
                {step === 1 && (
                    <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm space-y-6">
                        <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">
                            Disaster / Incident Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className={labelClass}>SitRep Number</label>
                                <input value={data.sitrep_number} onChange={e => setData('sitrep_number', e.target.value)} className={inputClass} placeholder="001" />
                            </div>
                            <div>
                                <label className={labelClass}>Report Date</label>
                                <input type="date" value={data.date} onChange={e => setData('date', e.target.value)} className={inputClass} />
                            </div>
                            <div>
                                <label className={labelClass}>Disaster Type</label>
                                <select value={data.disaster_type} onChange={e => setData('disaster_type', e.target.value)} className={inputClass}>
                                    {['Typhoon','Flood','Earthquake','Fire','Landslide','Others'].map(t => (
                                        <option key={t} value={t}>{t}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className={labelClass}>Disaster / Incident Name</label>
                                <input value={data.disaster_name} onChange={e => setData('disaster_name', e.target.value)} className={inputClass} placeholder="e.g. Typhoon Agaton" />
                            </div>
                            <div>
                                <label className={labelClass}>Date of Occurrence</label>
                                <input type="date" value={data.disaster_date} onChange={e => setData('disaster_date', e.target.value)} className={inputClass} />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className={labelClass}>Reporting Period From</label>
                                <input type="date" value={data.period_from} onChange={e => setData('period_from', e.target.value)} className={inputClass} />
                            </div>
                            <div>
                                <label className={labelClass}>Reporting Period To</label>
                                <input type="date" value={data.period_to} onChange={e => setData('period_to', e.target.value)} className={inputClass} />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className={labelClass}>Prepared By</label>
                                <input value={data.prepared_by} onChange={e => setData('prepared_by', e.target.value)} className={inputClass} />
                            </div>
                            <div>
                                <label className={labelClass}>Position</label>
                                <input value={data.position} onChange={e => setData('position', e.target.value)} className={inputClass} />
                            </div>
                            <div>
                                <label className={labelClass}>Office</label>
                                <input value={data.office} onChange={e => setData('office', e.target.value)} className={inputClass} />
                            </div>
                        </div>
                        <div className="flex justify-end">
                            <button onClick={() => setStep(2)}
                                className="bg-orange-600 text-white px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-orange-700 transition-all">
                                Next: Statistics →
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 2: Statistics */}
                {step === 2 && (
                    <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm space-y-6">
                        <div>
                            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-2">
                                Affected Population
                            </h3>
                            <p className="text-xs text-slate-400 font-bold">
                                Data pulled from all Validated FACED records.
                            </p>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {statCards.map(card => (
                                <div key={card.label} className="bg-slate-50 p-5 rounded-2xl border border-slate-100 text-center">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{card.label}</p>
                                    <p className="text-3xl font-black text-slate-900">{card.value}</p>
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-between">
                            <button onClick={() => setStep(1)}
                                className="px-6 py-3 bg-slate-100 text-slate-600 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-all">
                                ← Back
                            </button>
                            <button onClick={() => setStep(3)}
                                className="bg-orange-600 text-white px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-orange-700 transition-all">
                                Next: Summary →
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 3: Summary & Save */}
                {step === 3 && (
                    <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm space-y-6">
                        <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">
                            Incident Summary
                        </h3>
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label className={labelClass}>AI-Generated or Manual Summary</label>
                                <button
                                    onClick={handleGenerateSummary}
                                    disabled={generating || !data.disaster_name}
                                    className="flex items-center space-x-2 bg-slate-900 text-white px-4 py-2 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-slate-800 transition-all disabled:opacity-50"
                                >
                                    {generating ? <Loader size={14} className="animate-spin" /> : <Send size={14} />}
                                    <span>{generating ? 'Generating...' : 'Generate with AI'}</span>
                                </button>
                            </div>
                            <textarea
                                value={data.summary}
                                onChange={e => setData('summary', e.target.value)}
                                rows={6}
                                placeholder="Write or generate an official incident summary..."
                                className={`${inputClass} resize-none`}
                            />
                        </div>

                        {/* Preview */}
                        {data.summary && (
                            <div className="bg-slate-50 border border-slate-200 p-6 rounded-2xl">
                                <div className="flex items-center space-x-2 mb-3">
                                    <FileText size={16} className="text-orange-600" />
                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                                        Report Preview
                                    </p>
                                </div>
                                <p className="text-xs font-bold text-slate-700 leading-relaxed">{data.summary}</p>
                            </div>
                        )}

                        <div className="flex justify-between">
                            <button onClick={() => setStep(2)}
                                className="px-6 py-3 bg-slate-100 text-slate-600 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-all">
                                ← Back
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={processing}
                                className="bg-emerald-600 text-white px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-emerald-700 transition-all disabled:opacity-50 flex items-center space-x-2"
                            >
                                <Save size={16} />
                                <span>{processing ? 'Saving...' : 'Save SitRep'}</span>
                            </button>
                        </div>
                    </div>
                )}

            </div>
        </Layout>
    );
}