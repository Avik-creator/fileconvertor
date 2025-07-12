export type Action = {
    file: File;
    filename: string;
    size: number;
    from: string;
    to: string;
    type: string;
    converting?: boolean;
    converted?: boolean;
    error?: string;
    url?: string;
    output?: string;
}