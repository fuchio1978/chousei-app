import { useState, useEffect } from 'react';
import { CalendarGrid } from './components/CalendarGrid';
import { OutputPanel } from './components/OutputPanel';
import { startOfToday } from 'date-fns';
import { db } from './firebase';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';

function App() {
  const [teacher, setTeacher] = useState('tetsu'); // 'tetsu' or 'chigusa'
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [baseDate, setBaseDate] = useState(startOfToday());

  // Firestore Sync: Listen to the teacher's document
  useEffect(() => {
    // Note: 'appointments' collection, docId = teacher name
    const docRef = doc(db, 'appointments', teacher);

    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        // Convert stored Firestore values back to JS Date objects.
        // Firestore typically returns Timestamp objects for Date fields,
        // but we may also encounter ISO strings depending on how data was written.
        const loadedSlots = (data.slots || []).map(s => {
          const rawDate = s.date;
          const hydratedDate = rawDate && typeof rawDate.toDate === 'function'
            ? rawDate.toDate() // Firestore Timestamp
            : new Date(rawDate); // ISO string or other serialised form

          return {
            ...s,
            date: hydratedDate,
          };
        });

        setSelectedSlots(loadedSlots);
      } else {
        setSelectedSlots([]); // No doc yet
      }
    }, (error) => {
      console.error("Firestore sync error:", error);
      // Fallback for valid config missing: Just rely on local for now so app doesn't crash
    });

    return () => unsubscribe();
  }, [teacher]);

  // Toggle slot selection (Write to Firestore)
  const handleSlotClick = async (date, hour) => {
    const slotId = `${date.toISOString()}-${hour}`;
    const isSelected = selectedSlots.some(slot => slot.id === slotId);

    let newSlots;
    if (isSelected) {
      newSlots = selectedSlots.filter(slot => slot.id !== slotId);
    } else {
      const newSlot = {
        id: slotId,
        date: date, // Will be serialized
        hour: hour,
      };

      newSlots = [...selectedSlots, newSlot].sort((a, b) => {
        if (a.date.getTime() !== b.date.getTime()) {
          return a.date.getTime() - b.date.getTime();
        }
        return a.hour - b.hour;
      });
    }

    // Optimistic update
    setSelectedSlots(newSlots);

    // Persist to Firestore
    try {
      // We need to serialize the Date objects for Firestore (or let SDK handle it, but JSON preferred for generic use)
      // SDK handles Date objects comfortably.
      await setDoc(doc(db, 'appointments', teacher), {
        slots: newSlots
      });
    } catch (e) {
      console.error("Failed to save to Firestore", e);
      // User probably hasn't set keys yet
    }
  };

  return (
    <div className="layout">
      <div style={{ flex: 2 }}>
        <header style={{ marginBottom: '20px' }}>
          <h1>四柱推命講座 日程調整</h1>

          {/* Teacher Tabs */}
          <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
            <button
              onClick={() => setTeacher('tetsu')}
              style={{
                padding: '8px 16px',
                borderRadius: '20px',
                border: 'none',
                fontWeight: 600,
                background: teacher === 'tetsu' ? 'var(--color-primary)' : '#eee',
                color: teacher === 'tetsu' ? 'white' : '#666',
                transition: 'all 0.2s',
                boxShadow: teacher === 'tetsu' ? 'var(--shadow-md)' : 'none'
              }}
            >
              てつ先生
            </button>
            <button
              onClick={() => setTeacher('chigusa')}
              style={{
                padding: '8px 16px',
                borderRadius: '20px',
                border: 'none',
                fontWeight: 600,
                background: teacher === 'chigusa' ? '#E91E63' : '#eee', // Pink for Chigusa
                color: teacher === 'chigusa' ? 'white' : '#666',
                transition: 'all 0.2s',
                boxShadow: teacher === 'chigusa' ? 'var(--shadow-md)' : 'none'
              }}
            >
              ちぐさ先生
            </button>
          </div>
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
          <OutputPanel selectedSlots={selectedSlots} teacher={teacher} />
        </div>
      </div>
    </div>
  );
}

export default App;
