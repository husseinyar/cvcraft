import type { CVData } from "@/types";
import { Mail, Phone, Globe } from "lucide-react";
import Image from "next/image";

interface TemplateProps {
  data: CVData;
}

export default function CreativeTemplate({ data }: TemplateProps) {
  return (
    <div className="w-full h-full bg-white text-gray-800 p-6 flex gap-6 font-sans">
      <aside className="w-1/3 bg-primary/10 p-6 rounded-lg flex flex-col items-center text-center">
        <Image 
          src="https://placehold.co/150x150.png" 
          alt={data.name} 
          width={150} 
          height={150} 
          className="rounded-full border-4 border-white shadow-lg -mt-16 mb-4"
          data-ai-hint="person portrait"
        />
        <h1 className="text-3xl font-bold text-primary">{data.name}</h1>
        <h2 className="text-lg font-medium text-primary/80 mb-6">{data.jobTitle}</h2>
        
        <div className="w-full text-left space-y-4 text-sm">
            <h3 className="font-bold text-accent text-lg border-b-2 border-accent/30 pb-1">Contact</h3>
            <p className="flex items-center gap-2 text-primary/90"><Mail size={14}/> {data.contact.email}</p>
            <p className="flex items-center gap-2 text-primary/90"><Phone size={14}/> {data.contact.phone}</p>
            <p className="flex items-center gap-2 text-primary/90"><Globe size={14}/> {data.contact.website}</p>

            <h3 className="font-bold text-accent text-lg border-b-2 border-accent/30 pb-1 pt-4">Skills</h3>
            <div className="flex flex-wrap gap-2">
                {data.skills.map(skill => (
                    <span key={skill} className="bg-accent/20 text-accent-foreground text-xs py-1 px-2 rounded-full">{skill}</span>
                ))}
            </div>
        </div>
      </aside>

      <main className="w-2/3 py-6 pr-6">
        <section className="mb-6">
          <h3 className="text-2xl font-bold text-primary mb-2">Profile</h3>
          <p className="text-sm leading-relaxed text-gray-700">{data.summary}</p>
        </section>

        <section className="mb-6">
          <h3 className="text-2xl font-bold text-primary mb-3">Work Experience</h3>
          <div className="space-y-4">
            {data.experience.map(exp => (
              <div key={exp.id} className="relative pl-4 border-l-2 border-accent">
                <div className="absolute w-3 h-3 bg-accent rounded-full -left-[7px] top-1.5"></div>
                <p className="text-xs text-gray-500">{exp.dates}</p>
                <h4 className="text-lg font-semibold">{exp.role}</h4>
                <p className="font-medium text-gray-600">{exp.company}</p>
                <p className="text-sm text-gray-700 mt-1">{exp.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h3 className="text-2xl font-bold text-primary mb-3">Education</h3>
          <div className="space-y-3">
            {data.education.map(edu => (
              <div key={edu.id}>
                <p className="text-xs text-gray-500">{edu.dates}</p>
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
