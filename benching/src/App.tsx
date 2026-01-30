import { useState } from 'react';
import { BenchmarkRunner } from './components/BenchmarkRunner';
import type { BenchmarkConfig, ExecutionMode } from './types';
import './App.css';

function App() {
  const [mode, setMode] = useState<ExecutionMode>('serial');

  const benchmarks: BenchmarkConfig[] = [
    // Small object tests - Basic comparison
    { id: 1, objectSize: 'small', iterations: 10000, method: 'simple-comparator' },
    { id: 2, objectSize: 'small', iterations: 10000, method: 'json-stringify' },
    { id: 3, objectSize: 'small', iterations: 10000, method: 'reference-equality' },
    
    // Medium object tests
    { id: 4, objectSize: 'medium', iterations: 5000, method: 'simple-comparator' },
    { id: 5, objectSize: 'medium', iterations: 5000, method: 'json-stringify' },
    { id: 6, objectSize: 'medium', iterations: 5000, method: 'reference-equality' },
    
    // Large object tests
    { id: 7, objectSize: 'large', iterations: 1000, method: 'simple-comparator' },
    { id: 8, objectSize: 'large', iterations: 1000, method: 'json-stringify' },
    { id: 9, objectSize: 'large', iterations: 1000, method: 'reference-equality' },
    
    // Huge object tests
    { id: 10, objectSize: 'huge', iterations: 500, method: 'simple-comparator' },
    { id: 11, objectSize: 'huge', iterations: 500, method: 'json-stringify' },
    { id: 12, objectSize: 'huge', iterations: 500, method: 'reference-equality' },
    
    // ADVANTAGE TESTS - Where simple-comparator shines!
    
    // Selective field comparison - Only compare critical fields
    { 
      id: 13, 
      objectSize: 'selective', 
      iterations: 5000, 
      method: 'simple-comparator-selective',
      options: { topLevelInclude: ['id', 'userId', 'status'] }
    },
    { id: 14, objectSize: 'selective', iterations: 5000, method: 'simple-comparator' },
    { id: 15, objectSize: 'selective', iterations: 5000, method: 'json-stringify' },
    
    // Key ordering - simple-comparator handles this, JSON.stringify fails
    { id: 16, objectSize: 'key-order', iterations: 10000, method: 'simple-comparator' },
    { id: 17, objectSize: 'key-order', iterations: 10000, method: 'json-stringify' },
    
    // Circular references - JSON.stringify throws!
    { 
      id: 18, 
      objectSize: 'circular', 
      iterations: 5000, 
      method: 'simple-comparator',
      options: { detectCircular: true }
    },
    
    // REAL-WORLD OPTIMIZATION - useStableState pattern
    
    // Same reference (no re-render needed) - useStableState skips comparison!
    { id: 19, objectSize: 'stable-same-ref', iterations: 100000, method: 'simple-comparator-stable' },
    { id: 20, objectSize: 'stable-same-ref', iterations: 100000, method: 'json-stringify-always' },
    { id: 21, objectSize: 'stable-same-ref', iterations: 100000, method: 'reference-equality' },
    
    // New reference but same content (common in React props)
    { id: 22, objectSize: 'stable-new-ref', iterations: 10000, method: 'simple-comparator-stable' },
    { id: 23, objectSize: 'stable-new-ref', iterations: 10000, method: 'json-stringify-always' },
  ];

  return (
    <div className="app">
      <header className="app-header">
        <h1>🚀 simple-comparator Benchmark Suite</h1>
        <p className="subtitle">
          Comparing deep equality methods: raw performance vs. real-world advantages
        </p>
        <p className="subtitle" style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>
          ✨ See where simple-comparator excels: selective comparison, useStableState optimization, key ordering, and circular refs
        </p>
      </header>

      <div className="mode-selector">
        <label className="mode-label">Execution Mode:</label>
        <div className="mode-buttons">
          <button
            className={`mode-button ${mode === 'serial' ? 'active' : ''}`}
            onClick={() => setMode('serial')}
          >
            Serial (Recommended)
          </button>
          <button
            className={`mode-button ${mode === 'parallel' ? 'active' : ''}`}
            onClick={() => setMode('parallel')}
          >
            Parallel (Fast)
          </button>
        </div>
      </div>

      <BenchmarkRunner key={mode} mode={mode} benchmarks={benchmarks} />

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
