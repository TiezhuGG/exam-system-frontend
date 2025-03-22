<template>
  <div class="m-10">
    <p>
      得分：<span class="text-red-500 text-4xl">{{ score }}</span>
    </p>
    <div class="my-5 border-b pb-5" v-for="item in json" :key="item.id">
      <p>{{ item.question || "请输入问题" }}</p>
      <template v-if="item.type === 'radio'">
        <el-radio-group v-model="item.userAnswer" disabled>
          <el-radio
            v-for="option in item.options"
            :key="option"
            :value="option"
            >{{ option }}</el-radio
          >
        </el-radio-group>
        <p>分值：{{ item.score }}</p>
        <p>答案：{{ item.answer }}</p>
        <p class="text-green-600">答案解析：{{ item.answerAnalyze }}</p>
      </template>

      <template v-else-if="item.type === 'checkbox'">
        <el-checkbox-group v-model="item.userAnswer" disabled>
          <el-checkbox
            v-for="option in item.options"
            :key="option"
            :value="option"
          >
            {{ option }}
          </el-checkbox>
        </el-checkbox-group>
        <p>分值：{{ item.score }}</p>
        <p>答案：{{ item.answer }}</p>
        <p class="text-green-600">答案解析：{{ item.answerAnalyze }}</p>
      </template>

      <template v-else>
        <el-input v-model="item.answer" disabled />
        <p>分值：{{ item.score }}</p>
        <p>答案：{{ item.answer }}</p>
        <p class="text-green-600">答案解析：{{ item.answerAnalyze }}</p>
      </template>
    </div>
    <div class="text-center">
      <el-button @click="router.push('/')">返回试卷列表</el-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useRoute, useRouter } from "vue-router";
import { answerFind } from "../../api/answer";
import { onMounted, ref } from "vue";
import type { Question } from "../../types/exam";

const router = useRouter();
const { id } = useRoute().params;

let score = ref<number>(0);
const json = ref<Question[]>([]);

const findAnswer = async () => {
  const { data } = await answerFind(+id);
  score = data.score;
  json.value = JSON.parse(data.exam.content);
};

onMounted(() => {
  findAnswer();
});
</script>

<style lang="scss" scoped></style>
