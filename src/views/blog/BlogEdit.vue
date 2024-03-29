<template>
  <div>
    <!--新增修改弹窗-->
    <Window :show="windowConfig.show"
            :buttons="windowConfig.buttons"
            @close="closeWindow"
            style="width:100%">
      <el-form :model="blogFormData"
              :rules="rules"
              ref="blogFormRef">
        <el-form-item prop="title">
          <div class="input-title">
            <el-input placeholder="请输入博客标题"
                   v-model="blogFormData.title">
            </el-input>
          </div>
        </el-form-item>
        <el-form-item prop="content">
          <div :style="{'width':'100%'}">
            <EditorHtml :height="editHtmlHeight"
                        v-model="blogFormData.content"
                        v-if="blogFormData.editorType==0"></EditorHtml>
      
            <EditorMarkdown v-else
                            :height="editMarkHeight"
                            v-model="blogFormData.markdownContent"
                            @htmlContent="setHtmlContent"></EditorMarkdown>
          </div>
        </el-form-item>
        
      </el-form>

      <Dialog :show="dialogConfig.show"
          :title="dialogConfig.title" 
          :buttons="dialogConfig.buttons"
          width="700px"
          @close="dialogConfig.show=false">
        <el-form :model="blogFormData"
                   :rules="rules"
                   ref="blogFormDataRef"
                   label-width="95px">
          <el-form-item label="博客分类&emsp;"
                        prop="categoryId">
             <el-select placeholder="请选择分类"
                        v-model="blogFormData.categoryId"
                        clearable
                        :style="{'width':'100%'}">
                <el-option :value="item.categoryId" 
                           :label="item.categoryName"
                           v-for="(item,index) in categoryList" :key="index" />
              </el-select>
          </el-form-item>
          <el-form-item label="封面&emsp;"
                        prop="cover">
            <CoverUpload v-model="blogFormData.cover"></CoverUpload>
          </el-form-item>
          <el-form-item label="博客类型&emsp;"
                        prop="type">
            <el-radio-group v-model="blogFormData.type">
              <el-radio :label="0">原创</el-radio>
              <el-radio :label="1">转载</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="原文地址&emsp;"
                        prop="reprintUrl"
                        v-if="blogFormData.type==1">
            <el-input v-model="blogFormData.reprintUrl"
                      placeholder="请输入原文地址">
            </el-input>
          </el-form-item>
          <el-form-item label="评论&emsp;"
                        prop="allowComment">
            <el-radio-group v-model="blogFormData.allowComment">
              <el-radio :label="1">允许</el-radio>
              <el-radio :label="0">不允许</el-radio>
            </el-radio-group>
            <span class="info1">请先在评论里设置相应参数，才会生效</span>
          </el-form-item>
          <el-form-item label="博客摘要&emsp;"
                        prop="summary">
            <el-input v-model="blogFormData.summary"
                      type="textarea"
                      placeholder="请输入摘要"
                      :autosize="{minRows:3,maxRows:3}">
            </el-input>
          </el-form-item>
          <el-form-item label="博客标签&emsp;"
                        prop="categoryDesc">
            <div style="display:flex;align-items: center;">
              <el-tag v-for="(item,index) in blogFormData.tag" :key="index"
                      @close="closeTag(index)" closable
                      style="margin-right: 5px;">
                {{item}}

              </el-tag>
              <span class="info2"
                    v-if="blogFormData.tag.length==0">添加标签，更容易被搜索引擎收录</span>
              <el-button :icon="Plus" circle size="small" 
                          @click="showTagInputHandler"
                          v-if="!showTagInput"/>
              <el-input class="tag-input"
                        v-if="showTagInput"
                        v-model="tagInputValue"
                        @blur="tagInputResult"
                        @keyup.enter="tagInputResult"></el-input>
            </div>
          </el-form-item>
        </el-form>
      </Dialog>

    </Window>
  </div>
</template>

<script setup>
import { getCurrentInstance, nextTick, onMounted, proxyRefs, reactive, ref } from "vue"
import { Plus} from '@element-plus/icons-vue'

const {proxy} = getCurrentInstance();
//
const api ={
  loadAllCategory4Blog:"/category/loadAllCategory4Blog",
  saveBlog:"/blog/saveBlog",
  getUserInfo:"/getUserInfo"
}

