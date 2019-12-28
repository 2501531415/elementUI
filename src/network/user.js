import {request} from './request'

// 左边菜单栏数据
export function getMenu(){
    return request({
        url:'/menus'
    })

}

//user数据
export function getUser(info){
    return request({
        url:'/users',
        params:{
            query:info.query,
            pagenum:info.pagenum,
            pagesize:info.pagesize
        }
    })
}
//修改状态
export function getState(uid,state){
    return request({
        method:'put',
        url:`users/${uid}/state/${state}`
    })
}
// 根据id获取用户信息
export function getMessage(uid){
    return request({
        url:`users/${uid}`,
    })
}
// 添加用户
export function addUser(userInfo){
    return request({
        method:'post',
        url:'/users',
        data:{
            username:userInfo.username,
            password:userInfo.password,
            email:userInfo.email,
            mobile:userInfo.mobile
        }
    })
}
//提交编辑内容
export function editForm(id,editInfo){
    return request({
        method:'put',
        url:`users/${id}`,
        data:{
            email:editInfo.email,
            mobile:editInfo.mobile
        }
    })
}
// 删除用户
export function userDelete(id){
    return request({
        method:'delete',
        url:`users/${id}`
    })
}
// 获取所有的角色
export function submitRole(id,rid){
    return request({
        method:'put',
        url:`users/${id}/role`,
        data:{
            rid:rid
        }
    })
}