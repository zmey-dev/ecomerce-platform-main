
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWorkStore } from '../../store/workStore';
import { useToast } from '../../components/ui/Toast/Toast';
import Button from '../../components/ui/Button/Button';
import Input from '../../components/ui/Input/Input';
import FileUploader from '../../components/ui/FileUploader/FileUploader';
import { validators } from '../../utils/validators';
import { FILE_TYPES } from '../../utils/constants';

const RegisterWork: React.FC = () => {
  const [formData, setFormData] = useState({
    title: '',
    authors: [''],
    coAuthors: [''],
    isrc: '',
    iswc: '',
    description: '',
  });
  const [files, setFiles] = useState<File[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { createWork, isLoading } = useWorkStore();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!validators.required(formData.title)) {
      newErrors.title = 'Title is required';
    }

    if (!formData.authors.some(author => validators.required(author))) {
      newErrors.authors = 'At least one author is required';
    }

    if (formData.isrc && !validators.isrc(formData.isrc)) {
      newErrors.isrc = 'Invalid ISRC format (CC-XXX-YY-NNNNN)';
    }

    if (formData.iswc && !validators.iswc(formData.iswc)) {
      newErrors.iswc = 'Invalid ISWC format (T-DDD.DDD.DDD-C)';
    }

    if (files.length === 0) {
      newErrors.files = 'At least one file is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const formDataToSend = new FormData();
      
      // Add work data
      formDataToSend.append('title', formData.title);
      formDataToSend.append('authors', JSON.stringify(formData.authors.filter(a => a.trim())));
      formDataToSend.append('coAuthors', JSON.stringify(formData.coAuthors.filter(a => a.trim())));
      formDataToSend.append('isrc', formData.isrc);
      formDataToSend.append('iswc', formData.iswc);
      formDataToSend.append('description', formData.description);

      // Add files
      files.forEach((file) => {
        formDataToSend.append('files', file);
      });

      await createWork(formDataToSend);
      
      showToast({
        type: 'success',
        title: 'Work Registered',
        message: 'Your work has been successfully registered and is pending review.',
      });
      
      navigate('/my-works');
    } catch (error: any) {
      showToast({
        type: 'error',
        title: 'Registration Failed',
        message: error.response?.data?.message || 'Failed to register work. Please try again.',
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleAuthorChange = (index: number, value: string, type: 'authors' | 'coAuthors') => {
    setFormData((prev) => ({
      ...prev,
      [type]: prev[type].map((author, i) => i === index ? value : author),
    }));
  };

  const addAuthor = (type: 'authors' | 'coAuthors') => {
    setFormData((prev) => ({
      ...prev,
      [type]: [...prev[type], ''],
    }));
  };

  const removeAuthor = (index: number, type: 'authors' | 'coAuthors') => {
    setFormData((prev) => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">Register New Work</h1>
            <p className="mt-1 text-gray-600">
              Register your musical work to protect your rights and enable monetization.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="px-6 py-6 space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Basic Information</h3>
              
              <Input
                label="Work Title *"
                name="title"
                value={formData.title}
                onChange={handleChange}
                error={errors.title}
                placeholder="Enter the title of your work"
                required
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className="block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Describe your work (optional)"
                />
              </div>
            </div>

            {/* Authors */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Authors</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Main Authors *
                </label>
                {formData.authors.map((author, index) => (
                  <div key={index} className="flex items-center space-x-2 mb-2">
                    <Input
                      value={author}
                      onChange={(e) => handleAuthorChange(index, e.target.value, 'authors')}
                      placeholder="Author name"
                      className="flex-1"
                    />
                    {formData.authors.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeAuthor(index, 'authors')}
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addAuthor('authors')}
                >
                  Add Author
                </Button>
                {errors.authors && (
                  <p className="mt-1 text-sm text-red-600">{errors.authors}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Co-Authors (Optional)
                </label>
                {formData.coAuthors.map((coAuthor, index) => (
                  <div key={index} className="flex items-center space-x-2 mb-2">
                    <Input
                      value={coAuthor}
                      onChange={(e) => handleAuthorChange(index, e.target.value, 'coAuthors')}
                      placeholder="Co-author name"
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeAuthor(index, 'coAuthors')}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addAuthor('coAuthors')}
                >
                  Add Co-Author
                </Button>
              </div>
            </div>

            {/* Codes */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Identification Codes</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="ISRC (Optional)"
                  name="isrc"
                  value={formData.isrc}
                  onChange={handleChange}
                  error={errors.isrc}
                  placeholder="CC-XXX-YY-NNNNN"
                  helperText="International Standard Recording Code"
                />

                <Input
                  label="ISWC (Optional)"
                  name="iswc"
                  value={formData.iswc}
                  onChange={handleChange}
                  error={errors.iswc}
                  placeholder="T-DDD.DDD.DDD-C"
                  helperText="International Standard Musical Work Code"
                />
              </div>
            </div>

            {/* File Upload */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Files</h3>
              <FileUploader
                onFilesChange={setFiles}
                acceptedFileTypes={[...FILE_TYPES.AUDIO, ...FILE_TYPES.DOCUMENT]}
                multiple={true}
                maxFiles={10}
              />
              {errors.files && (
                <p className="text-sm text-red-600">{errors.files}</p>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end space-x-4 pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/dashboard')}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                isLoading={isLoading}
              >
                Register Work
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterWork;
