import type { ExamAdd } from "../types/exam";
import request from "../utils/request";

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
