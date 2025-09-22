import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface GenerateResumeRequest {
  resumeFile: File;
  jobDescriptionFile: File;
}

export interface GenerateResumeResponse {
  success: boolean;
  generatedResume: string;
  message?: string;
}

export interface GenerateQuestionsRequest {
  jobDescriptionFile: File;
}

export interface GenerateQuestionsResponse {
  success: boolean;
  questions: string[];
  message?: string;
}

export const resumeService = {
  generateResume: async (data: GenerateResumeRequest): Promise<GenerateResumeResponse> => {
    const formData = new FormData();
    formData.append('resume', data.resumeFile);
    formData.append('jobDescription', data.jobDescriptionFile);

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

  generateQuestions: async (data: GenerateQuestionsRequest): Promise<GenerateQuestionsResponse> => {
    const formData = new FormData();
    formData.append('jobDescription', data.jobDescriptionFile);

    try {
      const response = await api.post('/interview/questions', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error generating questions:', error);
      return {
        success: false,
        questions: [],
        message: 'Failed to generate questions. Please try again.',
      };
    }
  },
};

export default resumeService;