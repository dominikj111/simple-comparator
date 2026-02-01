import './LibraryComparison.css';

interface Library {
  name: string;
  category: 'performance' | 'feature-rich' | 'specialized';
  weeklyDownloads?: string;
  features: string[];
  pros: string[];
  cons: string[];
  bundleSize?: string;
  dependencies?: number;
}

const libraries: Library[] = [
  // Performance-Focused
  {
    name: 'fast-deep-equal',
    category: 'performance',
    weeklyDownloads: '20M+',
    bundleSize: '~1KB',
    dependencies: 0,
    features: [
      'ES6 Map/Set/TypedArray support',
      'Minimal footprint',
      'Very fast (~262k ops/sec)',
    ],
    pros: [
      'Fastest option available',
      'Zero dependencies',
      'Well maintained',
    ],
    cons: [
      'No selective comparison',
      'No custom equality logic',
      'Limited configuration options',
    ],
  },
  {
    name: 'fast-equals',
    category: 'performance',
    weeklyDownloads: '5M+',
    bundleSize: '~2KB',
    dependencies: 0,
    features: [
      'Deep, shallow, referential comparison',
      'Circular reference support',
      'Strict mode',
    ],
    pros: [
      'Multiple comparison modes',
      'Good performance',
      'TypeScript support',
    ],
    cons: [
      'No selective comparison',
      'Larger than alternatives',
      'Complex API for simple use cases',
    ],
  },
  {
    name: 'nano-equal',
    category: 'performance',
    weeklyDownloads: '500K+',
    bundleSize: '~200B',
    dependencies: 0,
    features: [
      'Ultra-lightweight',
      'Fast (~188k ops/sec)',
      'Minimal API',
    ],
    pros: [
      'Smallest bundle size',
      'Simple and fast',
      'No dependencies',
    ],
    cons: [
      'No advanced features',
      'Limited type support',
      'No configuration',
    ],
  },
  {
    name: 'react-fast-compare',
    category: 'performance',
    weeklyDownloads: '15M+',
    bundleSize: '~600B',
    dependencies: 0,
    features: [
      'Optimized for React',
      'React.memo compatible',
      'shouldComponentUpdate support',
    ],
    pros: [
      'Perfect for React',
      'Very fast for React use cases',
      'Tiny bundle',
    ],
    cons: [
      'React-specific optimizations only',
      'Not suitable for general use',
      'No selective comparison',
    ],
  },
  
  // Feature-Rich
  {
    name: 'deep-equal',
    category: 'feature-rich',
    weeklyDownloads: '10M+',
    bundleSize: '~18KB',
    dependencies: 17,
    features: [
      'Mirrors Node\'s assert.deepEqual',
      'Strict mode option',
      'Comprehensive type support',
    ],
    pros: [
      'Battle-tested',
      'Comprehensive',
      'Node.js compatible',
    ],
    cons: [
      '17+ dependencies',
      'Large bundle size',
      'Slower than alternatives',
    ],
  },
  {
    name: 'lodash.isEqual',
    category: 'feature-rich',
    weeklyDownloads: '30M+',
    bundleSize: '~17KB',
    dependencies: 0,
    features: [
      'Part of lodash ecosystem',
      'Handles edge cases',
      'Widely used',
    ],
    pros: [
      'Extremely popular',
      'Well documented',
      'Handles many edge cases',
    ],
    cons: [
      'Large bundle (entire lodash)',
      'Overkill for simple cases',
      'Deprecated in some contexts',
    ],
  },
  {
    name: 'deep-eql',
    category: 'feature-rich',
    weeklyDownloads: '8M+',
    bundleSize: '~6KB',
    dependencies: 1,
    features: [
      'From Chai.js',
      'Testing-focused',
      'Circular reference support',
    ],
    pros: [
      'Great for testing',
      'Chai.js integration',
      'Well maintained',
    ],
    cons: [
      'Testing-focused (not general)',
      'No selective comparison',
      'Limited customization',
    ],
  },
  {
    name: 'ramda.equals',
    category: 'feature-rich',
    weeklyDownloads: '3M+',
    bundleSize: '~60KB (full Ramda)',
    dependencies: 0,
    features: [
      'Functional programming style',
      'Immutable-friendly',
      'Part of Ramda',
    ],
    pros: [
      'FP paradigm',
      'Curried',
      'Ramda ecosystem',
    ],
    cons: [
      'Requires Ramda knowledge',
      'Large if using full library',
      'Not optimized for speed',
    ],
  },
  
  // Specialized
  {
    name: 'object-deep-compare',
    category: 'specialized',
    weeklyDownloads: '50K+',
    bundleSize: '~3KB',
    dependencies: 0,
    features: [
      'TypeScript-first',
      'Configurable options',
      'Complex structures',
    ],
    pros: [
      'TypeScript support',
      'Good configuration',
      'Modern',
    ],
    cons: [
      'Less popular',
      'Limited ecosystem',
      'No selective comparison',
    ],
  },
  {
    name: 'deep-equal-in-any-order',
    category: 'specialized',
    weeklyDownloads: '100K+',
    bundleSize: '~4KB',
    dependencies: 2,
    features: [
      'Ignores array order',
      'Chai plugin',
      'Testing-focused',
    ],
    pros: [
      'Unique array handling',
      'Good for testing',
      'Flexible',
    ],
    cons: [
      'Niche use case',
      'Performance overhead',
      'Chai dependency',
    ],
  },
];

