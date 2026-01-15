import React, { useEffect, useMemo, useState } from 'react';
import { CONFIG } from './scene.constants';
import './scene.css';

type ShelfStyle = React.CSSProperties & {
  ['--x']?: string;
  ['--y']?: string;
  ['--z']?: string;
  ['--delay']?: string;
};

type SceneStyle = React.CSSProperties & {
  ['--duration']?: string;
  ['--travel']?: string;
  ['--travel-end']?: string;
};

const CARD_LABELS = ['The Architect', 'Residual Self-Images', 'Broadcast'];

function MatrixCard({ label }: { label: string }) {
  return <div className="matrix-card">{label}</div>;
}

export default function MatrixConstructScene() {
  const [showCards, setShowCards] = useState(false);

  useEffect(() => {
    const lastDelay = ((CONFIG.shelfCount - 6) * CONFIG.duration) / CONFIG.shelfCount;
    const totalTimeMs = (CONFIG.duration + lastDelay) * 1000;
    const timer = window.setTimeout(() => setShowCards(true), totalTimeMs);
    return () => window.clearTimeout(timer);
  }, []);

  const shelves = useMemo(() => {
    const items: Array<{ key: string; style: ShelfStyle }> = [];
    CONFIG.rows.forEach((row, rowIndex) => {
      for (let i = 0; i < CONFIG.shelfCount; i += 1) {
        const style: ShelfStyle = {
          '--x': `${row.x}px`,
          '--y': `${row.y}px`,
          '--z': `${-i * CONFIG.spacingZ}px`,
          '--delay': `${(i * CONFIG.duration) / CONFIG.shelfCount}s`,
        };
        items.push({ key: `${rowIndex}-${i}`, style });
      }
    });
    return items;
  }, []);

  const sceneStyle: SceneStyle = {
    '--duration': `${CONFIG.duration}s`,
    '--travel': `${CONFIG.travel}px`,
    '--travel-end': `${CONFIG.travelEnd}px`,
  };

  return (
    <div className="matrix-scene" style={sceneStyle}>
      <div className="matrix-aisle">
        {shelves.map(item => (
          <div key={item.key} className="matrix-shelf" style={item.style} />
        ))}
      </div>
      {showCards && (
        <div className="matrix-cards">
          {CARD_LABELS.map(label => (
            <MatrixCard key={label} label={label} />
          ))}
        </div>
      )}
    </div>
  );
}
