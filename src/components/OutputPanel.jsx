import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { Copy, Check } from 'lucide-react';
import { useState } from 'react';

export function OutputPanel({ selectedSlots }) {
    const [copiedLine, setCopiedLine] = useState(false);
    const [copiedAdmin, setCopiedAdmin] = useState(false);

    // --- LINE Logic ---
    const getCircleNumber = (num) => {
        const map = ['①', '②', '③', '④', '⑤', '⑥', '⑦', '⑧', '⑨', '⑩', '⑪', '⑫', '⑬', '⑭', '⑮', '⑯', '⑰', '⑲', '⑲', '⑳'];
        return map[num - 1] || `(${num})`;
    };

    const lineLines = selectedSlots.map((slot, index) => {
        const dateStr = format(slot.date, 'M/d(EEE)', { locale: ja });
        const timeStr = `${slot.hour}:00`;
        return `${getCircleNumber(index + 1)}${dateStr} ${timeStr}～`;
    });

    const handleCopyLine = async () => {
        const text = lineLines.join('\n');
        try {
            await navigator.clipboard.writeText(text);
            setCopiedLine(true);
            setTimeout(() => setCopiedLine(false), 2000);
        } catch (err) {
            console.error('Failed to copy', err);
        }
    };

    // --- Admin Logic ---
    const generateAdminText = () => {
        // Group slots by date: { '2026-1-4': [21, 22], ... }
        const grouped = selectedSlots.reduce((acc, slot) => {
            const dateKey = format(slot.date, 'yyyy-M-d'); // 2026-1-4
            if (!acc[dateKey]) acc[dateKey] = [];
            acc[dateKey].push(slot.hour);
            return acc;
        }, {});

        // Format each group
        return Object.entries(grouped).map(([dateKey, hours]) => {
            // hours are already sorted in App.jsx but good to be safe if keys behave odd (though object keys might not sort)
            // selectedSlots is sorted, so reduce order should be preserved for arrays
            const timeStr = hours.map(h => `${h}:00`).join(',');
            return `${dateKey}:${timeStr}`;
        }).join('\n');
    };

    const adminText = generateAdminText();

    const handleCopyAdmin = async () => {
        try {
            await navigator.clipboard.writeText(adminText);
            setCopiedAdmin(true);
            setTimeout(() => setCopiedAdmin(false), 2000);
        } catch (err) {
            console.error('Failed to copy', err);
        }
    };

    return (
        <div className="card" style={{ borderColor: 'var(--color-primary-light)' }}>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span>選択日時リスト</span>
                <span style={{ fontSize: '0.9rem', padding: '4px 8px', background: '#eee', borderRadius: '12px', color: '#666' }}>{selectedSlots.length}件</span>
            </h2>

            {selectedSlots.length === 0 ? (
                <div style={{ color: 'var(--color-text-muted)', textAlign: 'center', padding: '32px 0' }}>
                    カレンダーから<br />日時を選択してください
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    {/* Section 1: LINE Format */}
                    <div>
                        <div style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '8px', color: 'var(--color-primary)' }}>LINE用</div>
                        <div style={{ background: '#fcfcfc', border: '1px solid #eee', borderRadius: '8px', padding: '12px', marginBottom: '8px', fontFamily: 'monospace', minHeight: '80px', fontSize: '0.9rem' }}>
                            {lineLines.map((line, i) => (
                                <div key={i} style={{ marginBottom: '4px' }}>{line}</div>
                            ))}
                        </div>
                        <CopyButton onClick={handleCopyLine} copied={copiedLine} label="LINE用テキストをコピー" />
                    </div>

                    {/* Section 2: Admin Format */}
                    <div>
                        <div style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '8px', color: 'var(--color-secondary)' }}>予約管理サイト用</div>
                        <div style={{ background: '#f0fdf4', border: '1px solid #dcfce7', borderRadius: '8px', padding: '12px', marginBottom: '8px', fontFamily: 'monospace', minHeight: '60px', fontSize: '0.9rem', whiteSpace: 'pre-wrap' }}>
                            {adminText}
                        </div>
                        <CopyButton onClick={handleCopyAdmin} copied={copiedAdmin} label="管理用テキストをコピー" color="var(--color-secondary)" />
                    </div>
                </div>
            )}
        </div>
    );
}

function CopyButton({ onClick, copied, label, color }) {
    const baseColor = color || 'var(--color-primary)';
    return (
        <button
            onClick={onClick}
            style={{
                width: '100%',
                padding: '10px',
                backgroundColor: copied ? '#4CAF50' : baseColor, // Green if copied
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                fontSize: '0.9rem',
                transition: 'all 0.2s',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                cursor: 'pointer'
            }}
        >
            {copied ? <><Check size={18} /> コピーしました</> : <><Copy size={18} /> {label}</>}
        </button>
    );
}
