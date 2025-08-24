import type { CVData } from "@/types";
import { Mail, Phone, Globe } from "lucide-react";

interface TemplateProps {
  data: CVData;
}

export default function OtagoTemplate({ data }: TemplateProps) {
  return (
    <div className="cv-page bg-white text-gray-800 p-8 font-sans" style={{ fontSize: 'var(--cv-font-size-base)' }}>
      <header className="mb-8">
        <h1 className="font-bold tracking-tight text-[--cv-primary-color]" style={{ fontSize: 'var(--cv-font-size-xxl)' }}>{data.name}</h1>
        <h2 className="font-medium text-muted-foreground mt-1" style={{ fontSize: 'var(--cv-font-size-lg)' }}>{data.jobTitle}</h2>
      </header>
      
      <main className="grid grid-cols-3 gap-x-12">
        <div className="col-span-2 space-y-6">
            <section>
              <h3 className="font-bold uppercase tracking-wider text-[--cv-primary-color] mb-2 border-b-2 border-[--cv-primary-color]/20 pb-1" style={{ fontSize: 'var(--cv-font-size-sm)' }}>Profile</h3>
              <p className="leading-relaxed text-gray-700">{data.summary}</p>
            </section>

            <section>
              <h3 className="font-bold uppercase tracking-wider text-[--cv-primary-color] mb-3 border-b-2 border-[--cv-primary-color]/20 pb-1" style={{ fontSize: 'var(--cv-font-size-sm)' }}>Experience</h3>
              <div className="space-y-4">
                {data.experience.map(exp => (
                  <div key={exp.id}>
                    <div className="flex justify-between items-baseline mb-1">
                        <h4 className="font-semibold" style={{ fontSize: 'var(--cv-font-size-lg)' }}>{exp.role}</h4>
                        <p className="text-gray-500 font-medium" style={{ fontSize: 'var(--cv-font-size-sm)' }}>{exp.dates}</p>
                    </div>
                    <p className="font-medium text-gray-600 mb-1">{exp.company}</p>
                    <p className="text-gray-700 leading-normal">{exp.description}</p>
                  </div>
                ))}
              </div>
            </section>
            
            <section>
              <h3 className="font-bold uppercase tracking-wider text-[--cv-primary-color] mb-3 border-b-2 border-[--cv-primary-color]/20 pb-1" style={{ fontSize: 'var(--cv-font-size-sm)' }}>Education</h3>
              <div className="space-y-3">
                {data.education.map(edu => (
                  <div key={edu.id}>
                    <div className="flex justify-between items-baseline">
                        <h4 className="font-semibold" style={{ fontSize: 'var(--cv-font-size-lg)' }}>{edu.degree}</h4>
                        <p className="text-gray-500 font-medium" style={{ fontSize: 'var(--cv-font-size-sm)' }}>{edu.dates}</p>
                    </div>
                    <p className="font-medium text-gray-600">{edu.school}</p>
                    {edu.description && <p className="text-gray-700 mt-1" style={{ fontSize: 'var(--cv-font-size-sm)' }}>{edu.description}</p>}
                  </div>
                ))}
              </div>
            </section>
        </div>

        <aside className="col-span-1 space-y-6">
            <section>
                <h3 className="font-bold uppercase tracking-wider text-[--cv-primary-color] mb-3 border-b-2 border-[--cv-primary-color]/20 pb-1" style={{ fontSize: 'var(--cv-font-size-sm)' }}>Contact</h3>
                <div className="space-y-2" style={{ fontSize: 'var(--cv-font-size-sm)' }}>
                    <p className="flex items-center gap-2"><Mail size={12}/> {data.contact.email}</p>
                    <p className="flex items-center gap-2"><Phone size={12}/> {data.contact.phone}</p>
                    <p className="flex items-center gap-2"><Globe size={12}/> {data.contact.website}</p>
                </div>
            </section>
            <section>
                <h3 className="font-bold uppercase tracking-wider text-[--cv-primary-color] mb-3 border-b-2 border-[--cv-primary-color]/20 pb-1" style={{ fontSize: 'var(--cv-font-size-sm)' }}>Skills</h3>
                <div className="flex flex-col space-y-1">
                    {data.skills.map(skill => (
                        <span key={skill} className="text-gray-700">{skill}</span>
                    ))}
                </div>
            </section>
        </aside>
      </main>
    </div>
  );
}
