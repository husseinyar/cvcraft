
import type { CVData } from "@/types";
import { Mail, Phone, Globe } from "lucide-react";
import React from "react";

interface TemplateProps {
  data: CVData;
}

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <section className="mb-6 break-inside-avoid">
        <h3 className="text-sm font-bold uppercase tracking-widest text-white/60 mb-3">{title}</h3>
        <div className="space-y-4 text-sm">{children}</div>
    </section>
);

const MainSectionContent = ({ sectionId, data }: { sectionId: string, data: CVData }) => {
  switch(sectionId) {
    case 'summary':
      return data.summary ? (
        <Section title="Profile">
          <p className="text-sm leading-relaxed text-white/80">{data.summary}</p>
        </Section>
      ) : null;
    case 'experience':
      return data.experience?.length > 0 ? (
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
      ) : null;
    case 'education':
      return data.education?.length > 0 ? (
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
      ) : null;
    case 'volunteering':
        return data.volunteering && data.volunteering.length > 0 ? (
            <Section title="Volunteering">
                <div className="space-y-4">
                    {data.volunteering.map(vol => (
                        <div key={vol.id}>
                            <div className="flex justify-between items-baseline mb-1">
                                <h4 className="text-base font-semibold">{vol.role}</h4>
                                <p className="text-xs text-white/50">{vol.dates}</p>
                            </div>
                            <p className="font-medium text-white/70 mb-1">{vol.organization}</p>
                            <p className="text-white/80 text-xs">{vol.description}</p>
                        </div>
                    ))}
                </div>
            </Section>
        ) : null;
    default:
      return null;
  }
};

const SidebarSectionContent = ({ sectionId, data }: { sectionId: string, data: CVData }) => {
  switch(sectionId) {
      case 'contact':
        return (
          <Section title="Contact">
            <div className="space-y-3 text-sm">
                <p className="flex items-center gap-3 text-white/80"><Mail size={14}/> {data.contact.email}</p>
                <p className="flex items-center gap-3 text-white/80"><Phone size={14}/> {data.contact.phone}</p>
                <p className="flex items-center gap-3 text-white/80"><Globe size={14}/> {data.contact.website}</p>
            </div>
          </Section>
        );
      case 'skills':
         return data.skills?.length > 0 ? (
            <Section title="Skills">
                <div className="flex flex-col space-y-1 text-sm">
                    {data.skills.map(skill => (
                        <span key={skill} className="text-white/80">{skill}</span>
                    ))}
                </div>
            </Section>
          ) : null;
      case 'languages':
        return data.languages && data.languages.length > 0 ? (
            <Section title="Languages">
                <div className="space-y-2">
                    {data.languages.map(lang => (
                        <div key={lang.id} className="flex justify-between items-baseline text-white/80">
                            <span>{lang.name}</span>
                            <span className="text-xs text-white/60">{lang.level}</span>
                        </div>
                    ))}
                </div>
            </Section>
        ) : null;
      case 'certifications':
        return data.certifications && data.certifications.length > 0 ? (
            <Section title="Certifications">
                 <div className="space-y-3">
                    {data.certifications.map(cert => (
                        <div key={cert.id} className="text-white/80">
                            <p className="font-semibold">{cert.name}</p>
                            <p className="text-xs text-white/60">{cert.issuer} ({cert.date})</p>
                        </div>
                    ))}
                </div>
            </Section>
        ) : null;
       case 'awards':
        return data.awards && data.awards.length > 0 ? (
            <Section title="Awards">
                <div className="space-y-3">
                    {data.awards.map(award => (
                        <div key={award.id} className="text-white/80">
                            <p className="font-semibold">{award.name}</p>
                            <p className="text-xs text-white/60">{award.issuer} ({award.date})</p>
                        </div>
                    ))}
                </div>
            </Section>
        ) : null;
      default:
        return null;
  }
}

export default function OnyxTemplate({ data }: TemplateProps) {
  const { sectionOrder = ['summary', 'experience', 'education', 'skills'] } = data;
  const mainSections = sectionOrder.filter(s => ['summary', 'experience', 'education', 'volunteering'].includes(s));
  const sidebarSections = sectionOrder.filter(s => !mainSections.includes(s));
  
  if (!sidebarSections.includes('contact')) sidebarSections.unshift('contact');


  return (
    <div className="cv-page bg-[#1A1A1A] text-white font-sans flex flex-col md:flex-row">
      <main className="w-full md:w-2/3 p-8">
        <header className="mb-8">
            <h1 className="text-4xl lg:text-5xl font-bold tracking-tight text-white">{data.name.toUpperCase()}</h1>
            <h2 className="text-lg font-light text-white/80 mt-1">{data.jobTitle}</h2>
        </header>
        
        {mainSections.map(sectionId => (
          <MainSectionContent key={sectionId} sectionId={sectionId} data={data} />
        ))}
      </main>

      <aside className="w-full md:w-1/3 bg-[#121212] p-8">
        {sidebarSections.map(sectionId => (
          <SidebarSectionContent key={sectionId} sectionId={sectionId} data={data} />
        ))}
      </aside>
    </div>
  );
}
