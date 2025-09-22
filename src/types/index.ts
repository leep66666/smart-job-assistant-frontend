export interface UploadedFile {
  file: File;
  type: 'resume' | 'jobDescription';
  uploadedAt: Date;
}

export interface ResumeGenerationState {
  resumeFile?: File;
  jobDescriptionFile?: File;
  isGenerating: boolean;
  generatedResume?: string;
  error?: string;
}

export interface InterviewState {
  jobDescriptionFile?: File;
  questions: string[];
  isGenerating: boolean;
  error?: string;
}

export interface AppState {
  resume: ResumeGenerationState;
  interview: InterviewState;
}