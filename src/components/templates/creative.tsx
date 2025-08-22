import type { CVData } from "@/types";
import { Mail, Phone, Globe } from "lucide-react";
import Image from "next/image";

interface TemplateProps {
  data: CVData;
}

const SectionContent = ({ sectionId, data }: { sectionId: string, data: CVData }) => {
  switch (sectionId) {
    case 'summary':
      return (
        <section className="mb-10">
          <p className="text-sm leading-relaxed text-gray-600 border-l-4 border-primary pl-4">{data.summary}</p>
        </section>
      );
    case 'experience':
      return (
        <section className="mb-10">
          <h3 className="text-2xl font-bold uppercase tracking-wider text-primary mb-6">Work Experience</h3>
          <div className="space-y-6">
            {data.experience.map((exp) => (
              <div key={exp.id} className="relative pl-6 before:absolute before:left-0 before:top-2 before:h-2 before:w-2 before:bg-primary before:rounded-full">
                <p className="text-xs text-gray-500 font-medium tracking-wider mb-1">{exp.dates}</p>
                <h4 className="text-lg font-semibold text-gray-800">{exp.role}</h4>
                <p className="font-medium text-gray-600">{exp.company}</p>
                <p className="text-sm text-gray-600 mt-2 leading-relaxed">{exp.description}</p>
              </div>
            ))}
          </div>
        </section>
      );
    case 'education':
      return (
        <section>
          <h3 className="text-2xl font-bold uppercase tracking-wider text-primary mb-6">Education</h3>
          <div className="space-y-5">
            {data.education.map((edu) => (
              <div key={edu.id} className="relative pl-6 before:absolute before:left-0 before:top-2 before:h-2 before:w-2 before:bg-primary before:rounded-full">
                 <p className="text-xs text-gray-500 font-medium tracking-wider mb-1">{edu.dates}</p>
                <h4 className="text-lg font-semibold">{edu.degree}</h4>
                <p className="font-medium text-gray-600">{edu.school}</p>
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
    <div className="a4-container flex font-sans text-gray-800">
      {/* Left Sidebar */}
      <aside className="w-1/3 bg-primary text-primary-foreground p-8 flex flex-col justify-between">
        <div>
          <Image
            src="https://placehold.co/150x150.png"
            alt={data.name}
            width={150}
            height={150}
            className="rounded-full border-4 border-white/50 shadow-lg mb-6"
            data-ai-hint="person portrait"
          />
          <h3 className="text-xl font-semibold uppercase tracking-wider mb-4 border-b pb-2">Personal Details</h3>
          <div className="mt-4 space-y-4 text-sm">
             <div className="flex items-start gap-3">
                <Mail size={16} className="shrink-0 mt-1" />
                <span>{data.contact.email}</span>
             </div>
             <div className="flex items-start gap-3">
                <Phone size={16} className="shrink-0 mt-1" />
                <span>{data.contact.phone}</span>
             </div>
             <div className="flex items-start gap-3">
                <Globe size={16} className="shrink-0 mt-1" />
                <span>{data.contact.website}</span>
             </div>
          </div>
        </div>

        <div>
            <h3 className="text-xl font-semibold uppercase tracking-wider mb-4 border-b pb-2">Skills</h3>
            <div className="flex flex-col gap-2 text-sm">
                {data.skills.map(skill => (
                    <span key={skill}>{skill}</span>
                ))}
            </div>
        </div>

      </aside>

      {/* Main Content */}
      <main className="w-2/3 p-10 overflow-y-auto">
        <header className="mb-10">
          <h1 className="text-5xl font-bold tracking-tight text-primary">{data.name}</h1>
          <h2 className="text-xl font-light text-gray-600 mt-2">{data.jobTitle}</h2>
        </header>

        {sectionOrder.map(sectionId => (
          <SectionContent key={sectionId} sectionId={sectionId} data={data} />
        ))}

      </main>
    </div>
  );
}
