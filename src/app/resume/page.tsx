import React from 'react';
import resumeData from './resume.json';

const Resume = () => {
    const {
        name,
        title,
        email,
        phone,
        summary,
        experience,
        education,
        skills,
    } = resumeData;

    return (
        <main className="mx-auto max-w-[768px] w-full">
            <div className="bg-white p-8 max-w-letter mx-auto print:bg-transparent">
                <header className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{name}</h1>
                    <p className="text-gray-700">{title}</p>
                    <p className="text-gray-700">
                        {email} | {phone}
                    </p>
                </header>

                <section className="mb-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Summary</h2>
                    <p className="text-gray-700">{summary}</p>
                </section>

                <section className="mb-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Experience</h2>
                    {experience.map((job, index) => (
                        <div key={index} className="mb-4">
                            <div className="grid grid-cols-[1fr_auto] border-b">
                                <h3 className="font-semibold text-gray-800">
                                    {job.jobTitle}, {job.company}
                                </h3>
                                <p className="text-gray-700">{job.duration}</p>

                            </div>
                            <ul className="list-disc list-inside text-gray-700">
                                {job.responsibilities.map((responsibility, index) => (
                                    <li key={index}>{responsibility}</li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </section>

                <section className="mb-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Education</h2>
                    {education.map((edu, index) => (
                        <div key={index} className="mb-4">
                            <h3 className="font-semibold text-gray-800">
                                {edu.degree}, {edu.field}
                            </h3>
                            <p className="text-gray-700">
                                {edu.institution}, {edu.year}
                            </p>
                        </div>
                    ))}
                </section>

                <section className="mb-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Skills</h2>
                    <ul className="list-disc list-inside text-gray-700">
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