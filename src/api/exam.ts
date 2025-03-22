import type { ExamAdd, ExamSave } from "../types/exam";
import { axiosInstance } from "../utils/request";

const request = axiosInstance(import.meta.env.VITE_API_EXAM_URL);

export async function examList() {
  return await request.get("/exam/list");
}

export async function examAdd(data: ExamAdd) {
  return await request.post("/exam/add", data);
}

export async function examPublish(id: number) {
  return await request.get(`/exam/publish/${id}`);
}

export async function examUnPublish(id: number) {
  return await request.get(`/exam/unpublish/${id}`);
}

export async function examDelete(id: number) {
  return await request.delete(`/exam/delete/${id}`);
}

export async function examFind(id: number) {
  return await request.get(`/exam/find/${id}`);
}

export async function examSave(data: ExamSave) {
  return await request.post(`/exam/save`, data);
}
