'use client';

import { Suspense } from 'react';
import SalesPage from './SalesCompPage';


export default function SalesMainPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-600">Loading sales data...</div>
      </div>
    }>
      <SalesPage />
    </Suspense>
  );
}