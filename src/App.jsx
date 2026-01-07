import { useState } from 'react';
import { CalendarGrid } from './components/CalendarGrid';
import { OutputPanel } from './components/OutputPanel';
import { startOfToday } from 'date-fns';

function App() {
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [baseDate, setBaseDate] = useState(startOfToday());

  // Toggle slot selection
  const handleSlotClick = (date, hour) => {
    const slotId = `${date.toISOString()}-${hour}`;
    
    // Check if already selected
    const isSelected = selectedSlots.some(slot => slot.id === slotId);

    if (isSelected) {
      // Remove
      setSelectedSlots(prev => prev.filter(slot => slot.id !== slotId));
    } else {
      // Add
      const newSlot = {
        id: slotId,
        date: date,
        hour: hour,
      };
      
      // Sort slots by date and time
      setSelectedSlots(prev => [...prev, newSlot].sort((a, b) => {
        if (a.date.getTime() !== b.date.getTime()) {
          return a.date.getTime() - b.date.getTime();
        }
        return a.hour - b.hour;
      }));
    }
  };

  return (
    <div className="layout">
      <div style={{ flex: 2 }}>
        <header style={{ marginBottom: '20px' }}>
          <h1>四柱推命講座 日程調整</h1>
          <p style={{ color: 'var(--color-text-muted)' }}>
            ご希望の日時をクリックして選択してください。
          </p>
        </header>
        <CalendarGrid 
          baseDate={baseDate}
          selectedSlots={selectedSlots}
          onSlotClick={handleSlotClick}
          onDateChange={setBaseDate}
        />
      </div>
      
      <div style={{ flex: 1, minWidth: '300px' }}>
        <div style={{ position: 'sticky', top: '20px' }}>
          <OutputPanel selectedSlots={selectedSlots} />
        </div>
      </div>
    </div>
  );
}

export default App;
