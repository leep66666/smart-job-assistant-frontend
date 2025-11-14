import { create } from 'zustand';
import type {
  AppState,
  ResumeGenerationState,
  InterviewState,
  ManualResumeFormData,
  AuthState,
} from '../types/index';
import { resumeService } from '../services/api';
import { authService, type RegisterPayload, type LoginPayload } from '../services/auth';

interface AppStore extends AppState {
  setResumeFile: (file: File | undefined) => void;
  setJobDescriptionFile: (file: File) => void;
  generateResume: (manualData?: ManualResumeFormData) => Promise<void>;
  clearResumeState: () => void;
  clearInterviewState: () => void;
  registerUser: (payload: RegisterPayload) => Promise<void>;
  loginUser: (payload: LoginPayload) => Promise<void>;
  logoutUser: () => void;
  initializeAuth: () => void;
  clearAuthError: () => void;
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

const initialAuthState: AuthState = {
  isAuthenticated: false,
  loading: false,
  user: undefined,
  token: undefined,
  error: undefined,
};

export const useAppStore = create<AppStore>((set, get) => ({
  resume: initialResumeState,
  interview: initialInterviewState,
  auth: initialAuthState,

  setResumeFile: (file?: File) => {
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

  generateResume: async (manualData?: ManualResumeFormData) => {
    const { resume } = get();

    if (!resume.jobDescriptionFile) {
      set((state) => ({
        resume: {
          ...state.resume,
          error: 'Please upload a job description file.',
        },
      }));
      return;
    }

    if (!resume.resumeFile && !manualData) {
      set((state) => ({
        resume: {
          ...state.resume,
          error: 'Provide either a resume file or fill in the manual form.',
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
        manualData,
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

  registerUser: async (payload) => {
    set((state) => ({
      auth: {
        ...state.auth,
        loading: true,
        error: undefined,
      },
    }));
    try {
      const session = await authService.register(payload);
      set((state) => ({
        auth: {
          ...state.auth,
          loading: false,
          isAuthenticated: true,
          user: session.user,
          token: session.token,
          error: undefined,
        },
      }));
    } catch (error) {
      set((state) => ({
        auth: {
          ...state.auth,
          loading: false,
          error: error instanceof Error ? error.message : 'Registration failed, please try again later',
        },
      }));
    }
  },

  loginUser: async (payload) => {
    set((state) => ({
      auth: {
        ...state.auth,
        loading: true,
        error: undefined,
      },
    }));
    try {
      const session = await authService.login(payload);
      set((state) => ({
        auth: {
          ...state.auth,
          loading: false,
          isAuthenticated: true,
          user: session.user,
          token: session.token,
          error: undefined,
        },
      }));
    } catch (error) {
      set((state) => ({
        auth: {
          ...state.auth,
          loading: false,
          error: error instanceof Error ? error.message : 'Login failed, please try again later',
        },
      }));
    }
  },

  logoutUser: () => {
    authService.logout();
    set({
      auth: initialAuthState,
      resume: initialResumeState,
      interview: initialInterviewState,
    });
  },

  initializeAuth: () => {
    const session = authService.loadSession();
    if (session) {
      set({
        auth: {
          ...initialAuthState,
          isAuthenticated: true,
          user: session.user,
          token: session.token,
        },
      });
    } else {
      set({ auth: initialAuthState });
    }
  },

  clearAuthError: () => {
    set((state) => ({
      auth: {
        ...state.auth,
        error: undefined,
      },
    }));
  },
}));
