import type { CVData } from "@/types";
import { Mail, Phone, Globe } from "lucide-react";
import Image from "next/image";

interface TemplateProps {
  data: CVData;
}

export default function HarvardTemplate({ data }: TemplateProps) {
  return (
    <div className="w-full h-full bg-white text-gray-800 flex font-sans">
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
          <h1 className="text-4xl font-bold tracking-tight">{data.name.split(' ')[0]}<br/>{data.name.split(' ').slice(1).join(' ')}</h1>
          <h2 className="text-lg font-light text-primary-foreground/80 mt-2 pb-6 border-b-2 border-primary-foreground/20">{data.jobTitle}</h2>
          
          <div className="mt-8 space-y-4 text-sm">
             <div className="flex items-center gap-3">
                <Mail size={16} className="shrink-0" />
                <span>{data.contact.email}</span>
             </div>
             <div className="flex items-center gap-3">
                <Phone size={16} className="shrink-0" />
                <span>{data.contact.phone}</span>
             </div>
             <div className="flex items-center gap-3">
                <Globe size={16} className="shrink-0" />
                <span>{data.contact.website}</span>
             </div>
          </div>
        </div>

        <div>
            <h3 className="text-xl font-semibold uppercase tracking-wider mb-4">Skills</h3>
            <div className="flex flex-col gap-2 text-sm">
                {data.skills.map(skill => (
                    <span key={skill}>{skill}</span>
                ))}
            </div>
        </div>

      </aside>

      {/* Main Content */}
      <main className="w-2/3 p-10 overflow-y-auto">
        <section className="mb-10">
          <h3 className="text-2xl font-bold uppercase tracking-wider text-primary mb-4">Profile</h3>
          <p className="text-sm leading-relaxed text-gray-600">{data.summary}</p>
        </section>

        <section className="mb-10">
          <h3 className="text-2xl font-bold uppercase tracking-wider text-primary mb-6">Experience</h3>
          <div className="space-y-6">
            {data.experience.map(exp => (
              <div key={exp.id}>
                <p className="text-xs text-gray-500 font-medium tracking-wider mb-1">{exp.dates}</p>
                <h4 className="text-lg font-semibold text-gray-800">{exp.role}</h4>
                <p className="font-medium text-gray-600">{exp.company}</p>
                <p className="text-sm text-gray-600 mt-2 leading-relaxed">{exp.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h3 className="text-2xl font-bold uppercase tracking-wider text-primary mb-6">Education</h3>
          <div className="space-y-5">
            {data.education.map(edu => (
              <div key={edu.id}>
                 <p className="text-xs text-gray-500 font-medium tracking-wider mb-1">{edu.dates}</p>
                <h4 className="text-lg font-semibold">{edu.degree}</h4>
                <p className="font-medium text-gray-600">{edu.school}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
