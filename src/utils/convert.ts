import { Action } from "@/lib/types";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile } from "@ffmpeg/util";

function getFileExtension(fileName: string){
    const extension = fileName.split(".").pop();
    if (!extension) return "";
    return `.${extension}`;
}

function removeFileExtension(fileName: string){
    const extension = getFileExtension(fileName);
    return fileName.replace(extension, "");
}

export async function convert(ffmpeg: FFmpeg, action: Action) {
    const { file, filename, to } = action;
    const input = getFileExtension(filename);
    const output = removeFileExtension(filename) + "." + to;
    ffmpeg.writeFile(input, await fetchFile(file));
    const ffmpeg_cmd: string[] = [];
    if (to === '3gp'){
        ffmpeg_cmd.push(
            '-i',
            input,
            '-r',
            '20',
            '-s',
            '352x288',
            '-vb',
            '400k',
            '-acodec',
            'aac',
            '-strict',
            'experimental',
            '-ac',
            '1',
            '-ar',
            '8000',
            '-ab',
            '24k',
            output,
        );
    }
    else ffmpeg_cmd.push('-i', input, output);
    await ffmpeg.exec(ffmpeg_cmd);
    const data = await ffmpeg.readFile(output);
    const blob = new Blob([data], { type: file.type });
    const url = URL.createObjectURL(blob);
    return {
        url,
        output
    }
}