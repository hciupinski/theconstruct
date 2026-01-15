import { Suspense } from 'react';
import Instructions from '../components/Instructions';
import LoadingFallback from '../components/LoadingFallback';
import MatrixConstructScene from '../components/scene';

export default function HomePage() {
  return (
    <div className="w-screen h-screen overflow-hidden">
      <Suspense fallback={<LoadingFallback />}>
        <MatrixConstructScene />
      </Suspense>
      <Instructions />
    </div>
  );
}