export function LibraryComparison() {
  return (
    <div className="library-comparison">
      <section className="comparison-header">
        <h2>📊 How Simple Comparator Compares</h2>
        <p className="comparison-intro">
          Here's how simple-comparator stacks up against other popular deep equality libraries.
          Each has its strengths, but simple-comparator offers a unique combination of features.
        </p>
      </section>

      <section className="simple-comparator-highlight">
        <h3>simple-comparator</h3>
        <div className="highlight-content">
          <div className="highlight-stats">
            <div className="highlight-stat">
              <span className="stat-value">0</span>
              <span className="stat-label">Dependencies</span>
            </div>
            <div className="highlight-stat">
              <span className="stat-value">&lt;5KB</span>
              <span className="stat-label">Bundle Size</span>
            </div>
            <div className="highlight-stat">
              <span className="stat-value">3</span>
              <span className="stat-label">Platforms</span>
            </div>
          </div>
          <div className="highlight-features">
            <h4>✨ Unique Advantages</h4>
            <ul>
              <li><strong>Selective Property Comparison</strong> - <code>topLevelInclude</code> / <code>topLevelIgnore</code></li>
              <li><strong>Custom Equality Logic</strong> - <code>Comparable</code> interface for custom types</li>
              <li><strong>Cross-Platform</strong> - Node.js, Deno, and browser support out of the box</li>
              <li><strong>Zero Dependencies</strong> - No security vulnerabilities from third parties</li>
              <li><strong>Memory Efficient</strong> - No cloning or temporary structures</li>
              <li><strong>Optional Circular Detection</strong> - Enable only when needed for performance</li>
              <li><strong>TypeScript First</strong> - Full type safety and IntelliSense support</li>
              <li><strong>Natural API</strong> - <code>same()</code> and <code>different()</code> functions</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="categories">
        <div className="category">
          <h3>⚡ Performance-Focused Libraries</h3>
          <p className="category-description">
            These libraries prioritize raw speed and minimal bundle size.
          </p>
          <div className="libraries-grid">
            {libraries
              .filter(lib => lib.category === 'performance')
              .map(lib => (
                <LibraryCard key={lib.name} library={lib} />
              ))}
          </div>
        </div>

        <div className="category">
          <h3>🎨 Feature-Rich Libraries</h3>
          <p className="category-description">
            Comprehensive solutions with extensive features and ecosystem support.
          </p>
          <div className="libraries-grid">
            {libraries
              .filter(lib => lib.category === 'feature-rich')
              .map(lib => (
                <LibraryCard key={lib.name} library={lib} />
              ))}
          </div>
        </div>

        <div className="category">
          <h3>🎯 Specialized Libraries</h3>
          <p className="category-description">
            Libraries focused on specific use cases or unique features.
          </p>
          <div className="libraries-grid">
            {libraries
              .filter(lib => lib.category === 'specialized')
              .map(lib => (
                <LibraryCard key={lib.name} library={lib} />
              ))}
          </div>
        </div>
      </section>

      <section className="comparison-table">
        <h3>📋 Feature Comparison Matrix</h3>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Library</th>
                <th>Zero Deps</th>
                <th>Bundle Size</th>
                <th>Selective Fields</th>
                <th>Custom Equality</th>
                <th>Circular Refs</th>
                <th>Cross-Platform</th>
                <th>TypeScript</th>
              </tr>
            </thead>
            <tbody>
              <tr className="highlight-row">
                <td><strong>simple-comparator</strong></td>
                <td>✅</td>
                <td>&lt;5KB</td>
                <td>✅</td>
                <td>✅</td>
                <td>✅</td>
                <td>✅</td>
                <td>✅</td>
              </tr>
              <tr>
                <td>fast-deep-equal</td>
                <td>✅</td>
                <td>~1KB</td>
                <td>❌</td>
                <td>❌</td>
                <td>❌</td>
                <td>✅</td>
                <td>⚠️</td>
              </tr>
              <tr>
                <td>fast-equals</td>
                <td>✅</td>
                <td>~2KB</td>
                <td>❌</td>
                <td>❌</td>
                <td>✅</td>
                <td>✅</td>
                <td>✅</td>
              </tr>
              <tr>
                <td>deep-equal</td>
                <td>❌ (17)</td>
                <td>~18KB</td>
                <td>❌</td>
                <td>❌</td>
                <td>✅</td>
                <td>⚠️</td>
                <td>⚠️</td>
              </tr>
              <tr>
                <td>lodash.isEqual</td>
                <td>⚠️</td>
                <td>~17KB</td>
                <td>❌</td>
                <td>❌</td>
                <td>✅</td>
                <td>✅</td>
                <td>⚠️</td>
              </tr>
              <tr>
                <td>nano-equal</td>
                <td>✅</td>
                <td>~200B</td>
                <td>❌</td>
                <td>❌</td>
                <td>❌</td>
                <td>✅</td>
                <td>❌</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="table-note">
          ✅ = Fully supported | ⚠️ = Partial support | ❌ = Not supported
        </p>
      </section>

      <section className="conclusion">
        <h3>🎯 The Simple Comparator Advantage</h3>
        <div className="conclusion-grid">
          <div className="conclusion-item">
            <h4>🔒 Security</h4>
            <p>Zero dependencies means zero third-party security vulnerabilities. Sleep better at night.</p>
          </div>
          <div className="conclusion-item">
            <h4>⚡ Performance</h4>
            <p>Fast enough for production, with optional features that don't slow you down when not needed.</p>
          </div>
          <div className="conclusion-item">
            <h4>🎯 Flexibility</h4>
            <p>Selective comparison and custom equality logic solve real-world problems others can't.</p>
          </div>
          <div className="conclusion-item">
            <h4>🌍 Universal</h4>
            <p>True cross-platform support: Node.js, Deno, and browsers without any configuration.</p>
          </div>
        </div>
      </section>
    </div>
  );
}

