import { useState, useEffect } from 'react';
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
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState('');

  // 当简历生成后，初始化编辑内容
  useEffect(() => {
    if (resume.generatedResume && !editedContent) {
      setEditedContent(resume.generatedResume);
    }
  }, [resume.generatedResume, editedContent]);

  const handleResumeUpload = (file: File) => {
    setResumeFile(file);
  };

  const handleJobDescriptionUpload = (file: File) => {
    setJobDescriptionFile(file);
  };

  const handleGenerate = async () => {
    await generateResume();
    if (resume.generatedResume) {
      setEditedContent(resume.generatedResume);
      setIsEditing(false);
      setActiveTab('result');
    }
  };

  const handleStartEdit = () => {
    setEditedContent(resume.generatedResume || '');
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setEditedContent(resume.generatedResume || '');
    setIsEditing(false);
  };

  const handleSaveEdit = () => {
    // 更新 store 中的内容
    useAppStore.setState((state) => ({
      resume: {
        ...state.resume,
        generatedResume: editedContent,
      },
    }));
    setIsEditing(false);
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
            <div className="space-x-2 flex items-center">
              <button
                onClick={() => {
                  setActiveTab('upload');
                  setIsEditing(false);
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Upload New Files
              </button>
              {resume.downloadMd ? (
                <a
                  href={resume.downloadMd}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-blue-50 text-blue-600 rounded-md border border-blue-200 hover:bg-blue-100 transition-colors"
                >
                  Download Markdown
                </a>
              ) : null}
              {resume.downloadPdf ? (
                <a
                  href={resume.downloadPdf}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Download PDF
                </a>
              ) : (
                <button
                  disabled
                  className="px-4 py-2 bg-gray-300 text-gray-500 rounded-md cursor-not-allowed"
                >
                  PDF Not Available
                </button>
              )}
            </div>
          </div>

          {resume.generatedResume ? (
            <div className="bg-gray-50 p-6 rounded-lg border">
              {isEditing ? (
                <div className="space-y-4">
                  <textarea
                    value={editedContent}
                    onChange={(e) => setEditedContent(e.target.value)}
                    className="w-full h-96 p-4 border border-gray-300 rounded-md font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Edit your resume content here..."
                  />
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={handleCancelEdit}
                      className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveEdit}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="prose max-w-none">
                    <pre className="whitespace-pre-wrap text-sm text-gray-800">
                      {resume.generatedResume}
                    </pre>
                  </div>
                  <div className="flex justify-end">
                    <button
                      onClick={handleStartEdit}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                    >
                      Edit Content
                    </button>
                  </div>
                </div>
              )}
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

          {resume.warnings && resume.warnings.length > 0 ? (
            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
              <h3 className="text-sm font-semibold text-yellow-700 mb-2">Warnings</h3>
              <ul className="list-disc list-inside text-sm text-yellow-800 space-y-1">
                {resume.warnings.map((warning) => (
                  <li key={warning}>{warning}</li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default ResumeGenerator;