<template>
  <el-dialog
    v-model="visible"
    title="新建试卷"
    width="30%"
    :close-on-click-modal="false"
    @close="closeDialog"
  >
    <el-form
      :model="examForm"
      :rules="rules"
      ref="examFormRef"
      label-width="80px"
    >
      <el-form-item label="试卷名称" prop="name">
        <el-input v-model="examForm.name" placeholder="请输入试卷名称" />
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="closeDialog">取消</el-button>
      <el-button
        type="primary"
        @click="submitForm(examFormRef)"
        :loading="loading"
        >确定</el-button
      >
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { reactive, ref, watch } from "vue";
import { type ExamAdd } from "../../types/exam";
import { ElMessage, type FormInstance, type FormRules } from "element-plus";
import { examAdd } from "../../api";

const props = defineProps<{
  showDialog: boolean;
}>();

const emit = defineEmits<{
  (e: "update:showDialog", value: boolean): void;
  (e: "submit"): void;
}>();

const loading = ref(false);
const visible = ref(false);

watch(
  () => props.showDialog,
  (newVal) => {
    visible.value = newVal;
    emit("update:showDialog", newVal);
  }
);

const examForm = reactive<ExamAdd>({
  name: "",
});

const examFormRef = ref<FormInstance>();

const rules = reactive<FormRules>({
  name: [{ required: true, message: "请输入试卷名称", trigger: "blur" }],
});

const closeDialog = () => {
  visible.value = false;
  emit("update:showDialog", false);
  examFormRef.value?.resetFields();
};

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate(async (valid) => {
    if (valid) {
      loading.value = true;
      try {
        await examAdd(examForm);
        ElMessage.success("添加成功");

        closeDialog();
        emit("submit");
      } catch (e: unknown) {
        ElMessage.error(e || "系统繁忙，请稍后再试");
      } finally {
        loading.value = false;
      }
    } else {
      console.log("error submit");
    }
  });
};
</script>

<style lang="scss" scoped></style>
