<template>
  <div class="cover">
    <img :src="proxy.globalInfo.imageUrl+cover" v-if="cover">
    <img v-else src="../assets/logo_bg.png" alt="">
  </div>
</template>

<script setup>
import { getCurrentInstance, reactive } from 'vue'

const props = defineProps({
    cover:{
        type:String
    }
})
const {proxy} = getCurrentInstance();

</script>

<style scoped>
.cover{
    width:60px;
    height:60px;
    background: #6c93f43e;
    border-radius: 5px;
    display: flex;
    text-align: center;
    justify-content: center;
    overflow: hidden;
}
.cover img{
    width: 100%;
}
</style>