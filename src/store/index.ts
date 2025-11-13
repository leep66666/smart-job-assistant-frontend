import { create } from 'zustand';
import type { AppState, ResumeGenerationState, InterviewState } from '../types/index';
import { resumeService } from '../services/api';

interface AppStore extends AppState {
  setResumeFile: (file: File) => void;
  setJobDescriptionFile: (file: File) => void;
  generateResume: () => Promise<void>;
  clearResumeState: () => void;
  clearInterviewState: () => void;
}

const initialResumeState: ResumeGenerationState = {
  isGenerating: false,
};

const initialInterviewState: InterviewState = {
  sessionId: undefined,
  questions: [],
  currentIndex: 0,
  answers: {},
  isGenerating: false,
  isSubmitting: false,
  warnings: [],
  error: undefined,
  report: undefined,
};

export const useAppStore = create<AppStore>((set, get) => ({
  resume: initialResumeState,
  interview: initialInterviewState,

  setResumeFile: (file: File) => {
    set((state) => ({
      resume: {
        ...state.resume,
        resumeFile: file,
        error: undefined,
      },
    }));
  },

  setJobDescriptionFile: (file: File) => {
    set((state) => ({
      resume: {
        ...state.resume,
        jobDescriptionFile: file,
        error: undefined,
      },
    }));
  },

  generateResume: async () => {
    const { resume } = get();

    if (!resume.resumeFile || !resume.jobDescriptionFile) {
      set((state) => ({
        resume: {
          ...state.resume,
          error: 'Please upload both resume and job description files.',
        },
      }));
      return;
    }

    set((state) => ({
      resume: {
        ...state.resume,
        isGenerating: true,
        error: undefined,
      },
    }));

    try {
      const response = await resumeService.generateResume({
        resumeFile: resume.resumeFile,
        jobDescriptionFile: resume.jobDescriptionFile,
      });

      if (response.success) {
        set((state) => ({
          resume: {
            ...state.resume,
            isGenerating: false,
            generatedResume: response.generatedResume,
            downloadMd: response.downloadMd,
            downloadPdf: response.downloadPdf ?? null,
            fileId: response.fileId,
            warnings: response.warnings,
          },
        }));
      } else {
        set((state) => ({
          resume: {
            ...state.resume,
            isGenerating: false,
            downloadMd: undefined,
            downloadPdf: null,
            fileId: undefined,
            warnings: undefined,
            error: response.message || 'Failed to generate resume',
          },
        }));
      }
    } catch {
      set((state) => ({
        resume: {
          ...state.resume,
          isGenerating: false,
          downloadMd: undefined,
          downloadPdf: null,
          fileId: undefined,
          warnings: undefined,
          error: 'An unexpected error occurred. Please try again.',
        },
      }));
    }
  },

  clearResumeState: () => {
    set({ resume: initialResumeState });
  },

  clearInterviewState: () => {
    set({ interview: initialInterviewState });
  },
}));