import type { CVData } from "@/types";
import { Mail, Phone, Globe, Linkedin } from "lucide-react";
import Image from "next/image";

interface TemplateProps {
  data: CVData;
}

export default function HarvardTemplate({ data }: TemplateProps) {
  return (
    <div className="cv-page bg-white text-gray-800 flex font-sans">
      {/* Left Sidebar */}
      <aside className="w-1/3 bg-[--cv-primary-color] text-primary-foreground p-8 flex flex-col justify-between">
        <div>
          <Image
            src="https://placehold.co/150x150.png"
            alt={data.name}
            width={150}
            height={150}
            className="rounded-full border-4 border-white/50 shadow-lg mb-6"
            data-ai-hint="person portrait"
          />
          <h1 className="font-bold tracking-tight" style={{ fontSize: 'var(--cv-font-size-xxl)' }}>{data.name.split(' ')[0]}<br/>{data.name.split(' ').slice(1).join(' ')}</h1>
          <h2 className="font-light text-white/80 mt-2 pb-6 border-b-2 border-white/20" style={{ fontSize: 'var(--cv-font-size-lg)' }}>{data.jobTitle}</h2>
          
          <div className="mt-8 space-y-4" style={{ fontSize: 'var(--cv-font-size-sm)' }}>
             <div className="flex items-center gap-3">
                <Mail size={16} className="shrink-0" />
                <span>{data.contact.email}</span>
             </div>
             <div className="flex items-center gap-3">
                <Phone size={16} className="shrink-0" />
                <span>{data.contact.phone}</span>
             </div>
             {data.contact.website && (
              <div className="flex items-center gap-3">
                  <Globe size={16} className="shrink-0" />
                  <a href={data.contact.website} target="_blank" rel="noopener noreferrer">{data.contact.website}</a>
              </div>
             )}
            {data.contact.linkedin && (
              <div className="flex items-center gap-3">
                  <Linkedin size={16} className="shrink-0" />
                  <a href={data.contact.linkedin} target="_blank" rel="noopener noreferrer">{data.contact.linkedin.replace('https://www.','')}</a>
              </div>
            )}
          </div>
        </div>

        <div>
            <h3 className="font-semibold uppercase tracking-wider mb-4" style={{ fontSize: 'var(--cv-font-size-lg)' }}>Skills</h3>
            <div className="flex flex-col gap-2" style={{ fontSize: 'var(--cv-font-size-sm)' }}>
                {data.skills.map(skill => (
                    <span key={skill}>{skill}</span>
                ))}
            </div>
        </div>

      </aside>

      {/* Main Content */}
      <main className="w-2/3 p-10 overflow-y-auto">
        <section className="mb-10">
          <h3 className="font-bold uppercase tracking-wider text-[--cv-primary-color] mb-4" style={{ fontSize: 'var(--cv-font-size-xl)' }}>Profile</h3>
          <p className="leading-relaxed text-gray-600" style={{ fontSize: 'var(--cv-font-size-base)' }}>{data.summary}</p>
        </section>

        <section className="mb-10">
          <h3 className="font-bold uppercase tracking-wider text-[--cv-primary-color] mb-6" style={{ fontSize: 'var(--cv-font-size-xl)' }}>Experience</h3>
          <div className="space-y-6">
            {data.experience.map(exp => (
              <div key={exp.id}>
                <p className="font-medium tracking-wider mb-1 text-gray-500" style={{ fontSize: 'var(--cv-font-size-sm)' }}>{exp.dates}</p>
                <h4 className="font-semibold text-gray-800" style={{ fontSize: 'var(--cv-font-size-lg)' }}>{exp.role}</h4>
                <p className="font-medium text-gray-600" style={{ fontSize: 'var(--cv-font-size-base)' }}>{exp.company}</p>
                <p className="text-gray-600 mt-2 leading-relaxed" style={{ fontSize: 'var(--cv-font-size-base)' }}>{exp.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h3 className="font-bold uppercase tracking-wider text-[--cv-primary-color] mb-6" style={{ fontSize: 'var(--cv-font-size-xl)' }}>Education</h3>
          <div className="space-y-5">
            {data.education.map(edu => (
              <div key={edu.id}>
                 <p className="font-medium tracking-wider mb-1 text-gray-500" style={{ fontSize: 'var(--cv-font-size-sm)' }}>{edu.dates}</p>
                <h4 className="font-semibold" style={{ fontSize: 'var(--cv-font-size-lg)' }}>{edu.degree}</h4>
                <p className="font-medium text-gray-600" style={{ fontSize: 'var(--cv-font-size-base)' }}>{edu.school}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
