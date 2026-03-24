import Layout from '@/Components/Layout';
import { useForm, usePage } from '@inertiajs/react';
import {
    MapPin, User, Users, CreditCard, Home,
    ShieldCheck, Plus, Trash2, ChevronDown, ChevronUp, Save
} from 'lucide-react';
import { useState } from 'react';

const BARANGAYS = ['Binangbang','Cadiao','Capuyas','Esparar','Guintas','Ipil','Jinalinan','Luntao','Magtulis','Mayabay','Nalupa','Poblacion'];
const VULNERABILITIES = ['PWD','Senior Citizen','Pregnant/Lactating','Solo Parent','Others'];
const RELATIONSHIPS = ['Child','Spouse','Parent','Sibling','Grandparent','In-law','Others'];

const inputClass = 'w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-900 outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all disabled:bg-slate-100 disabled:cursor-not-allowed';
const labelClass = 'block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5';

function SectionHeader({ icon: Icon, title }) {
    return (
        <div className="flex items-center space-x-3 border-b-2 border-orange-500 pb-3 mb-6">
            <Icon size={20} className="text-orange-600 shrink-0" />
            <span className="text-base font-black uppercase tracking-tight text-slate-900">{title}</span>
        </div>
    );
}

function calculateAge(birthdate) {
    if (!birthdate) return '';
    const today = new Date();
    const dob = new Date(birthdate);
    let age = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;
    return age;
}

