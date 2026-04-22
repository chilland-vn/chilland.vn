/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';

// Lazy load pages
const Home = lazy(() => import('./pages/Home'));
const ListingList = lazy(() => import('./pages/ListingList'));
const ListingDetail = lazy(() => import('./pages/ListingDetail'));
const Admin = lazy(() => import('./pages/Admin'));
const News = lazy(() => import('./pages/News'));

// Components
import Header from './components/Header';
import Footer from './components/Footer';
import Loading from './components/Loading';

export default function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          <Suspense fallback={<Loading />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/danh-muc/:category" element={<ListingList />} />
              <Route path="/san-pham/:id" element={<ListingDetail />} />
              <Route path="/tin-tuc" element={<News />} />
              <Route path="/admin/*" element={<Admin />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
        
        {/* Floating Contact Buttons */}
        <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-50">
          <a 
            href="https://zalo.me/0888928628" 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-14 h-14 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
          >
            <span className="font-bold">Zalo</span>
          </a>
          <a 
            href="tel:0888928628" 
            className="w-14 h-14 bg-green-600 text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          </a>
        </div>
      </div>
    </Router>
  );
}
