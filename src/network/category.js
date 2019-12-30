import {request} from './request'
// 获取分类数据
export function getCategory(categoryInfo){
    return request({
        url:'/categories',
        params:{
            type:categoryInfo.type,
            pagenum:categoryInfo.pagenum,
            pagesize:categoryInfo.pagesize

        }
    })
}
// 提交添加分类
export function cateSubmit(Info){
    return request({
        method:'post',
        url:'/categories',
        data:{
            cat_name:Info.cat_name,
            cat_pid:Info.cat_pid,
            cat_level:Info.cat_level
        }
    })
}
// 删除分类
export function delCate(id){
    return request({
        method:'delete',
        url:`categories/${id}`
    })
}
// 编辑分类
export function editCate(info){
    return request({
        method:'put',
        url:`categories/${info.cat_id}`,
        data:{
            cat_name:info.cat_name
        }
    })
}

// 获取分类参数列表
export function getParams(id,sel){
    return request({
        url:`categories/${id}/attributes`,
        params:{
            sel:sel
        }
    })
}

// 提交添加参数
export function submitParams(id,name,sel){
    return request({
        method:'post',
        url:`categories/${id}/attributes`,
        data:{
            attr_name:name,
            attr_sel:sel
        }
    })
}

// 删除参数
export function deleteParams(cat_id,attr_id){
    return request({
        method:'delete',
        url:`categories/${cat_id}/attributes/${attr_id}`
    })
}
// 提交编辑
export function submitEditParams(id,attrId,name,sel,val){
    return request({
        method:'put',
        url:`categories/${id}/attributes/${attrId}`,
        data:{
            attr_name:name,
            attr_sel:sel,
            attr_vals:val
        }
    })
}