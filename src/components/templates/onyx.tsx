
import type { CVData, Experience, Education } from "@/types";

interface TemplateProps {
  data: CVData;
}

const ITEMS_PER_PAGE = 5; // Adjust this based on average content length

const Page = ({ children }: { children: React.ReactNode }) => (
    <div className="cv-page w-full h-full bg-[#121417] text-white p-10 font-sans text-sm aspect-[8.5/11]">
        {children}
    </div>
);

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <section className="mb-6">
        <h3 className="text-center text-lg font-light tracking-[0.2em] uppercase mb-4">{title}</h3>
        <hr className="border-t-2 border-white/20 w-16 mx-auto mb-6" />
        <div className="space-y-5">{children}</div>
    </section>
);

const ExperienceItem = ({ exp }: { exp: Experience }) => (
    <div className="grid grid-cols-12 gap-4">
        <div className="col-span-3 text-xs text-white/60">
            <p className="font-bold">{exp.role}</p>
            <p>{exp.company}</p>
            <p>{exp.dates}</p>
        </div>
        <div className="col-span-9">
            <h4 className="font-semibold text-base">{exp.role}</h4>
            <p className="text-white/80 text-xs leading-relaxed">{exp.description}</p>
        </div>
    </div>
);

const EducationItem = ({ edu }: { edu: Education }) => (
     <div className="grid grid-cols-12 gap-4">
        <div className="col-span-3 text-xs text-white/60">
            <p className="font-bold">{edu.school}</p>
            <p>{edu.dates}</p>
        </div>
        <div className="col-span-9">
            <h4 className="font-semibold text-base">{edu.degree}</h4>
        </div>
    </div>
);


export default function OnyxTemplate({ data }: TemplateProps) {
  const allItems: (Experience | Education)[] = [...data.experience, ...data.education];
  const totalItems = allItems.length;

  const pages = [];
  let currentPageItems = [];
  let itemCountOnPage = 0;

  // Header and summary are on the first page
  const headerAndSummary = (
    <>
      <header className="text-center mb-8">
        <h1 className="text-5xl font-light tracking-[0.2em] uppercase">{data.name}</h1>
        <h2 className="text-lg font-light tracking-wider text-white/70 mt-2">{data.jobTitle}</h2>
      </header>
      <div className="text-center text-xs text-white/50 mb-8 space-x-6">
        <span>{data.contact.email}</span>
        <span>&bull;</span>
        <span>{data.contact.phone}</span>
        <span>&bull;</span>
        <span>{data.contact.website}</span>
      </div>
      <p className="text-center text-white/80 text-xs leading-relaxed mb-8">{data.summary}</p>
    </>
  );
  
  // A rough estimate for header height
  itemCountOnPage += 2; 

  let experienceLeft = [...data.experience];
  let educationLeft = [...data.education];

  let pageIndex = 0;
  while (experienceLeft.length > 0 || educationLeft.length > 0) {
    let experienceForPage = [];
    let educationForPage = [];
    itemCountOnPage = pageIndex === 0 ? 2 : 0; // Reset for new pages, account for header on page 1

    while (itemCountOnPage < ITEMS_PER_PAGE && experienceLeft.length > 0) {
      experienceForPage.push(experienceLeft.shift()!);
      itemCountOnPage++;
    }

    while (itemCountOnPage < ITEMS_PER_PAGE && educationLeft.length > 0) {
        educationForPage.push(educationLeft.shift()!);
        itemCountOnPage++;
    }
    
    pages.push(
        <Page key={`page-${pageIndex}`}>
            {pageIndex === 0 && headerAndSummary}
            
            {experienceForPage.length > 0 && (
                <Section key="experience-section" title="Experience">
                    {experienceForPage.map(exp => <ExperienceItem key={exp.id} exp={exp} />)}
                </Section>
            )}

            {educationForPage.length > 0 && (
                 <Section key="education-section" title="Education">
                    {educationForPage.map(edu => <EducationItem key={edu.id} edu={edu} />)}
                </Section>
            )}

            {/* Render Skills on the last page */}
            {experienceLeft.length === 0 && educationLeft.length === 0 && (
                 <div className="absolute bottom-10 left-10 right-10">
                    <Section key="skills-section" title="Skills">
                        <p className="text-center text-white/60 text-xs">
                            {data.skills.join(' / ')}
                        </p>
                    </Section>
                </div>
            )}
        </Page>
    );
    pageIndex++;
  }

  // Handle case where there's no experience or education
  if (pages.length === 0) {
     pages.push(
        <Page key={`page-0`}>
            {headerAndSummary}
             <div className="absolute bottom-10 left-10 right-10">
                <Section key="skills-section" title="Skills">
                    <p className="text-center text-white/60 text-xs">
                        {data.skills.join(' / ')}
                    </p>
                </Section>
            </div>
        </Page>
     );
  }

  return <div className="w-full">{pages}</div>;
}
