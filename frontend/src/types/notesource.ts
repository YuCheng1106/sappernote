export type NoteSourceInfo = {
    id: number;
    uuid: string;
    title: string;
    content?: string;
    type: string;
    url?: string;
    active: boolean;
    created_time: string;
    updated_time: string;
} | null;