function LibraryCard({ library }: { library: Library }) {
  return (
    <div className="library-card">
      <div className="library-header">
        <h4>{library.name}</h4>
        <div className="library-meta">
          {library.weeklyDownloads && (
            <span className="downloads">📦 {library.weeklyDownloads}/week</span>
          )}
          {library.bundleSize && (
            <span className="bundle-size">📏 {library.bundleSize}</span>
          )}
          {library.dependencies !== undefined && (
            <span className={`dependencies ${library.dependencies === 0 ? 'zero' : 'has-deps'}`}>
              {library.dependencies === 0 ? '✅ Zero deps' : `⚠️ ${library.dependencies} deps`}
            </span>
          )}
        </div>
      </div>

      <div className="library-features">
        <h5>Features</h5>
        <ul>
          {library.features.map((feature, i) => (
            <li key={i}>{feature}</li>
          ))}
        </ul>
      </div>

      <div className="library-pros-cons">
        <div className="pros">
          <h5>✅ Pros</h5>
          <ul>
            {library.pros.map((pro, i) => (
              <li key={i}>{pro}</li>
            ))}
          </ul>
        </div>
        <div className="cons">
          <h5>❌ Cons</h5>
          <ul>
            {library.cons.map((con, i) => (
              <li key={i}>{con}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
