import axios from 'axios';
import type { ManualResumeFormData } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface GenerateResumeRequest {
  resumeFile?: File;
  jobDescriptionFile: File;
  manualData?: ManualResumeFormData;
}

export interface GenerateResumeResponse {
  success: boolean;
  generatedResume: string;
  downloadMd?: string;
  downloadPdf?: string | null;
  fileId?: string;
  warnings?: string[];
  resumeSaved?: string;
  jdSaved?: string;
  message?: string;
}

export const resumeService = {
  generateResume: async (data: GenerateResumeRequest): Promise<GenerateResumeResponse> => {
    const formData = new FormData();
    if (data.resumeFile) {
      formData.append('resume', data.resumeFile);
    }
    formData.append('jobDescription', data.jobDescriptionFile);
    if (data.manualData) {
      formData.append('manualResume', JSON.stringify(data.manualData));
    }

    try {
      const response = await api.post('/resume/generate', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error generating resume:', error);
      return {
        success: false,
        generatedResume: '',
        message: 'Failed to generate resume. Please try again.',
      };
    }
  },
};

export interface InterviewQuestion {
  id: string;
  text: string;
  durationSeconds: number;
}

export interface StartInterviewResponse {
  success: boolean;
  sessionId: string;
  questions: InterviewQuestion[];
  currentQuestionId?: string | null;
  warnings?: string[];
  message?: string;
}

export interface SubmitAnswerResponse {
  success: boolean;
  questionId: string;
  transcript: string;
  evaluation: {
    overallScore?: number;
    summary?: string;
    strengths?: string[];
    improvements?: string[];
    [key: string]: unknown;
  };
  durationSeconds: number;
  nextQuestionId?: string | null;
  nextQuestionText?: string | null;
  hasMoreQuestions: boolean;
  warnings?: string[];
  message?: string;
}

export interface InterviewReportResponse {
  success: boolean;
  report: {
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
      evaluation?: SubmitAnswerResponse['evaluation'] | null;
      warnings?: string[];
    }>;
    downloadName: string;
  };
  markdown: string;
  downloadUrl: string;
  message?: string;
}

export const interviewService = {
  startInterview: async (
    jobDescriptionFile?: File,
  ): Promise<StartInterviewResponse> => {
    const formData = new FormData();
    if (jobDescriptionFile) {
      formData.append('jobDescription', jobDescriptionFile);
    }

    try {
      const response = await api.post('/interview/questions', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error starting interview session:', error);
      return {
        success: false,
        sessionId: '',
        questions: [],
        message: 'Failed to start interview session. Please try again.',
      };
    }
  },

  submitAnswer: async ({
    sessionId,
    questionId,
    audioBlob,
    elapsedSeconds,
  }: {
    sessionId: string;
    questionId: string;
    audioBlob: Blob;
    elapsedSeconds: number;
  }): Promise<SubmitAnswerResponse> => {
    const formData = new FormData();
    formData.append('sessionId', sessionId);
    formData.append('questionId', questionId);
    formData.append('elapsedSeconds', String(elapsedSeconds));
    formData.append('audio', audioBlob, `${questionId}.webm`);

    try {
      const response = await api.post('/interview/answer', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error submitting interview answer:', error);
      return {
        success: false,
        questionId,
        transcript: '',
        evaluation: {},
        durationSeconds: elapsedSeconds,
        hasMoreQuestions: true,
        message: 'Failed to submit answer. Please try again.',
      };
    }
  },

  fetchReport: async (sessionId: string): Promise<InterviewReportResponse> => {
    try {
      const response = await api.get(`/interview/report/${sessionId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching interview report:', error);
      return {
        success: false,
        report: {
          summary: {
            sessionId,
            questionCount: 0,
            answeredCount: 0,
            averageScore: null,
            generatedAt: new Date().toISOString(),
          },
          items: [],
          downloadName: '',
        },
        markdown: '',
        downloadUrl: '',
        message: 'Failed to fetch interview report. Please try again.',
      };
    }
  },
};

export default resumeService;
