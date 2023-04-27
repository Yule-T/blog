<template>
  <el-button type="primary" plain round :icon="Edit" @click="showEdit('add')">新增分类</el-button>
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
        <a href="javascript:void(0)" class="a-link" @click="showEdit('update',row)" >修改</a>
        <el-divider direction="vertical"></el-divider>
        <a href="javascript:void(0)" class="a-link" @click="del(row)">删除</a>
        <el-divider direction="vertical"></el-divider>
        <a href="javascript:void(0)" :class="[index==0?'not-allow':'a-link']" @click="changeSort(index,'up')" >上移</a>
        <el-divider direction="vertical"></el-divider>
        <a href="javascript:void(0)" :class="[index==tableData.list.length-1?'not-allow':'a-link']" @click="changeSort(index,'down')" >下移</a>
      </div>
    </template>
  </Table>
  <Dialog :show="dialogConfig.show"
          :title="dialogConfig.title" 
          :buttons="dialogConfig.buttons"
          width="500px"
          @close="dialogConfig.show=false">
    <el-form :model="formData"
               :rules="rules"
               ref="formDataRef"
               label-width="95px"
               label-position="right">
        <el-form-item label="名称&emsp;"
                      prop="categoryName">
          <el-input placeholder="请输入名称"
                    v-model="formData.categoryName">
          </el-input>
        </el-form-item>
        <el-form-item label="封面&emsp;"
                      prop="cover">
          <CoverUpload v-model="formData.cover"></CoverUpload>
        </el-form-item>
        <el-form-item label="简介&emsp;"
                      prop="categoryDesc">
          <el-input v-model="formData.categoryDesc"
                    type="textarea"
                    placeholder="请输入简介"
                    :autosize="{minRows:3,maxRows:3}">
          </el-input>
        </el-form-item>
      </el-form>
  </Dialog>
</template>

<script setup>
import { Edit } from '@element-plus/icons-vue'
import { getCurrentInstance, reactive, ref, nextTick } from 'vue'

const {proxy} = getCurrentInstance();

const api ={
  "loadDataList":"/category/loadAllCategory4Blog",
  "saveCategory":"/category/saveCategory4Blog",
  "delCategory":"/category/delCategory4Blog",
  "changeCategorySort":"/category/changeCategorySort4Blog",
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

//新增、修改
const dialogConfig = reactive({
  show:false,
  title:"标题",
  buttons:[{
    type:"primary",
    text:"确定",
    click: (e) => {
      submitForm();
    }
  }]
})

const formData = reactive({})
const rules={
  categoryName: [{required:true,message:"请输入分类名称"}]
};
const formDataRef = ref();
const showEdit = (type,data)=>{ //新增修改
  dialogConfig.show = true;
  nextTick( ()=>{
    formDataRef.value.resetFields();
    if(type=='add'){
      dialogConfig.title = "新增分类";
    }else if(type=='update'){
      dialogConfig.title = "编辑分类";
      Object.assign(formData,data);
    }
  })
  
}

const submitForm = () => {
  formDataRef.value.validate( async (valid) => {
    if(!valid){
      return ;
    }
    let params = {};
    Object.assign(params,formData);
    let result = await proxy.Request({
      url:api.saveCategory,
      params,
    })
    if(!result){
      return;
    }
    dialogConfig.show=false;
    proxy.Message.success("保存成功");
    loadDataList();
  })
}
//删除
const del= (data) =>{
  proxy.Confirm(`你确定要删除${data.categoryName}`,async() =>{
    let result = await proxy.Request({
      url:api.delCategory,
      params:{
        categoryId:data.categoryId,
      }
    })
    if(!result){
      return;
    }
    loadDataList();
  })
}
//排序
const changeSort= async(index,type)=>{
  let categoryList = tableData.list;
  if(type==='down'&&index == categoryList.length === 1 || type==="up" && index === 0){
    return ;
  }
  let temp = categoryList[index];
  let number = type =="down" ?1 : -1;
  categoryList.splice(index,1);
  categoryList.splice(index + number,0,temp);
  console.log(JSON.stringify(categoryList));
  
  let result = await proxy.Request({
    url:api.changeCategorySort,
    dataType:"json",
    params:categoryList
  })
  if(!result){
    return;
  }
  proxy.Message.success("成功排序成功");
  loadDataList();
}

</script>

<style scoped>

</style>