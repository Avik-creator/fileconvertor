"use client";

import { useState, useCallback, useEffect } from "react";
import { Upload, Download, X, Play, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { convert } from "@/utils/convert";
import { loadFFmpeg } from "@/utils/loadffmpeg";
import { Action } from "@/lib/types";
import { getFileIcon, getFileColor } from "@/utils/fileIcons";
import { FFmpeg } from "@ffmpeg/ffmpeg";

export default function Home() {
  const [files, setFiles] = useState<Action[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isConverting, setIsConverting] = useState(false);
  const [isFFmpegLoading, setIsFFmpegLoading] = useState(false);
  const [ffmpeg, setFFmpeg] = useState<FFmpeg | null>(null);

  // Initialize FFmpeg on component mount
  useEffect(() => {
    const initFFmpeg = async () => {
      setIsFFmpegLoading(true);
      try {
        const ffmpegInstance = await loadFFmpeg();
        setFFmpeg(ffmpegInstance);
      } catch (error) {
        console.error('Failed to load FFmpeg:', error);
      } finally {
        setIsFFmpegLoading(false);
      }
    };

    initFFmpeg();
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    const newFiles: Action[] = droppedFiles.map(file => ({
      file,
      filename: file.name,
      size: file.size,
      from: file.name.split('.').pop() || '',
      to: 'mp4',
      type: file.type,
      converting: false,
      converted: false
    }));
    
    setFiles(prev => [...prev, ...newFiles]);
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    const newFiles: Action[] = selectedFiles.map(file => ({
      file,
      filename: file.name,
      size: file.size,
      from: file.name.split('.').pop() || '',
      to: 'mp4',
      type: file.type,
      converting: false,
      converted: false
    }));
    
    setFiles(prev => [...prev, ...newFiles]);
  }, []);

  const removeFile = useCallback((index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  }, []);

  const updateFileFormat = useCallback((index: number, format: string) => {
    setFiles(prev => prev.map((file, i) => 
      i === index ? { ...file, to: format } : file
    ));
  }, []);

  const convertFile = useCallback(async (file: Action, index: number) => {
    if (!ffmpeg) {
      setFiles(prev => prev.map((f, i) => 
        i === index ? { 
          ...f, 
          error: 'FFmpeg not loaded. Please wait and try again.'
        } : f
      ));
      return;
    }

    try {
      setFiles(prev => prev.map((f, i) => 
        i === index ? { ...f, converting: true, error: undefined } : f
      ));

      const result = await convert(ffmpeg, file);
      
      setFiles(prev => prev.map((f, i) => 
        i === index ? { 
          ...f, 
          converting: false, 
          converted: true, 
          url: result.url,
          output: result.output
        } : f
      ));
    } catch (error) {
      setFiles(prev => prev.map((f, i) => 
        i === index ? { 
          ...f, 
          converting: false, 
          error: error instanceof Error ? error.message : 'Conversion failed'
        } : f
      ));
    }
  }, [ffmpeg]);

  const convertAllFiles = useCallback(async () => {
    if (!ffmpeg) {
      alert('FFmpeg not loaded. Please wait and try again.');
      return;
    }

    setIsConverting(true);
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file.converted && !file.converting) {
        await convertFile(file, i);
      }
    }
    
    setIsConverting(false);
  }, [files, convertFile, ffmpeg]);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const supportedFormats = ['mp4', 'avi', 'mov', 'mkv', 'wmv', 'flv', 'webm', '3gp', 'mp3', 'wav', 'aac', 'ogg', 'jpg', 'png', 'gif', 'webp'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            File Converter
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Convert your files to different formats with ease. Support for video, audio, and image formats.
          </p>
          
          {/* FFmpeg Loading Status */}
          {isFFmpegLoading && (
            <div className="mt-4 flex items-center justify-center gap-2 text-blue-600 dark:text-blue-400">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Loading FFmpeg...</span>
            </div>
          )}
          
          {/* Stats */}
          {files.length > 0 && (
            <div className="mt-6 flex justify-center gap-8 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <span className="font-medium">{files.length}</span>
                <span>Total Files</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium">{files.filter(f => f.converted).length}</span>
                <span>Converted</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium">{files.filter(f => f.converting).length}</span>
                <span>Converting</span>
              </div>
            </div>
          )}
        </div>

        {/* Upload Area */}
        <div className="max-w-4xl mx-auto mb-8">
          <div
            className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-200 ${
              isDragOver
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Drop files here or click to browse
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Support for video, audio, and image files
            </p>
            <input
              type="file"
              multiple
              onChange={handleFileSelect}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              accept="video/*,audio/*,image/*"
            />
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
              Choose Files
            </button>
          </div>
        </div>

        {/* Files List */}
        {files.length > 0 && (
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                Files ({files.length})
              </h2>
              <div className="flex gap-2">
                {files.some(f => !f.converted && !f.converting) && (
                  <button
                    onClick={convertAllFiles}
                    disabled={isConverting || !ffmpeg}
                    className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 text-sm"
                  >
                    {isConverting ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Play className="h-4 w-4" />
                    )}
                    Convert All
                  </button>
                )}
                <button
                  onClick={() => setFiles([])}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 text-sm"
                >
                  <X className="h-4 w-4" />
                  Clear All
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {files.map((file, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      {(() => {
                        const IconComponent = getFileIcon(file.filename);
                        return <IconComponent className={`h-8 w-8 ${getFileColor(file.filename)}`} />;
                      })()}
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">
                          {file.filename}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {formatFileSize(file.size)}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => removeFile(index)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 mb-4">
                    <div className="flex-1 w-full">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Convert to:
                      </label>
                      <select
                        value={file.to}
                        onChange={(e) => updateFileFormat(index, e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        {supportedFormats.map(format => (
                          <option key={format} value={format}>
                            {format.toUpperCase()}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="w-full sm:w-auto">
                      {!file.converted && !file.converting && !file.error && (
                        <button
                          onClick={() => convertFile(file, index)}
                          disabled={!ffmpeg}
                          className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                        >
                          <Play className="h-4 w-4" />
                          Convert
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Status */}
                  <div className="flex items-center gap-2">
                    {file.converting && (
                      <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Converting...
                      </div>
                    )}
                    {file.converted && (
                      <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                        <CheckCircle className="h-4 w-4" />
                        Converted successfully
                      </div>
                    )}
                    {file.error && (
                      <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                        <AlertCircle className="h-4 w-4" />
                        {file.error}
                      </div>
                    )}
                  </div>

                  {/* Download Link */}
                  {file.converted && file.url && (
                    <div className="mt-4">
                      <a
                        href={file.url}
                        download={file.output}
                        className="inline-flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors w-full sm:w-auto"
                      >
                        <Download className="h-4 w-4" />
                        Download Converted File
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <footer className="text-center mt-16 text-gray-500 dark:text-gray-400">
          <p>Powered by FFmpeg • Built with Next.js</p>
        </footer>
      </div>
    </div>
  );
}
