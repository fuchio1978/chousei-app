import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { Copy, Check } from 'lucide-react';
import { useState } from 'react';

export function OutputPanel({ selectedSlots }) {
    const [copied, setCopied] = useState(false);

    // Generate text for clipboard
    const generateText = () => {
        return selectedSlots.map((slot, index) => {
            const dateStr = format(slot.date, 'M/d(EE)', { locale: ja });
            const timeStr = `${slot.hour}:00`;
            return `①${index + 1} ${dateStr} ${timeStr}～`;
        }).join('\n'); // Using numbered circle chars might be tricky for dynamic > 20, keeping user request format
        // User req: "①1/7...", "②..." 
        // I'll stick to circle numbers for 1-20, or just bracket numbers if it goes high.
        // Actually, user example has ①, ② repeated for lines.
        // Wait, "①1/7..." then "②1/7..." 
        // Let's try to map 1-20 to chars, or fallback to (N).
    };

    const getCircleNumber = (num) => {
        // Basic map for 1-20
        const map = ['①', '②', '③', '④', '⑤', '⑥', '⑦', '⑧', '⑨', '⑩', '⑪', '⑫', '⑬', '⑭', '⑮', '⑯', '⑰', '⑱', '⑲', '⑳'];
        return map[num - 1] || `(${num})`;
    };

    const formattedLines = selectedSlots.map((slot, index) => {
        const dateStr = format(slot.date, 'M/d(EEE)', { locale: ja });
        const timeStr = `${slot.hour}:00`;
        return `${getCircleNumber(index + 1)}${dateStr} ${timeStr}～`;
    });

    const handleCopy = async () => {
        const text = formattedLines.join('\n');
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy', err);
        }
    };

    return (
        <div className="card" style={{ borderColor: 'var(--color-primary-light)' }}>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span>選択した日時</span>
                <span style={{ fontSize: '0.9rem', padding: '4px 8px', background: '#eee', borderRadius: '12px', color: '#666' }}>{selectedSlots.length}件</span>
            </h2>

            {selectedSlots.length === 0 ? (
                <div style={{ color: 'var(--color-text-muted)', textAlign: 'center', padding: '32px 0' }}>
                    カレンダーから<br />日時を選択してください
                </div>
            ) : (
                <>
                    <div style={{ background: '#fcfcfc', border: '1px solid #eee', borderRadius: '8px', padding: '16px', marginBottom: '20px', fontFamily: 'monospace', minHeight: '120px' }}>
                        {formattedLines.map((line, i) => (
                            <div key={i} style={{ marginBottom: '4px' }}>
                                {line}
                            </div>
                        ))}
                    </div>

                    <button
                        onClick={handleCopy}
                        style={{
                            width: '100%',
                            padding: '12px',
                            backgroundColor: copied ? 'var(--color-secondary)' : 'var(--color-primary)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            fontWeight: 600,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                            fontSize: '1rem',
                            transition: 'all 0.2s',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                        }}
                    >
                        {copied ? <><Check size={20} /> コピーしました</> : <><Copy size={20} /> テキストをコピー</>}
                    </button>
                </>
            )}
        </div>
    );
}
