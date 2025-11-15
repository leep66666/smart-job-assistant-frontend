import { useEffect, useState } from 'react';
import FileUpload from '../../components/FileUpload/FileUpload';
import ManualResumeForm from '../../components/ManualResumeForm/ManualResumeForm';
import { useAppStore } from '../../store';
import type { ManualResumeFormData } from '../../types';

const createEducationEntry = () => ({
  degree: '',
  school: '',
  startDate: '',
  endDate: '',
  major: '',
  gpa: '',
});

const createInternOrWorkEntry = () => ({
  company: '',
  title: '',
  timeframe: '',
  responsibilities: '',
});

const createProjectEntry = () => ({
  name: '',
  timeframe: '',
  description: '',
});

const createInitialManualForm = (): ManualResumeFormData => ({
  personal: {
    fullName: '',
    phoneCode: '+86',
    phoneNumber: '',
    email: '',
  },
  education: [createEducationEntry(), createEducationEntry()],
  internships: [createInternOrWorkEntry(), createInternOrWorkEntry()],
  work: [
    {
      ...createInternOrWorkEntry(),
      departureReason: '',
    },
  ],
  projects: [createProjectEntry()],
  skills: {
    programming: '',
    office: '',
    languages: '',
  },
  competitions: [],
});

const hasText = (value?: string) => Boolean(value && value.trim().length > 0);

const manualFormHasContent = (data: ManualResumeFormData): boolean => {
  if (
    hasText(data.personal.fullName) ||
    hasText(data.personal.email) ||
    hasText(data.personal.phoneNumber)
  ) {
    return true;
  }

  const sectionsWithText = [
    data.education.some(
      (item) =>
        hasText(item.school) ||
        hasText(item.degree) ||
        hasText(item.major) ||
        hasText(item.startDate) ||
        hasText(item.endDate) ||
        hasText(item.gpa),
    ),
    data.internships.some(
      (item) =>
        hasText(item.company) ||
        hasText(item.title) ||
        hasText(item.timeframe) ||
        hasText(item.responsibilities),
    ),
    data.work.some(
      (item) =>
        hasText(item.company) ||
        hasText(item.title) ||
        hasText(item.timeframe) ||
        hasText(item.responsibilities) ||
        hasText(item.departureReason),
    ),
    data.projects.some(
      (item) => hasText(item.name) || hasText(item.timeframe) || hasText(item.description),
    ),
    hasText(data.skills.programming) ||
      hasText(data.skills.office) ||
      hasText(data.skills.languages),
    data.competitions.some(
      (item) => hasText(item.name) || hasText(item.level) || hasText(item.result),
    ),
  ];

  return sectionsWithText.some(Boolean);
};

