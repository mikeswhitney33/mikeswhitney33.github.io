import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface Project {
    id: number;
    title: string;
    description: string;
    imageUrl: string;
    link: string;
}

const projects: Project[] = [
    {
        id: 1,
        title: 'Project Title 1',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec interdum lorem vel enim faucibus, non tincidunt nunc lobortis.',
        imageUrl: '/project1.jpg',
        link: 'https://example.com/project1',
    },
    {
        id: 2,
        title: 'Project Title 2',
        description: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam.',
        imageUrl: '/project2.jpg',
        link: 'https://example.com/project2',
    },
    // Add more projects here
];

const ProjectsPage = () => {
    return (
        <div className="bg-gray-100 min-h-screen py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-extrabold text-gray-900 mb-8">My Projects</h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {projects.map((project) => (
                        <div key={project.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                            <div className="aspect-w-16 aspect-h-9">
                                <Image src={project.imageUrl} alt={project.title} className="object-cover" width={640} height={360} />
                            </div>
                            <div className="p-6">
                                <h2 className="text-xl font-semibold text-gray-900 mb-2">{project.title}</h2>
                                <p className="text-gray-700 mb-4">{project.description}</p>
                                <Link href={project.link} className="text-indigo-600 hover:text-indigo-800">
                                    View Project
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ProjectsPage;