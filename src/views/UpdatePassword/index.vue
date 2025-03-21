<template>
  <div
    class="update-container h-[100vh] flex flex-col justify-center items-center"
  >
    <h1 class="text-[40px] pb-10">考试系统</h1>
    <el-form
      ref="ruleFormRef"
      :model="ruleForm"
      :rules="rules"
      label-width="80px"
    >
      <el-form-item label="用户名" prop="username">
        <el-input v-model="ruleForm.username" placeholder="请输入用户名" />
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="ruleForm.email" placeholder="请输入邮箱" />
      </el-form-item>
      <el-form-item label="验证码" prop="captcha">
        <div class="flex">
          <el-input v-model="ruleForm.captcha" placeholder="请输入验证码" />
          <el-button
            class="ml-3"
            type="primary"
            @click="sendCaptcha"
            :loading="sendLoading"
            >发送验证码</el-button
          >
        </div>
      </el-form-item>
      <el-form-item label="新密码" prop="password">
        <el-input
          type="password"
          v-model="ruleForm.password"
          placeholder="请输入新密码"
          show-password
        />
      </el-form-item>
      <el-form-item label="确认密码" prop="confirmPassword">
        <el-input
          type="password"
          v-model="ruleForm.confirmPassword"
          placeholder="请输入确认密码"
          show-password
        />
      </el-form-item>
      <el-form-item class="update-form">
        <el-button
          type="primary"
          @click="submit(ruleFormRef)"
          :loading="loading"
          >修改</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
import { ElMessage, type FormInstance, type FormRules } from "element-plus";
import { reactive, ref } from "vue";
import type { updatePasswordParams } from "../../types/user";
import { updatePassword, updatePasswordCaptcha } from "../../api";
import { useRouter } from "vue-router";

const sendLoading = ref<boolean>(false);
const loading = ref<boolean>(false);

const ruleForm = reactive<updatePasswordParams>({
  username: "",
  password: "",
  confirmPassword: "",
  email: "",
  captcha: "",
});

const ruleFormRef = ref<FormInstance>();

const checkConfirmPassword = (rule: any, value: any, callback: any) => {
  if (value === "") {
    callback(new Error("请输入确认密码"));
  } else if (value !== ruleForm.password) {
    callback(new Error("确认密码与密码不一致，请重新输入"));
  } else {
    callback();
  }
};

const rules = reactive<FormRules<updatePasswordParams>>({
  username: [{ required: true, message: "请输入用户名", trigger: "blur" }],
  password: [
    { required: true, message: "请输入新密码", trigger: "blur" },
    { min: 6, message: "密码不少于6位", trigger: "blur" },
  ],
  confirmPassword: [
    { required: true, validator: checkConfirmPassword, trigger: "blur" },
  ],
  email: [{ required: true, message: "请输入邮箱", trigger: "blur" }],
  captcha: [{ required: true, message: "请输入验证码", trigger: "blur" }],
});

const sendCaptcha = async () => {
  const { email } = ruleForm;
  if (!email) {
    return ElMessage.error("请先输入邮箱地址");
  }

  sendLoading.value = true;
  try {
    await updatePasswordCaptcha(email);
    ElMessage.success("发送成功");
  } catch (e: unknown) {
    ElMessage.error(e || "系统繁忙，请稍后再试");
  } finally {
    sendLoading.value = false;
  }
};

const router = useRouter();

const submit = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate(async (valid) => {
    if (valid) {
      loading.value = true;
      try {
        await updatePassword(ruleForm);
        ElMessage.success("密码修改成功");
        setTimeout(() => {
          router.push("/login");
        }, 1000);
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

<style lang="scss" scoped>
.update-container {
  .el-form-item {
    width: 350px;
  }

  .link-form {
    :deep(.el-form-item__content) {
      width: 100%;
      display: flex;
      justify-content: flex-end;
    }
    a {
      color: #409eff;
    }
  }

  .update-form {
    .el-button {
      width: 100%;
    }
  }
}
</style>
