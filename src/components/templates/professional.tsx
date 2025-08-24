
import type { CVData } from "@/types";
import { Mail, Phone, Globe } from "lucide-react";
import React from "react";

interface TemplateProps {
  data: CVData;
}

const SectionContent = ({ sectionId, data }: { sectionId: string, data: CVData }) => {
  switch (sectionId) {
    case 'summary':
      return (
        <section>
          <h3 className="text-sm font-bold uppercase tracking-wider text-primary mb-2 border-b-2 border-primary/20 pb-1">Profile</h3>
          <p className="leading-relaxed text-gray-700">{data.summary}</p>
        </section>
      );
    case 'experience':
      return (
        <section>
          <h3 className="text-sm font-bold uppercase tracking-wider text-primary mb-3 border-b-2 border-primary/20 pb-1">Experience</h3>
          <div className="space-y-4">
            {data.experience.map(exp => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline mb-1">
                    <h4 className="text-base font-semibold">{exp.role}</h4>
                    <p className="text-xs text-gray-500 font-medium">{exp.dates}</p>
                </div>
                <p className="font-medium text-gray-600 mb-1">{exp.company}</p>
                <p className="text-gray-700 leading-normal">{exp.description}</p>
              </div>
            ))}
          </div>
        </section>
      );
    case 'education':
      return (
        <section>
          <h3 className="text-sm font-bold uppercase tracking-wider text-primary mb-3 border-b-2 border-primary/20 pb-1">Education</h3>
          <div className="space-y-3">
            {data.education.map(edu => (
              <div key={edu.id}>
                <div className="flex justify-between items-baseline">
                    <h4 className="text-base font-semibold">{edu.degree}</h4>
                    <p className="text-xs text-gray-500 font-medium">{edu.dates}</p>
                </div>
                <p className="font-medium text-gray-600">{edu.school}</p>
                {edu.description && <p className="text-gray-700 text-xs mt-1">{edu.description}</p>}
              </div>
            ))}
          </div>
        </section>
      );
    case 'volunteering':
        return data.volunteering && data.volunteering.length > 0 ? (
            <section>
                <h3 className="text-sm font-bold uppercase tracking-wider text-primary mb-3 border-b-2 border-primary/20 pb-1">Volunteering</h3>
                <div className="space-y-4">
                    {data.volunteering.map(vol => (
                        <div key={vol.id}>
                             <div className="flex justify-between items-baseline mb-1">
                                <h4 className="text-base font-semibold">{vol.role}</h4>
                                <p className="text-xs text-gray-500 font-medium">{vol.dates}</p>
                            </div>
                            <p className="font-medium text-gray-600 mb-1">{vol.organization}</p>
                            <p className="text-gray-700 leading-normal">{vol.description}</p>
                        </div>
                    ))}
                </div>
            </section>
        ) : null;
    default:
      return null;
  }
}

const AsideSectionContent = ({ sectionId, data }: { sectionId: string, data: CVData }) => {
    switch (sectionId) {
        case 'skills':
            return data.skills && data.skills.length > 0 ? (
                <section>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-primary mb-3 border-b-2 border-primary/20 pb-1">Skills</h3>
                    <div className="flex flex-col space-y-1">
                        {data.skills.map(skill => (
                            <span key={skill} className="text-gray-700">{skill}</span>
                        ))}
                    </div>
                </section>
            ) : null;
        case 'languages':
            return data.languages && data.languages.length > 0 ? (
                <section>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-primary mb-3 border-b-2 border-primary/20 pb-1">Languages</h3>
                     <div className="space-y-1">
                        {data.languages.map(lang => (
                            <div key={lang.id} className="flex justify-between items-baseline">
                                <span>{lang.name}</span>
                                <span className="text-xs text-gray-500">{lang.level}</span>
                            </div>
                        ))}
                    </div>
                </section>
            ) : null;
        case 'certifications':
            return data.certifications && data.certifications.length > 0 ? (
                <section>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-primary mb-3 border-b-2 border-primary/20 pb-1">Certifications</h3>
                    <div className="space-y-2">
                        {data.certifications.map(cert => (
                            <div key={cert.id}>
                                <p className="font-semibold">{cert.name}</p>
                                <p className="text-xs text-gray-500">{cert.issuer} ({cert.date})</p>
                            </div>
                        ))}
                    </div>
                </section>
            ) : null;
        case 'awards':
            return data.awards && data.awards.length > 0 ? (
                <section>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-primary mb-3 border-b-2 border-primary/20 pb-1">Awards</h3>
                    <div className="space-y-2">
                        {data.awards.map(award => (
                            <div key={award.id}>
                                <p className="font-semibold">{award.name}</p>
                                <p className="text-xs text-gray-500">{award.issuer} ({award.date})</p>
                            </div>
                        ))}
                    </div>
                </section>
            ) : null;
        default:
            return null;
    }
}

export default function ProfessionalTemplate({ data }: TemplateProps) {
  const { sectionOrder = ['summary', 'experience', 'education', 'skills'] } = data;

  const mainSectionIds = ['summary', 'experience', 'education', 'volunteering'];
  const asideSectionIds = ['skills', 'languages', 'certifications', 'awards'];

  const mainSections = sectionOrder.filter(id => mainSectionIds.includes(id));
  const asideSections = sectionOrder.filter(id => asideSectionIds.includes(id));

  return (
    <div className="cv-page p-8 font-sans text-sm text-gray-800 bg-white">
      <header className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight text-primary">{data.name}</h1>
        <h2 className="text-lg font-medium text-muted-foreground mt-1">{data.jobTitle}</h2>
      </header>
      
      <main className="grid grid-cols-3 gap-x-12">
        <div className="col-span-2 space-y-6">
          {mainSections.map(sectionId => (
            <SectionContent key={sectionId} sectionId={sectionId} data={data} />
          ))}
        </div>

        <aside className="col-span-1 space-y-6">
            <section>
                <h3 className="text-sm font-bold uppercase tracking-wider text-primary mb-3 border-b-2 border-primary/20 pb-1">Contact</h3>
                <div className="space-y-2 text-xs">
                    <p className="flex items-center gap-2"><Mail size={12}/> {data.contact.email}</p>
                    <p className="flex items-center gap-2"><Phone size={12}/> {data.contact.phone}</p>
                    <p className="flex items-center gap-2"><Globe size={12}/> {data.contact.website}</p>
                </div>
            </section>
            {asideSections.map(sectionId => (
                <AsideSectionContent key={sectionId} sectionId={sectionId} data={data} />
            ))}
        </aside>
      </main>
    </div>
  );
}
