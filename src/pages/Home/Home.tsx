import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="text-center">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">
          Smart Job Assistant
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Transform your job application process with AI-powered resume generation
          and interview preparation tools.
        </p>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Resume Generator
            </h3>
            <p className="text-gray-600 mb-4">
              Upload your resume and job description to generate a tailored resume
              that matches the job requirements.
            </p>
            <Link
              to="/resume-generator"
              className="inline-block bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Get Started
            </Link>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Interview Preparation
            </h3>
            <p className="text-gray-600 mb-4">
              Generate interview questions, record your answers, and receive AI-powered feedback
              with a downloadable evaluation report.
            </p>
            <Link
              to="/interview-coach"
              className="inline-block bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Start Practicing
            </Link>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              PPT Generator
            </h3>
            <p className="text-gray-600 mb-4">
              Generate a professional self-introduction PPT based on your resume and job description
              using AI-powered content structuring.
            </p>
            <Link
              to="/ppt-generator"
              className="inline-block bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Generate PPT
            </Link>
          </div>
        </div>

        <div className="bg-blue-50 p-6 rounded-lg">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                1
              </div>
              <h4 className="font-medium text-gray-900 mb-2">Upload Files</h4>
              <p className="text-gray-600 text-sm">
                Upload your resume and the job description you're targeting.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                2
              </div>
              <h4 className="font-medium text-gray-900 mb-2">AI Processing</h4>
              <p className="text-gray-600 text-sm">
                Our AI analyzes the job requirements and tailors your resume.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                3
              </div>
              <h4 className="font-medium text-gray-900 mb-2">Download Result</h4>
              <p className="text-gray-600 text-sm">
                Get your optimized resume ready for your job application.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;