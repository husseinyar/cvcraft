import type { CVData } from "@/types";

interface TemplateProps {
  data: CVData;
}

export default function PrincetonTemplate({ data }: TemplateProps) {
  return (
    <div className="cv-page bg-white text-gray-700 p-12 font-sans">
      <header className="text-center mb-12">
        <h1 className="font-light tracking-widest uppercase" style={{ fontSize: 'var(--cv-font-size-xxl)' }}>{data.name}</h1>
        <h2 className="font-normal tracking-wider text-gray-500 mt-2" style={{ fontSize: 'var(--cv-font-size-xl)' }}>{data.jobTitle}</h2>
      </header>

      <div className="text-center text-gray-500 mb-12 space-x-6" style={{ fontSize: 'var(--cv-font-size-sm)' }}>
        <span>{data.contact.email}</span>
        <span>&bull;</span>
        <span>{data.contact.phone}</span>
        <span>&bull;</span>
        <span>{data.contact.website}</span>
      </div>

      <main className="leading-7" style={{ fontSize: 'var(--cv-font-size-base)' }}>
        <section className="mb-10">
          <p>{data.summary}</p>
        </section>

        <hr className="my-8" />

        <section className="mb-10">
          <h3 className="font-normal tracking-wider text-gray-500 mb-6 text-center" style={{ fontSize: 'var(--cv-font-size-xl)' }}>Experience</h3>
          {data.experience.map(exp => (
            <div key={exp.id} className="mb-6 grid grid-cols-4 gap-4">
              <div className="col-span-1 text-right" style={{ fontSize: 'var(--cv-font-size-sm)' }}>
                <p className="font-semibold">{exp.company}</p>
                <p className="text-gray-500">{exp.dates}</p>
              </div>
              <div className="col-span-3">
                <h4 className="font-semibold" style={{ fontSize: 'var(--cv-font-size-lg)' }}>{exp.role}</h4>
                <p>{exp.description}</p>
              </div>
            </div>
          ))}
        </section>

        <hr className="my-8" />

        <section className="mb-10">
          <h3 className="font-normal tracking-wider text-gray-500 mb-6 text-center" style={{ fontSize: 'var(--cv-font-size-xl)' }}>Education</h3>
          {data.education.map(edu => (
            <div key={edu.id} className="mb-4 grid grid-cols-4 gap-4">
               <div className="col-span-1 text-right" style={{ fontSize: 'var(--cv-font-size-sm)' }}>
                <p className="font-semibold">{edu.school}</p>
                <p className="text-gray-500">{edu.dates}</p>
              </div>
              <div className="col-span-3">
                <h4 className="font-semibold" style={{ fontSize: 'var(--cv-font-size-lg)' }}>{edu.degree}</h4>
              </div>
            </div>
          ))}
        </section>
        
        <hr className="my-8" />

        <section>
          <h3 className="font-normal tracking-wider text-gray-500 mb-6 text-center" style={{ fontSize: 'var(--cv-font-size-xl)' }}>Skills</h3>
          <p className="text-center text-gray-500">
            {data.skills.join(' / ')}
          </p>
        </section>
      </main>
    </div>
  );
}
