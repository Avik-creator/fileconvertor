export type Action = {
    file: File;
    filename: string;
    size: number;
    from: string;
    to: String;
    type: string;
    converting?: boolean;
    converted?: boolean;
    error?: string;
    url?: string;
    output?: File;
}