import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  acceptedTypes: string;
  label: string;
  description: string;
  uploadedFile?: File;
}

const FileUpload = ({
  onFileSelect,
  acceptedTypes,
  label,
  description,
  uploadedFile
}: FileUploadProps) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onFileSelect(acceptedFiles[0]);
    }
  }, [onFileSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      [acceptedTypes]: []
    },
    multiple: false
  });

  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
          isDragActive
            ? 'border-blue-500 bg-blue-50'
            : uploadedFile
            ? 'border-green-500 bg-green-50'
            : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
        }`}
      >
        <input {...getInputProps()} />
        <div className="space-y-2">
          {uploadedFile ? (
            <>
              <div className="text-green-600">
                <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-sm font-medium text-green-700">
                {uploadedFile.name}
              </p>
              <p className="text-xs text-green-600">
                File uploaded successfully
              </p>
            </>
          ) : (
            <>
              <div className="text-gray-400">
                <svg className="mx-auto h-12 w-12" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                  <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <p className="text-sm text-gray-600">
                {isDragActive ? 'Drop the file here...' : 'Click to upload or drag and drop'}
              </p>
              <p className="text-xs text-gray-500">
                {description}
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default FileUpload;