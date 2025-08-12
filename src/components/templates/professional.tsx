import type { CVData } from "@/types";
import { Mail, Phone, Globe } from "lucide-react";

interface TemplateProps {
  data: CVData;
}

export default function ProfessionalTemplate({ data }: TemplateProps) {
  return (
    <div className="w-full h-full bg-white text-[#1f2937] p-8 font-serif text-sm">
      <header className="text-center border-b-2 border-gray-300 pb-4 mb-6">
        <h1 className="text-4xl font-bold tracking-wider text-primary">{data.name}</h1>
        <h2 className="text-xl font-medium text-gray-600 mt-1">{data.jobTitle}</h2>
      </header>

      <div className="grid grid-cols-3 gap-8">
        <aside className="col-span-1">
          <section>
            <h3 className="text-lg font-bold text-primary border-b border-gray-200 pb-1 mb-3 uppercase tracking-wider">Contact</h3>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-2"><Mail size={14} /><span>{data.contact.email}</span></li>
              <li className="flex items-center gap-2"><Phone size={14} /><span>{data.contact.phone}</span></li>
              <li className="flex items-center gap-2"><Globe size={14} /><span>{data.contact.website}</span></li>
            </ul>
          </section>

          <section className="mt-6">
            <h3 className="text-lg font-bold text-primary border-b border-gray-200 pb-1 mb-3 uppercase tracking-wider">Education</h3>
            {data.education.map(edu => (
              <div key={edu.id} className="mb-3">
                <h4 className="font-bold">{edu.degree}</h4>
                <p className="font-medium text-gray-700">{edu.school}</p>
                <p className="text-xs text-gray-500">{edu.dates}</p>
              </div>
            ))}
          </section>
          
          <section className="mt-6">
            <h3 className="text-lg font-bold text-primary border-b border-gray-200 pb-1 mb-3 uppercase tracking-wider">Skills</h3>
            <ul className="flex flex-wrap gap-2 text-xs">
              {data.skills.map(skill => (
                <li key={skill} className="bg-gray-200 text-gray-800 py-1 px-2 rounded">{skill}</li>
              ))}
            </ul>
          </section>
        </aside>

        <main className="col-span-2">
          <section>
            <h3 className="text-lg font-bold text-primary border-b border-gray-200 pb-1 mb-3 uppercase tracking-wider">Summary</h3>
            <p className="text-gray-700 leading-relaxed text-sm">{data.summary}</p>
          </section>

          <section className="mt-6">
            <h3 className="text-lg font-bold text-primary border-b border-gray-200 pb-1 mb-3 uppercase tracking-wider">Experience</h3>
            {data.experience.map(exp => (
              <div key={exp.id} className="mb-4">
                <div className="flex justify-between items-baseline">
                  <h4 className="text-md font-bold">{exp.role}</h4>
                  <p className="text-xs text-gray-500">{exp.dates}</p>
                </div>
                <p className="font-medium text-gray-700">{exp.company}</p>
                <p className="text-sm text-gray-600 mt-1 leading-normal">{exp.description}</p>
              </div>
            ))}
          </section>
        </main>
      </div>
    </div>
  );
}
