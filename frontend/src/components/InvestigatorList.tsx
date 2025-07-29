import { useEffect, useState } from 'react';
import type { Investigator } from '../api/investigators';
import {
    getInvestigators,
    createInvestigator,
    updateInvestigator,
    deleteInvestigator,
} from '../api/investigators';

// ENUM 옵션 (DB와 동일하게 한글)
const investigatorClassOptions = [
    '수호자', '탐구자', '무법자', '신비주의자', '생존자', '중립'
];
const productLineOptions = [
    '기본판', '던위치의 유산', '카르코사로 가는 길', '잊힌 시대', '끝맺지 못한 의식',
    '꿈을 먹는 자들', '인스머스의 음모', '지구의 끝자락', '진홍빛 열쇠', '햄록 베일의 축일',
    '수몰된 도시', '조사자 확장'
];

const initialForm: Omit<Investigator, 'id'> = {
    korName: '',
    engName: '',
    investigatorClass: '수호자',
    productLine: '기본판',
    deckSize: 30,
    health: 0,
    sanity: 0,
    willpower: 0,
    intellect: 0,
    combat: 0,
    agility: 0,
    elderSignEffect: '',
    specialAbilities: '',
    flavorText: '',
};

function InvestigatorList() {
    const [investigators, setInvestigators] = useState<Investigator[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState<Omit<Investigator, 'id'>>(initialForm);
    const [editId, setEditId] = useState<number | null>(null);
    const [error, setError] = useState<string>('');

    const fetchData = () => {
        getInvestigators().then(setInvestigators);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: ['deckSize', 'health', 'sanity', 'willpower', 'intellect', 'combat', 'agility'].includes(name)
                ? Number(value)
                : value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        // 필수값 체크
        if (!form.korName || !form.investigatorClass || !form.health || !form.sanity ||
            !form.willpower || !form.intellect || !form.combat || !form.agility) {
            setError('필수 항목을 모두 입력하세요.');
            return;
        }
        try {
            if (editId) {
                await updateInvestigator(editId, form as Investigator);
            } else {
                await createInvestigator(form as Investigator);
            }
            setShowForm(false);
            setForm(initialForm);
            setEditId(null);
            fetchData();
        } catch {
            setError('등록/수정에 실패했습니다.');
        }
    };

    const handleEdit = (inv: Investigator) => {
        const { id, ...rest } = inv;
        setForm(rest as Omit<Investigator, 'id'>);
        setEditId(inv.id!);
        setShowForm(true);
        setError('');
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('정말로 삭제하시겠습니까?')) {
            await deleteInvestigator(id);
            fetchData();
        }
    };

    const handleAdd = () => {
        setForm(initialForm);
        setEditId(null);
        setShowForm(true);
        setError('');
    };

    return (
        <div style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '20px',
            fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
            backgroundColor: '#f5f5f5',
            minHeight: '100vh'
        }}>
            {/* Header */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '30px',
                padding: '20px',
                backgroundColor: '#fff',
                borderRadius: '12px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                border: '1px solid #e1e5e9'
            }}>
                <h1 style={{
                    margin: 0,
                    color: '#2c3e50',
                    fontSize: '28px',
                    fontWeight: '600'
                }}>
                    Arkham 조사자 관리
                </h1>
                <button
                    onClick={handleAdd}
                    style={{
                        padding: '12px 24px',
                        backgroundColor: '#3498db',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '16px',
                        fontWeight: '500',
                        transition: 'all 0.3s ease',
                        boxShadow: '0 2px 4px rgba(52, 152, 219, 0.3)'
                    }}
                >
                    + 조사자 추가
                </button>
            </div>

            {/* Investigators Table */}
            <div style={{
                backgroundColor: '#fff',
                borderRadius: '12px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                border: '1px solid #e1e5e9',
                overflow: 'hidden'
            }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                    <tr style={{ backgroundColor: '#34495e' }}>
                        <th style={headerStyle}>이름</th>
                        <th style={headerStyle}>클래스</th>
                        <th style={headerStyle}>확장</th>
                        <th style={headerStyle}>체력</th>
                        <th style={headerStyle}>정신력</th>
                        <th style={headerStyle}>액션</th>
                    </tr>
                    </thead>
                    <tbody>
                    {investigators.map((inv, index) => (
                        <tr key={inv.id} style={{
                            backgroundColor: index % 2 === 0 ? '#f8f9fa' : '#fff',
                            transition: 'background-color 0.3s ease'
                        }}>
                            <td style={cellStyle}>{inv.korName}</td>
                            <td style={cellStyle}>
                                <span style={{
                                    padding: '4px 8px',
                                    backgroundColor: getClassColor(inv.investigatorClass),
                                    color: '#fff',
                                    borderRadius: '4px',
                                    fontSize: '12px',
                                    fontWeight: '500'
                                }}>
                                    {inv.investigatorClass}
                                </span>
                            </td>
                            <td style={cellStyle}>{inv.productLine}</td>
                            <td style={cellStyle}>
                                <span style={{
                                    padding: '4px 8px',
                                    backgroundColor: '#e74c3c',
                                    color: '#fff',
                                    borderRadius: '12px',
                                    fontSize: '12px',
                                    fontWeight: 'bold'
                                }}>
                                    {inv.health}
                                </span>
                            </td>
                            <td style={cellStyle}>
                                <span style={{
                                    padding: '4px 8px',
                                    backgroundColor: '#9b59b6',
                                    color: '#fff',
                                    borderRadius: '12px',
                                    fontSize: '12px',
                                    fontWeight: 'bold'
                                }}>
                                    {inv.sanity}
                                </span>
                            </td>
                            <td style={cellStyle}>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <button
                                        onClick={() => handleEdit(inv)}
                                        style={{
                                            ...buttonStyle,
                                            backgroundColor: '#27ae60',
                                            color: '#fff'
                                        }}
                                    >
                                        수정
                                    </button>
                                    <button
                                        onClick={() => handleDelete(inv.id!)}
                                        style={{
                                            ...buttonStyle,
                                            backgroundColor: '#e74c3c',
                                            color: '#fff'
                                        }}
                                    >
                                        삭제
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {/* Form Modal */}
            {showForm && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000
                }}>
                    <div style={{
                        backgroundColor: '#fff',
                        padding: '30px',
                        borderRadius: '12px',
                        width: '500px',
                        maxHeight: '80vh',
                        overflow: 'auto',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
                    }}>
                        <h2 style={{
                            margin: '0 0 20px 0',
                            color: '#2c3e50',
                            fontSize: '24px',
                            fontWeight: '600',
                            textAlign: 'center'
                        }}>
                            {editId ? '조사자 수정' : '조사자 추가'}
                        </h2>
                        {error && <div style={{ color: 'red', marginBottom: 12 }}>{error}</div>}
                        <form onSubmit={handleSubmit}>
                            <div style={{ marginBottom: '16px' }}>
                                <label style={labelStyle}>이름(한글):</label>
                                <input
                                    type="text"
                                    name="korName"
                                    value={form.korName}
                                    onChange={handleChange}
                                    style={inputStyle}
                                    required
                                />
                            </div>
                            <div style={{ marginBottom: '16px' }}>
                                <label style={labelStyle}>이름(영문):</label>
                                <input
                                    type="text"
                                    name="engName"
                                    value={form.engName || ''}
                                    onChange={handleChange}
                                    style={inputStyle}
                                />
                            </div>
                            <div style={{ marginBottom: '16px' }}>
                                <label style={labelStyle}>클래스:</label>
                                <select
                                    name="investigatorClass"
                                    value={form.investigatorClass}
                                    onChange={handleChange}
                                    style={inputStyle}
                                    required
                                >
                                    {investigatorClassOptions.map(opt => (
                                        <option key={opt} value={opt}>{opt}</option>
                                    ))}
                                </select>
                            </div>
                            <div style={{ marginBottom: '16px' }}>
                                <label style={labelStyle}>확장:</label>
                                <select
                                    name="productLine"
                                    value={form.productLine}
                                    onChange={handleChange}
                                    style={inputStyle}
                                >
                                    <option value="">-</option>
                                    {productLineOptions.map(opt => (
                                        <option key={opt} value={opt}>{opt}</option>
                                    ))}
                                </select>
                            </div>
                            <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
                                <div style={{ flex: 1 }}>
                                    <label style={labelStyle}>체력:</label>
                                    <input
                                        type="number"
                                        name="health"
                                        value={form.health}
                                        onChange={handleChange}
                                        style={inputStyle}
                                        min="0"
                                        required
                                    />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label style={labelStyle}>정신력:</label>
                                    <input
                                        type="number"
                                        name="sanity"
                                        value={form.sanity}
                                        onChange={handleChange}
                                        style={inputStyle}
                                        min="0"
                                        required
                                    />
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
                                <div style={{ flex: 1 }}>
                                    <label style={labelStyle}>덱 크기:</label>
                                    <input
                                        type="number"
                                        name="deckSize"
                                        value={form.deckSize}
                                        onChange={handleChange}
                                        style={inputStyle}
                                        min="0"
                                    />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label style={labelStyle}>의지력:</label>
                                    <input
                                        type="number"
                                        name="willpower"
                                        value={form.willpower}
                                        onChange={handleChange}
                                        style={inputStyle}
                                        min="0"
                                        required
                                    />
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
                                <div style={{ flex: 1 }}>
                                    <label style={labelStyle}>지식:</label>
                                    <input
                                        type="number"
                                        name="intellect"
                                        value={form.intellect}
                                        onChange={handleChange}
                                        style={inputStyle}
                                        min="0"
                                        required
                                    />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label style={labelStyle}>전투:</label>
                                    <input
                                        type="number"
                                        name="combat"
                                        value={form.combat}
                                        onChange={handleChange}
                                        style={inputStyle}
                                        min="0"
                                        required
                                    />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label style={labelStyle}>민첩:</label>
                                    <input
                                        type="number"
                                        name="agility"
                                        value={form.agility}
                                        onChange={handleChange}
                                        style={inputStyle}
                                        min="0"
                                        required
                                    />
                                </div>
                            </div>
                            <div style={{ marginBottom: '16px' }}>
                                <label style={labelStyle}>엘더사인 효과:</label>
                                <input
                                    type="text"
                                    name="elderSignEffect"
                                    value={form.elderSignEffect || ''}
                                    onChange={handleChange}
                                    style={inputStyle}
                                />
                            </div>
                            <div style={{ marginBottom: '16px' }}>
                                <label style={labelStyle}>특수 능력:</label>
                                <textarea
                                    name="specialAbilities"
                                    value={form.specialAbilities || ''}
                                    onChange={handleChange}
                                    style={{ ...inputStyle, minHeight: 40 }}
                                />
                            </div>
                            <div style={{ marginBottom: '16px' }}>
                                <label style={labelStyle}>플레이버 텍스트:</label>
                                <textarea
                                    name="flavorText"
                                    value={form.flavorText || ''}
                                    onChange={handleChange}
                                    style={{ ...inputStyle, minHeight: 40 }}
                                />
                            </div>
                            <div style={{
                                display: 'flex',
                                gap: '12px',
                                justifyContent: 'flex-end',
                                marginTop: '24px'
                            }}>
                                <button
                                    type="button"
                                    onClick={() => setShowForm(false)}
                                    style={{
                                        ...buttonStyle,
                                        backgroundColor: '#95a5a6',
                                        color: '#fff',
                                        padding: '12px 20px'
                                    }}
                                >
                                    취소
                                </button>
                                <button
                                    type="submit"
                                    style={{
                                        ...buttonStyle,
                                        backgroundColor: '#3498db',
                                        color: '#fff',
                                        padding: '12px 20px'
                                    }}
                                >
                                    {editId ? '수정' : '추가'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

// 클래스별 색상
const getClassColor = (className: string) => {
    const colors: { [key: string]: string } = {
        '수호자': '#e74c3c',
        '탐구자': '#f39c12',
        '무법자': '#27ae60',
        '신비주의자': '#9b59b6',
        '생존자': '#34495e',
        '중립': '#95a5a6'
    };
    return colors[className] || '#34495e';
};

const headerStyle: React.CSSProperties = {
    padding: '16px',
    textAlign: 'left',
    color: '#fff',
    fontWeight: '600',
    fontSize: '14px',
    letterSpacing: '0.5px'
};

const cellStyle: React.CSSProperties = {
    padding: '16px',
    borderBottom: '1px solid #e1e5e9',
    color: '#2c3e50'
};

const buttonStyle: React.CSSProperties = {
    padding: '8px 12px',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: '500',
    transition: 'all 0.3s ease'
};

const labelStyle: React.CSSProperties = {
    display: 'block',
    marginBottom: '6px',
    color: '#2c3e50',
    fontWeight: '500',
    fontSize: '14px'
};

const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '12px',
    border: '2px solid #e1e5e9',
    borderRadius: '6px',
    fontSize: '14px',
    transition: 'border-color 0.3s ease',
    outline: 'none'
};

export default InvestigatorList;