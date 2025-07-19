# 🔄 File Converter

A modern, web-based file converter built with Next.js that allows you to convert images and videos to different formats directly in your browser using FFmpeg WebAssembly.

![File Converter](https://fileconvertor-beryl.vercel.app/FileConverter.png)

## ✨ Features

### 🖼️ Image Conversion
- **Supported Formats**: JPG, JPEG, PNG, GIF, BMP, WebP, TIFF
- **High Quality**: Maintains image quality during conversion
- **Batch Processing**: Convert multiple images at once

### 🎥 Video Conversion
- **Supported Formats**: MP4, AVI, MOV, MKV, WMV, FLV, WebM, 3GP
- **Audio Extraction**: Extract audio as MP3, WAV, AAC
- **Optimized Output**: Smart encoding for different formats

### 🚀 Key Features
- **Client-Side Processing**: All conversions happen in your browser - no uploads to servers
- **Privacy First**: Your files never leave your device
- **Modern UI**: Beautiful, responsive interface with dark mode support
- **Drag & Drop**: Easy file selection with drag and drop functionality
- **Real-time Progress**: Live conversion status and progress indicators
- **Batch Operations**: Convert multiple files simultaneously
- **Format Detection**: Automatic file type detection and format suggestions

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) with App Router
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **UI Components**: [Radix UI](https://www.radix-ui.com/)
- **Media Processing**: [FFmpeg WebAssembly](https://github.com/ffmpegwasm/ffmpeg.wasm)
- **Icons**: [Lucide React](https://lucide.dev/)

## 🚀 Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm, yarn, pnpm, or bun

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Avik-creator/fileconvertor.git
   cd fileconvertor
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   # or
   bun install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   # or
   bun dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

## 📖 Usage

### Converting Files

1. **Select File Type**: Choose between Images, Videos, or All Files
2. **Add Files**: Drag and drop files or click to browse
3. **Choose Output Format**: Select your desired output format
4. **Convert**: Click "Convert" for individual files or "Convert All" for batch processing
5. **Download**: Download your converted files once processing is complete

### Supported Conversions

#### Image Formats
| Input | Output Options |
|-------|----------------|
| JPG/JPEG | PNG, GIF, BMP, WebP, TIFF |
| PNG | JPG, GIF, BMP, WebP, TIFF |
| GIF | JPG, PNG, BMP, WebP, TIFF |
| WebP | JPG, PNG, GIF, BMP, TIFF |

#### Video Formats
| Input | Output Options |
|-------|----------------|
| MP4 | AVI, MOV, MKV, WMV, WebM, 3GP |
| AVI | MP4, MOV, MKV, WMV, WebM, 3GP |
| MOV | MP4, AVI, MKV, WMV, WebM, 3GP |

#### Audio Extraction
Extract audio from videos to MP3, WAV, or AAC formats.

## 🏗️ Project Structure

```
fileconvertor/
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── globals.css      # Global styles
│   │   ├── layout.tsx       # Root layout
│   │   └── page.tsx         # Main page component
│   ├── components/
│   │   └── ui/              # Reusable UI components
│   ├── lib/
│   │   ├── types.ts         # TypeScript type definitions
│   │   └── utils.ts         # Utility functions
│   └── utils/
│       ├── convert.ts       # File conversion logic
│       ├── fileIcons.tsx    # File type icons
│       ├── loadffmpeg.ts    # FFmpeg initialization
│       └── size.ts          # File size utilities
├── public/                  # Static assets
├── components.json          # shadcn/ui configuration
├── next.config.ts           # Next.js configuration
├── package.json             # Dependencies and scripts
├── tailwind.config.js       # Tailwind CSS configuration
└── tsconfig.json           # TypeScript configuration
```

## 🔧 Configuration

### Environment Variables

This project doesn't require any environment variables for basic functionality. All processing happens client-side.

### Customization

- **Themes**: The project supports light and dark themes automatically
- **File Types**: Add new file types by modifying `src/utils/fileIcons.tsx`
- **Conversion Logic**: Extend conversion capabilities in `src/utils/convert.ts`

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### Development Guidelines

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/AmazingFeature`)
3. **Commit your changes** (`git commit -m 'Add some AmazingFeature'`)
4. **Push to the branch** (`git push origin feature/AmazingFeature`)
5. **Open a Pull Request**

### Code Style

- Use TypeScript for type safety
- Follow ESLint and Prettier configurations
- Use meaningful commit messages
- Add comments for complex logic

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🙋‍♂️ Author

**Avik Mukherjee**
- GitHub: [@Avik-creator](https://github.com/Avik-creator)
- Email: avikm744@gmail.com

## 🚨 Known Issues

- Large video files (>100MB) may take significant time to process
- Some older browsers may not support all features
- FFmpeg loading requires good internet connection on first visit

## 🔮 Future Enhancements

- [ ] Audio format conversion
- [ ] PDF manipulation
- [ ] Document format conversion
- [ ] Advanced video editing features
- [ ] Cloud storage integration
- [ ] Conversion presets
- [ ] Batch download as ZIP

## 🙏 Acknowledgments

- [FFmpeg](https://ffmpeg.org/) for the amazing media processing capabilities
- [Vercel](https://vercel.com/) for hosting and deployment
- [Shadcn UI](https://ui.shadcn.com/) for accessible UI components
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework

## 📞 Support

If you have any questions or need help, please:

1. Check the [Issues](https://github.com/Avik-creator/fileconvertor/issues) page
2. Create a new issue with detailed description
3. Contact me directly at avikm744@gmail.com

---

⭐ Star this repository if you find it helpful!
