import axios from './interceptor.ts';
import qs from 'query-string';
import type { RcFile } from 'rc-upload/lib/interface';

export interface NoteSourceReq {
    file: RcFile;
    active?: boolean;
    file_type?: string;
}

export interface NoteSourceUpdateReq {
    title?: string;
    content?: string;
    type?: string;
    url?: string;
    active?: boolean;
}

export interface NoteSourceNotebookReq {
    notebook_ids: number[];
}

export interface NoteSourceRes {
    id: number;
    uuid: string;
    title: string;
    content: string;
    type: string;
    url: string;
    created_time: string;
    updated_time: string;
    active: boolean;
}

export interface NoteSourceParams {
    title?: string;
    active?: boolean;
    page?: number;
    size?: number;
}

export interface NoteSourceListRes {
    items: NoteSourceRes[];
    total: number;
}

export interface NoteSourceDeleteParams {
    pk: number[];
}

// 获取所有来源
export function queryNoteSourceAll(): Promise<NoteSourceRes[]> {
    return axios.get('/api/v1/notesource/all');
}

// 获取来源详情
export function queryNoteSourceDetail(pk: number): Promise<NoteSourceRes> {
    return axios.get(`/api/v1/notesource/${pk}`);
}

// 获取来源列表（分页）
export function queryNoteSourceList(params: NoteSourceParams): Promise<NoteSourceListRes> {
    return axios.get('/api/v1/notesource', {
        params,
        paramsSerializer: (obj) => {
            return qs.stringify(obj);
        },
    });
}

// 创建来源
export function createNoteSource({ notebookId, data }: { notebookId: number; data: NoteSourceReq }) {
    const formData = new FormData();
    formData.append('file', data.file);  // Attach the file
    formData.append('file_type', 'pdf');  // Set the file type
    formData.append('active', String(data.active ?? true));  // Default to true if not specified

    // Ensure axios sends the data as multipart/form-data
    return axios.post(`/api/v1/notesource/${notebookId}/notebooks`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
}

// 更新来源
export function updateNoteSource(pk: number, data: NoteSourceUpdateReq) {
    return axios.put(`/api/v1/notesource/${pk}`, data);
}

// 更新来源关联的笔记本
export function updateNoteSourceNotebooks(pk: number, data: NoteSourceNotebookReq) {
    return axios.put(`/api/v1/notesource/${pk}/notebooks`, data);
}

// 批量删除来源
export function deleteNoteSource(params: NoteSourceDeleteParams) {
    return axios.delete('/api/v1/notesource', {
        params,
        paramsSerializer: (obj) => {
            return qs.stringify(obj);
        },
    });
}
