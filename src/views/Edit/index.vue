<template>
  <div class="edit-container">
    <div class="header">
      <div class="flex items-center">
        <el-button @click="router.back()">返回</el-button>
        <p class="ml-5">试卷编辑器</p>
      </div>
      <div>
        <!-- <el-button>预览</el-button> -->
        <el-button type="primary" @click="saveExamContent">保存</el-button>
      </div>
    </div>
    <div class="body">
      <div class="materials">
        <div
          class="material-item"
          v-for="item in materialTypes"
          :key="item.type"
          draggable="true"
          @dragstart="handleDragStart($event, item.type)"
        >
          {{ item.label }}
        </div>
      </div>
      <div
        class="edit-area mx-5 mt-5"
        @dragover.prevent="handleDragOver"
        @drop="handleDrop"
      >
        <div
          class="question-item flex flex-col mb-5 cursor-pointer border-b pb-5"
          :class="{ active: selectedQuestion?.id === item.id }"
          v-for="item in json"
          :key="item.id"
          @click.stop="handleSelectQuestion(item)"
        >
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
            <p>答案：{{ item.answer }}</p>
            <p>答案解析：{{ item.answerAnalyze }}</p>
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
            <p>答案：{{ item.answer }}</p>
            <p>答案解析：{{ item.answerAnalyze }}</p>
          </template>

          <template v-else>
            <el-input v-model="item.userAnswer" />
            <p>分值：{{ item.score }}</p>
            <p>答案：{{ item.answer }}</p>
            <p>答案解析：{{ item.answerAnalyze }}</p>
          </template>
          <div class="text-right">
            <el-button
              type="danger"
              :icon="Delete"
              circle
              @click.stop="onDeleteQuestion(item.id)"
            />
          </div>
        </div>
      </div>
      <div class="setting">
        <el-tabs v-model="activeTab" class="demo-tabs">
          <el-tab-pane label="JSON" name="JSON">
            <pre>{{ JSON.stringify(json, null, 4) }}</pre>
          </el-tab-pane>

          <el-tab-pane label="属性" name="PROPERTY">
            <template v-if="selectedQuestion">
              <h3 class="text-2xl text-center mb-5">编辑题目</h3>
              <el-form :model="selectedQuestion" label-width="80px">
                <el-form-item label="问题类型">
                  <el-radio-group v-model="selectedQuestion.type">
                    <el-radio
                      v-for="item in materialTypes"
                      :key="item.type"
                      :value="item.type"
                    >
                      {{ item.label }}
                    </el-radio>
                  </el-radio-group>
                </el-form-item>

                <el-form-item label="问题描述">
                  <el-input
                    v-model="selectedQuestion.question"
                    placeholder="请输入问题"
                  />
                </el-form-item>

                <el-form-item label="分值">
                  <el-input-number v-model="selectedQuestion.score" :min="1" />
                </el-form-item>

                <el-form-item label="答案">
                  <el-input
                    v-model="selectedQuestion.answer"
                    placeholder="请输入答案"
                  />
                </el-form-item>

                <el-form-item label="答案解析">
                  <el-input
                    v-model="selectedQuestion.answerAnalyze"
                    type="textarea"
                    placeholder="请输入答案解析"
                  />
                </el-form-item>

                <el-form-item
                  v-if="
                    selectedQuestion.type === 'radio' ||
                    selectedQuestion.type === 'checkbox'
                  "
                  label="选项"
                >
                  <div
                    v-for="(option, index) in selectedQuestion.options"
                    :key="index"
                    class="mr-5"
                  >
                    <template v-if="selectedQuestion?.options">
                      <el-input v-model="selectedQuestion.options[index]" />
                    </template>
                  </div>

                  <el-button type="primary" @click="addOption"
                    >添加选项</el-button
                  >
                </el-form-item>
              </el-form>
            </template>

            <template v-else>
              <p>请选择一个题目进行编辑</p>
            </template>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { examFind, examSave } from "../../api";
import { ElMessage } from "element-plus";
import { Delete } from "@element-plus/icons-vue";
import type { Question, QuestionTypes } from "../../types/exam";

