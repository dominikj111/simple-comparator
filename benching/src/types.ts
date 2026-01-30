import type { ObjectSize } from './utils/testDataGenerator';

export type ComparisonMethod = 
  | 'simple-comparator' 
  | 'simple-comparator-selective' 
  | 'simple-comparator-stable' // useStableState pattern
  | 'json-stringify' 
  | 'json-stringify-always' // Always runs (simulates every render)
  | 'reference-equality';

export interface BenchmarkConfig {
  id: number;
  objectSize: ObjectSize;
  iterations: number;
  method: ComparisonMethod;
  options?: any; // For passing CompareOptions
}

export type BenchmarkStatus = 'pending' | 'running' | 'completed' | 'error';

export interface BenchmarkResult {
  id: number;
  config: BenchmarkConfig;
  status: BenchmarkStatus;
  timeMs?: number;
  reRenderCount?: number;
  error?: string;
}

export type ExecutionMode = 'serial' | 'parallel';
