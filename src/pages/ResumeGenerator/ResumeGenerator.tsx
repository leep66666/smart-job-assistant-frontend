import { useState } from 'react';
import FileUpload from '../../components/FileUpload/FileUpload';
import { useAppStore } from '../../store';

const ResumeGenerator = () => {
  const {
    resume,
    setResumeFile,
    setJobDescriptionFile,
    generateResume,
    clearResumeState,
  } = useAppStore();

  const [activeTab, setActiveTab] = useState<'upload' | 'result'>('upload');

  const handleResumeUpload = (file: File) => {
    setResumeFile(file);
  };

  const handleJobDescriptionUpload = (file: File) => {
    setJobDescriptionFile(file);
  };

  const handleGenerate = async () => {
    await generateResume();
    if (resume.generatedResume) {
      setActiveTab('result');
    }
  };

  const handleReset = () => {
    clearResumeState();
    setActiveTab('upload');
  };

  const canGenerate = resume.resumeFile && resume.jobDescriptionFile && !resume.isGenerating;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Resume Generator</h1>
        <p className="text-lg text-gray-600">
          Upload your resume and job description to generate a tailored resume that matches the job requirements.
        </p>
      </div>

      <div className="mb-6">
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('upload')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'upload'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Upload Files
          </button>
          <button
            onClick={() => setActiveTab('result')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'result'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
            disabled={!resume.generatedResume}
          >
            Generated Resume
          </button>
        </div>
      </div>

      {activeTab === 'upload' && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <FileUpload
                onFileSelect={handleResumeUpload}
                acceptedTypes="application/pdf,.pdf,.doc,.docx"
                label="Upload Your Resume"
                description="PDF, DOC, or DOCX files up to 10MB"
                uploadedFile={resume.resumeFile}
              />
            </div>
            <div>
              <FileUpload
                onFileSelect={handleJobDescriptionUpload}
                acceptedTypes="application/pdf,.pdf,.doc,.docx,.txt"
                label="Upload Job Description"
                description="PDF, DOC, DOCX, or TXT files up to 10MB"
                uploadedFile={resume.jobDescriptionFile}
              />
            </div>
          </div>

          {resume.error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-700">{resume.error}</p>
            </div>
          )}

          <div className="mt-6 flex justify-between">
            <button
              onClick={handleReset}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Reset
            </button>
            <button
              onClick={handleGenerate}
              disabled={!canGenerate}
              className={`px-6 py-2 rounded-md font-medium transition-colors ${
                canGenerate
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {resume.isGenerating ? 'Generating...' : 'Generate Resume'}
            </button>
          </div>
        </div>
      )}

      {activeTab === 'result' && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">Generated Resume</h2>
            <div className="space-x-2">
              <button
                onClick={() => setActiveTab('upload')}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Edit Files
              </button>
              <button
                disabled
                className="px-4 py-2 bg-gray-300 text-gray-500 rounded-md cursor-not-allowed"
              >
                Download PDF
              </button>
            </div>
          </div>

          {resume.generatedResume ? (
            <div className="bg-gray-50 p-6 rounded-lg border">
              <div className="prose max-w-none">
                <pre className="whitespace-pre-wrap text-sm text-gray-800">
                  {resume.generatedResume}
                </pre>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <svg className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="text-gray-600">No resume generated yet.</p>
              <button
                onClick={() => setActiveTab('upload')}
                className="mt-4 text-blue-600 hover:text-blue-800"
              >
                Upload files to get started
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ResumeGenerator;