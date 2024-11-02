import { createAsyncThunk } from '@reduxjs/toolkit';
import {
    queryNotebookAll,
    queryNotebookAllByUser,
    queryNotebookDetail,
    queryNotebookList,
    createNotebook,
    updateNotebook,
    deleteNotebook,
    updateNotebookSource,
    NotebookReq,
    NotebookParams,
    NotebookDeleteParams,
    NotebookSourceReq, NotebookUpdateReq, queryNotebookDetailByUuid,
} from '../api/notebook';

// 获取所有笔记本
export const fetchAllNotebooks = createAsyncThunk(
    'notebook/fetchAllNotebooks',
    async (_, { rejectWithValue }) => {
        try {
            return await queryNotebookAll();
        } catch (error: unknown) {
            if (typeof error === 'object' && error !== null && 'response' in error) {
                const err = error as { response: { data?: never } };
                if (err.response && 'data' in err.response) {
                    return rejectWithValue(err.response.data);
                }
            }
            return rejectWithValue('Failed to fetch all notebooks');
        }
    }
);

// 获取指定用户的所有笔记本
export const fetchNotebooksByUser = createAsyncThunk(
    'notebook/fetchNotebooksByUser',
    async (userUuid: string, { rejectWithValue }) => {
        try {
            return await queryNotebookAllByUser(userUuid);
        } catch (error: unknown) {
            if (typeof error === 'object' && error !== null && 'response' in error) {
                const err = error as { response: { data?: never } };
                if (err.response && 'data' in err.response) {
                    return rejectWithValue(err.response.data);
                }
            }
            return rejectWithValue('Failed to fetch notebooks for the user');
        }
    }
);

// 获取笔记本详情
export const fetchNotebookDetail = createAsyncThunk(
    'notebook/fetchNotebookDetail',
    async (notebookId: number, { rejectWithValue }) => {
        try {
            return await queryNotebookDetail(notebookId);
        } catch (error: unknown) {
            if (typeof error === 'object' && error !== null && 'response' in error) {
                const err = error as { response: { data?: never } };
                if (err.response && 'data' in err.response) {
                    return rejectWithValue(err.response.data);
                }
            }
            return rejectWithValue('Failed to fetch notebook details');
        }
    }
);

export const fetchNotebookDetailByUuid = createAsyncThunk(
    'notebook/fetchNotebookDetailByUuid',
    async (notebookUuid: string, { rejectWithValue }) => {
        try {
            return await queryNotebookDetailByUuid(notebookUuid);
        } catch (error: unknown) {
            if (typeof error === 'object' && error !== null && 'response' in error) {
                const err = error as { response: { data?: never } };
                if (err.response && 'data' in err.response) {
                    return rejectWithValue(err.response.data);
                }
            }
            return rejectWithValue('Failed to fetch notebook details');
        }
    }
);

// 获取笔记本列表（分页）
export const fetchNotebookList = createAsyncThunk(
    'notebook/fetchNotebookList',
    async (params: NotebookParams, { rejectWithValue }) => {
        try {
            return await queryNotebookList(params);
        } catch (error: unknown) {
            if (typeof error === 'object' && error !== null && 'response' in error) {
                const err = error as { response: { data?: never } };
                if (err.response && 'data' in err.response) {
                    return rejectWithValue(err.response.data);
                }
            }
            return rejectWithValue('Failed to fetch notebook list');
        }
    }
);

// 创建笔记本
export const createNewNotebook = createAsyncThunk(
    'notebook/createNewNotebook',
    async (data: NotebookReq, { rejectWithValue }) => {
        try {
            return await createNotebook(data);
        } catch (error: unknown) {
            if (typeof error === 'object' && error !== null && 'response' in error) {
                const err = error as { response: { data?: never } };
                if (err.response && 'data' in err.response) {
                    return rejectWithValue(err.response.data);
                }
            }
            return rejectWithValue('Failed to create notebook');
        }
    }
);

// 更新笔记本
export const updateNotebooks = createAsyncThunk(
    'notebook/updateNotebookInfo',
    async ({ notebookId, data }: { notebookId: number; data: NotebookUpdateReq }, { rejectWithValue }) => {
        try {
            const response = await updateNotebook(notebookId, data);
            return response.data;
        } catch (error: unknown) {
            if (typeof error === 'object' && error !== null && 'response' in error) {
                const err = error as { response: { data?: never } };
                if (err.response && 'data' in err.response) {
                    return rejectWithValue(err.response.data);
                }
            }
            return rejectWithValue('Failed to update notebook');
        }
    }
);

// 更新笔记本的来源
export const updateNotebookSources = createAsyncThunk(
    'notebook/updateNotebookSources',
    async ({ notebookId, data }: { notebookId: number; data: NotebookSourceReq }, { rejectWithValue }) => {
        try {
            return await updateNotebookSource(notebookId, data);
        } catch (error: unknown) {
            if (typeof error === 'object' && error !== null && 'response' in error) {
                const err = error as { response: { data?: never } };
                if (err.response && 'data' in err.response) {
                    return rejectWithValue(err.response.data);
                }
            }
            return rejectWithValue('Failed to update notebook sources');
        }
    }
);


// 删除笔记本
export const deleteNotebooks = createAsyncThunk(
    'notebook/deleteNotebooks',
    async (params: NotebookDeleteParams, { rejectWithValue }) => {
        try {
            return await deleteNotebook(params);
        } catch (error: unknown) {
            if (typeof error === 'object' && error !== null && 'response' in error) {
                const err = error as { response: { data?: never } };
                if (err.response && 'data' in err.response) {
                    return rejectWithValue(err.response.data);
                }
            }
            return rejectWithValue('Failed to delete notebooks');
        }
    }
);
