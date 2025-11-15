import { useState } from 'react';
import FileUpload from '../../components/FileUpload/FileUpload';
import { pptService } from '../../services/api';

const PPTGenerator = () => {
  const [resumeFile, setResumeFile] = useState<File | undefined>();
  const [jdFile, setJdFile] = useState<File | undefined>();
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [downloadUrl, setDownloadUrl] = useState<string | undefined>();
  const [filename, setFilename] = useState<string | undefined>();
  const [warnings, setWarnings] = useState<string[] | undefined>();

  const handleResumeUpload = (file: File) => {
    setResumeFile(file);
    setError(undefined);
  };

  const handleJobDescriptionUpload = (file: File) => {
    setJdFile(file);
    setError(undefined);
  };

  const handleGenerate = async () => {
    if (!resumeFile || !jdFile) {
      setError('请上传简历和岗位JD文件');
      return;
    }

    setIsGenerating(true);
    setError(undefined);
    setDownloadUrl(undefined);
    setFilename(undefined);
    setWarnings(undefined);

    try {
      const response = await pptService.generatePPT({
        resumeFile,
        jobDescriptionFile: jdFile,
      });

      if (response.success) {
        setDownloadUrl(response.downloadUrl);
        setFilename(response.filename);
        setWarnings(response.warnings || undefined);
      } else {
        setError(response.message || '生成PPT失败');
      }
    } catch (err) {
      setError('生成PPT时发生错误，请重试');
      console.error('Error generating PPT:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleReset = () => {
    setResumeFile(undefined);
    setJdFile(undefined);
    setError(undefined);
    setDownloadUrl(undefined);
    setFilename(undefined);
    setWarnings(undefined);
  };

  const canGenerate = resumeFile && jdFile && !isGenerating;

  const getDownloadUrl = () => {
    if (!downloadUrl) return '';
    // downloadUrl已经是完整的API路径，如 /api/files/xxx.pptx
    // 如果已经是完整URL，直接返回
    if (downloadUrl.startsWith('http')) {
      return downloadUrl;
    }
    // 获取base URL，确保不重复/api
    let baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    // 如果baseUrl以/api结尾，去掉它（因为downloadUrl已经包含/api）
    if (baseUrl.endsWith('/api')) {
      baseUrl = baseUrl.slice(0, -4);
    }
    // 确保baseUrl不以/结尾
    baseUrl = baseUrl.replace(/\/$/, '');
    return `${baseUrl}${downloadUrl}`;
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">自我介绍PPT生成器</h1>
        <p className="text-lg text-gray-600">
          上传您的简历和岗位JD，我们将使用AI为您生成一份专业的自我介绍PPT。
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div>
            <FileUpload
              onFileSelect={handleResumeUpload}
              acceptedTypes="application/pdf,.pdf,.doc,.docx"
              label="上传简历"
              description="支持PDF、DOC、DOCX格式，最大10MB"
              uploadedFile={resumeFile}
            />
          </div>
          <div>
            <FileUpload
              onFileSelect={handleJobDescriptionUpload}
              acceptedTypes="application/pdf,.pdf,.doc,.docx,.txt"
              label="上传岗位JD"
              description="支持PDF、DOC、DOCX、TXT格式，最大10MB"
              uploadedFile={jdFile}
            />
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {warnings && warnings.length > 0 && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
            <h3 className="text-sm font-semibold text-yellow-700 mb-2">提示</h3>
            <ul className="list-disc list-inside text-sm text-yellow-800 space-y-1">
              {warnings.map((warning, index) => (
                <li key={index}>{warning}</li>
              ))}
            </ul>
          </div>
        )}

        {downloadUrl && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-700 font-medium">PPT生成成功！</p>
                <p className="text-sm text-green-600 mt-1">
                  文件名: {filename}
                </p>
              </div>
              <a
                href={getDownloadUrl()}
                download={filename}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                下载PPT
              </a>
            </div>
          </div>
        )}

        <div className="flex justify-between">
          <button
            onClick={handleReset}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            重置
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
            {isGenerating ? '生成中...' : '生成PPT'}
          </button>
        </div>
      </div>

      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">使用说明</h3>
        <ul className="list-disc list-inside text-sm text-blue-800 space-y-2">
          <li>上传您的简历文件（PDF或Word格式）</li>
          <li>上传目标岗位的JD文件（PDF、Word或TXT格式）</li>
          <li>点击"生成PPT"按钮，系统将使用AI分析并生成PPT内容结构</li>
          <li>生成完成后，您可以下载PPT文件</li>
          <li>PPT将包含封面、个人简介、核心技能、项目经历、优势总结等内容</li>
        </ul>
      </div>
    </div>
  );
};

export default PPTGenerator;

