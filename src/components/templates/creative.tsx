import type { CVData } from "@/types";
import { Mail, Phone, Globe } from "lucide-react";
import Image from "next/image";

interface TemplateProps {
  data: CVData;
}

export default function CreativeTemplate({ data }: TemplateProps) {
  return (
    <div className="w-full h-full bg-white text-gray-800 flex font-sans">
      {/* Left Sidebar */}
      <aside className="w-1/3 bg-accent text-accent-foreground p-8 flex flex-col justify-center items-center text-center">
        <Image 
          src="https://placehold.co/150x150.png" 
          alt={data.name} 
          width={150} 
          height={150} 
          className="rounded-full border-4 border-white/50 shadow-lg mb-4"
          data-ai-hint="person portrait"
        />
        <h1 className="text-4xl font-bold tracking-tight">{data.name}</h1>
        <h2 className="text-lg font-light text-accent-foreground/80 mt-1">{data.jobTitle}</h2>
      </aside>

      {/* Main Content */}
      <main className="w-2/3 p-10 overflow-y-auto">
        <section className="mb-8">
          <h3 className="text-xl font-bold uppercase tracking-wider text-primary mb-3">Profile</h3>
          <p className="text-sm leading-relaxed text-gray-600">{data.summary}</p>
        </section>

        <section className="mb-8">
          <h3 className="text-xl font-bold uppercase tracking-wider text-primary mb-4">Experience</h3>
          <div className="space-y-5">
            {data.experience.map(exp => (
              <div key={exp.id} className="relative pl-5">
                 <div className="absolute w-2.5 h-2.5 bg-primary rounded-full -left-[5px] top-1.5 border-2 border-white"></div>
                <p className="text-xs text-gray-500 font-medium tracking-wider">{exp.dates}</p>
                <h4 className="text-lg font-semibold text-gray-800">{exp.role}</h4>
                <p className="font-medium text-gray-600">{exp.company}</p>
                <p className="text-sm text-gray-600 mt-1">{exp.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-8">
          <h3 className="text-xl font-bold uppercase tracking-wider text-primary mb-4">Education</h3>
          <div className="space-y-4">
            {data.education.map(edu => (
              <div key={edu.id}>
                <h4 className="text-lg font-semibold">{edu.degree}</h4>
                <p className="font-medium text-gray-600">{edu.school}</p>
                <p className="text-xs text-gray-500 mt-0.5">{edu.dates}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-8">
            <h3 className="text-xl font-bold uppercase tracking-wider text-primary mb-4">Skills</h3>
            <div className="flex flex-wrap gap-2">
                {data.skills.map(skill => (
                    <span key={skill} className="bg-primary/10 text-primary font-medium text-xs py-1 px-3 rounded-full">{skill}</span>
                ))}
            </div>
        </section>
        
        <section>
             <h3 className="text-xl font-bold uppercase tracking-wider text-primary mb-4">Contact</h3>
             <div className="flex justify-between text-sm text-gray-600">
                <p className="flex items-center gap-2"><Mail size={14}/> {data.contact.email}</p>
                <p className="flex items-center gap-2"><Phone size={14}/> {data.contact.phone}</p>
                <p className="flex items-center gap-2"><Globe size={14}/> {data.contact.website}</p>
             </div>
        </section>
      </main>
    </div>
  );
}
