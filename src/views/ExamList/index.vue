<template>
  <div class="examList-container">
    <div class="header">
      <h1>考试系统</h1>
    </div>
    <div class="wrapper">
      <div class="operate">
        <el-button type="primary" @click="openDialog">新建试卷</el-button>
        <el-button type="primary" @click="handleShowTrash">{{
          showTrashList ? "退出回收站" : "打开回收站"
        }}</el-button>
      </div>

      <div class="list">
        <div class="item" v-for="exam in list" :key="exam.id">
          <p>{{ exam.name }}</p>
          <div class="btns">
            <el-button
              class="btn"
              type="primary"
              @click="handlePublish(exam)"
              >{{ exam.isPublish ? "停止" : "发布" }}</el-button
            >
            <el-button class="btn">编辑</el-button>

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

<style lang="scss" scoped>
.examList-container {
  .header {
    height: 80px;
    border-bottom: 1px solid #aaa;
    line-height: 80px;
  }

  h1 {
    margin: 0;
  }

  .wrapper {
    .operate {
      padding: 20px;
    }

    .list {
      .item {
        min-height: 100px;
        border: 1px solid #000;
        padding: 20px;
        margin-bottom: 20px;

        .btns {
          .btn {
            margin: 10px;
          }
        }
      }
    }
  }
}
</style>
