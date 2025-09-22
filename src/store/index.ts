import { create } from 'zustand';
import type { AppState, ResumeGenerationState, InterviewState } from '../types/index';
import { resumeService } from '../services/api';

interface AppStore extends AppState {
  setResumeFile: (file: File) => void;
  setJobDescriptionFile: (file: File) => void;
  generateResume: () => Promise<void>;
  generateQuestions: () => Promise<void>;
  clearResumeState: () => void;
  clearInterviewState: () => void;
}

const initialResumeState: ResumeGenerationState = {
  isGenerating: false,
};

const initialInterviewState: InterviewState = {
  questions: [],
  isGenerating: false,
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
          },
        }));
      } else {
        set((state) => ({
          resume: {
            ...state.resume,
            isGenerating: false,
            error: response.message || 'Failed to generate resume',
          },
        }));
      }
    } catch (error) {
      set((state) => ({
        resume: {
          ...state.resume,
          isGenerating: false,
          error: 'An unexpected error occurred. Please try again.',
        },
      }));
    }
  },

  generateQuestions: async () => {
    const { resume } = get();

    if (!resume.jobDescriptionFile) {
      set((state) => ({
        interview: {
          ...state.interview,
          error: 'Please upload a job description file.',
        },
      }));
      return;
    }

    set((state) => ({
      interview: {
        ...state.interview,
        isGenerating: true,
        error: undefined,
      },
    }));

    try {
      const response = await resumeService.generateQuestions({
        jobDescriptionFile: resume.jobDescriptionFile,
      });

      if (response.success) {
        set((state) => ({
          interview: {
            ...state.interview,
            isGenerating: false,
            questions: response.questions,
          },
        }));
      } else {
        set((state) => ({
          interview: {
            ...state.interview,
            isGenerating: false,
            error: response.message || 'Failed to generate questions',
          },
        }));
      }
    } catch (error) {
      set((state) => ({
        interview: {
          ...state.interview,
          isGenerating: false,
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