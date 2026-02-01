import "./LandingPage.css";

export function LandingPage() {
	return (
		<div className="landing-page">
			<section className="hero">
				<p className="hero-subtitle">Deep equality comparison for JavaScript and TypeScript</p>
			</section>

			<section className="features">
				<h2>Key Features</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🔒</div>
            <h3>Zero dependencies</h3>
            <p>No third-party security vulnerabilities</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🎯</div>
            <h3>Selective comparison</h3>
            <p>Include or ignore specific properties</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">⚙️</div>
            <h3>Custom equality logic</h3>
            <p>Define your own comparison rules via <code>Comparable</code> interface</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🔄</div>
            <h3>Circular references</h3>
            <p>Optional detection, enable when needed</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🌍</div>
            <h3>Cross-platform</h3>
            <p>Works in Node.js, Deno, and browsers</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">⚡</div>
            <h3>Memory efficient</h3>
            <p>No cloning or temporary structures</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📘</div>
            <h3>TypeScript first</h3>
            <p>Full type safety included</p>
          </div>
        </div>
			</section>

			<section className="quick-start">
				<h2>Quick Start</h2>

				<div className="install">
					<pre>
						<code>npm install simple-comparator</code>
					</pre>
				</div>

				<div className="code-examples">
					<div className="code-example">
						<h3>Basic Usage</h3>
						<pre>
							<code>
								<span className="keyword">import</span> {'{ '}
								<span className="function">compare</span>, <span className="function">same</span>,{' '}
								<span className="function">different</span>
								{' }'} <span className="keyword">from</span> <span className="string">"simple-comparator"</span>;
								{'\n\n'}
								<span className="function">compare</span>({'{ '}
								<span className="property">a</span>: <span className="number">1</span>,{' '}
								<span className="property">b</span>: <span className="number">2</span>
								{' }'}, {'{ '}
								<span className="property">a</span>: <span className="number">1</span>,{' '}
								<span className="property">b</span>: <span className="number">2</span>
								{' }'}); <span className="comment">// true</span>
								{'\n\n'}
								<span className="keyword">if</span> (<span className="function">same</span>(user1, user2)) {'{'}
								{'\n  '}
								<span className="variable">console</span>.<span className="function">log</span>(
								<span className="string">"Users are equal"</span>);
								{'\n}'}
							</code>
						</pre>
					</div>

					<div className="code-example">
						<h3>Selective Comparison</h3>
						<pre>
							<code>
								<span className="function">compare</span>(
								{'\n  '}
								{'{ '}
								<span className="property">id</span>: <span className="number">1</span>,{' '}
								<span className="property">name</span>: <span className="string">"John"</span>,{' '}
								<span className="property">timestamp</span>: <span className="variable">Date</span>.
								<span className="function">now</span>() {'}'},
								{'\n  '}
								{'{ '}
								<span className="property">id</span>: <span className="number">2</span>,{' '}
								<span className="property">name</span>: <span className="string">"John"</span>,{' '}
								<span className="property">timestamp</span>: <span className="variable">Date</span>.
								<span className="function">now</span>() - <span className="number">1000</span> {'}'},
								{'\n  '}
								{'{ '}
								<span className="property">topLevelIgnore</span>: [
								<span className="string">"id"</span>, <span className="string">"timestamp"</span>]{' }'}
								{'\n'}); <span className="comment">// true</span>
							</code>
						</pre>
					</div>
				</div>
			</section>

			<section className="comparison">
				<h2>Comparison with Other Libraries</h2>
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
							</tr>
						</thead>
						<tbody>
							<tr className="highlight-row">
								<td>
									<strong>simple-comparator</strong>
								</td>
								<td>✅</td>
								<td>&lt;5KB</td>
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
							</tr>
							<tr>
								<td>fast-equals</td>
								<td>✅</td>
								<td>~2KB</td>
								<td>❌</td>
								<td>❌</td>
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
							</tr>
							<tr>
								<td>lodash.isEqual</td>
								<td>⚠️</td>
								<td>~17KB</td>
								<td>❌</td>
								<td>❌</td>
								<td>✅</td>
								<td>✅</td>
							</tr>
							<tr>
								<td>nano-equal</td>
								<td>✅</td>
								<td>~200B</td>
								<td>❌</td>
								<td>❌</td>
								<td>❌</td>
								<td>✅</td>
							</tr>
						</tbody>
					</table>
				</div>
			</section>

			<section className="links">
				<a
					href="https://github.com/dominikj111/simple-comparator"
					target="_blank"
					rel="noopener noreferrer"
					className="link-button"
				>
					View on GitHub
				</a>
				<a
					href="https://www.npmjs.com/package/simple-comparator"
					target="_blank"
					rel="noopener noreferrer"
					className="link-button"
				>
					View on npm
				</a>
			</section>
		</div>
	);
}