const editMarkHeight = window.innerHeight - 60 - 30 - 55 -70;
const editHtmlHeight = window.innerHeight - 60 - 30 - 55 -30 -120;

const init = (type,data) => {
  
  windowConfig.show = true
  nextTick(()=>{
    blogFormRef.value.resetFields()
    blogFormData.value = {tag:[]}
    if(type==="add"){
      getUserInfo()
    }
  })
}
defineExpose({init});
const getUserInfo = async()=>{
  let result = await proxy.Request({
    url:api.getUserInfo,
  })
  if(!result){
    return;
  }
  blogFormData.value.editorType = result.data.editorType;
}

//新增 修改
const windowConfig = reactive({
  show:false,
  buttons:[{
    type:"primary",
    text:"确定",
    click: (e) => {
      showSettings();
    }
  }]
});

const emit = defineEmits()
const closeWindow = () =>{
  windowConfig.show = false;
  emit("callback");
}

// 博客正文
const blogFormRef = ref(null)
const blogFormData = ref({tag:[]})
const rules = {
  title:[{required:true,message:"请输入标题" }],
  content:[{required:true,message:"请输入正文" }],
  categoryId:[{required:true,message:"请选择博客分类" }],
  type:[{required:true,message:"请选择博客类型"}],
  allowComment:[{required:true,message:"请选择是否容许评论"}],
  reprintUrl:[{required:true,message:"请输入原文地址"}],

}

//markdown设置html内容
const setHtmlContent = (htmlContent)=>{
  blogFormData.value.content = htmlContent
}
// 提交1 展示配置弹窗
const showSettings = () =>{
  blogFormRef.value.validate(async (valid) => {
    if(!valid){
      return
    }
    dialogConfig.show = true;
  })
}

//设置确定吗
const dialogConfig = reactive({
  show:false,
  title:"博客设置",
  buttons:[{
    type:"primary",
    text:"确定",
    click: (e) => {
      SubmitBlog();
    }
  }]
})
//博客分类
const categoryList = ref([]);
const loadcategory = async () =>{
  let result = await proxy.Request({
    url: api.loadAllCategory4Blog,
  })
  if (!result) {
    return
  }
  categoryList.value = result.data;
}
onMounted(() => {
  loadcategory();
})

//标签输入
const tagInputValue = ref(null)
const tagInputResult = () => {
  if(tagInputValue.value==undefined){
    return
  }
  showTagInput.value = false;
  if(blogFormData.value.tag.indexOf(tagInputValue.value) == -1){
    blogFormData.value.tag.push(tagInputValue.value);
  }
  tagInputValue.value = undefined;
}
const closeTag = (index) => {
blogFormData.value.tag.splice(index, 1)
}
//是否显示tag输入框
const showTagInput = ref(false)
const showTagInputHandler = () => {
  showTagInput.value = true
}

const blogFormDataRef = ref()
const SubmitBlog = () => {
  blogFormDataRef.value.validate(async (valid) => {
    if(!valid){
      return
    }
    const params={
        // blogId:blogFormData.blogId,
        // title:blogFormData.blogId,
        // content:blogFormData.blogId,
        // markdownContent:blogFormData.blogId,
        // editorType:blogFormData.blogId,
        // categoryId:blogFormData.blogId,
        // cover:blogFormData.blogId,
        // summary:blogFormData.blogId,
        // tag:blogFormData.blogId,
        // type	:blogFormData.blogId,
        // reprintUrl:blogFormData.blogId,
        // allowComment:blogFormData.blogId,
    }
    Object.assign(params,blogFormData.value);
    params.tag = params.tag.join("|")
    let result = await proxy.Request({
      url:api.saveBlog,
      params
    })
    if (!result) {
      return
    }
    proxy.Message.success("保存博客成功")
    dialogConfig.show=false
    closeWindow()
  })
}




</script>

<style scoped>
.input-title{
  width: 100%;
  border-bottom: 1px solid rgba(202, 203, 206, 0.774);
}
.input-title :deep(.el-input__wrapper){
  box-shadow: none;
  border-radius: 5px;
  font-size: 18px;
  font-family: "微软雅黑";
}
.info1{
  margin-left: 10px;
  font-size: 12px;
  color: rgb(166, 170, 174);
}
.info2{
  color: rgb(166, 170, 174);
  font-size: 12px;
  margin-right: 10px;
}
.tag-input{
  width: 100px;
  margin-left: 10px;
}
</style>