const materialTypes = ref([
  { type: "radio", label: "单选题" },
  { type: "checkbox", label: "多选题" },
  { type: "input", label: "填空题" },
]);

const activeTab = ref("JSON");
const json = ref<Question[]>([]);
let selectedQuestion = ref<Question | null>(null);

// 选择题目
const handleSelectQuestion = (question: Question) => {
  selectedQuestion.value = question;
};

// 监听问题类型变化
watch(
  () => selectedQuestion.value?.type,
  (newType) => {
    // 已选择题目
    if (selectedQuestion.value) {
      const updatedQuestion: Question = { ...selectedQuestion.value };

      if (newType === "radio" || newType === "checkbox") {
        if (!updatedQuestion.options) {
          updatedQuestion.options = ["选项1", "选项2"];
        }
        if (newType === "radio") {
          updatedQuestion.userAnswer = Array.isArray(updatedQuestion.userAnswer)
            ? ""
            : updatedQuestion.userAnswer;
        }

        if (newType === "checkbox") {
          updatedQuestion.userAnswer = updatedQuestion.userAnswer || [];
        }
      } else if (newType === "input") {
        delete updatedQuestion.options;
      }

      const index = json.value.findIndex(
        (item) => item.id === updatedQuestion?.id
      );

      if (index !== -1) {
        json.value.splice(index, 1, { ...updatedQuestion });
        selectedQuestion.value = json.value[index];
      }
    }
  }
);

// 添加选项
const addOption = () => {
  if (selectedQuestion.value?.options) {
    selectedQuestion.value.options.push(
      `选项${selectedQuestion.value.options.length + 1}`
    );
  }
};

// 拖拽开始
const handleDragStart = (event: DragEvent, type: string) => {
  if (event.dataTransfer) {
    event.dataTransfer.setData("text/plain", type); // 设置拖拽数据
  }
};

// 拖拽进入目标区域
const handleDragOver = (event: DragEvent) => {
  event.preventDefault(); // 阻止默认行为
};

// 拖拽完成
const handleDrop = (event: DragEvent) => {
  event.preventDefault();

  // 获取拖拽数据
  const type = event.dataTransfer?.getData("text/plain") as QuestionTypes;

  const newQuestion = createNewQuestion(type);

  // 添加到题目列表
  json.value.push(newQuestion);
};

// 生成新题目
const createNewQuestion = (type: QuestionTypes) => {
  const newQuestion: Question = {
    id: new Date().getTime(), // 生成唯一ID
    question: "",
    type,
    options: type === "input" ? undefined : ["选项1", "选项2"], // 填空题没有选项
    score: 5, // 默认分值
    answer: "", // 默认答案
    answerAnalyze: "", // 默认答案解析
    userAnswer: type === "checkbox" ? [] : "", // 初始化用户答案
  };

  return newQuestion;
};

const router = useRouter();
const { id } = useRoute().params;

const findExam = async () => {
  if (!id) return;

  const { data } = await examFind(+id);
  json.value = data.content ? JSON.parse(data.content) : [];
};

const saveExamContent = async () => {
  if (!id) return;

  await examSave({
    id: +id,
    content: JSON.stringify(json.value),
  });

  ElMessage.success("保存成功");
};

const onDeleteQuestion = (id: number) => {
  json.value = json.value.filter((v) => v.id !== id);
};

onMounted(() => {
  findExam();
});
</script>

<style lang="scss" scoped>
.edit-container {
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 80px;
    font-size: 30px;
    line-height: 80px;
    border-bottom: 1px solid #000;
    padding: 0 20px;
  }

  .body {
    height: calc(100vh - 80px);

    display: flex;
    .materials {
      height: 100%;
      width: 300px;
      border-right: 1px solid #000;

      .material-item {
        padding: 20px;
        border: 1px solid #000;
        display: inline-block;
        margin: 10px;
        cursor: move;
      }
    }

    .edit-area {
      height: 100%;
      flex: 1;
    }

    .setting {
      height: 100%;
      width: 400px;
      border-left: 1px solid #000;
    }
  }
}

.active {
  padding: 5px;
  border: 1px solid #409eff;
}

:deep(.el-tabs__nav) {
  width: 100%;
  .el-tabs__item {
    width: 50%;
  }
}
</style>
