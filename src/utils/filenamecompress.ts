export function filenameCompress(filename: string) {
    const maxSubstringLength = 20;
    if (filename.length <= maxSubstringLength) return filename;
    const fileNameWithoutExtension = filename.split(".")[0];
    const extension = filename.split(".")[1];
    const compressedFileName = fileNameWithoutExtension.slice(0, maxSubstringLength - extension.length - 1) + "..." + extension;
    return compressedFileName;
}