import { addDays, format, getDay, setHours, setMinutes, isSameDay } from 'date-fns';
import { ja } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export function CalendarGrid({ baseDate, selectedSlots, onSlotClick, onDateChange }) {
    // Generate 7 days starting from baseDate
    const days = Array.from({ length: 7 }, (_, i) => addDays(baseDate, i));

    // Hours 8:00 to 22:00 (end at 23:00)
    const hours = Array.from({ length: 15 }, (_, i) => i + 8);

    const handlePrevWeek = () => onDateChange(addDays(baseDate, -7));
    const handleNextWeek = () => onDateChange(addDays(baseDate, 7));

    const isSelected = (date, hour) => {
        return selectedSlots.some(slot =>
            isSameDay(slot.date, date) && slot.hour === hour
        );
    };

    return (
        <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <button onClick={handlePrevWeek} style={navButtonStyle} aria-label="前の週">
                    <ChevronLeft />
                </button>
                <div style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--color-primary)' }}>
                    {format(baseDate, 'yyyy年M月', { locale: ja })}
                </div>
                <button onClick={handleNextWeek} style={navButtonStyle} aria-label="次の週">
                    <ChevronRight />
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '50px repeat(7, 1fr)', gap: '1px', background: 'var(--color-border)', border: '1px solid var(--color-border)', borderRadius: '8px', overflow: 'hidden' }}>
                {/* Header Row */}
                <div style={headerCellStyle}></div> {/* Empty top-left */}
                {days.map(day => (
                    <div key={day.toString()} style={{ ...headerCellStyle, color: getDayColor(day) }}>
                        <div style={{ fontSize: '0.8rem' }}>{format(day, 'M/d', { locale: ja })}</div>
                        <div style={{ fontSize: '1rem', fontWeight: 700 }}>{format(day, '(EE)', { locale: ja })}</div>
                    </div>
                ))}

                {/* Time Grid */}
                {hours.map(hour => (
                    <>
                        {/* Time Label */}
                        <div key={`time-${hour}`} style={timeLabelStyle}>
                            {hour}:00
                        </div>

                        {/* Day Cells for this Hour */}
                        {days.map(day => {
                            const selected = isSelected(day, hour);
                            return (
                                <div
                                    key={`${day}-${hour}`}
                                    onClick={() => onSlotClick(day, hour)}
                                    style={{
                                        ...cellStyle,
                                        backgroundColor: selected ? 'var(--color-primary-light)' : 'var(--color-surface)',
                                        cursor: 'pointer',
                                        transition: 'background-color 0.15s ease'
                                    }}
                                >
                                    {selected && <div style={checkMarkStyle}>✓</div>}
                                </div>
                            );
                        })}
                    </>
                ))}
            </div>
        </div>
    );
}

const navButtonStyle = {
    background: 'none',
    border: '1px solid var(--color-border)',
    borderRadius: '50%',
    width: '36px',
    height: '36px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'var(--color-primary)',
    cursor: 'pointer',
};

const headerCellStyle = {
    backgroundColor: '#f8fafc',
    padding: '12px 4px',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '60px',
};

const timeLabelStyle = {
    backgroundColor: '#f8fafc',
    padding: '8px',
    fontSize: '0.75rem',
    color: 'var(--color-text-muted)',
    display: 'flex',
    alignItems: 'start',
    justifyContent: 'center',
    borderTop: '1px solid #eee',
};

const cellStyle = {
    backgroundColor: 'white',
    minHeight: '40px',
    position: 'relative', // for checkmark absolute pos
    borderTop: '1px dashed #eee', // Helper lines, though grid gap handles main borders
};

const checkMarkStyle = {
    position: 'absolute',
    inset: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'var(--color-primary)',
    fontWeight: 'bold',
    fontSize: '1.2rem',
};

function getDayColor(date) {
    const day = getDay(date);
    if (day === 0) return '#e53e3e'; // Sunday Red
    if (day === 6) return '#3182ce'; // Saturday Blue
    return 'var(--color-text)';
}
