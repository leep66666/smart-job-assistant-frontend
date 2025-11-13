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
  downloadMd?: string;
  downloadPdf?: string | null;
  fileId?: string;
  warnings?: string[];
  error?: string;
}

export interface InterviewQuestion {
  id: string;
  text: string;
  durationSeconds: number;
}

export interface InterviewEvaluation {
  overallScore?: number;
  summary?: string;
  strengths?: string[];
  improvements?: string[];
  [key: string]: unknown;
}

export interface InterviewAnswer {
  questionId: string;
  transcript: string;
  evaluation: InterviewEvaluation;
  durationSeconds: number;
  warnings?: string[];
}

export interface InterviewReport {
  summary: {
    sessionId: string;
    questionCount: number;
    answeredCount: number;
    averageScore?: number | null;
    generatedAt: string;
  };
  items: Array<{
    questionId: string;
    question: string;
    durationSeconds?: number | null;
    transcript?: string | null;
    evaluation?: InterviewEvaluation | null;
    warnings?: string[];
  }>;
  markdown: string;
  downloadUrl?: string;
}

export interface InterviewState {
  sessionId?: string;
  questions: InterviewQuestion[];
  currentIndex: number;
  answers: Record<string, InterviewAnswer>;
  isGenerating: boolean;
  isSubmitting: boolean;
  warnings: string[];
  error?: string;
  report?: InterviewReport;
}

export interface AppState {
  resume: ResumeGenerationState;
  interview: InterviewState;
}