<template>
  <div class="window" v-if="show"
       :style="{width:windowWidth + 'px'}">
    <div class="title">
			<span class="iconfont icon-back" @click="close"></span>
    </div>
	  <div class="body" >
      <slot></slot>
    </div>
	  <template v-if="(buttons&&buttons.length>0)||showCancel">
        <div class="footer">
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
  </div>
</template>

<script setup>
import { ref, reactive,  } from "vue";
const windowWidth = window.innerWidth - 200 ;

const props = defineProps({
  show:{
      type:Boolean,
      default: false,
  },
	buttons:{
		type: Array,
	},
	showCancel:{
      type:Boolean,
      default: true,
  },
})

const emit=defineEmits(["close"]);
const close= () => {
  emit("close")
}




</script>

<style scoped>
.window{
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100%;
  height: calc(100vh - 65px);
  background: rgb(250, 252, 255);
  z-index: 5;
}
.title{
	height: 30px;
	/* background-color: rgb(255, 255, 255); */
  display: flex;
  align-items: center;
  padding-left: 10px;

	
}
.body{
	height: calc(100vh - 151px);
	/* background-color: rgb(247, 225, 225); */
  padding: 10px;
}
.footer{
	height: 55px;
	/* background-color: darkorchid; */
  text-align: center;
  line-height: 50px;
}
.icon-back{
  border-top: 1px solid rgb(252, 252, 252);
  font-size: 24px;
  cursor: pointer;
}
</style>