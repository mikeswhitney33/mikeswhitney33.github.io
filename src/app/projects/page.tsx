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
        title: 'Board Game Arena',
        description: '"Board Game Arena" is a comprehensive Python project that combines the joy of classic board games with the thrill of playing against intelligent computer opponents. This project offers a collection of meticulously crafted implementations of popular board games such as Tic-Tac-Toe, Connect Four, and Reversi (also known as Othello).',
        imageUrl: '/images/reversi.png',
        link: 'https://github.com/mikeswhitney33/board-game-arena',
    },
    // Add more projects here
];

const ProjectsPage = () => {
    return (
      <div className="bg-powder-blue min-h-screen py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-extrabold text-navy-blue mb-8">My Projects</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
              <div key={project.id} className="bg-light-blue rounded-lg shadow-md overflow-hidden">
                <div className="aspect-w-16 aspect-h-9">
                  <Image src={project.imageUrl} alt={project.title} className="object-cover" width={640} height={360} />
                </div>
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-navy-blue mb-2">{project.title}</h2>
                  <p className="text-midnight-blue mb-4">{project.description}</p>
                  <Link href={project.link} className="text-royal-blue hover:text-navy-blue">
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