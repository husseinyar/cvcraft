
import type { CVData } from "@/types";
import { Mail, Phone, Globe } from "lucide-react";

interface TemplateProps {
  data: CVData;
}

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <section className="mb-6">
        <h3 className="text-sm font-bold uppercase tracking-widest text-white/60 mb-3">{title}</h3>
        <div className="space-y-4 text-sm">{children}</div>
    </section>
);

export default function OnyxTemplate({ data }: TemplateProps) {
  return (
    <div className="w-full bg-[#1A1A1A] text-white font-sans flex flex-col md:flex-row">
      {/* Main Content (Left Column) */}
      <main className="w-full md:w-2/3 p-8">
        <header className="mb-8">
            <h1 className="text-4xl lg:text-5xl font-bold tracking-tight text-white">{data.name.toUpperCase()}</h1>
            <h2 className="text-lg font-light text-white/80 mt-1">{data.jobTitle}</h2>
        </header>

        <Section title="Profile">
          <p className="text-sm leading-relaxed text-white/80">{data.summary}</p>
        </Section>
        
        <Section title="Experience">
           <div className="space-y-6">
            {data.experience.map(exp => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline mb-1">
                    <h4 className="text-base font-semibold text-white">{exp.role}</h4>
                    <p className="text-xs text-white/50 font-medium">{exp.dates}</p>
                </div>
                <p className="font-medium text-white/70 mb-1">{exp.company}</p>
                <p className="text-white/80 leading-normal text-xs">{exp.description}</p>
              </div>
            ))}
          </div>
        </Section>
        
        <Section title="Education">
          <div className="space-y-4">
            {data.education.map(edu => (
              <div key={edu.id}>
                <div className="flex justify-between items-baseline">
                    <h4 className="text-base font-semibold">{edu.degree}</h4>
                    <p className="text-xs text-white/50 font-medium">{edu.dates}</p>
                </div>
                <p className="font-medium text-white/70">{edu.school}</p>
                {edu.description && <p className="text-white/80 text-xs mt-1">{edu.description}</p>}
              </div>
            ))}
          </div>
        </Section>
      </main>

      {/* Sidebar (Right Column) */}
      <aside className="w-full md:w-1/3 bg-[#121212] p-8">
          <Section title="Contact">
            <div className="space-y-3 text-sm">
                <p className="flex items-center gap-3 text-white/80"><Mail size={14}/> {data.contact.email}</p>
                <p className="flex items-center gap-3 text-white/80"><Phone size={14}/> {data.contact.phone}</p>
                <p className="flex items-center gap-3 text-white/80"><Globe size={14}/> {data.contact.website}</p>
            </div>
          </Section>

          <Section title="Skills">
            <div className="flex flex-col space-y-1 text-sm">
                {data.skills.map(skill => (
                    <span key={skill} className="text-white/80">{skill}</span>
                ))}
            </div>
          </Section>
      </aside>
    </div>
  );
}