const ResumeGenerator = () => {
  const {
    resume,
    setResumeFile,
    setJobDescriptionFile,
    generateResume,
    clearResumeState,
  } = useAppStore();

  const [activeTab, setActiveTab] = useState<'upload' | 'result'>('upload');
  const [manualResume, setManualResume] = useState<ManualResumeFormData>(createInitialManualForm());
  const [otherNotes, setOtherNotes] = useState('');
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(undefined);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  const [previewError, setPreviewError] = useState<string | undefined>(undefined);

  const handleResumeUpload = (file: File) => {
    setResumeFile(file);
  };

  const handleJobDescriptionUpload = (file: File) => {
    setJobDescriptionFile(file);
  };

  const handleManualChange = (updated: ManualResumeFormData) => {
    setManualResume(updated);
  };

  const handleGenerate = async () => {
    const manualDataProvided = manualFormHasContent(manualResume);
    await generateResume(manualDataProvided ? manualResume : undefined);
  };

  useEffect(() => {
    if (resume.generatedResume && activeTab !== 'result') {
      setActiveTab('result');
    }
  }, [resume.generatedResume, activeTab]);

  useEffect(() => {
    let objectUrl: string | undefined;
    const cleanupObjectUrl = () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
        objectUrl = undefined;
      }
    };

    if (!resume.downloadPdf) {
      setPreviewUrl(undefined);
      setPreviewError(undefined);
      setIsPreviewLoading(false);
      return () => {
        cleanupObjectUrl();
      };
    }

    const controller = new AbortController();
    setIsPreviewLoading(true);
    setPreviewError(undefined);
    setPreviewUrl(undefined);

    const preparePreview = async () => {
      try {
        const response = await fetch(resume.downloadPdf as string, {
          signal: controller.signal,
          credentials: 'include',
        });
        if (!response.ok) {
          throw new Error(`Failed to fetch PDF preview (${response.status})`);
        }
        const blob = await response.blob();
        objectUrl = URL.createObjectURL(blob);
        setPreviewUrl(objectUrl);
      } catch (error) {
        if (controller.signal.aborted) {
          return;
        }
        console.error('Failed to prepare PDF preview:', error);
        setPreviewUrl(undefined);
        setPreviewError('Unable to load PDF preview. Please use the download button above.');
      } finally {
        if (!controller.signal.aborted) {
          setIsPreviewLoading(false);
        }
      }
    };

    void preparePreview();

    return () => {
      controller.abort();
      cleanupObjectUrl();
    };
  }, [resume.downloadPdf]);

  const handleReset = () => {
    clearResumeState();
    setManualResume(createInitialManualForm());
    setOtherNotes('');
    setActiveTab('upload');
  };

  const manualDataProvided = manualFormHasContent(manualResume);
  const canGenerate =
    !!resume.jobDescriptionFile &&
    !resume.isGenerating &&
    (Boolean(resume.resumeFile) || manualDataProvided);

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

          <div className="mt-8 border-t border-gray-200 pt-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">Manual Resume Form</h3>
                <p className="text-sm text-gray-500">
                  Provide structured information below if you prefer to submit your data without an existing resume file.
                </p>
              </div>
              <p className="text-xs text-gray-400 mt-2 md:mt-0">
                Personal info, education, internships, projects, skills, competitions
              </p>
            </div>
            <ManualResumeForm data={manualResume} onChange={handleManualChange} />
          </div>

          <div className="mt-8 border-t border-gray-200 pt-6">
            <div className="mb-4">
              <h3 className="text-xl font-semibold text-gray-900">Other</h3>
              <p className="text-sm text-gray-500">Share any additional context or requirements.</p>
            </div>
            <label htmlFor="other-notes" className="block text-sm font-medium text-gray-700 mb-2">
              Notes
            </label>
            <textarea
              id="other-notes"
              value={otherNotes}
              onChange={(event) => setOtherNotes(event.target.value)}
              rows={4}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500/20"
              placeholder="Add any extra context or special requests here"
            />
            <p className="mt-1 text-xs text-gray-500">Optional field for additional notes.</p>
          </div>

          <div className="mt-8 flex justify-between">
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
              {resume.downloadPdf ? (
                <a
                  href={resume.downloadPdf}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Download PDF
                </a>
              ) : (
                <button
                  disabled
                  className="px-4 py-2 bg-gray-300 text-gray-500 rounded-md cursor-not-allowed"
                >
                  Download PDF
                </button>
              )}
            </div>
          </div>

          {resume.generatedResume ? (
            <>
              {resume.warnings && resume.warnings.length > 0 && (
                <div className="mb-4 rounded-md border border-yellow-200 bg-yellow-50 p-4 text-yellow-800">
                  <p className="font-medium mb-2">Warnings</p>
                  <ul className="list-disc ml-5 space-y-1 text-sm">
                    {resume.warnings.map((warning) => (
                      <li key={warning}>{warning}</li>
                    ))}
                  </ul>
                </div>
              )}
              <div className="bg-gray-50 p-6 rounded-lg border">
                <div className="prose max-w-none">
                  <pre className="whitespace-pre-wrap text-sm text-gray-800">
                    {resume.generatedResume}
                  </pre>
                </div>
              </div>
              {resume.downloadPdf ? (
                <div className="mt-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">PDF Preview</h3>
                  {previewUrl ? (
                    <div className="border rounded-lg overflow-hidden bg-white h-[600px]">
                      <iframe
                        title="Generated Resume PDF Preview"
                        src={previewUrl}
                        className="w-full h-full"
                      />
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">
                      {isPreviewLoading
                        ? 'Preparing PDF preview...'
                        : previewError ?? 'PDF preview is currently unavailable. Please try again shortly.'}
                    </p>
                  )}
                </div>
              ) : (
                <p className="mt-6 text-sm text-gray-500">
                  PDF preview will be available once the resume is ready for download.
                </p>
              )}
            </>
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
