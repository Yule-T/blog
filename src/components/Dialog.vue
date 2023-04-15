<template>
  <div>
    <el-dialog :show-close="showClose"
                :draggable="true"
                :model-value="show"
                :close-on-click-modal="false"
                :title="title"
                class="cust-dialog"
                :top="top"
                :width="width"
                :showCancel="showCancel"
                @close="close">
      <div class="dialog-body">
        <slot></slot>
      </div>
      <template v-if="(buttons&&buttons.length>0)||showCancel">
        <div class="dialog-footer">
           <el-button type="info" link @click="close">
            取消
          </el-button>
          <el-button v-for="(btn,index) in buttons" 
                    :key="index" :type="btn.type"
                    @click="btn.click">
            {{btn.text}}
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>


const props=defineProps({
    title:{
        type:String,
        default: "你好哇"
    },
    show:{
        type:Boolean,
        default: false
    },
    showClose:{
        type:Boolean,
        default: true,
    },
    showCancel:{
        type:Boolean,
        default: true,
    },
    top:{
        type:String,
        default:"50px",
    },
    width:{
        type:String,
        default:"30%"
    },
    buttons:{
        type:Array
    }
})

const emit=defineEmits();
const close= () => {
  emit("close")
}


</script>

<style scoped>
:deep(.el-dialog__body) {
  padding: 0;
}
.dialog-body{
   border-top: 1px solid rgba(0, 0, 0, 0.099);
   border-bottom: 1px solid rgba(172, 189, 199, 0.247);
   padding: 10px;
   min-height:80px;
}
.dialog-footer{
  text-align: right;
  padding:8px 20px;
}
</style>