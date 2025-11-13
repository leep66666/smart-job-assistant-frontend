import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { interviewService, type InterviewQuestion, type SubmitAnswerResponse } from '../../services/api';
import FileUpload from '../../components/FileUpload/FileUpload';

type RecordingState = 'idle' | 'recording' | 'submitting' | 'completed';

interface QuestionResult {
  response: SubmitAnswerResponse;
  submittedAt: string;
}

const InterviewCoach = () => {
  const [jobDescriptionFile, setJobDescriptionFile] = useState<File>();
  const [sessionId, setSessionId] = useState<string>();
  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [recordingState, setRecordingState] = useState<RecordingState>('idle');
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [warnings, setWarnings] = useState<string[]>([]);
  const [error, setError] = useState<string>();
  const [questionResults, setQuestionResults] = useState<Record<string, QuestionResult>>({});
  const [reportMarkdown, setReportMarkdown] = useState<string>();
  const [reportDownloadUrl, setReportDownloadUrl] = useState<string>();
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(false);
  const [isFetchingReport, setIsFetchingReport] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);
  const stopPromiseRef = useRef<Promise<void> | null>(null);

  const currentQuestion = questions[currentIndex];

  const isFinished = useMemo(
    () => sessionId && currentIndex >= questions.length,
    [currentIndex, questions.length, sessionId],
  );

  const stopMedia = useCallback(() => {
    mediaRecorderRef.current?.stop();
    streamRef.current?.getTracks().forEach((track) => track.stop());
    mediaRecorderRef.current = null;
    streamRef.current = null;
  }, []);

  const startSession = async () => {
    setIsLoadingQuestions(true);
    setError(undefined);
    setWarnings([]);
    setSessionId(undefined);
    setQuestions([]);
    setCurrentIndex(0);
    setReportMarkdown(undefined);
    setReportDownloadUrl(undefined);
    setQuestionResults({});

    const response = await interviewService.startInterview(jobDescriptionFile);
    setIsLoadingQuestions(false);

    if (!response.success) {
      setError(response.message || 'Failed to start interview session.');
      return;
    }

    setSessionId(response.sessionId);
    setQuestions(response.questions);
    setWarnings(response.warnings || []);
    setCurrentIndex(0);
    setRecordingState('idle');
  };

  const startRecording = async () => {
    if (!currentQuestion) return;
    if (!sessionId) {
      setError('Interview session is not initialized.');
      return;
    }
    if (!navigator.mediaDevices) {
      setError('Your browser does not support audio recording.');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      streamRef.current = stream;
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      stopPromiseRef.current = new Promise<void>((resolve) => {
        mediaRecorder.onstop = () => {
          resolve();
        };
      });

      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };
      mediaRecorder.start();
      setWarnings([]);
      setError(undefined);
      setRecordingState('recording');
    } catch (err) {
      console.error(err);
      setError('Unable to access microphone. Please allow microphone permissions.');
    }
  };

  const fetchReport = useCallback(async (session: string) => {
    setIsFetchingReport(true);
    const report = await interviewService.fetchReport(session);
    setIsFetchingReport(false);
    if (!report.success) {
      setError(report.message || 'Failed to fetch report.');
      return;
    }
    setReportMarkdown(report.markdown);
    setReportDownloadUrl(report.downloadUrl);
  }, []);

  const submitAnswer = useCallback(
    async ({
      session,
      question,
      audioBlob,
      duration,
    }: {
      session: string;
      question: InterviewQuestion;
      audioBlob: Blob;
      duration: number;
    }) => {
      const response = await interviewService.submitAnswer({
        sessionId: session,
        questionId: question.id,
        audioBlob,
        elapsedSeconds: duration,
      });

      if (!response.success) {
        setError(response.message || 'Failed to submit answer.');
        setRecordingState('idle');
        return;
      }

      setQuestionResults((prev) => ({
        ...prev,
        [response.questionId]: {
          response,
          submittedAt: new Date().toISOString(),
        },
      }));
      setWarnings(response.warnings || []);

      if (response.hasMoreQuestions && response.nextQuestionId) {
        setRecordingState('completed');
      } else {
        setRecordingState('completed');
        setCurrentIndex((prev) => prev + 1);
        await fetchReport(session);
      }
    },
    [fetchReport],
  );

  const stopRecording = useCallback(
    async ({
      session,
      question,
      duration,
    }: {
      session: string;
      question: InterviewQuestion;
      duration: number;
    }) => {
      if (recordingState !== 'recording') return;
      setRecordingState('submitting');
      mediaRecorderRef.current?.stop();
      streamRef.current?.getTracks().forEach((track) => track.stop());

      try {
        if (stopPromiseRef.current) {
          await stopPromiseRef.current;
        }
      } catch (err) {
        console.error('Error stopping recorder', err);
      }

      const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
      chunksRef.current = [];
      await submitAnswer({ session, question, audioBlob, duration });
    },
    [recordingState, submitAnswer],
  );

  useEffect(() => {
    return () => {
      stopMedia();
    };
  }, [stopMedia]);

  useEffect(() => {
    if (recordingState !== 'recording') {
      if (timerRef.current !== null) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    setElapsedSeconds(0);
    const startAt = Date.now();
    timerRef.current = window.setInterval(() => {
      const elapsed = Math.floor((Date.now() - startAt) / 1000);
      setElapsedSeconds(elapsed);
      if (currentQuestion && sessionId && elapsed >= currentQuestion.durationSeconds) {
        void stopRecording({
          session: sessionId,
          question: currentQuestion,
          duration: elapsed,
        });
      }
    }, 500);

    return () => {
      if (timerRef.current !== null) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [recordingState, currentQuestion, sessionId, stopRecording]);

  const goToNextQuestion = () => {
    if (currentIndex + 1 >= questions.length) {
      setCurrentIndex(questions.length);
      return;
    }
    setCurrentIndex((prev) => prev + 1);
    setRecordingState('idle');
    setWarnings([]);
    setElapsedSeconds(0);
  };

  const currentResult = currentQuestion ? questionResults[currentQuestion.id] : undefined;
  const answeredResults = questions.map((question) => questionResults[question.id]).filter(Boolean);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Interview Coach</h1>
        <p className="text-lg text-gray-600">
          Practice with AI-guided interview questions. Record your answers, receive instant feedback,
          and download a comprehensive evaluation report.
        </p>
      </div>

      <section className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">1. Prepare</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <FileUpload
              onFileSelect={setJobDescriptionFile}
              acceptedTypes="application/pdf,.pdf,.doc,.docx,.txt"
              label="Optional: Upload Job Description"
              description="Provide a JD to tailor interview questions (optional)."
              uploadedFile={jobDescriptionFile}
            />
          </div>
          <div className="flex flex-col justify-between space-y-4">
            <div className="text-sm text-gray-600">
              <p className="font-medium text-gray-800 mb-2">How it works:</p>
              <ol className="list-decimal list-inside space-y-1">
                <li>Upload (optional) job description and start the session.</li>
                <li>Record your answer to each question within 3 minutes.</li>
                <li>Receive instant feedback and a detailed final report.</li>
              </ol>
            </div>
            <button
              onClick={startSession}
              disabled={isLoadingQuestions}
              className="self-start px-6 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-400"
            >
              {isLoadingQuestions ? 'Preparing...' : 'Start Interview Session'}
            </button>
          </div>
        </div>
        {warnings.length > 0 && (
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
            <h3 className="text-sm font-semibold text-yellow-700 mb-2">Warnings</h3>
            <ul className="list-disc list-inside text-sm text-yellow-800 space-y-1">
              {warnings.map((warning) => (
                <li key={warning}>{warning}</li>
              ))}
            </ul>
          </div>
        )}
        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md text-red-700">
            {error}
          </div>
        )}
      </section>

      {sessionId && questions.length > 0 && !isFinished && currentQuestion && (
        <section className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-baseline justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Question {currentIndex + 1} of {questions.length}
            </h2>
            <span className="text-sm text-gray-500">
              Max duration: {Math.floor(currentQuestion.durationSeconds / 60)} min
            </span>
          </div>

          <p className="text-lg text-gray-800 mb-6">{currentQuestion.text}</p>

          <div className="flex items-center space-x-6 mb-6">
            <div>
              <span className="text-sm uppercase tracking-wide text-gray-500">Elapsed</span>
              <div className="text-2xl font-semibold text-gray-900">
                {Math.min(elapsedSeconds, currentQuestion.durationSeconds)}s
              </div>
            </div>
            <div>
              <span className="text-sm uppercase tracking-wide text-gray-500">Remaining</span>
              <div className="text-2xl font-semibold text-gray-900">
                {Math.max(currentQuestion.durationSeconds - elapsedSeconds, 0)}s
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {recordingState !== 'recording' && (
              <button
                onClick={startRecording}
                className="px-6 py-2 bg-green-600 text-white rounded-md font-medium hover:bg-green-700 transition-colors"
              >
                Start Recording
              </button>
            )}
            {recordingState === 'recording' && currentQuestion && sessionId && (
              <button
                onClick={() =>
                  stopRecording({
                    session: sessionId,
                    question: currentQuestion,
                    duration: elapsedSeconds,
                  })
                }
                className="px-6 py-2 bg-red-600 text-white rounded-md font-medium hover:bg-red-700 transition-colors"
              >
                Stop &amp; Submit
              </button>
            )}
            {recordingState === 'submitting' && (
              <span className="text-sm text-gray-600">Uploading answer...</span>
            )}
            {recordingState === 'completed' && currentResult && currentIndex < questions.length - 1 && (
              <button
                onClick={goToNextQuestion}
                className="px-6 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors"
              >
                Next Question
              </button>
            )}
          </div>

          {currentResult && (
            <div className="mt-6 border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Feedback</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-500 uppercase mb-1">Transcript</p>
                  <div className="bg-gray-50 border rounded-md p-3 text-sm text-gray-800 whitespace-pre-wrap">
                    {currentResult.response.transcript || '(No transcript available)'}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500 uppercase mb-1">Evaluation Summary</p>
                  <div className="bg-gray-50 border rounded-md p-3 text-sm text-gray-800 space-y-2">
                    <p>
                      <span className="font-medium">Score:</span>{' '}
                      {currentResult.response.evaluation.overallScore ?? 'N/A'}
                    </p>
                    <p>
                      <span className="font-medium">Summary:</span>{' '}
                      {currentResult.response.evaluation.summary ?? 'No summary provided.'}
                    </p>
                    {currentResult.response.evaluation.strengths &&
                      currentResult.response.evaluation.strengths.length > 0 && (
                        <div>
                          <p className="font-medium">Strengths</p>
                          <ul className="list-disc list-inside text-sm text-gray-700">
                            {currentResult.response.evaluation.strengths.map((item) => (
                              <li key={item}>{item}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    {currentResult.response.evaluation.improvements &&
                      currentResult.response.evaluation.improvements.length > 0 && (
                        <div>
                          <p className="font-medium">Improvements</p>
                          <ul className="list-disc list-inside text-sm text-gray-700">
                            {currentResult.response.evaluation.improvements.map((item) => (
                              <li key={item}>{item}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>
      )}

      {answeredResults.length > 0 && (
        <section className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Answered Questions</h2>
          <div className="space-y-4">
            {questions.map((question, index) => {
              const result = questionResults[question.id];
              if (!result) return null;
              const score = result.response.evaluation.overallScore;
              return (
                <div key={question.id} className="border rounded-md p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">
                      Q{index + 1}. {question.text}
                    </h3>
                    <span className="text-sm text-gray-500">
                      Score: {typeof score === 'number' ? score : 'N/A'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    Duration: {result.response.durationSeconds.toFixed(1)}s
                  </p>
                  <p className="text-sm text-gray-700">
                    {result.response.evaluation.summary || 'No summary'}
                  </p>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {isFinished && (
        <section className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Final Report</h2>
            {reportDownloadUrl && (
              <a
                href={reportDownloadUrl}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors"
              >
                Download Report
              </a>
            )}
          </div>
          {isFetchingReport && <p className="text-sm text-gray-600">Generating report...</p>}
          {!isFetchingReport && reportMarkdown && (
            <div className="bg-gray-50 border rounded-md p-4 max-h-96 overflow-y-auto whitespace-pre-wrap text-sm">
              {reportMarkdown}
            </div>
          )}
          {!isFetchingReport && !reportMarkdown && (
            <p className="text-sm text-gray-600">Report not available.</p>
          )}
        </section>
      )}
    </div>
  );
};

export default InterviewCoach;

