import React, { useCallback, useState } from 'react';
import { UploadCloud, Image as ImageIcon, Loader2 } from 'lucide-react';
import { ImageFile } from '../types';

interface UploadAreaProps {
  onImageSelected: (image: ImageFile) => void;
  isLoading?: boolean;
}

export const UploadArea: React.FC<UploadAreaProps> = ({ onImageSelected, isLoading }) => {
  const [isDragging, setIsDragging] = useState(false);

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      // Extract pure base64
      const base64 = result.split(',')[1];
      onImageSelected({
        file,
        preview: result,
        base64,
        mimeType: file.type
      });
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  return (
    <div 
      className={`relative w-full max-w-2xl mx-auto h-80 rounded-2xl border-2 border-dashed transition-all duration-300 ease-in-out
        ${isDragging 
          ? 'border-indigo-500 bg-indigo-500/10 scale-[1.02]' 
          : 'border-slate-700 bg-slate-800/50 hover:border-slate-600 hover:bg-slate-800'
        } flex flex-col items-center justify-center cursor-pointer group overflow-hidden`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input 
        type="file" 
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
        onChange={handleFileChange}
        accept="image/*"
        disabled={isLoading}
      />
      
      <div className="flex flex-col items-center space-y-4 text-center p-6 transition-transform duration-300 group-hover:-translate-y-1">
        <div className={`p-4 rounded-full ${isDragging ? 'bg-indigo-500/20' : 'bg-slate-700'} transition-colors`}>
          {isLoading ? (
            <Loader2 className="w-10 h-10 text-indigo-400 animate-spin" />
          ) : (
            <UploadCloud className={`w-10 h-10 ${isDragging ? 'text-indigo-400' : 'text-slate-400'}`} />
          )}
        </div>
        <div className="space-y-1">
          <p className="text-lg font-medium text-slate-200">
            {isLoading ? 'Processing...' : 'Drop your product image here'}
          </p>
          <p className="text-sm text-slate-500">
            {isLoading ? 'Please wait' : 'or click to browse files'}
          </p>
        </div>
        {!isLoading && (
          <div className="flex items-center space-x-4 pt-4 text-xs text-slate-600 font-mono">
            <span className="flex items-center"><ImageIcon className="w-3 h-3 mr-1" /> JPG</span>
            <span className="flex items-center"><ImageIcon className="w-3 h-3 mr-1" /> PNG</span>
            <span className="flex items-center"><ImageIcon className="w-3 h-3 mr-1" /> WEBP</span>
          </div>
        )}
      </div>
    </div>
  );
};