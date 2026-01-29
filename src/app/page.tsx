import Link from "next/link";
import { ArrowRight, Code2, Inbox, Zap, Copy, Lock, RefreshCw } from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex flex-col gap-20 pb-12">
      {/* Hero Section */}
      <section className="flex flex-col gap-6 pt-16 pb-8 text-center max-w-4xl mx-auto">
        <div className="flex flex-col gap-4">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
            http-kit
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed">
            Lightweight HTTP utilities for rapid backend prototyping
          </p>
        </div>
        <p className="text-sm text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Stop building full backends for simple data endpoints and webhook testing. 
          http-kit gives you instant, secure HTTP primitives that just work.
        </p>
      </section>

      {/* Main Feature Cards */}
      <section className="grid md:grid-cols-2 gap-6 max-w-6xl mx-auto w-full">
        {/* API Dashboard Card */}
        <Link 
          href="/api-dashboard"
          className="group relative border rounded-2xl bg-card p-8 hover:border-primary/50 transition-all duration-300 hover:shadow-lg overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl group-hover:bg-blue-500/10 transition-all" />
          
          <div className="relative flex flex-col gap-6">
            <div className="flex items-start justify-between">
              <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 w-fit">
                <Code2 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all" />
            </div>

            <div className="flex flex-col gap-3">
              <h2 className="text-2xl font-semibold">API Dashboard</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Create instant mock APIs with JSON or text responses. Perfect for frontend development, 
                config endpoints, and temporary data hosting.
              </p>
            </div>

            <div className="flex flex-col gap-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <Zap className="w-3.5 h-3.5" />
                <span>Instant endpoint generation</span>
              </div>
              <div className="flex items-center gap-2">
                <Lock className="w-3.5 h-3.5" />
                <span>Token-based authentication</span>
              </div>
              <div className="flex items-center gap-2">
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Real-time updates</span>
              </div>
            </div>
          </div>
        </Link>

        {/* Request Bin Card */}
        <Link 
          href="/request-bin"
          className="group relative border rounded-2xl bg-card p-8 hover:border-primary/50 transition-all duration-300 hover:shadow-lg overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 rounded-full blur-3xl group-hover:bg-green-500/10 transition-all" />
          
          <div className="relative flex flex-col gap-6">
            <div className="flex items-start justify-between">
              <div className="p-3 rounded-xl bg-green-500/10 border border-green-500/20 w-fit">
                <Inbox className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all" />
            </div>

            <div className="flex flex-col gap-3">
              <h2 className="text-2xl font-semibold">Request Bins</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Capture and inspect HTTP requests in real-time. Debug webhooks, test callbacks, 
                and analyze third-party integrations effortlessly.
              </p>
            </div>

            <div className="flex flex-col gap-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <Inbox className="w-3.5 h-3.5" />
                <span>All HTTP methods supported</span>
              </div>
              <div className="flex items-center gap-2">
                <Copy className="w-3.5 h-3.5" />
                <span>Full request inspection</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-3.5 h-3.5" />
                <span>Instant endpoint creation</span>
              </div>
            </div>
          </div>
        </Link>
      </section>

      {/* Getting Started */}
      <section className="max-w-4xl mx-auto w-full flex flex-col gap-6">
        <div className="flex flex-col gap-2 text-center">
          <h2 className="text-3xl font-semibold">Getting Started</h2>
          <p className="text-sm text-muted-foreground">
            Start using http-kit in under 2 minutes
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div className="border rounded-xl bg-card p-6 flex flex-col gap-4">
            <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-sm font-semibold">
              1
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="font-medium">Create an Endpoint</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Choose API Dashboard for data endpoints or Request Bin for webhook testing.
              </p>
            </div>
          </div>

          <div className="border rounded-xl bg-card p-6 flex flex-col gap-4">
            <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-sm font-semibold">
              2
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="font-medium">Copy Your URL</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Get your unique endpoint URL and authentication token instantly.
              </p>
            </div>
          </div>

          <div className="border rounded-xl bg-card p-6 flex flex-col gap-4">
            <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-sm font-semibold">
              3
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="font-medium">Start Building</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Integrate with your app immediately. No backend setup required.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="max-w-4xl mx-auto w-full flex flex-col gap-6">
        <div className="flex flex-col gap-2 text-center">
          <h2 className="text-3xl font-semibold">Perfect For</h2>
          <p className="text-sm text-muted-foreground">
            Common development scenarios where http-kit shines
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="border rounded-xl bg-card p-5 flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-blue-500" />
              <h3 className="font-medium text-sm">Frontend Development</h3>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed pl-5">
              Mock backend APIs while building your UI. No need to wait for backend completion.
            </p>
          </div>

          <div className="border rounded-xl bg-card p-5 flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <h3 className="font-medium text-sm">Webhook Testing</h3>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed pl-5">
              Debug webhooks from Stripe, GitHub, or any service. Inspect full payloads instantly.
            </p>
          </div>

          <div className="border rounded-xl bg-card p-5 flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-purple-500" />
              <h3 className="font-medium text-sm">Configuration APIs</h3>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed pl-5">
              Host feature flags, app configs, or temporary JSON data without infrastructure.
            </p>
          </div>

          <div className="border rounded-xl bg-card p-5 flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-yellow-500" />
              <h3 className="font-medium text-sm">API Prototyping</h3>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed pl-5">
              Test API contracts and data structures before implementing the real backend.
            </p>
          </div>

          <div className="border rounded-xl bg-card p-5 flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-red-500" />
              <h3 className="font-medium text-sm">Integration Testing</h3>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed pl-5">
              Verify third-party callbacks and HTTP integrations in your test environment.
            </p>
          </div>

          <div className="border rounded-xl bg-card p-5 flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-orange-500" />
              <h3 className="font-medium text-sm">Quick Demos</h3>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed pl-5">
              Create working prototypes instantly for client presentations and proof-of-concepts.
            </p>
          </div>
        </div>
      </section>

      {/* Quick Example */}
      <section className="max-w-4xl mx-auto w-full flex flex-col gap-6">
        <div className="flex flex-col gap-2 text-center">
          <h2 className="text-3xl font-semibold">Example Usage</h2>
          <p className="text-sm text-muted-foreground">
            See how simple it is to integrate
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {/* API Dashboard Example */}
          <div className="border rounded-xl bg-card p-6 flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <Code2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <h3 className="font-medium text-sm">API Dashboard</h3>
            </div>
            <pre className="rounded-lg border bg-background p-4 text-xs overflow-x-auto leading-relaxed font-mono">
{`// Fetch your mock data
const res = await fetch(
  'https://http-kit.app/api/mock/abc123',
  {
    headers: {
      'Authorization': 'Bearer YOUR_TOKEN'
    }
  }
);

const data = await res.json();
// { "feature": true, "version": "1.0" }`}
            </pre>
          </div>

          {/* Request Bin Example */}
          <div className="border rounded-xl bg-card p-6 flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <Inbox className="w-4 h-4 text-green-600 dark:text-green-400" />
              <h3 className="font-medium text-sm">Request Bin</h3>
            </div>
            <pre className="rounded-lg border bg-background p-4 text-xs overflow-x-auto leading-relaxed font-mono">
{`// Send webhook to your bin
curl -X POST \\
  'https://http-kit.app/api/bin/xyz789' \\
  -H 'Content-Type: application/json' \\
  -d '{
    "event": "payment.success",
    "amount": 99.99
  }'

// View full request in dashboard`}
            </pre>
          </div>
        </div>
      </section>

      {/* Technical Stack */}
      <section className="max-w-4xl mx-auto w-full">
        <div className="border rounded-xl bg-card p-8 flex flex-col gap-6">
          <div className="flex flex-col gap-2 text-center">
            <h2 className="text-2xl font-semibold">Built With Modern Tech</h2>
            <p className="text-sm text-muted-foreground">
              Leveraging the latest web technologies
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex flex-col items-center gap-2 p-4 rounded-lg bg-muted/30">
              <span className="text-sm font-medium">Next.js 16</span>
              <span className="text-xs text-muted-foreground">App Router</span>
            </div>
            <div className="flex flex-col items-center gap-2 p-4 rounded-lg bg-muted/30">
              <span className="text-sm font-medium">TypeScript</span>
              <span className="text-xs text-muted-foreground">Type-safe</span>
            </div>
            <div className="flex flex-col items-center gap-2 p-4 rounded-lg bg-muted/30">
              <span className="text-sm font-medium">Prisma ORM</span>
              <span className="text-xs text-muted-foreground">Database</span>
            </div>
            <div className="flex flex-col items-center gap-2 p-4 rounded-lg bg-muted/30">
              <span className="text-sm font-medium">Clerk Auth</span>
              <span className="text-xs text-muted-foreground">Security</span>
            </div>
          </div>
        </div>
      </section>

      {/* Contribution Section */}
      <section className="max-w-4xl mx-auto w-full">
        <div className="border rounded-xl bg-gradient-to-br from-primary/5 to-primary/10 p-8 flex flex-col gap-6 text-center">
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                MVP Stage
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-semibold">
              Help Shape the Future
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              http-kit is in its initial MVP stage and rapidly evolving. We're building in public 
              and would love your contributions, feedback, and ideas.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <a
              href="https://github.com/YugShrivastava/http-kit"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition-all mx-auto"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
              </svg>
              <span>Contribute on GitHub</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
            <p className="text-xs text-muted-foreground">
              Star the repo • Report issues • Submit PRs • Share ideas
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-4 pt-4">
            <div className="flex flex-col gap-1.5 p-4 rounded-lg bg-background/50">
              <span className="text-xs font-medium text-muted-foreground">Roadmap</span>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• Request replay</li>
                <li>• Custom domains</li>
                <li>• Rate limiting</li>
              </ul>
            </div>
            <div className="flex flex-col gap-1.5 p-4 rounded-lg bg-background/50">
              <span className="text-xs font-medium text-muted-foreground">Coming Soon</span>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• GraphQL support</li>
                <li>• API analytics</li>
                <li>• Team workspaces</li>
              </ul>
            </div>
            <div className="flex flex-col gap-1.5 p-4 rounded-lg bg-background/50">
              <span className="text-xs font-medium text-muted-foreground">Future Ideas</span>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• WebSocket bins</li>
                <li>• Mock responses</li>
                <li>• API versioning</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}