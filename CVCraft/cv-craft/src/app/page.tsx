
"use client"
import SiteLayout from '@/components/site-layout';
import { HardHat } from 'lucide-react';

export default function MaintenancePage() {

  return (
    <SiteLayout>
        <div className="container mx-auto px-4 py-12 flex flex-col items-center justify-center text-center min-h-[60vh]">
            <HardHat className="w-24 h-24 text-primary mb-6" />
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
                Under Construction
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                Our website is currently undergoing scheduled maintenance. We should be back online shortly. Thank you for your patience!
            </p>
        </div>
    </SiteLayout>
  );
}