export default function FacedForm({ record }) {
    const { auth } = usePage().props;
    const user = auth.user;
    const isAdmin = user.role === 'MSWDO / Admin';
    const isEdit = !!record?.id;
    const isValidated = record?.status === 'Validated';

    const { data, setData, post, put, processing, errors } = useForm({
        // Location
        region:             record?.region             || 'Region VI',
        province:           record?.province           || 'Antique',
        municipality:       record?.municipality       || 'Barbaza',
        district:           record?.district           || '',
        barangay:           record?.barangay           || user.assigned_barangay || '',
        evacuation_center:  record?.evacuation_center  || '',
        date_registered:    record?.date_registered    || new Date().toISOString().split('T')[0],

        // Head of Family
        last_name:           record?.last_name          || '',
        first_name:          record?.first_name         || '',
        middle_name:         record?.middle_name        || '',
        name_extension:      record?.name_extension     || '',
        civil_status:        record?.civil_status       || 'Single',
        mothers_maiden_name: record?.mothers_maiden_name || '',
        religion:            record?.religion           || '',
        occupation:          record?.occupation         || '',
        birthdate:           record?.birthdate          || '',
        age:                 record?.age                || '',
        sex:                 record?.sex                || 'Male',
        birthplace:          record?.birthplace         || '',
        monthly_income:      record?.monthly_income     || '0',
        id_presented:        record?.id_presented       || 'National ID',
        id_number:           record?.id_number          || '',
        contact_primary:     record?.contact_primary    || '',
        contact_alternate:   record?.contact_alternate  || '',
        permanent_address:   record?.permanent_address  || '',

        // Social Category
        is_4ps:           record?.is_4ps           || false,
        is_ip:            record?.is_ip            || false,
        ip_group:         record?.ip_group         || '',
        others_category:  record?.others_category  || '',

        // Account Info
        bank_provider:   record?.bank_provider  || '',
        account_name:    record?.account_name   || '',
        account_type:    record?.account_type   || 'Savings',
        account_number:  record?.account_number || '',

        // Housing
        house_ownership: record?.house_ownership || 'Owner',
        shelter_damage:  record?.shelter_damage  || 'None',

        // Consent
        consent_checked: record?.consent_checked || false,
        remarks:         record?.remarks         || '',

        // Family Members
        family_members: record?.family_members?.map(m => ({
            ...m,
            vulnerabilities: m.vulnerabilities || [],
        })) || [],
    });

    const [expandedMembers, setExpandedMembers] = useState([]);

    const toggleMember = (i) => {
        setExpandedMembers(prev =>
            prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i]
        );
    };

    const addMember = () => {
        const idx = data.family_members.length;
        setData('family_members', [...data.family_members, {
            id: null, name: '', relationship: 'Child',
            birthdate: '', age: '', sex: 'Male',
            birthplace: '', occupation: '',
            educational_attainment: '', vulnerabilities: [],
        }]);
        setExpandedMembers(prev => [...prev, idx]);
    };

    const updateMember = (i, field, value) => {
        const updated = [...data.family_members];
        updated[i] = { ...updated[i], [field]: value };
        if (field === 'birthdate') updated[i].age = calculateAge(value);
        setData('family_members', updated);
    };

    const toggleVulnerability = (i, vuln) => {
        const updated = [...data.family_members];
        const vulns = updated[i].vulnerabilities || [];
        updated[i].vulnerabilities = vulns.includes(vuln)
            ? vulns.filter(v => v !== vuln)
            : [...vulns, vuln];
        setData('family_members', updated);
    };

    const removeMember = (i) => {
        setData('family_members', data.family_members.filter((_, idx) => idx !== i));
        setExpandedMembers(prev => prev.filter(x => x !== i).map(x => x > i ? x - 1 : x));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isEdit) {
            put(route('records.update', record.id));
        } else {
            post(route('records.store'));
        }
    };

    // Live VAI preview
    const vaiPreview = (() => {
        let score = 0;
        if (data.is_4ps) score += 10;
        if (data.is_ip) score += 10;
        if (data.others_category) score += 5;
        const income = parseFloat(data.monthly_income) || 0;
        if (income < 5000) score += 25;
        else if (income < 10000) score += 15;
        else if (income < 15000) score += 5;
        const vulnCount = data.family_members.reduce((acc, m) => acc + (m.vulnerabilities?.length || 0), 0);
        score += Math.min(vulnCount * 5, 30);
        if (data.shelter_damage === 'Totally Damaged') score += 30;
        else if (data.shelter_damage === 'Partially Damaged') score += 15;
        return score;
    })();

    const readOnly = isValidated && !isAdmin;

    return (
        <Layout>
            <div className="space-y-6">

                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">
                            {isEdit ? 'Edit FACED Record' : 'New FACED Record'}
                        </h2>
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">
                            {isEdit
                                ? <>Serial: <span className="font-mono text-orange-600">{record?.serial_number}</span> · Status: <span className={`${
                                    record?.status === 'Validated' ? 'text-emerald-600' :
                                    record?.status === 'Returned'  ? 'text-amber-600'   : 'text-orange-600'
                                }`}>{record?.status}</span></>
                                : 'Family Assistance Card in Emergencies and Disasters — Form 1-A'
                            }
                        </p>
                    </div>

                    {/* VAI Score Preview */}
                    <div className="bg-white border border-slate-100 shadow-sm px-6 py-4 rounded-[1.5rem] flex items-center space-x-4 shrink-0">
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">VAI Score Preview</p>
                            <p className="text-3xl font-black text-orange-600 leading-none mt-1">{vaiPreview}</p>
                        </div>
                        <div className="w-16">
                            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                                <div
                                    className="bg-orange-600 h-full rounded-full transition-all duration-300"
                                    style={{ width: `${Math.min(vaiPreview, 100)}%` }}
                                />
                            </div>
                            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-1 text-right">/ 110</p>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">

                    {/* ── Section 1: Location ── */}
                    <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
                        <SectionHeader icon={MapPin} title="Location Information" />
                        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            <div>
                                <label className={labelClass}>Region</label>
                                <input value={data.region} onChange={e => setData('region', e.target.value)} className={inputClass} disabled={readOnly} />
                            </div>
                            <div>
                                <label className={labelClass}>Province</label>
                                <input value={data.province} onChange={e => setData('province', e.target.value)} className={inputClass} disabled={readOnly} />
                            </div>
                            <div>
                                <label className={labelClass}>Municipality</label>
                                <input value={data.municipality} onChange={e => setData('municipality', e.target.value)} className={inputClass} disabled={readOnly} />
                            </div>
                            <div>
                                <label className={labelClass}>District</label>
                                <input value={data.district} onChange={e => setData('district', e.target.value)} className={inputClass} placeholder="Optional" disabled={readOnly} />
                            </div>
                            <div>
                                <label className={labelClass}>Barangay</label>
                                {isAdmin && !readOnly ? (
                                    <select value={data.barangay} onChange={e => setData('barangay', e.target.value)} className={inputClass}>
                                        <option value="">Select Barangay</option>
                                        {BARANGAYS.map(b => <option key={b} value={b}>{b}</option>)}
                                    </select>
                                ) : (
                                    <input value={data.barangay} className={inputClass} disabled />
                                )}
                                {errors.barangay && <p className="text-red-500 text-xs mt-1">{errors.barangay}</p>}
                            </div>
                            <div>
                                <label className={labelClass}>Evacuation Center</label>
                                <input value={data.evacuation_center} onChange={e => setData('evacuation_center', e.target.value)} className={inputClass} placeholder="Optional" disabled={readOnly} />
                            </div>
                            <div>
                                <label className={labelClass}>Date Registered</label>
                                <input type="date" value={data.date_registered} onChange={e => setData('date_registered', e.target.value)} className={inputClass} disabled={readOnly} />
                                {errors.date_registered && <p className="text-red-500 text-xs mt-1">{errors.date_registered}</p>}
                            </div>
                        </div>
                    </div>

                    {/* ── Section 2: Head of Family ── */}
                    <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
                        <SectionHeader icon={User} title="Head of Family" />
                        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            <div>
                                <label className={labelClass}>Last Name</label>
                                <input value={data.last_name} onChange={e => setData('last_name', e.target.value)} className={inputClass} disabled={readOnly} />
                                {errors.last_name && <p className="text-red-500 text-xs mt-1">{errors.last_name}</p>}
                            </div>
                            <div>
                                <label className={labelClass}>First Name</label>
                                <input value={data.first_name} onChange={e => setData('first_name', e.target.value)} className={inputClass} disabled={readOnly} />
                                {errors.first_name && <p className="text-red-500 text-xs mt-1">{errors.first_name}</p>}
                            </div>
                            <div>
                                <label className={labelClass}>Middle Name</label>
                                <input value={data.middle_name} onChange={e => setData('middle_name', e.target.value)} className={inputClass} disabled={readOnly} />
                            </div>
                            <div>
                                <label className={labelClass}>Extension (Jr./Sr./III)</label>
                                <input value={data.name_extension} onChange={e => setData('name_extension', e.target.value)} className={inputClass} placeholder="Jr., Sr., III" disabled={readOnly} />
                            </div>
                            <div>
                                <label className={labelClass}>Sex</label>
                                <select value={data.sex} onChange={e => setData('sex', e.target.value)} className={inputClass} disabled={readOnly}>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                </select>
                            </div>
                            <div>
                                <label className={labelClass}>Civil Status</label>
                                <select value={data.civil_status} onChange={e => setData('civil_status', e.target.value)} className={inputClass} disabled={readOnly}>
                                    {['Single','Married','Widowed','Separated','Co-habiting'].map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className={labelClass}>Birthdate</label>
                                <input type="date" value={data.birthdate}
                                    onChange={e => { setData('birthdate', e.target.value); setData('age', calculateAge(e.target.value)); }}
                                    className={inputClass} disabled={readOnly} />
                            </div>
                            <div>
                                <label className={labelClass}>Age</label>
                                <input type="number" value={data.age} onChange={e => setData('age', e.target.value)} className={inputClass} disabled={readOnly} />
                            </div>
                            <div>
                                <label className={labelClass}>Birthplace</label>
                                <input value={data.birthplace} onChange={e => setData('birthplace', e.target.value)} className={inputClass} disabled={readOnly} />
                            </div>
                            <div>
                                <label className={labelClass}>Religion</label>
                                <input value={data.religion} onChange={e => setData('religion', e.target.value)} className={inputClass} disabled={readOnly} />
                            </div>
                            <div>
                                <label className={labelClass}>Occupation</label>
                                <input value={data.occupation} onChange={e => setData('occupation', e.target.value)} className={inputClass} disabled={readOnly} />
                            </div>
                            <div>
                                <label className={labelClass}>Monthly Income (₱)</label>
                                <input type="number" min="0" value={data.monthly_income} onChange={e => setData('monthly_income', e.target.value)} className={inputClass} disabled={readOnly} />
                            </div>
                            <div className="md:col-span-2">
                                <label className={labelClass}>Mother's Maiden Name</label>
                                <input value={data.mothers_maiden_name} onChange={e => setData('mothers_maiden_name', e.target.value)} className={inputClass} disabled={readOnly} />
                            </div>
                            <div className="lg:col-span-4">
                                <label className={labelClass}>Permanent Address</label>
                                <input value={data.permanent_address} onChange={e => setData('permanent_address', e.target.value)} className={inputClass} disabled={readOnly} />
                                {errors.permanent_address && <p className="text-red-500 text-xs mt-1">{errors.permanent_address}</p>}
                            </div>
                            <div>
                                <label className={labelClass}>Contact Number (Primary)</label>
                                <input value={data.contact_primary} onChange={e => setData('contact_primary', e.target.value)} className={inputClass} disabled={readOnly} />
                                {errors.contact_primary && <p className="text-red-500 text-xs mt-1">{errors.contact_primary}</p>}
                            </div>
                            <div>
                                <label className={labelClass}>Contact Number (Alternate)</label>
                                <input value={data.contact_alternate} onChange={e => setData('contact_alternate', e.target.value)} className={inputClass} disabled={readOnly} />
                            </div>
                            <div>
                                <label className={labelClass}>ID Presented</label>
                                <input value={data.id_presented} onChange={e => setData('id_presented', e.target.value)} className={inputClass} disabled={readOnly} />
                            </div>
                            <div>
                                <label className={labelClass}>ID Number</label>
                                <input value={data.id_number} onChange={e => setData('id_number', e.target.value)} className={inputClass} disabled={readOnly} />
                            </div>
                        </div>

                        {/* Social Category */}
                        <div className="mt-6 pt-6 border-t border-slate-100">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Social Category</p>
                            <div className="flex flex-wrap gap-6">
                                <label className="flex items-center space-x-2 cursor-pointer">
                                    <input type="checkbox" checked={data.is_4ps}
                                        onChange={e => setData('is_4ps', e.target.checked)}
                                        disabled={readOnly}
                                        className="w-4 h-4 rounded text-orange-600" />
                                    <span className="text-sm font-bold text-slate-700">4Ps Beneficiary</span>
                                </label>
                                <label className="flex items-center space-x-2 cursor-pointer">
                                    <input type="checkbox" checked={data.is_ip}
                                        onChange={e => setData('is_ip', e.target.checked)}
                                        disabled={readOnly}
                                        className="w-4 h-4 rounded text-orange-600" />
                                    <span className="text-sm font-bold text-slate-700">Indigenous People (IP)</span>
                                </label>
                                {data.is_ip && (
                                    <input value={data.ip_group} onChange={e => setData('ip_group', e.target.value)}
                                        placeholder="IP Group/Tribe" className={`${inputClass} w-48`} disabled={readOnly} />
                                )}
                                <div className="flex items-center space-x-2">
                                    <span className="text-sm font-bold text-slate-700">Others:</span>
                                    <input value={data.others_category} onChange={e => setData('others_category', e.target.value)}
                                        placeholder="Specify..." className={`${inputClass} w-48`} disabled={readOnly} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ── Section 3: Family Members ── */}
                    <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center space-x-3 border-b-2 border-orange-500 pb-3 flex-1 mr-4">
                                <Users size={20} className="text-orange-600 shrink-0" />
                                <span className="text-base font-black uppercase tracking-tight text-slate-900">Family Members</span>
                                <span className="bg-orange-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                                    {data.family_members.length}
                                </span>
                            </div>
                            {!readOnly && (
                                <button type="button" onClick={addMember}
                                    className="bg-orange-600 text-white px-4 py-2 rounded-xl font-black text-xs uppercase tracking-widest flex items-center space-x-1 hover:bg-orange-700 transition-all shrink-0">
                                    <Plus size={14} /><span>Add Member</span>
                                </button>
                            )}
                        </div>

                        {data.family_members.length === 0 ? (
                            <p className="text-center py-8 text-slate-300 font-black uppercase tracking-widest text-xs">
                                No family members added yet
                            </p>
                        ) : (
                            <div className="space-y-3">
                                {data.family_members.map((member, i) => (
                                    <div key={i} className="border border-slate-200 rounded-2xl overflow-hidden">
                                        {/* Member Header */}
                                        <div className="flex items-center justify-between px-5 py-3 bg-slate-50 cursor-pointer"
                                            onClick={() => toggleMember(i)}>
                                            <div className="flex items-center space-x-3">
                                                <div className="w-7 h-7 bg-orange-600 rounded-lg flex items-center justify-center shrink-0">
                                                    <span className="text-white text-[10px] font-black">{i + 1}</span>
                                                </div>
                                                <div>
                                                    <p className="font-black text-slate-900 text-sm">
                                                        {member.name || <span className="text-slate-400 font-bold italic">Unnamed Member</span>}
                                                    </p>
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                                        {member.relationship}{member.age ? ` · Age ${member.age}` : ''}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                {member.vulnerabilities?.length > 0 && (
                                                    <span className="bg-orange-100 text-orange-600 text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest">
                                                        {member.vulnerabilities.length} vuln.
                                                    </span>
                                                )}
                                                {!readOnly && (
                                                    <button type="button"
                                                        onClick={e => { e.stopPropagation(); removeMember(i); }}
                                                        className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
                                                        <Trash2 size={14} />
                                                    </button>
                                                )}
                                                {expandedMembers.includes(i)
                                                    ? <ChevronUp size={16} className="text-slate-400" />
                                                    : <ChevronDown size={16} className="text-slate-400" />
                                                }
                                            </div>
                                        </div>

                                        {/* Member Fields */}
                                        {expandedMembers.includes(i) && (
                                            <div className="p-5 space-y-4">
                                                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                                    <div className="md:col-span-2">
                                                        <label className={labelClass}>Full Name</label>
                                                        <input value={member.name} onChange={e => updateMember(i, 'name', e.target.value)} className={inputClass} disabled={readOnly} />
                                                    </div>
                                                    <div>
                                                        <label className={labelClass}>Relationship</label>
                                                        <select value={member.relationship} onChange={e => updateMember(i, 'relationship', e.target.value)} className={inputClass} disabled={readOnly}>
                                                            {RELATIONSHIPS.map(r => <option key={r} value={r}>{r}</option>)}
                                                        </select>
                                                    </div>
                                                    <div>
                                                        <label className={labelClass}>Sex</label>
                                                        <select value={member.sex} onChange={e => updateMember(i, 'sex', e.target.value)} className={inputClass} disabled={readOnly}>
                                                            <option value="Male">Male</option>
                                                            <option value="Female">Female</option>
                                                        </select>
                                                    </div>
                                                    <div>
                                                        <label className={labelClass}>Birthdate</label>
                                                        <input type="date" value={member.birthdate} onChange={e => updateMember(i, 'birthdate', e.target.value)} className={inputClass} disabled={readOnly} />
                                                    </div>
                                                    <div>
                                                        <label className={labelClass}>Age</label>
                                                        <input type="number" value={member.age} onChange={e => updateMember(i, 'age', e.target.value)} className={inputClass} disabled={readOnly} />
                                                    </div>
                                                    <div>
                                                        <label className={labelClass}>Birthplace</label>
                                                        <input value={member.birthplace} onChange={e => updateMember(i, 'birthplace', e.target.value)} className={inputClass} disabled={readOnly} />
                                                    </div>
                                                    <div>
                                                        <label className={labelClass}>Occupation</label>
                                                        <input value={member.occupation} onChange={e => updateMember(i, 'occupation', e.target.value)} className={inputClass} disabled={readOnly} />
                                                    </div>
                                                    <div>
                                                        <label className={labelClass}>Educational Attainment</label>
                                                        <input value={member.educational_attainment} onChange={e => updateMember(i, 'educational_attainment', e.target.value)} className={inputClass} disabled={readOnly} />
                                                    </div>
                                                </div>

                                                {/* Vulnerabilities */}
                                                <div className="pt-3 border-t border-slate-100">
                                                    <p className={labelClass}>Vulnerabilities</p>
                                                    <div className="flex flex-wrap gap-4 mt-2">
                                                        {VULNERABILITIES.map(vuln => (
                                                            <label key={vuln} className="flex items-center space-x-2 cursor-pointer">
                                                                <input type="checkbox"
                                                                    checked={member.vulnerabilities?.includes(vuln) || false}
                                                                    onChange={() => !readOnly && toggleVulnerability(i, vuln)}
                                                                    disabled={readOnly}
                                                                    className="w-4 h-4 rounded text-orange-600" />
                                                                <span className="text-xs font-bold text-slate-700">{vuln}</span>
                                                            </label>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* ── Section 4: Account Info ── */}
                    <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
                        <SectionHeader icon={CreditCard} title="Financial Account Information" />
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div>
                                <label className={labelClass}>Bank / E-Wallet Provider</label>
                                <input value={data.bank_provider} onChange={e => setData('bank_provider', e.target.value)} className={inputClass} placeholder="e.g. Landbank, GCash" disabled={readOnly} />
                            </div>
                            <div>
                                <label className={labelClass}>Account Name</label>
                                <input value={data.account_name} onChange={e => setData('account_name', e.target.value)} className={inputClass} disabled={readOnly} />
                            </div>
                            <div>
                                <label className={labelClass}>Account Type</label>
                                <select value={data.account_type} onChange={e => setData('account_type', e.target.value)} className={inputClass} disabled={readOnly}>
                                    <option value="Savings">Savings</option>
                                    <option value="Checking">Checking</option>
                                    <option value="E-Wallet">E-Wallet</option>
                                </select>
                            </div>
                            <div>
                                <label className={labelClass}>Account Number</label>
                                <input value={data.account_number} onChange={e => setData('account_number', e.target.value)} className={inputClass} disabled={readOnly} />
                            </div>
                        </div>
                    </div>

                    {/* ── Section 5: Housing & Damage ── */}
                    <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
                        <SectionHeader icon={Home} title="Housing & Shelter Damage" />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className={labelClass}>House Ownership</label>
                                <select value={data.house_ownership} onChange={e => setData('house_ownership', e.target.value)} className={inputClass} disabled={readOnly}>
                                    <option value="Owner">Owner</option>
                                    <option value="Renter">Renter</option>
                                    <option value="Sharer">Sharer</option>
                                </select>
                            </div>
                            <div>
                                <label className={labelClass}>Shelter Damage</label>
                                <select value={data.shelter_damage} onChange={e => setData('shelter_damage', e.target.value)} className={inputClass} disabled={readOnly}>
                                    <option value="None">None</option>
                                    <option value="Partially Damaged">Partially Damaged</option>
                                    <option value="Totally Damaged">Totally Damaged</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* ── Section 6: Consent & Remarks ── */}
                    <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
                        <SectionHeader icon={ShieldCheck} title="Consent & Remarks" />
                        <div className="space-y-4">
                            <label className="flex items-start space-x-3 cursor-pointer">
                                <input type="checkbox" checked={data.consent_checked}
                                    onChange={e => setData('consent_checked', e.target.checked)}
                                    disabled={readOnly}
                                    className="w-4 h-4 rounded text-orange-600 mt-0.5 shrink-0" />
                                <span className="text-sm font-bold text-slate-700 leading-relaxed">
                                    I hereby certify that the information provided is true and correct. I consent to the collection and processing of my personal data in accordance with the Data Privacy Act of 2012 (RA 10173).
                                </span>
                            </label>
                            {errors.consent_checked && <p className="text-red-500 text-xs">{errors.consent_checked}</p>}
                            <div>
                                <label className={labelClass}>Remarks / Notes</label>
                                <textarea value={data.remarks} onChange={e => setData('remarks', e.target.value)}
                                    rows={3} disabled={readOnly}
                                    className={`${inputClass} resize-none`}
                                    placeholder="Optional remarks from the staff..." />
                            </div>
                        </div>
                    </div>

                    {/* ── Submit Buttons ── */}
                    {!readOnly && (
                        <div className="flex items-center justify-end space-x-3 pb-8">
                            <a href={route('records.index')}
                                className="px-6 py-3 bg-slate-100 text-slate-600 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-all">
                                Cancel
                            </a>
                            <button type="submit" disabled={processing}
                                className="bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center space-x-2 shadow-lg shadow-orange-500/20 transition-all active:scale-95">
                                {processing ? (
                                    <span className="animate-pulse">Saving...</span>
                                ) : (
                                    <><Save size={16} /><span>{isEdit ? 'Update Record' : 'Submit Record'}</span></>
                                )}
                            </button>
                        </div>
                    )}

                </form>
            </div>
        </Layout>
    );
}