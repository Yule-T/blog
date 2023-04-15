<template>
  <el-button type="primary" plain round :icon="Edit">新增分类</el-button>

  <Table :columns='colums'
          :showPagination='false'
          :dataSource='tableData'
          :fetch='loadDataList'
          :options='tableOptions'
          style="margin-top:10px;">
    <template #cover=" { index, row } ">
      <Cover :cover="row.cover"></Cover>
    </template>
    <template #op=" { index, row } ">
      <div class="op">
        <a href="javascript(0)" class="a-link">修改</a>
        <el-divider direction="vertical"></el-divider>
        <a href="javascript(1)" class="a-link">删除</a>
        <el-divider direction="vertical"></el-divider>
        <a href="javascript(2)" class="a-link">上移</a>
        <el-divider direction="vertical"></el-divider>
        <a href="javascript(3)" class="a-link">下移</a>
      </div>
    </template>
  </Table>
  <Dialog :show="dialogConfig.show"
          :title="dialogConfig.title" 
          :buttons="dialogConfig.buttons"
          width="500px"
          @close="dialogConfig.show=false">
    我是内容
  </Dialog>
</template>

<script setup>
import { Edit } from '@element-plus/icons-vue'
import { getCurrentInstance, reactive } from 'vue'

const {proxy} = getCurrentInstance();

const api ={
  "loadDataList":"/category/loadAllCategory4Blog"
}

const colums=[{
  label:'封面',
  prop:'cover',
  width:80,
  scopedSlots:'cover'
},{
  label:'名称',
  prop:'categoryName',
  width:200,
},{
  label:'简介',
  prop:'categoryDesc',
},{
  label:'博客数量',
  prop:'blogCount',
  width:80,
},{
  label:'操作',
  prop:'op',
  width:200,
  scopedSlots:'op'
}]

const tableData=reactive({})
const tableOptions = {
  extHeight:10,
}
const loadDataList = async()=> {
  let result =  await proxy.Request({
    url:api.loadDataList
  })
  if(!result){
    return
  }
  tableData.list = result.data;
}

const dialogConfig = reactive({
  show:true,
  title:"标题",
  buttons:[{
    type:"primary",
    text:"确定",
    click: (e) => {
      console.log("xx");
    }
  }]
})


</script>

<style scoped>

</style>