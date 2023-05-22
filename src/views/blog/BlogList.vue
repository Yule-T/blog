<template>
  <div>
    <div class="top-panel">
      <el-form :model="searchFormData"
               label-width="60px">
        <el-row>
          <el-col :span="6">
            <el-form-item label="标题"
                        prop="titleFuzzy">
              <el-input placeholder="请输入名称"
                        v-model="searchFormData.titleFuzzy">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="状态"
                        prop="status">
              <el-select placeholder="请选择状态"
                        v-model="searchFormData.status"
                        clearable>
                <el-option :value="0" label="草稿" />
                <el-option :value="1" label="已发布" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="分类"
                        prop="status">
              <el-select placeholder="请选择分类"
                        v-model="searchFormData.categoryId"
                        clearable>
                <el-option :value="item.categoryId" 
                           :label="item.categoryName"
                           v-for="(item,index) in categoryList" :key="index" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            &emsp;
            <el-button :icon="Search" type="primary" round @click="loadDataList">搜索</el-button>
            <el-button :icon="Edit" type="primary" round @click="showEdit('add')">新增博客</el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <Table :columns='colums'
          :showPagination='true'
          :dataSource='tableData'
          :fetch='loadDataList'
          :options='tableOptions'
          style="margin-top:10px;">
    <!-- 封面 -->
    <template #cover=" { index, row } ">
      <Cover :cover="row.cover"></Cover>
    </template>
    <!-- 文章信息 -->
    <template #blogInfo=" { index, row } ">
      <div>标题：{{row.title}}</div>
      <div>分类：{{row.categoryName}}</div>
      <div>作者：{{row.nickName}}</div>
    </template>
    <!-- 类型 -->
    <template #typeName=" { index, row } ">
      <span>{{row.type==0?"原创":"转载"}}</span>
      <span v-if="row.type==1">&nbsp;({{row.reprintUrl}})</span>
    </template>
    <!-- 类型 -->
    <template #statusName=" { index, row } ">
      <span v-if="row.status==1" :style="{color:'green'}">{{row.statusName}}</span>
      <span v-else :style="{color:'red'}">{{row.statusName}}</span>
    </template>
    <!-- time -->
    <template #time=" { index, row } ">
     <div>创建时间：<br/> {{row.createTime}}</div>
     <div>更新时间：<br/> {{row.lastUpdateTime}}</div>
    </template>
    <template #op=" { index, row } ">
      <div class="op">
        <a href="javascript:void(0)" class="a-link" @click="showEdit('update',row)" >修改</a>
        <el-divider direction="vertical"></el-divider>
        <a href="javascript:void(0)" class="a-link" @click="del(row)">删除</a>
        <el-divider direction="vertical"></el-divider>
        <a href="javascript:void(0)" class="a-link" @click="changeSort(index,'up')" >预览</a>
      </div>
    </template>
    </Table>
    <BlogEdit ref="blogEditRef" @callback="loadDataList"></BlogEdit>
  </div>
</template>

<script setup>
import { getCurrentInstance, reactive, ref } from "vue";
import { Search, Edit } from '@element-plus/icons-vue'
import BlogEdit from "./BlogEdit.vue";

const {proxy} = getCurrentInstance();

const api ={
  "loadCategory":"/category/loadAllCategory4Blog",
  "loadDataList":"/blog/loadBlog",

}

//搜索
const searchFormData =reactive({});
const categoryList = ref([]);
const loadCategoryList = async()=>{
  let result = await proxy.Request({
    url:api.loadCategory
  })
  categoryList.value = result.data;
}
loadCategoryList();

//列表
const colums=[{
  label:'封面',
  prop:'cover',
  width:80,
  scopedSlots:'cover'
},{
  label:'文章信息',
  prop:'blogInfo',
  scopedSlots:'blogInfo'
},{
  label:'编辑器',
  prop:'editorTypeName',
  width:102,
},{
  label:'类型',
  prop:'typeName',
  width:158,
  scopedSlots:'typeName'
},{
  label:'评论',
  prop:'allowCommentTypeName',
  width:68,
},{
  label:'状态',
  prop:'statusName',
  width:68,
  scopedSlots:'statusName'
},{
  label:'时间',
  prop:'time',
  width:170,
  scopedSlots:'time'
},{
  label:'操作',
  prop:'op',
  width:150,
  scopedSlots:'op'
}]

const tableData=reactive({})
const tableOptions = {
  extHeight:40,
}
const loadDataList = async()=> {
  let params = {
    pageNo:tableData.pageNo,
    pageSize:tableData.pageSize
  }
  Object.assign(params,searchFormData);
  let result =  await proxy.Request({
    url:api.loadDataList,
    params
  })
  if(!result){
    return
  }
  Object.assign(tableData,result.data);
}

const blogEditRef = ref(null)
const showEdit = (type,data) => {
  blogEditRef.value.init(type,data)
}


</script>

<style scoped>

</style>