import axios from './interceptor.ts';
import {
  SysUserAddReq,
  SysUserAvatarReq,
  SysUserInfoReq,
  SysUserNoRelationRes,
  UserInfo,
} from '../types/user.ts';


export function getUserInfo(): Promise<UserInfo> {
  return axios.get('/api/v1/sys/users/me');
}

export function changeUserStatus(pk: number) {
  return axios.put(`/api/v1/sys/users/${pk}/status`);
}

export function changeUserSuper(pk: number) {
  return axios.put(`/api/v1/sys/users/${pk}/super`);
}

export function changeUserStaff(pk: number) {
  return axios.put(`/api/v1/sys/users/${pk}/staff`);
}

export function changeUserMulti(pk: number) {
  return axios.put(`/api/v1/sys/users/${pk}/multi`);
}

export function updateUserAvatar(username: string, data: SysUserAvatarReq) {
  return axios.put(`/api/v1/sys/users/${username}/avatar`, data);
}

export function updateUser(username: string, data: SysUserInfoReq) {
  return axios.put(`/api/v1/sys/users/${username}`, data);
}

export function addUser(data: SysUserAddReq): Promise<SysUserNoRelationRes> {
  return axios.post('/api/v1/sys/users/add', data);
}
export function deleteUser(username: string) {
  return axios.delete(`/api/v1/sys/users/${username}`);
}
