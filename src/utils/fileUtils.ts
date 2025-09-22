export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const isValidFileType = (file: File, acceptedTypes: string[]): boolean => {
  return acceptedTypes.some(type => {
    if (type.startsWith('.')) {
      return file.name.toLowerCase().endsWith(type.toLowerCase());
    }
    return file.type === type;
  });
};

export const getFileExtension = (filename: string): string => {
  return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2);
};

export const validateFile = (file: File, maxSizeBytes: number = 10 * 1024 * 1024): { isValid: boolean; error?: string } => {
  if (file.size > maxSizeBytes) {
    return {
      isValid: false,
      error: `File size exceeds ${formatFileSize(maxSizeBytes)} limit`
    };
  }

  const allowedTypes = ['.pdf', '.doc', '.docx', '.txt'];
  if (!isValidFileType(file, allowedTypes)) {
    return {
      isValid: false,
      error: 'File type not supported. Please use PDF, DOC, DOCX, or TXT files.'
    };
  }

  return { isValid: true };
};

export const downloadBlob = (blob: Blob, filename: string): void => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};