
import type { CVData } from "@/types";
import { Mail, Phone, Globe, Linkedin } from "lucide-react";
import Image from "next/image";

interface TemplateProps {
  data: CVData;
}

const SectionContent = ({ sectionId, data }: { sectionId: string, data: CVData }) => {
  switch (sectionId) {
    case 'summary':
      return (
        <section className="mb-10">
          <p className="leading-relaxed text-gray-600 border-l-4 border-[--cv-primary-color] pl-4" style={{ fontSize: 'var(--cv-font-size-base)' }}>{data.summary}</p>
        </section>
      );
    case 'experience':
      return (
        <section className="mb-10">
          <h3 className="uppercase tracking-wider text-[--cv-primary-color] mb-6" style={{ fontSize: 'var(--cv-font-size-xl)', fontWeight: 'bold' }}>Work Experience</h3>
          <div className="space-y-6">
            {data.experience.map((exp) => (
              <div key={exp.id} className="relative pl-6 before:absolute before:left-0 before:top-2 before:h-2 before:w-2 before:bg-[--cv-primary-color] before:rounded-full">
                <p className="text-gray-500 font-medium tracking-wider mb-1" style={{ fontSize: 'var(--cv-font-size-sm)' }}>{exp.dates}</p>
                <h4 className="font-semibold text-gray-800" style={{ fontSize: 'var(--cv-font-size-lg)' }}>{exp.role}</h4>
                <p className="font-medium text-gray-600" style={{ fontSize: 'var(--cv-font-size-base)' }}>{exp.company}</p>
                <p className="text-gray-600 mt-2 leading-relaxed" style={{ fontSize: 'var(--cv-font-size-base)' }}>{exp.description}</p>
              </div>
            ))}
          </div>
        </section>
      );
    case 'education':
      return (
        <section>
          <h3 className="uppercase tracking-wider text-[--cv-primary-color] mb-6" style={{ fontSize: 'var(--cv-font-size-xl)', fontWeight: 'bold' }}>Education</h3>
          <div className="space-y-5">
            {data.education.map((edu) => (
              <div key={edu.id} className="relative pl-6 before:absolute before:left-0 before:top-2 before:h-2 before:w-2 before:bg-[--cv-primary-color] before:rounded-full">
                 <p className="text-gray-500 font-medium tracking-wider mb-1" style={{ fontSize: 'var(--cv-font-size-sm)' }}>{edu.dates}</p>
                <h4 className="font-semibold" style={{ fontSize: 'var(--cv-font-size-lg)' }}>{edu.degree}</h4>
                <p className="font-medium text-gray-600" style={{ fontSize: 'var(--cv-font-size-base)' }}>{edu.school}</p>
              </div>
            ))}
          </div>
        </section>
      );
    default:
      return null;
  }
}

export default function CreativeTemplate({ data }: TemplateProps) {
  const { sectionOrder = ['summary', 'experience', 'education'] } = data;

  return (
    <div className="cv-page flex font-sans text-gray-800 bg-white">
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
          <h3 className="font-semibold uppercase tracking-wider mb-4 border-b pb-2" style={{ fontSize: 'var(--cv-font-size-lg)' }}>Personal Details</h3>
          <div className="mt-4 space-y-4" style={{ fontSize: 'var(--cv-font-size-sm)' }}>
             <div className="flex items-start gap-3">
                <Mail size={16} className="shrink-0 mt-1" />
                <span>{data.contact.email}</span>
             </div>
             <div className="flex items-start gap-3">
                <Phone size={16} className="shrink-0 mt-1" />
                <span>{data.contact.phone}</span>
             </div>
             {data.contact.website && (
                <div className="flex items-start gap-3">
                    <Globe size={16} className="shrink-0 mt-1" />
                    <a href={data.contact.website} target="_blank" rel="noopener noreferrer">{data.contact.website}</a>
                </div>
             )}
             {data.contact.linkedin && (
                <div className="flex items-start gap-3">
                    <Linkedin size={16} className="shrink-0 mt-1" />
                    <a href={data.contact.linkedin} target="_blank" rel="noopener noreferrer">{data.contact.linkedin.replace('https://www.','')}</a>
                </div>
             )}
          </div>
        </div>

        <div>
            <h3 className="font-semibold uppercase tracking-wider mb-4 border-b pb-2" style={{ fontSize: 'var(--cv-font-size-lg)' }}>Skills</h3>
            <div className="flex flex-col gap-2" style={{ fontSize: 'var(--cv-font-size-sm)' }}>
                {data.skills.map(skill => (
                    <span key={skill}>{skill}</span>
                ))}
            </div>
        </div>

      </aside>

      {/* Main Content */}
      <main className="w-2/3 p-10 overflow-y-auto">
        <header className="mb-10">
          <h1 className="font-bold tracking-tight text-[--cv-primary-color]" style={{ fontSize: 'var(--cv-font-size-xxl)' }}>{data.name}</h1>
          <h2 className="font-light text-gray-600 mt-2" style={{ fontSize: 'var(--cv-font-size-lg)' }}>{data.jobTitle}</h2>
        </header>

        {sectionOrder.map(sectionId => (
          <SectionContent key={sectionId} sectionId={sectionId} data={data} />
        ))}

      </main>
    </div>
  );
}
