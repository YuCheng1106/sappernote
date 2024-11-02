import { NotebookSourceRes } from '../api/notebook';

export type NotebookInfo = {
    id: number;
    uuid: string;
    user_uuid: string;
    title: string;
    content?: string;
    active: boolean;
    created_time: string;
    updated_time: string;
    source: NotebookSourceRes[];  // 来源的数组
};
