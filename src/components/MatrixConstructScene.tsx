import React, { useEffect, useMemo, useState } from 'react';
import { CONFIG } from './matrix-construct-scene.constants';
import './matrix-construct-scene.css';

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

type CardProps = {
  label: string;
  route: string;
};

const base = import.meta.env.BASE_URL;

const CARDS: CardProps[] = [
  { label: 'The Architect', route: `${base}architect/` },
  { label: 'Residual Self-Images', route: `${base}portfolio/` },
  { label: 'Broadcast', route: `${base}blog/` },
];

function MatrixCard({ label, route }: { label: string; route: string }) {
  return (
    <a href={route} className="matrix-card">
      <div>
        <span>{label}</span>
      </div>
    </a>
  );
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
    <div className="matrix-scene" style={sceneStyle} aria-hidden="true">
      <div className="matrix-aisle">
        {shelves.map(item => (
          <div key={item.key} className="matrix-shelf" style={item.style} />
        ))}
      </div>
      {showCards && (
        <div className="matrix-cards">
          {CARDS.map(card => (
            <MatrixCard key={card.label} label={card.label} route={card.route} />
          ))}
        </div>
      )}
    </div>
  );
}
