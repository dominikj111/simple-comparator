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
  const [activeIndividual, setActiveIndividual] = useState<number | null>(null);

  const handleComplete = (result: BenchmarkResult) => {
    setResults(prev =>
      prev.map(r => (r.id === result.id ? result : r))
    );

    if (mode === 'serial') {
      // Move to next benchmark
      setCurrentIndex(prev => prev + 1);
    }
    
    // Clear individual run state
    if (activeIndividual === result.id) {
      setActiveIndividual(null);
    }
  };

  const startBenchmarks = () => {
    // If already running or completed, reset and start again
    if (isRunning || allComplete) {
      setIsRunning(false);
      setCurrentIndex(0);
      setResults(
        benchmarks.map(config => ({
          id: config.id,
          config,
          status: 'pending' as const,
        }))
      );
      // Use setTimeout to ensure state updates before starting
      setTimeout(() => {
        setIsRunning(true);
      }, 50);
    } else {
      setIsRunning(true);
      setCurrentIndex(0);
      setResults(
        benchmarks.map(config => ({
          id: config.id,
          config,
          status: 'pending' as const,
        }))
      );
    }
  };

  const runScenario = (scenario: string) => {
    // Get all benchmark IDs for this scenario
    const scenarioIds = benchmarks
      .filter(b => b.objectSize === scenario)
      .map(b => b.id);
    
    // Reset benchmarks in this scenario and mark as running
    setActiveIndividual(scenarioIds[0]); // Track first one to trigger rendering
    setResults(prev =>
      prev.map(r => scenarioIds.includes(r.id) ? { id: r.id, config: r.config, status: 'running' as const } : r)
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

  // Stop running when all benchmarks are complete
  useEffect(() => {
    if (isRunning && allComplete) {
      setIsRunning(false);
    }
  }, [isRunning, allComplete]);

  return (
    <div className="benchmark-runner">
      <div className="benchmark-controls">
        <h2>Benchmark Runner</h2>
        <div className="control-buttons">
          <button
            onClick={startBenchmarks}
            className="btn-primary"
          >
            {isRunning ? `Running ${mode === 'serial' ? 'Sequentially' : 'Simultaneously'}...` : allComplete ? 'Run All Again' : 'Run All'}
          </button>
        </div>
      </div>

      <div className="results-container">
        {renderComparisonTables(results, runScenario)}
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

      {/* Render scenario benchmarks if running individually */}
      {activeIndividual !== null && !isRunning && (
        <>
          {benchmarks
            .filter(b => results.find(r => r.id === b.id)?.status === 'running')
            .map(config => (
              <Benchmark
                key={`scenario-${config.id}`}
                config={config}
                active={true}
                onComplete={handleComplete}
              />
            ))}
        </>
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

function getStatusIconOnly(status: BenchmarkResult['status']): string {
  switch (status) {
    case 'pending':
      return '⬜️';
    case 'running':
      return '⏳';
    case 'completed':
      return '✅';
    case 'error':
      return '❌';
    default:
      return '⬜️';
  }
}

function formatMethodName(method: string): string {
  switch (method) {
    case 'simple-comparator':
      return 'simple-comparator';
    case 'simple-comparator-selective':
      return 'simple-comparator (selective)';
    case 'simple-comparator-stable':
      return 'simple-comparator (useStableState)';
    case 'json-stringify':
      return 'JSON.stringify';
    case 'json-stringify-always':
      return 'JSON.stringify';
    case 'reference-equality':
      return 'Reference (===)';
    default:
      return method;
  }
}

function groupResultsByScenario(results: BenchmarkResult[]) {
  const groups: Record<string, BenchmarkResult[]> = {};
  
  results.forEach(result => {
    const scenario = result.config.objectSize;
    if (!groups[scenario]) {
      groups[scenario] = [];
    }
    groups[scenario].push(result);
  });
  
  return groups;
}

function getScenarioDisplayName(scenario: string): string {
  const names: Record<string, string> = {
    'small': 'Small Object (4 fields)',
    'medium': 'Medium Object (nested + arrays)',
    'large': 'Large Object (50 users + 100 posts)',
    'huge': 'Huge Object (200 deep nested items)',
    'selective': 'Selective Comparison (100+ fields)',
    'key-order': 'Key Ordering Test',
    'circular': 'Circular References',
    'stable-state-hook-same-ref': 'useStableState - Same Reference',
    'stable-state-hook-new-ref': 'useStableState - New Reference',
  };
  return names[scenario] || scenario;
}

function renderComparisonTables(results: BenchmarkResult[], runScenario: (scenario: string) => void) {
  const grouped = groupResultsByScenario(results);
  
  return Object.entries(grouped).map(([scenario, scenarioResults]) => {
    // Sort by time (fastest first), handle pending/error states
    const sorted = [...scenarioResults].sort((a, b) => {
      if (a.status !== 'completed') return 1;
      if (b.status !== 'completed') return -1;
      return (a.timeMs || Infinity) - (b.timeMs || Infinity);
    });
    
    const fastestTime = sorted[0]?.timeMs;
    const allComplete = sorted.every(r => r.status === 'completed' || r.status === 'error');
    const anyRunning = sorted.some(r => r.status === 'running');
    
    return (
      <div key={scenario} className="scenario-group">
        <div className="scenario-header">
          <h3 className="scenario-title">{getScenarioDisplayName(scenario)}</h3>
          <button
            className="btn-run-scenario"
            onClick={() => runScenario(scenario)}
            disabled={anyRunning}
          >
            {anyRunning ? 'Running...' : 'Run Test'}
          </button>
        </div>
        <table className="comparison-table">
          <thead>
            <tr>
              <th className="rank-col">Rank</th>
              <th className="method-col">Method</th>
              <th className="time-col">Time (ms)</th>
              <th className="per1k-col">ms/1K ops</th>
              <th className="relative-col">vs Fastest</th>
              <th className="status-col">Status</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((result, index) => {
              const isWinner = allComplete && index === 0 && result.status === 'completed';
              const timePerK = result.timeMs && result.config.iterations 
                ? (result.timeMs / result.config.iterations) * 1000 
                : 0;
              const relativeSpeed = fastestTime && result.timeMs 
                ? result.timeMs / fastestTime 
                : 0;
              
              return (
                <tr 
                  key={result.id} 
                  className={`
                    status-${result.status} 
                    ${isWinner ? 'winner' : ''} 
                    ${index === 0 && result.status === 'completed' ? 'rank-1' : ''}
                  `.trim()}
                >
                  <td className="rank-col">
                    {result.status === 'completed' && allComplete ? (
                      <span className="rank-badge">
                        {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                      </span>
                    ) : (
                      <span className="status-indicator">
                        {getStatusIcon(result.status)}
                      </span>
                    )}
                  </td>
                  <td className="method-col method-cell">
                    {formatMethodName(result.config.method)}
                  </td>
                  <td className="time-col">
                    {result.status === 'error' ? (
                      <span className="error-text" title={result.error}>ERROR</span>
                    ) : result.timeMs !== undefined ? (
                      <span className={isWinner ? 'winner-value' : ''}>
                        {result.timeMs.toFixed(2)}
                      </span>
                    ) : (
                      '-'
                    )}
                  </td>
                  <td className="per1k-col">
                    {result.status === 'error' ? '-' : timePerK > 0 ? timePerK.toFixed(3) : '-'}
                  </td>
                  <td className="relative-col">
                    {result.status === 'error' ? (
                      '-'
                    ) : relativeSpeed > 0 ? (
                      <span className={`relative-speed ${relativeSpeed === 1 ? 'best' : relativeSpeed > 2 ? 'slow' : ''}`}>
                        {relativeSpeed.toFixed(2)}x
                      </span>
                    ) : (
                      '-'
                    )}
                  </td>
                  <td className="status-col">
                    {getStatusIconOnly(result.status)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  });
}
