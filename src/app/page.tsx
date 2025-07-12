"use client";

import { useState, useCallback, useEffect } from "react";
import { Upload, File, Download, X, Settings, Play, CheckCircle, AlertCircle, Loader2, Image, Video, FileText } from "lucide-react";
import { convert } from "@/utils/convert";
import { loadFFmpeg } from "@/utils/loadffmpeg";
import { Action } from "@/lib/types";
import { getFileIcon, getFileColor } from "@/utils/fileIcons";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";

type FileType = 'image' | 'video' | 'all';

export default function Home() {
  const [files, setFiles] = useState<Action[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isConverting, setIsConverting] = useState(false);
  const [isFFmpegLoading, setIsFFmpegLoading] = useState(false);
  const [ffmpeg, setFFmpeg] = useState<any>(null);
  const [selectedFileType, setSelectedFileType] = useState<FileType>('all');

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

  const getAcceptedFileTypes = (fileType: FileType) => {
    switch (fileType) {
      case 'image':
        return 'image/*';
      case 'video':
        return 'video/*';
      default:
        return 'image/*,video/*';
    }
  };

  const getSupportedFormats = (fileType: FileType) => {
    switch (fileType) {
      case 'image':
        return ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'tiff', 'svg'];
      case 'video':
        return ['mp4', 'avi', 'mov', 'mkv', 'wmv', 'flv', 'webm', '3gp', 'mp3', 'wav', 'aac'];
      default:
        return ['mp4', 'avi', 'mov', 'mkv', 'wmv', 'flv', 'webm', '3gp', 'jpg', 'jpeg', 'png', 'gif', 'webp', 'mp3', 'wav', 'aac'];
    }
  };

  const getDefaultFormat = (fileType: FileType) => {
    switch (fileType) {
      case 'image':
        return 'jpg';
      case 'video':
        return 'mp4';
      default:
        return 'mp4';
    }
  };

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
      to: getDefaultFormat(selectedFileType),
      type: file.type,
      converting: false,
      converted: false
    }));
    
    setFiles(prev => [...prev, ...newFiles]);
  }, [selectedFileType]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    const newFiles: Action[] = selectedFiles.map(file => ({
      file,
      filename: file.name,
      size: file.size,
      from: file.name.split('.').pop() || '',
      to: getDefaultFormat(selectedFileType),
      type: file.type,
      converting: false,
      converted: false
    }));
    
    setFiles(prev => [...prev, ...newFiles]);
  }, [selectedFileType]);

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

  const getFileTypeIcon = (type: FileType) => {
    switch (type) {
      case 'image':
        return Image;
      case 'video':
        return Video;
      default:
        return FileText;
    }
  };

  const getFileTypeDescription = (type: FileType) => {
    switch (type) {
      case 'image':
        return 'Convert images to different formats like JPG, PNG, WebP, and more';
      case 'video':
        return 'Convert videos to different formats like MP4, AVI, MOV, and extract audio';
      default:
        return 'Convert both images and videos to different formats';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            File Converter
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Convert your files to different formats with ease. Choose your file type and start converting.
          </p>
          
          {/* FFmpeg Loading Status */}
          {isFFmpegLoading && (
            <Alert className="mt-4 max-w-md mx-auto">
              <Loader2 className="h-4 w-4 animate-spin" />
              <AlertDescription>
                Loading FFmpeg... This may take a moment.
              </AlertDescription>
            </Alert>
          )}
          
          {/* Stats */}
          {files.length > 0 && (
            <div className="mt-6 flex justify-center gap-4">
              <Badge variant="secondary" className="text-sm">
                {files.length} Total Files
              </Badge>
              <Badge variant="default" className="text-sm">
                {files.filter(f => f.converted).length} Converted
              </Badge>
              <Badge variant="outline" className="text-sm">
                {files.filter(f => f.converting).length} Converting
              </Badge>
            </div>
          )}
        </div>

        {/* File Type Selection */}
        <div className="max-w-4xl mx-auto mb-8">
          <Tabs defaultValue="all" className="w-full" onValueChange={(value) => setSelectedFileType(value as FileType)}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                All Files
              </TabsTrigger>
              <TabsTrigger value="image" className="flex items-center gap-2">
                <Image className="h-4 w-4" />
                Images
              </TabsTrigger>
              <TabsTrigger value="video" className="flex items-center gap-2">
                <Video className="h-4 w-4" />
                Videos
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    All File Types
                  </CardTitle>
                  <CardDescription>
                    {getFileTypeDescription('all')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div
                    className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
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
                      Support for images and videos
                    </p>
                    <input
                      type="file"
                      multiple
                      onChange={handleFileSelect}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      accept={getAcceptedFileTypes('all')}
                    />
                    <Button>Choose Files</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="image" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Image className="h-5 w-5" />
                    Image Converter
                  </CardTitle>
                  <CardDescription>
                    {getFileTypeDescription('image')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div
                    className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
                      isDragOver
                        ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                        : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                    }`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    <Image className="mx-auto h-12 w-12 text-purple-400 mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      Drop images here or click to browse
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-6">
                      JPG, PNG, GIF, WebP, and more
                    </p>
                    <input
                      type="file"
                      multiple
                      onChange={handleFileSelect}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      accept={getAcceptedFileTypes('image')}
                    />
                    <Button>Choose Images</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="video" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Video className="h-5 w-5" />
                    Video Converter
                  </CardTitle>
                  <CardDescription>
                    {getFileTypeDescription('video')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div
                    className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
                      isDragOver
                        ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                        : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                    }`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    <Video className="mx-auto h-12 w-12 text-red-400 mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      Drop videos here or click to browse
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-6">
                      MP4, AVI, MOV, and extract audio
                    </p>
                    <input
                      type="file"
                      multiple
                      onChange={handleFileSelect}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      accept={getAcceptedFileTypes('video')}
                    />
                    <Button>Choose Videos</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
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
                  <Button
                    onClick={convertAllFiles}
                    disabled={isConverting || !ffmpeg}
                    className="flex items-center gap-2"
                  >
                    {isConverting ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Play className="h-4 w-4" />
                    )}
                    Convert All
                  </Button>
                )}
                <Button
                  variant="destructive"
                  onClick={() => setFiles([])}
                  className="flex items-center gap-2"
                >
                  <X className="h-4 w-4" />
                  Clear All
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              {files.map((file, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
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
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(index)}
                        className="text-gray-400 hover:text-red-500"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 mb-4">
                      <div className="flex-1 w-full">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Convert to:
                        </label>
                        <Select value={file.to} onValueChange={(value) => updateFileFormat(index, value)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {getSupportedFormats(selectedFileType).map(format => (
                              <SelectItem key={format} value={format}>
                                {format.toUpperCase()}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="w-full sm:w-auto">
                        {!file.converted && !file.converting && !file.error && (
                          <Button
                            onClick={() => convertFile(file, index)}
                            disabled={!ffmpeg}
                            className="w-full sm:w-auto flex items-center gap-2"
                          >
                            <Play className="h-4 w-4" />
                            Convert
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* Status */}
                    <div className="flex items-center gap-2 mb-4">
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
                        <Alert variant="destructive">
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription>{file.error}</AlertDescription>
                        </Alert>
                      )}
                    </div>

                    {/* Download Link */}
                    {file.converted && file.url && (
                      <Button asChild className="w-full sm:w-auto">
                        <a
                          href={file.url}
                          download={file.output}
                          className="flex items-center gap-2"
                        >
                          <Download className="h-4 w-4" />
                          Download Converted File
                        </a>
                      </Button>
                    )}
                  </CardContent>
                </Card>
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
