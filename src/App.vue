<template>
    <div>
        <el-config-provider :locale="locale" :message="config">
            <router-view/>
        </el-config-provider>
    </div>
</template>

<script setup>
import zhCn from 'element-plus/lib/locale/lang/zh-cn'
import { reactive } from 'vue';

const locale = zhCn;
const config = reactive({
    max:1,
})

</script>

<style scoped>
/* .vue{
    background-image: url("./assets/vue-bg (3).png");
    background-repeat:no-repeat;
    background-size:cover;
} */
</style>