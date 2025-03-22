<template>
  <div class="m-30">
    <p class="text-3xl text-center mb-10">{{ exam?.name }}</p>
    <div class="mb-5 border-b pb-5" v-for="item in json" :key="item.id">
      <p>{{ item.question || "请输入问题" }}</p>
      <template v-if="item.type === 'radio'">
        <el-radio-group v-model="item.userAnswer">
          <el-radio
            v-for="option in item.options"
            :key="option"
            :value="option"
            >{{ option }}</el-radio
          >
        </el-radio-group>
        <p>分值：{{ item.score }}</p>
        <!-- <p>答案：{{ item.answer }}</p>
        <p>答案解析：{{ item.answerAnalyze }}</p> -->
      </template>

      <template v-else-if="item.type === 'checkbox'">
        <el-checkbox-group v-model="item.userAnswer">
          <el-checkbox
            v-for="option in item.options"
            :key="option"
            :value="option"
          >
            {{ option }}
          </el-checkbox>
        </el-checkbox-group>
        <p>分值：{{ item.score }}</p>
        <!-- <p>答案：{{ item.answer }}</p>
        <p>答案解析：{{ item.answerAnalyze }}</p> -->
      </template>

      <template v-else>
        <el-input v-model="item.userAnswer" />
        <p>分值：{{ item.score }}</p>
        <!-- <p>答案：{{ item.answer }}</p>
        <p>答案解析：{{ item.answerAnalyze }}</p> -->
      </template>
    </div>
    <div class="text-center">
      <el-button type="primary" @click="submit">提交</el-button>
      <el-button @click="router.back()">返回</el-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useRoute, useRouter } from "vue-router";
import { examFind } from "../../api";
import { onMounted, ref } from "vue";
import type { Exam, Question } from "../../types/exam";
import { answerAdd } from "../../api/answer";
import { ElMessage } from "element-plus";

const router = useRouter();
const { id } = useRoute().params;

let exam = ref<Exam>();
const json = ref<Question[]>([]);

const findExam = async () => {
  if (!id) return;

  const { data } = await examFind(+id);
  exam = data;
  json.value = data.content ? JSON.parse(data.content) : [];
  // 清空答案
  json.value = json.value.map((item) => {
    return {
      ...item,
      userAnswer: item.type === "checkbox" ? [] : "",
    };
  });
};

onMounted(() => {
  findExam();
});

const submit = async () => {
  if (!id) return;

  const userAnswerArr = json.value.map((item) => {
    return {
      id: item.id,
      answer: item.userAnswer,
    };
  });

  const { data } = await answerAdd({
    examId: +id,
    content: JSON.stringify(userAnswerArr),
  });

  ElMessage.success("提交成功");

  setTimeout(() => {
    router.push(`/result/${data.id}`);
  }, 1000);
};
</script>