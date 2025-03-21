import request from "../utils/request";

export async function examList() {
  return await request.post("/exam/list");
}
