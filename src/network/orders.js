import {request} from './request.js'
// 获取订单信息
export function getOrderList(Info){
    return request({
        url:'/orders',
        params:{
            query:Info.query,
            pagenum:Info.pagenum,
            pagesize:Info.pagesize
        }
    })
}
// 获取物流信息
export function getMessage(){
    return request({
        url:`/kuaidi/804909574412544580`
    })
}

// 图片数据
export function getReports(){
    return request({
        url:'reports/type/1'
    })
}