import type { CVData } from "@/types";
import React from "react";

interface TemplateProps {
  data: CVData;
}

const SectionContent = ({ sectionId, data }: { sectionId: string, data: CVData }) => {
  switch (sectionId) {
    case 'summary':
      return (
        <section className="mb-10">
          <p>{data.summary}</p>
        </section>
      );
    case 'experience':
      return (
        <section className="mb-10">
          <h3 className="text-xl font-normal tracking-wider text-gray-500 mb-6 text-center">Experience</h3>
          {data.experience.map(exp => (
            <div key={exp.id} className="mb-6 grid grid-cols-4 gap-4">
              <div className="col-span-1 text-xs text-right">
                <p className="font-semibold">{exp.company}</p>
                <p className="text-gray-500">{exp.dates}</p>
              </div>
              <div className="col-span-3">
                <h4 className="font-semibold text-base">{exp.role}</h4>
                <p>{exp.description}</p>
              </div>
            </div>
          ))}
        </section>
      );
    case 'education':
      return (
        <section className="mb-10">
          <h3 className="text-xl font-normal tracking-wider text-gray-500 mb-6 text-center">Education</h3>
          {data.education.map(edu => (
            <div key={edu.id} className="mb-4 grid grid-cols-4 gap-4">
               <div className="col-span-1 text-xs text-right">
                <p className="font-semibold">{edu.school}</p>
                <p className="text-gray-500">{edu.dates}</p>
              </div>
              <div className="col-span-3">
                <h4 className="font-semibold text-base">{edu.degree}</h4>
              </div>
            </div>
          ))}
        </section>
      );
    case 'skills':
       return (
        <section>
          <h3 className="text-xl font-normal tracking-wider text-gray-500 mb-6 text-center">Skills</h3>
          <p className="text-center text-gray-500">
            {data.skills.join(' / ')}
          </p>
        </section>
       );
    default:
      return null;
  }
}


export default function MinimalTemplate({ data }: TemplateProps) {
  const { sectionOrder = ['summary', 'experience', 'education', 'skills'] } = data;

  return (
    <div className="cv-page p-12 font-sans text-gray-700 bg-white">
      <header className="text-center mb-12">
        <h1 className="text-5xl font-light tracking-widest uppercase">{data.name}</h1>
        <h2 className="text-lg font-normal tracking-wider text-gray-500 mt-2">{data.jobTitle}</h2>
      </header>

      <div className="text-center text-xs text-gray-500 mb-12 space-x-6">
        <span>{data.contact.email}</span>
        <span>&bull;</span>
        <span>{data.contact.phone}</span>
        <span>&bull;</span>
        <span>{data.contact.website}</span>
      </div>

      <main className="text-sm leading-7">
        {sectionOrder.map((sectionId, index) => (
          <React.Fragment key={sectionId}>
            <SectionContent sectionId={sectionId} data={data} />
            {index < sectionOrder.length - 1 && <hr className="my-8" />}
          </React.Fragment>
        ))}
      </main>
    </div>
  );
}
