<template>
  <div class="examList-container">
    <div class="header">
      <h1>考试系统</h1>
    </div>
    <div class="body">
      <div class="operate">
        <el-button type="primary">新建试卷</el-button>
      </div>

      <div class="list">
        <div class="item">
          <p>语文试卷</p>
          <div class="btns">
            <el-button class="btn" type="primary">发布</el-button>
            <el-button class="btn">编辑</el-button>
            <el-button class="btn" type="danger">删除</el-button>
          </div>
        </div>

        <div class="item">
          <p>数学试卷</p>
          <div class="btns">
            <el-button class="btn" type="primary">发布</el-button>
            <el-button class="btn">编辑</el-button>
            <el-button class="btn" type="danger">删除</el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup></script>

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

  .body {
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
