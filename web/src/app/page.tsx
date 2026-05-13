import { Diamond, ShieldCheck, Truck, Sparkles } from "lucide-react";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-24 bg-gradient-to-b from-white to-gray-50 dark:from-gray-950 dark:to-black">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
          Architecture:&nbsp;
          <code className="font-bold">Next.js 16 + React 19</code>
        </p>
      </div>

      <div className="relative flex flex-col items-center mt-16 mb-24 text-center">
        <h1 className="text-5xl md:text-7xl font-heading font-bold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-500 dark:from-white dark:to-gray-400">
          Sunny Diamond
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl">
          A production-ready architecture for premium jewelry commerce, powered by Next.js 16 and React 19.
        </p>
        <div className="flex gap-4 mt-8">
          <button className="px-8 py-3 rounded-full bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors">
            Explore Collection
          </button>
          <button className="px-8 py-3 rounded-full border border-input bg-background font-medium hover:bg-accent hover:text-accent-foreground transition-colors">
            Our Story
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-6xl">
        <FeatureCard 
          icon={<Diamond className="w-6 h-6 text-primary" />}
          title="Certified Diamonds"
          description="Every diamond is ethically sourced and GIA certified for quality."
        />
        <FeatureCard 
          icon={<ShieldCheck className="w-6 h-6 text-primary" />}
          title="Secure Shopping"
          description="Your security is our priority with 256-bit SSL encryption."
        />
        <FeatureCard 
          icon={<Truck className="w-6 h-6 text-primary" />}
          title="Insured Shipping"
          description="Free fully insured express shipping on all orders worldwide."
        />
        <FeatureCard 
          icon={<Sparkles className="w-6 h-6 text-primary" />}
          title="Lifetime Warranty"
          description="We stand behind our craftsmanship with a lifetime warranty."
        />
      </div>

      <div className="mt-24 w-full max-w-2xl p-8 rounded-3xl border bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm shadow-2xl">
        <h2 className="text-2xl font-bold mb-2">System Status</h2>
        <p className="text-muted-foreground mb-6">All systems operational and ready for Magento integration.</p>
        
        <div className="space-y-4 text-sm">
          <div className="flex justify-between items-center py-2 border-b">
            <span>TypeScript Strict Mode</span>
            <span className="text-green-500 font-bold">Enabled</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b">
            <span>Tailwind CSS 4.0</span>
            <span className="text-green-500 font-bold">Configured</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b">
            <span>Styled-components SSR</span>
            <span className="text-green-500 font-bold">Active</span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span>ESLint Scalable Rules</span>
            <span className="text-green-500 font-bold">Ready</span>
          </div>
        </div>
      </div>
    </main>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="group p-8 rounded-3xl border bg-white dark:bg-gray-950 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <div className="mb-4 p-3 rounded-2xl bg-primary/5 w-fit group-hover:bg-primary/10 transition-colors">
        {icon}
      </div>
      <h3 className="text-lg font-bold mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
    </div>
  );
}
