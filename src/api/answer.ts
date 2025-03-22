import type { AnswerAdd } from "../types/answer";
import { axiosInstance } from "../utils/request";

const request = axiosInstance(import.meta.env.VITE_API_ANSWER_URL);

export async function answerAdd(data: AnswerAdd) {
  return await request.post(`/answer/add`, data);
}

export async function answerFind(id: number) {
  return await request.get(`/answer/find/${id}`);
}
