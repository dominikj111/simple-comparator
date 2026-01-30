import { useEffect, useRef } from 'react';
import type { BenchmarkConfig, BenchmarkResult } from '../types';
import { generateTestObject } from '../utils/testDataGenerator';
import { same } from '../../../src/comparator';

interface BenchmarkProps {
  config: BenchmarkConfig;
  active: boolean;
  onComplete: (result: BenchmarkResult) => void;
}

export function Benchmark({ config, active, onComplete }: BenchmarkProps) {
  const hasRun = useRef(false);

  useEffect(() => {
    if (!active || hasRun.current) return;
    hasRun.current = true;

    // Run benchmark asynchronously to avoid blocking
    setTimeout(() => {
      try {
        const testObj1 = generateTestObject(config.objectSize);
        const testObj2 = generateTestObject(config.objectSize);
        
        const startTime = performance.now();
        let iterations = 0;

        // Simulate useStableState behavior
        let lastRef = testObj1;
        let stableRef = testObj1;

        // Run the comparison method for the specified iterations
        for (let i = 0; i < config.iterations; i++) {
          switch (config.method) {
            case 'simple-comparator':
              same(testObj1, testObj2, config.options);
              break;
            case 'simple-comparator-selective':
              same(testObj1, testObj2, config.options);
              break;
            case 'simple-comparator-stable':
              // Simulates useStableState: only compare when reference changes
              if (lastRef !== testObj2) {
                if (!same(stableRef, testObj2)) {
                  stableRef = testObj2;
                }
                lastRef = testObj2;
              }
              // Otherwise skip comparison (the optimization!)
              break;
            case 'json-stringify':
              JSON.stringify(testObj1) === JSON.stringify(testObj2);
              break;
            case 'json-stringify-always':
              // Simulates JSON.stringify in useEffect dependency (no ref optimization)
              JSON.stringify(testObj1) === JSON.stringify(testObj2);
              break;
            case 'reference-equality':
              testObj1 === testObj2;
              break;
          }
          iterations++;
        }

        const timeMs = performance.now() - startTime;

        onComplete({
          id: config.id,
          config,
          status: 'completed',
          timeMs,
          reRenderCount: iterations,
        });
      } catch (error) {
        onComplete({
          id: config.id,
          config,
          status: 'error',
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }, 0);
  }, [active, config, onComplete]);

  // Reset when active becomes false
  useEffect(() => {
    if (!active) {
      hasRun.current = false;
    }
  }, [active]);

  return null;
}
