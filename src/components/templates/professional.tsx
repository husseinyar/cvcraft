import type { CVData } from "@/types";
import { Mail, Phone, Globe } from "lucide-react";
import Image from "next/image";

interface TemplateProps {
  data: CVData;
}

export default function ProfessionalTemplate({ data }: TemplateProps) {
  return (
    <div className="w-full h-full bg-white text-gray-800 p-8 flex font-sans">
      <div className="w-1/3 pr-8 border-r border-gray-200">
        <div className="flex flex-col items-center text-center">
            <Image 
              src="https://placehold.co/150x150.png" 
              alt={data.name} 
              width={128} 
              height={128} 
              className="rounded-full mb-4"
              data-ai-hint="person portrait"
            />
            <h1 className="text-2xl font-bold text-gray-800">{data.name}</h1>
            <h2 className="text-md text-gray-600 mb-6">{data.jobTitle}</h2>
        </div>

        <section className="mb-6">
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">Details</h3>
             <div className="space-y-2 text-sm text-gray-600">
                <p className="flex items-center gap-2"><Mail size={14}/> {data.contact.email}</p>
                <p className="flex items-center gap-2"><Phone size={14}/> {data.contact.phone}</p>
                <p className="flex items-center gap-2"><Globe size={14}/> {data.contact.website}</p>
            </div>
        </section>

        <section className="mb-6">
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">Skills</h3>
            <div className="flex flex-wrap gap-2">
                {data.skills.map(skill => (
                    <span key={skill} className="bg-gray-100 text-gray-700 text-xs py-1 px-2 rounded-md">{skill}</span>
                ))}
            </div>
        </section>

         <section>
          <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">Education</h3>
          <div className="space-y-4">
            {data.education.map(edu => (
              <div key={edu.id}>
                <h4 className="font-semibold text-md">{edu.degree}</h4>
                <p className="text-sm text-gray-600">{edu.school}</p>
                <p className="text-xs text-gray-400 mt-1">{edu.dates}</p>
              </div>
            ))}
          </div>
        </section>

      </div>
      <div className="w-2/3 pl-8">
        <section className="mb-8">
          <h3 className="text-xl font-bold text-gray-800 mb-3 border-b-2 border-gray-200 pb-2">Profile</h3>
          <p className="text-sm leading-relaxed text-gray-700">{data.summary}</p>
        </section>

        <section>
          <h3 className="text-xl font-bold text-gray-800 mb-3 border-b-2 border-gray-200 pb-2">Experience</h3>
          <div className="space-y-6">
            {data.experience.map(exp => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline">
                    <h4 className="text-lg font-semibold">{exp.role}</h4>
                    <p className="text-xs text-gray-500">{exp.dates}</p>
                </div>
                <p className="font-medium text-gray-600 mb-1">{exp.company}</p>
                <p className="text-sm text-gray-700 leading-normal">{exp.description}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}