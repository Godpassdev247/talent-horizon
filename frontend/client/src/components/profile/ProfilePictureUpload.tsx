/**
 * Profile Picture Upload Component
 * Handles profile picture upload, preview, and removal
 */

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, Upload, Trash2, X, Check, Image as ImageIcon, ZoomIn, ZoomOut, RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProfilePictureUploadProps {
  currentImage?: string | null;
  initials: string;
  onUpload: (imageData: string) => void;
  onRemove: () => void;
  size?: "sm" | "md" | "lg" | "xl";
}

export const ProfilePictureUpload = ({
  currentImage,
  initials,
  onUpload,
  onRemove,
  size = "lg"
}: ProfilePictureUploadProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sizeClasses = {
    sm: "w-16 h-16",
    md: "w-24 h-24",
    lg: "w-32 h-32",
    xl: "w-40 h-40"
  };

  const textSizeClasses = {
    sm: "text-xl",
    md: "text-2xl",
    lg: "text-4xl",
    xl: "text-5xl"
  };

  const handleFileSelect = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Image must be less than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewImage(e.target?.result as string);
      setZoom(1);
      setRotation(0);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  }, [handleFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileSelect(file);
  };

  const handleUpload = async () => {
    if (!previewImage) return;

    setIsUploading(true);
    setUploadProgress(0);

    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 100);

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    clearInterval(progressInterval);
    setUploadProgress(100);

    // Apply transformations and save
    onUpload(previewImage);
    
    setTimeout(() => {
      setIsUploading(false);
      setIsModalOpen(false);
      setPreviewImage(null);
      setUploadProgress(0);
    }, 500);
  };

  const handleRemove = () => {
    onRemove();
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setPreviewImage(null);
    setIsModalOpen(false);
    setZoom(1);
    setRotation(0);
  };

  return (
    <>
      {/* Profile Picture Display */}
      <div className="relative group">
        <div className={`${sizeClasses[size]} rounded-2xl overflow-hidden border-4 border-white shadow-xl`}>
          {currentImage ? (
            <img 
              src={currentImage} 
              alt="Profile" 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
              <span className={`text-white font-bold ${textSizeClasses[size]}`}>
                {initials}
              </span>
            </div>
          )}
        </div>
        
        {/* Camera Button Overlay */}
        <button 
          onClick={() => setIsModalOpen(true)}
          className="absolute bottom-2 right-2 bg-white rounded-full p-2 shadow-lg border border-slate-200 hover:bg-slate-50 transition-all duration-200 hover:scale-110"
        >
          <Camera className="w-4 h-4 text-slate-600" />
        </button>

        {/* Hover Overlay */}
        <div 
          onClick={() => setIsModalOpen(true)}
          className="absolute inset-0 bg-black/40 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center cursor-pointer"
        >
          <Camera className="w-8 h-8 text-white" />
        </div>
      </div>

      {/* Upload Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={(e) => e.target === e.currentTarget && handleCancel()}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-slate-200">
                <h2 className="text-xl font-bold text-slate-800">Profile Picture</h2>
                <button 
                  onClick={handleCancel}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6">
                {!previewImage ? (
                  <>
                    {/* Current Image Preview */}
                    {currentImage && (
                      <div className="mb-6 text-center">
                        <p className="text-sm text-slate-500 mb-3">Current Photo</p>
                        <div className="w-32 h-32 mx-auto rounded-2xl overflow-hidden border-2 border-slate-200">
                          <img 
                            src={currentImage} 
                            alt="Current profile" 
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                    )}

                    {/* Upload Area */}
                    <div
                      onDrop={handleDrop}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onClick={() => fileInputRef.current?.click()}
                      className={`
                        border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-200
                        ${isDragging 
                          ? 'border-[#1e3a5f] bg-[#1e3a5f]/5' 
                          : 'border-slate-300 hover:border-[#1e3a5f] hover:bg-slate-50'
                        }
                      `}
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleInputChange}
                        className="hidden"
                      />
                      <div className="w-16 h-16 mx-auto mb-4 bg-[#1e3a5f]/10 rounded-2xl flex items-center justify-center">
                        <Upload className="w-8 h-8 text-[#1e3a5f]" />
                      </div>
                      <p className="text-slate-700 font-medium mb-1">
                        {isDragging ? 'Drop your image here' : 'Click to upload or drag and drop'}
                      </p>
                      <p className="text-sm text-slate-500">
                        PNG, JPG, GIF up to 5MB
                      </p>
                    </div>

                    {/* Remove Button */}
                    {currentImage && (
                      <button
                        onClick={handleRemove}
                        className="w-full mt-4 flex items-center justify-center gap-2 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                        <span className="font-medium">Remove Current Photo</span>
                      </button>
                    )}
                  </>
                ) : (
                  <>
                    {/* Preview Image with Controls */}
                    <div className="mb-6">
                      <div className="relative w-64 h-64 mx-auto rounded-2xl overflow-hidden bg-slate-100 border-2 border-slate-200">
                        <img 
                          src={previewImage} 
                          alt="Preview" 
                          className="w-full h-full object-cover transition-transform duration-200"
                          style={{ 
                            transform: `scale(${zoom}) rotate(${rotation}deg)`,
                          }}
                        />
                        
                        {/* Upload Progress Overlay */}
                        {isUploading && (
                          <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center">
                            <div className="w-16 h-16 mb-3">
                              <svg className="w-full h-full" viewBox="0 0 100 100">
                                <circle
                                  className="text-white/20"
                                  strokeWidth="8"
                                  stroke="currentColor"
                                  fill="transparent"
                                  r="42"
                                  cx="50"
                                  cy="50"
                                />
                                <circle
                                  className="text-white"
                                  strokeWidth="8"
                                  strokeLinecap="round"
                                  stroke="currentColor"
                                  fill="transparent"
                                  r="42"
                                  cx="50"
                                  cy="50"
                                  style={{
                                    strokeDasharray: `${2 * Math.PI * 42}`,
                                    strokeDashoffset: `${2 * Math.PI * 42 * (1 - uploadProgress / 100)}`,
                                    transform: 'rotate(-90deg)',
                                    transformOrigin: '50% 50%',
                                    transition: 'stroke-dashoffset 0.3s ease'
                                  }}
                                />
                              </svg>
                            </div>
                            <p className="text-white font-medium">{uploadProgress}%</p>
                          </div>
                        )}
                      </div>

                      {/* Image Controls */}
                      <div className="flex items-center justify-center gap-4 mt-4">
                        <button
                          onClick={() => setZoom(Math.max(0.5, zoom - 0.1))}
                          className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                          title="Zoom Out"
                        >
                          <ZoomOut className="w-5 h-5 text-slate-600" />
                        </button>
                        <div className="w-32 h-2 bg-slate-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-[#1e3a5f] rounded-full transition-all"
                            style={{ width: `${((zoom - 0.5) / 1.5) * 100}%` }}
                          />
                        </div>
                        <button
                          onClick={() => setZoom(Math.min(2, zoom + 0.1))}
                          className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                          title="Zoom In"
                        >
                          <ZoomIn className="w-5 h-5 text-slate-600" />
                        </button>
                        <div className="w-px h-6 bg-slate-200" />
                        <button
                          onClick={() => setRotation((rotation + 90) % 360)}
                          className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                          title="Rotate"
                        >
                          <RotateCw className="w-5 h-5 text-slate-600" />
                        </button>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                      <Button
                        variant="outline"
                        onClick={() => setPreviewImage(null)}
                        className="flex-1"
                        disabled={isUploading}
                      >
                        Choose Different
                      </Button>
                      <Button
                        onClick={handleUpload}
                        className="flex-1 bg-[#1e3a5f] hover:bg-[#2d5a8a]"
                        disabled={isUploading}
                      >
                        {isUploading ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                            Uploading...
                          </>
                        ) : (
                          <>
                            <Check className="w-4 h-4 mr-2" />
                            Save Photo
                          </>
                        )}
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ProfilePictureUpload;
