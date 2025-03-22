<template>
  <div class="examList-container">
    <div class="header">
      <p class="text-4xl text-center m-10">考试系统</p>
    </div>
    <div class="wrapper">
      <div class="p-5">
        <el-button type="primary" @click="openDialog">新建试卷</el-button>
        <el-button type="primary" @click="handleShowTrash">{{
          showTrashList ? "退出回收站" : "打开回收站"
        }}</el-button>
      </div>

      <div class="list">
        <div
          class="min-h-[100px] border p-5 mb-7"
          v-for="exam in list"
          :key="exam.id"
        >
          <p>{{ exam.name }}</p>
          <div class="btns">
            <el-button
              class="m-2"
              type="primary"
              @click="handlePublish(exam)"
              >{{ exam.isPublish ? "停止" : "发布" }}</el-button
            >
            <RouterLink :to="`/edit/${exam.id}`">
              <el-button class="m-2">编辑</el-button>
            </RouterLink>

            <RouterLink :to="`/exam/${exam.id}`" v-if="exam.content && exam.isPublish">
              <el-button class="m-2" type="success">去考试</el-button>
            </RouterLink>

            <el-popconfirm
              v-if="!exam.isDelete"
              title="是否确认删除？"
              @confirm="handleRemove(exam.id)"
            >
              <template #reference>
                <el-button class="btn" type="danger">删除</el-button>
              </template>
            </el-popconfirm>
          </div>
        </div>
      </div>
    </div>
  </div>

  <ExamAddModal v-model:showDialog="showDialog" @submit="handleAddExam" />
</template>

<script lang="ts" setup>
import { onMounted, ref } from "vue";
import { examDelete, examList, examPublish, examUnPublish } from "../../api";
import type { Exam } from "../../types/exam";
import ExamAddModal from "./ExamAddModal.vue";
import { ElMessage } from "element-plus";

let list = ref<Exam[]>([]);
const showTrashList = ref(false);

const getList = async (showTrashList = false) => {
  const { data } = await examList();
  list.value = showTrashList
    ? data.filter((exam: Exam) => exam.isDelete)
    : data.filter((exam: Exam) => !exam.isDelete);
};

onMounted(() => {
  getList();
});

const showDialog = ref(false);

const openDialog = () => {
  showDialog.value = true;
};

const handleAddExam = () => {
  getList();
};

const handlePublish = async (exam: Exam) => {
  if (exam.isPublish) {
    await examUnPublish(exam.id);
  } else {
    await examPublish(exam.id);
  }
  ElMessage.success(exam.isPublish ? "已取消发布" : "发布成功");
  getList();
};

const handleRemove = async (id: number) => {
  await examDelete(id);
  ElMessage.success("删除成功");
  getList();
};

const handleShowTrash = () => {
  showTrashList.value = !showTrashList.value;
  getList(showTrashList.value);
};
</script>
