import { File, Video, Music, Image, FileText } from "lucide-react";

export const getFileIcon = (filename: string) => {
  const extension = filename.split('.').pop()?.toLowerCase();
  
  const videoExtensions = ['mp4', 'avi', 'mov', 'mkv', 'wmv', 'flv', 'webm', '3gp', 'm4v'];
  const audioExtensions = ['mp3', 'wav', 'flac', 'aac', 'ogg', 'm4a', 'wma'];
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg', 'ico'];
  const documentExtensions = ['pdf', 'doc', 'docx', 'txt', 'rtf', 'odt'];
  
  if (videoExtensions.includes(extension || '')) {
    return Video;
  }
  if (audioExtensions.includes(extension || '')) {
    return Music;
  }
  if (imageExtensions.includes(extension || '')) {
    return Image;
  }
  if (documentExtensions.includes(extension || '')) {
    return FileText;
  }
  
  return File;
};

export const getFileColor = (filename: string) => {
  const extension = filename.split('.').pop()?.toLowerCase();
  
  const videoExtensions = ['mp4', 'avi', 'mov', 'mkv', 'wmv', 'flv', 'webm', '3gp', 'm4v'];
  const audioExtensions = ['mp3', 'wav', 'flac', 'aac', 'ogg', 'm4a', 'wma'];
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg', 'ico'];
  const documentExtensions = ['pdf', 'doc', 'docx', 'txt', 'rtf', 'odt'];
  
  if (videoExtensions.includes(extension || '')) {
    return 'text-red-500';
  }
  if (audioExtensions.includes(extension || '')) {
    return 'text-green-500';
  }
  if (imageExtensions.includes(extension || '')) {
    return 'text-purple-500';
  }
  if (documentExtensions.includes(extension || '')) {
    return 'text-blue-500';
  }
  
  return 'text-gray-500';
}; 