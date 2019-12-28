import {request} from './request'
// 获取权限数据
export function getRights(type){
    return request({
        url:`rights/${type}`
    })
}
export function getRoles(){
    return request({
        url:'/roles'
    })
}
// 删除用户对应权限
export function rightsDel(roleId,rightId){
    return request({
        method:'delete',
        url:`roles/${roleId}/rights/${rightId}`
    })
}
// 提交添加角色

export function addRoles(roleInfo){
    return request({
        method:'post',
        url:'/roles',
        data:{
            roleName:roleInfo.roleName,
            roleDesc:roleInfo.roleDesc
        }
    })
}
//根据id查找角色内容
export function checkRoles(id){
    return request({
        url:`roles/${id}`
    })
}
// 提交编辑
export function editFormSubmit(editInfo){
    return request({
        method:'put',
        url:`roles/${editInfo.roleId}`,
        data:{
            roleName:editInfo.roleName,
            roleDesc:editInfo.roleDesc
        }

    })
}
// 删除角色
export function delRoles(id){
    return request({
        method:'delete',
        url:`roles/${id}`
    })
}
// 提交分配权限
export function rightsSubmit(roleId,ridKey){
   return request({
    method:'post',
    url:`roles/${roleId}/rights`,
    data:{
        rids:ridKey
    }
   })
}
// 获取所有角色