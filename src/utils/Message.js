
import {ElMessage} from 'element-plus'
const message = {
    error:(msg) =>{
        ElMessage({
            message: msg,
            type: 'error',
            duration:2000,
        })
    },
    success:(msg) =>{
        ElMessage({
            message: msg,
            type: 'success',
            duration:2000,
        })
    },
    warnning:(msg) =>{
        ElMessage({
            message: msg,
            type: 'warnning',
            duration:1500,
        })
    }
}

export default message;