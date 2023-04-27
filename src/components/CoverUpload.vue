<template>
  <el-upload name="file"
             :show-file-list="false"
             accept=".png,.jpg,.jpeg,.gif,.bmp,.PNG,.JPG,.JPEG,.GIF,.BMP"
             :multiple="false"
             :http-request="uploadImage">
    <el-button plain
               class="cover-update-btn">
      <template v-if="modelValue">
        <img :src="proxy.globalInfo.imageUrl+modelValue" alt="">
      </template>
      <span v-else>点击上传封面</span>
    </el-button>
  </el-upload>
</template>

<script setup>
import { getCurrentInstance } from "vue"

const {proxy} =getCurrentInstance()
const props = defineProps({
    modelValue:{
        type:String,
        default:null
    }

})
const api={
    uploadUrl:"/file/uploadImage"
}
const emit = defineEmits();
const uploadImage = async(file)=>{
    let result = await proxy.Request({
        url: api.uploadUrl,
        dataType:"file",
        params:{
            file:file.file,
            type:0
        }
    })
    const fileName=result.data.fileName;
    emit("update:modelValue",fileName)
}



</script>

<style scoped>
.cover-update-btn{
    width: 100px;
    height: 100px;
    background: rgb(0, 0, 0,0.02);
    padding: 0;
}
.cover-update-btn img{
    width: 98px;
    height: 98px;
}
</style>