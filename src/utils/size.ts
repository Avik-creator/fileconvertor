export function size(bytes: number) {
    const sizes = ["B", "KB", "MB", "GB", "TB"];
    if (bytes === 0) return "0 B";
    const index = Math.floor(Math.log(bytes) / Math.log(1024));
    const size = (bytes / Math.pow(1024, index)).toFixed(2);
    return `${size} ${sizes[index]}`;
}
