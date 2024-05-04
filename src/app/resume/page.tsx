import React from "react";
import resumeData from "./resume.json";

const Resume = () => {
  const { name, title, email, phone, summary, experience, education, skills } =
    resumeData;

  return (
    <main className="mx-auto max-w-[768px] w-full mt-5 ">
      <div className="bg-light-blue rounded-lg p-8 max-w-letter mx-auto print:bg-transparent print:text-black">
        <header className="mb-6">
          <h1 className="text-3xl font-bold text-navy-blue print:text-black mb-2">{name}</h1>
          <p className="text-midnight-blue print:text-black">{title}</p>
          <p className="text-midnight-blue print:text-black">
            {email} | {phone}
          </p>
        </header>

        <section className="mb-6">
          <h2 className="text-xl font-semibold text-navy-blue print:text-black mb-2">Summary</h2>
          <p className="text-midnight-blue print:text-black">{summary}</p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold text-navy-blue print:text-black mb-2">
            Experience
          </h2>
          {experience.map((job, index) => (
            <div key={index} className="mb-4">
              <div className="grid grid-cols-[auto_1fr_auto] border-navy-blue print:text-black">
                <div>
                  <h3 className="font-semibold text-midnight-blue print:text-black">
                    {job.jobTitle}, {job.company}
                  </h3>

                </div>
                <hr className="self-end  border-midnight-blue print:border-black print:border-b-2 border-dotted"/>

                <p className="text-midnight-blue print:text-black">{job.duration}</p>
              </div>
              <ul className="list-disc list-inside text-midnight-blue print:text-black">
                {job.responsibilities.map((responsibility, index) => (
                  <li key={index}>{responsibility}</li>
                ))}
              </ul>
            </div>
          ))}
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold text-navy-blue print:text-black mb-2">
            Education
          </h2>
          {education.map((edu, index) => (
            <div key={index} className="mb-4">
              <h3 className="font-semibold text-midnight-blue print:text-black">
                {edu.degree}, {edu.field}
              </h3>
              <p className="text-midnight-blue print:text-black">
                {edu.institution}, {edu.year}
              </p>
            </div>
          ))}
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold text-navy-blue print:text-black mb-2">Skills</h2>
          <ul className="list-disc list-inside text-midnight-blue print:text-black">
            {skills.map((skill, index) => (
              <li key={index}>{skill}</li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  );
};

export default Resume;
