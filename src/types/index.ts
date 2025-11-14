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

export interface AuthUser {
  fullName: string;
  email: string;
}

export interface AuthState {
  user?: AuthUser;
  token?: string;
  isAuthenticated: boolean;
  loading: boolean;
  error?: string;
}

export interface PersonalInformation {
  fullName: string;
  phoneCode: string;
  phoneNumber: string;
  email: string;
}

export interface EducationEntry {
  degree: string;
  school: string;
  startDate: string;
  endDate: string;
  major: string;
  gpa: string;
}

export interface ExperienceEntry {
  company: string;
  title: string;
  timeframe: string;
  responsibilities: string;
}

export interface WorkExperienceEntry extends ExperienceEntry {
  departureReason: string;
}

export interface ProjectEntry {
  name: string;
  timeframe: string;
  description: string;
}

export interface SkillsSection {
  programming: string;
  office: string;
  languages: string;
}

export interface CompetitionEntry {
  name: string;
  level: string;
  result: string;
}

export interface ManualResumeFormData {
  personal: PersonalInformation;
  education: EducationEntry[];
  internships: ExperienceEntry[];
  work: WorkExperienceEntry[];
  projects: ProjectEntry[];
  skills: SkillsSection;
  competitions: CompetitionEntry[];
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
  auth: AuthState;
}
