import type { CVData } from "@/types";
import { Mail, Phone, Globe } from "lucide-react";

interface TemplateProps {
  data: CVData;
}

export default function ProfessionalTemplate({ data }: TemplateProps) {
  return (
    <div className="w-full h-full bg-white text-gray-800 p-8 font-sans text-sm">
      <header className="text-center mb-8 border-b pb-4">
        <h1 className="text-4xl font-bold tracking-tight text-primary">{data.name}</h1>
        <h2 className="text-lg font-medium text-muted-foreground mt-1">{data.jobTitle}</h2>
        <div className="flex justify-center gap-6 mt-4 text-xs text-muted-foreground">
          <p className="flex items-center gap-2"><Mail size={12}/> {data.contact.email}</p>
          <p className="flex items-center gap-2"><Phone size={12}/> {data.contact.phone}</p>
          <p className="flex items-center gap-2"><Globe size={12}/> {data.contact.website}</p>
        </div>
      </header>
      
      <main className="space-y-6">
        <section>
          <h3 className="text-sm font-bold uppercase tracking-wider text-primary mb-2 border-b-2 border-primary/20 pb-1">Profile</h3>
          <p className="leading-relaxed text-gray-700">{data.summary}</p>
        </section>

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

        <section>
            <h3 className="text-sm font-bold uppercase tracking-wider text-primary mb-3 border-b-2 border-primary/20 pb-1">Skills</h3>
            <div className="flex flex-wrap gap-2">
                {data.skills.map(skill => (
                    <span key={skill} className="bg-primary/10 text-primary font-medium text-xs py-1 px-3 rounded-full">{skill}</span>
                ))}
            </div>
        </section>
      </main>
    </div>
  );
}
