import {request} from './request'

export function loginCheck(params1,params2){
    return request({
        method:'post',
        url:'/login',
        data:{
            username:params1,
            password:params2
        }
    })
}