<template>
  <div class="box">
    <a-space direction="vertical" align="center">
      <a-space wrap>
        <a-input type="number" addon-before="用户名:" v-model:value.number="allInfo.userInfo.userId" />
        <a-input type="text" addon-before="密码:" v-model:value="allInfo.userInfo.token" />
      </a-space>
      <a-space wrap>
        <a-button type="primary" @click="login">登录</a-button>
        <a-button type="primary" @click="logout">退出</a-button>
      </a-space>
    </a-space>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, toRaw, watch } from "vue";
import { create, Options } from "../src";

const opts = reactive<Options>({
  brokerUrl: "ws://127.0.0.1:8888",
});
const instance = create(opts);

const allInfo = ref({
  userInfo: {
    userId: 0,
    token: "",
  },
});

watch(
  () => allInfo.value.userInfo.userId,
  (newv, oldv) => {

    const oldData = toRaw(allInfo.value)
    oldData.userInfo.userId = oldv
    localStorage.setItem(oldv.toString(), JSON.stringify(oldData));


    const cache = localStorage.getItem(newv.toString());

    if (cache) {
      allInfo.value = JSON.parse(cache);
    }
  }
);

const { login, logout } = useBase();

function useBase() {
  const login = async () => {
    try {
      const res = await instance.login(allInfo.value.userInfo);

      console.log(`[login] 登陆成功`, res);
    } catch (error) {
      console.log(`[login] 登陆失败 err`, error);
    }
  };

  const logout = async () => {
    try {
      const res = await instance.logout();

      console.log(`[logout] 退出登录成功`, res);
    } catch (error) {
      console.log(`[logout] 退出登录失败 err`, error);
    }
  };

  return {
    login,
    logout,
  };
}
</script>

<style scoped>
.box {
  display: flex;
  justify-content: center;
  align-content: center;
  padding: 20px;
}
</style>
