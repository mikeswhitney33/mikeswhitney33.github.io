import Image from "next/image";
import Link from "next/link";

const ENGINEER_NAME = "Mike Whitney"


function ClaudeHomePage() {
    return (
        <div className="bg-gray-100 min-h-screen flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
                <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
                    <span className="block">{ENGINEER_NAME}</span>
                    <span className="block text-indigo-600">Visionary Software Engineer</span>
                </h1>
                <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
                    Unlock the future of technology with innovative solutions in computer vision, artificial intelligence, and immersive gaming experiences.
                </p>
                <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
                    <div className="rounded-md shadow">
                        <Link
                            href="/projects"
                            className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10"
                        >
                            View My Projects
                        </Link>
                    </div>
                </div>
            </div>

            <div className="mt-10 max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                    <h3 className="text-xl font-semibold text-gray-900">Computer Vision</h3>
                    <p className="mt-2 text-gray-500">
                        Transform visual data into actionable insights through advanced image recognition, object tracking, and perception algorithms.
                    </p>
                </div>
                <div className="text-center">
                    <h3 className="text-xl font-semibold text-gray-900">Artificial Intelligence</h3>
                    <p className="mt-2 text-gray-500">
                        Develop intelligent systems that learn, adapt, and drive smarter decision-making across industries.
                    </p>
                </div>
                <div className="text-center">
                    <h3 className="text-xl font-semibold text-gray-900">Game Development</h3>
                    <p className="mt-2 text-gray-500">
                        Craft captivating and imaginative gaming worlds that transport players into unforgettable interactive adventures.
                    </p>
                </div>
            </div>
        </div>
    )
}

function ClaudeColorsHomePage() {
    return (
        <div className="bg-powder-blue min-h-screen flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl font-extrabold tracking-tight text-navy-blue sm:text-5xl md:text-6xl">
              <span className="block">{ENGINEER_NAME}</span>
              <span className="block text-royal-blue">Visionary Software Engineer</span>
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-midnight-blue sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              Unlock the future of technology with innovative solutions in computer vision, artificial intelligence, and immersive gaming experiences.
            </p>
            <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
              <div className="rounded-md shadow">
                <Link
                  href="/projects"
                  className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-light-blue bg-royal-blue hover:bg-navy-blue md:py-4 md:text-lg md:px-10"
                >
                  View My Projects
                </Link>
              </div>
            </div>
          </div>
          <div className="mt-10 max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-navy-blue">Computer Vision</h3>
              <p className="mt-2 text-midnight-blue">
                Transform visual data into actionable insights through advanced image recognition, object tracking, and perception algorithms.
              </p>
            </div>
            <div className="text-center">
              <h3 className="text-xl font-semibold text-navy-blue">Artificial Intelligence</h3>
              <p className="mt-2 text-midnight-blue">
                Develop intelligent systems that learn, adapt, and drive smarter decision-making across industries.
              </p>
            </div>
            <div className="text-center">
              <h3 className="text-xl font-semibold text-navy-blue">Game Development</h3>
              <p className="mt-2 text-midnight-blue">
                Craft captivating and imaginative gaming worlds that transport players into unforgettable interactive adventures.
              </p>
            </div>
          </div>
        </div>
      )
}

export default function Home() {
  return (
      <ClaudeColorsHomePage/>
  );
}
