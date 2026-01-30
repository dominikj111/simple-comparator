import { useEffect, useState } from 'react';
import { Benchmark } from './Benchmark';
import type { BenchmarkConfig, BenchmarkResult, ExecutionMode } from '../types';
import './BenchmarkRunner.css';

interface BenchmarkRunnerProps {
  mode: ExecutionMode;
  benchmarks: BenchmarkConfig[];
}

export function BenchmarkRunner({ mode, benchmarks }: BenchmarkRunnerProps) {
  const [results, setResults] = useState<BenchmarkResult[]>(() =>
    benchmarks.map(config => ({
      id: config.id,
      config,
      status: 'pending' as const,
    }))
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  const handleComplete = (result: BenchmarkResult) => {
    setResults(prev =>
      prev.map(r => (r.id === result.id ? result : r))
    );

    if (mode === 'serial') {
      // Move to next benchmark
      setCurrentIndex(prev => prev + 1);
    }
  };

  const startBenchmarks = () => {
    setIsRunning(true);
    setCurrentIndex(0);
    setResults(
      benchmarks.map(config => ({
        id: config.id,
        config,
        status: 'pending' as const,
      }))
    );
  };

  const resetBenchmarks = () => {
    setIsRunning(false);
    setCurrentIndex(0);
    setResults(
      benchmarks.map(config => ({
        id: config.id,
        config,
        status: 'pending' as const,
      }))
    );
  };

  // Update status for currently running benchmarks
  useEffect(() => {
    if (!isRunning) return;

    setResults(prev =>
      prev.map((r, idx) => {
        if (r.status === 'completed' || r.status === 'error') return r;
        
        if (mode === 'parallel') {
          return { ...r, status: 'running' };
        } else {
          return idx === currentIndex ? { ...r, status: 'running' } : r;
        }
      })
    );
  }, [isRunning, currentIndex, mode]);

  // Check if all benchmarks are complete
  const allComplete = results.every(r => r.status === 'completed' || r.status === 'error');
  const hasStarted = isRunning;

  return (
    <div className="benchmark-runner">
      <div className="benchmark-controls">
        <h2>Benchmark Runner</h2>
        <div className="control-buttons">
          <button
            onClick={startBenchmarks}
            disabled={isRunning}
            className="btn-primary"
          >
            Start {mode === 'serial' ? 'Serial' : 'Parallel'} Test
          </button>
          <button
            onClick={resetBenchmarks}
            disabled={!hasStarted}
            className="btn-secondary"
          >
            Reset
          </button>
        </div>
      </div>

      <div className="results-table-container">
        <table className="results-table">
          <thead>
            <tr>
              <th>Status</th>
              <th>Method</th>
              <th>Object Size</th>
              <th>Iterations</th>
              <th>Time (ms)</th>
              <th>Time per 1000 ops (ms)</th>
            </tr>
          </thead>
          <tbody>
            {results.map((result) => (
              <tr key={result.id} className={`status-${result.status}`}>
                <td>
                  <span className={`status-badge status-${result.status}`}>
                    {getStatusIcon(result.status)} {result.status}
                  </span>
                </td>
                <td className="method-cell">
                  {formatMethodName(result.config.method)}
                  {result.config.options && <span className="method-options"> (selective)</span>}
                </td>
                <td>{result.config.objectSize}</td>
                <td>{result.config.iterations.toLocaleString()}</td>
                <td>
                  {result.status === 'error' 
                    ? <span className="error-text" title={result.error}>ERROR</span>
                    : result.timeMs !== undefined
                      ? result.timeMs.toFixed(2)
                      : '-'}
                </td>
                <td>
                  {result.status === 'error'
                    ? '-'
                    : result.timeMs !== undefined && result.config.iterations
                      ? ((result.timeMs / result.config.iterations) * 1000).toFixed(3)
                      : '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Render active benchmarks */}
      {isRunning && mode === 'parallel' &&
        benchmarks.map(config => (
          <Benchmark
            key={config.id}
            config={config}
            active={true}
            onComplete={handleComplete}
          />
        ))}

      {isRunning && mode === 'serial' && currentIndex < benchmarks.length && (
        <Benchmark
          key={benchmarks[currentIndex].id}
          config={benchmarks[currentIndex]}
          active={true}
          onComplete={handleComplete}
        />
      )}

      {allComplete && hasStarted && (
        <div className="completion-message">
          ✓ All benchmarks completed!
        </div>
      )}
    </div>
  );
}

function getStatusIcon(status: BenchmarkResult['status']): string {
  switch (status) {
    case 'pending':
      return '⏳';
    case 'running':
      return '⚡';
    case 'completed':
      return '✓';
    case 'error':
      return '✗';
    default:
      return '';
  }
}

function formatMethodName(method: string): string {
  switch (method) {
    case 'simple-comparator':
      return 'Deep Compare';
    case 'simple-comparator-selective':
      return 'Deep Compare (Selective)';
    case 'simple-comparator-stable':
      return 'useStableState (optimized)';
    case 'json-stringify':
      return 'JSON.stringify';
    case 'json-stringify-always':
      return 'JSON.stringify (every render)';
    case 'reference-equality':
      return 'Reference (===)';
    default:
      return method;
  }
}
