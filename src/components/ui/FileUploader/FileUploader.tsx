
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { cn } from '../../../lib/utils';
import { validators } from '../../../utils/validators';
import { FILE_TYPES, MAX_FILE_SIZE } from '../../../utils/constants';

interface FileUploaderProps {
  onFilesChange: (files: File[]) => void;
  acceptedFileTypes?: string[];
  maxFileSize?: number;
  maxFiles?: number;
  multiple?: boolean;
  disabled?: boolean;
  className?: string;
}

const FileUploader: React.FC<FileUploaderProps> = ({
  onFilesChange,
  acceptedFileTypes = [...FILE_TYPES.AUDIO, ...FILE_TYPES.DOCUMENT],
  maxFileSize = MAX_FILE_SIZE,
  maxFiles = 5,
  multiple = true,
  disabled = false,
  className,
}) => {
  const [files, setFiles] = useState<File[]>([]);
  const [errors, setErrors] = useState<string[]>([]);

  const onDrop = useCallback(
    (acceptedFiles: File[], fileRejections: any[]) => {
      const newErrors: string[] = [];
      const validFiles: File[] = [];

      // Process accepted files
      acceptedFiles.forEach((file) => {
        if (!validators.fileType(file, acceptedFileTypes)) {
          newErrors.push(`${file.name}: File type not supported`);
          return;
        }

        if (!validators.fileSize(file, maxFileSize)) {
          newErrors.push(`${file.name}: File size too large (max ${maxFileSize / 1024 / 1024}MB)`);
          return;
        }

        validFiles.push(file);
      });

      // Process rejected files
      fileRejections.forEach(({ file, errors }) => {
        errors.forEach((error: any) => {
          newErrors.push(`${file.name}: ${error.message}`);
        });
      });

      if (validFiles.length + files.length > maxFiles) {
        newErrors.push(`Maximum ${maxFiles} files allowed`);
        return;
      }

      const updatedFiles = multiple ? [...files, ...validFiles] : validFiles;
      setFiles(updatedFiles);
      setErrors(newErrors);
      onFilesChange(updatedFiles);
    },
    [files, acceptedFileTypes, maxFileSize, maxFiles, multiple, onFilesChange]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    disabled,
    multiple,
    accept: acceptedFileTypes.reduce((acc, type) => {
      acc[`.${type}`] = [];
      return acc;
    }, {} as Record<string, string[]>),
  });

  const removeFile = (index: number) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    setFiles(updatedFiles);
    onFilesChange(updatedFiles);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className={cn('w-full', className)}>
      <div
        {...getRootProps()}
        className={cn(
          'border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer transition-colors',
          isDragActive && 'border-blue-500 bg-blue-50',
          disabled && 'cursor-not-allowed opacity-50',
          !disabled && 'hover:border-blue-400 hover:bg-gray-50'
        )}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            stroke="currentColor"
            fill="none"
            viewBox="0 0 48 48"
          >
            <path
              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <div className="mt-4">
            <p className="text-sm text-gray-600">
              {isDragActive
                ? 'Drop the files here...'
                : 'Drag & drop files here, or click to select'}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Supported formats: {acceptedFileTypes.join(', ')} (max {formatFileSize(maxFileSize)})
            </p>
          </div>
        </div>
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Selected Files:</h4>
          <div className="space-y-2">
            {files.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 bg-gray-50 rounded-md"
              >
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-700">{file.name}</p>
                  <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                </div>
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="ml-2 text-red-600 hover:text-red-800"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Errors */}
      {errors.length > 0 && (
        <div className="mt-4">
          <div className="bg-red-50 border border-red-200 rounded-md p-3">
            <h4 className="text-sm font-medium text-red-800">Upload Errors:</h4>
            <ul className="mt-1 text-sm text-red-700 list-disc list-inside">
              {errors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUploader;
