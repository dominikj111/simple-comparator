import { useState } from 'react';
import { BenchmarkRunner } from './components/BenchmarkRunner';
import { LandingPage } from './components/LandingPage';
import type { BenchmarkConfig, ExecutionMode } from './types';
import './App.css';

type Tab = 'home' | 'benchmarks';

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [mode, setMode] = useState<ExecutionMode>('serial');

  const benchmarks: BenchmarkConfig[] = [
    // Small object tests - Basic comparison
    { id: 1, objectSize: 'small', iterations: 10000, method: 'simple-comparator' },
    { id: 2, objectSize: 'small', iterations: 10000, method: 'json-stringify' },
    
    // Medium object tests
    { id: 3, objectSize: 'medium', iterations: 5000, method: 'simple-comparator' },
    { id: 4, objectSize: 'medium', iterations: 5000, method: 'json-stringify' },
    
    // Large object tests
    { id: 5, objectSize: 'large', iterations: 1000, method: 'simple-comparator' },
    { id: 6, objectSize: 'large', iterations: 1000, method: 'json-stringify' },
    
    // Huge object tests
    { id: 7, objectSize: 'huge', iterations: 500, method: 'simple-comparator' },
    { id: 8, objectSize: 'huge', iterations: 500, method: 'json-stringify' },
    
    // ADVANTAGE TESTS - Where simple-comparator shines!
    
    // Selective field comparison - Only compare critical fields
    { 
      id: 9, 
      objectSize: 'selective', 
      iterations: 5000, 
      method: 'simple-comparator-selective',
      options: { topLevelInclude: ['id', 'userId', 'status'] }
    },
    { id: 10, objectSize: 'selective', iterations: 5000, method: 'simple-comparator' },
    { id: 11, objectSize: 'selective', iterations: 5000, method: 'json-stringify' },
    
    // Key ordering - simple-comparator handles this, JSON.stringify fails
    { id: 12, objectSize: 'key-order', iterations: 10000, method: 'simple-comparator' },
    { id: 13, objectSize: 'key-order', iterations: 10000, method: 'json-stringify' },
    
    // Circular references - JSON.stringify throws!
    { 
      id: 14, 
      objectSize: 'circular', 
      iterations: 5000, 
      method: 'simple-comparator',
      options: { detectCircular: true }
    },
    { id: 15, objectSize: 'circular', iterations: 5000, method: 'json-stringify' },
    
    // REAL-WORLD OPTIMIZATION - useStableState pattern
    
    // Same reference (no re-render needed) - useStableState skips comparison!
    { id: 16, objectSize: 'stable-state-hook-same-ref', iterations: 100000, method: 'simple-comparator-stable' },
    { id: 17, objectSize: 'stable-state-hook-same-ref', iterations: 100000, method: 'json-stringify-always' },
    
    // New reference but same content (common in React props)
    { id: 18, objectSize: 'stable-state-hook-new-ref', iterations: 10000, method: 'simple-comparator-stable' },
    { id: 19, objectSize: 'stable-state-hook-new-ref', iterations: 10000, method: 'json-stringify-always' },
  ];

  return (
    <div className="app">
      <header className="app-header">
        <h1><span className="app-icon">⚖️</span> simple-comparator</h1>
        <nav className="main-nav">
          <button
            className={`nav-tab ${activeTab === 'home' ? 'active' : ''}`}
            onClick={() => setActiveTab('home')}
          >
            Home
          </button>
          <button
            className={`nav-tab ${activeTab === 'benchmarks' ? 'active' : ''}`}
            onClick={() => setActiveTab('benchmarks')}
          >
            Benchmarks
          </button>
        </nav>
      </header>

      {activeTab === 'home' && <LandingPage />}
      
      {activeTab === 'benchmarks' && (
        <>
          <div className="benchmark-intro">
            <p className="subtitle">
              Comparing deep equality methods: raw performance vs. real-world advantages
            </p>
            <p className="subtitle" style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>
              ✨ See where simple-comparator excels: selective comparison, useStableState optimization, key ordering, and circular refs
            </p>
          </div>

          <div className="mode-selector">
            <label className="mode-label">Execution Mode:</label>
            <div className="mode-buttons">
              <button
                className={`mode-button ${mode === 'serial' ? 'active' : ''}`}
                onClick={() => setMode('serial')}
              >
                Sequential (Recommended)
              </button>
              <button
                className={`mode-button ${mode === 'parallel' ? 'active' : ''}`}
                onClick={() => setMode('parallel')}
              >
                Simultaneous (Faster)
              </button>
            </div>
          </div>

          <BenchmarkRunner key={mode} mode={mode} benchmarks={benchmarks} />
        </>
      )}

      <footer className="app-footer">
        <p>
          Powered by <a href="https://github.com/dominikj111/simple-comparator" target="_blank">simple-comparator</a>
          {' '} • Built with React {import.meta.env.MODE === 'development' && '+ React Compiler'}
        </p>
      </footer>
    </div>
  );
}

export default App;
