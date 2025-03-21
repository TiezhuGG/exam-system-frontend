<template>
  <div
    class="login-container h-[100vh] flex flex-col justify-center items-center"
  >
    <h1 class="text-[40px] pb-10">考试系统</h1>
    <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-width="80px">
      <el-form-item label="用户名" prop="username">
        <el-input v-model="ruleForm.username" placeholder="请输入用户名" />
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input
          type="password"
          v-model="ruleForm.password"
          placeholder="请输入密码"
          show-password
        />
      </el-form-item>
      <el-form-item class="link-form">
        <RouterLink to="/register">创建账号</RouterLink>
        <RouterLink to="/updatePassword">忘记密码</RouterLink>
      </el-form-item>
      <el-form-item class="login-form">
        <el-button
          type="primary"
          @click="submit(ruleFormRef)"
          :loading="loading"
          >登录</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
import { ElMessage, type FormInstance, type FormRules } from "element-plus";
import { reactive, ref } from "vue";
import type { LoginParams } from "../../types/user";
import { login } from "../../api";
import { useRouter } from "vue-router";

const loading = ref<boolean>(false);

const ruleForm = reactive<LoginParams>({
  username: "",
  password: "",
});

const ruleFormRef = ref<FormInstance>();
const rules = reactive<FormRules<LoginParams>>({
  username: [{ required: true, message: "请输入用户名", trigger: "blur" }],
  password: [
    { required: true, message: "请输入密码", trigger: "blur" },
    { min: 6, message: "密码不少于6位", trigger: "blur" },
  ],
});

const router = useRouter();

const submit = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate(async (valid) => {
    if (valid) {
      loading.value = true;
      try {
        const { data } = await login(ruleForm);
        ElMessage.success("登录成功");

        localStorage.setItem("token", data.token);
        localStorage.setItem("userInfo", JSON.stringify(data.user));

        setTimeout(() => {
          router.push("/");
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
.login-container {
  .el-form-item {
    width: 350px;
  }

  .link-form {
    :deep(.el-form-item__content) {
      width: 100%;
      display: flex;
      justify-content: space-between;
    }
    a {
      color: #409eff;
    }
  }

  .login-form {
    .el-button {
      width: 100%;
    }
  }
}
</style>
