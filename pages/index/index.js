

const App = getApp();
import {api} from '../../config.js'
Page({
    data: {
        listData: [],
        pageNum: 1,
        isNoDta: 0
    },
    
    imageError(e) {
        console.log('image 发生 error 事件，携带值为', e.detail.errMsg);
    },
    onLoad() {
        this.getNetworkType()

        let that = this;
        let { pageNum } = this.data;
        swan.request({
            url: api+'/article/list-page-m?pageSize=5&pageNum=' + pageNum + '&status=1', // 仅为示例，并非真实的接口地址
            header: {
                'content-type': 'application/json'
            },
            success: res => {
                try {
                    that.removeSkeleton()
                } catch (err) {

                }
                if (res.data.success) {
                    if (res.data.data.length < 5) {
                        this.setData({
                            listData: res.data.data,
                            isNoDta: 1
                        })
                    } else {
                        this.setData({
                            listData: res.data.data,
                            pageNum: pageNum + 1
                        })
                    }
                } else {

                }
            },
            fail: err => {
                console.log('错误码：' + err.errCode);
                console.log('错误信息：' + err.errMsg);
            }
        });
    },
    getNetworkType() {
        swan.getNetworkType({
            success: res => {
                console.log(res.networkType)
                if (res.networkType == 'none') {
                    swan.showToast({
                        title: '网络不给力，请稍后再试',
                        icon: 'none'
                    });
                }
            },
            fail: err => {
                swan.showToast({
                    title: '获取网络状态失败'
                });
                // swan.showToast({
                //     title: res.networkType,
                //     icon: 'none'
                // });
            },
            // complete: res => {
            //     swan.showToast({
            //         title: res.networkType,
            //         icon: 'none'
            //     });
            // }
        });
    },
    lower() {
        let that = this;
        let { pageNum, listData, isNoDta } = this.data;

        console.log(isNoDta)
        if (isNoDta) {
            return
        }

        swan.showLoading();
        swan.request({
            url: api + '/article/list-page-m?pageSize=5&pageNum=' + pageNum + '&status=1',
            header: {
                'content-type': 'application/json'
            },
            success: res => {
                if (res.data.success) {
                    swan.hideLoading();
                    if (res.data.data.length < 5) {
                        // debugger
                        this.setData({
                            listData: listData.concat(res.data.data),
                            isNoDta: 1
                        })
                    } else {
                        this.setData({
                            listData: listData.concat(res.data.data),
                            pageNum: pageNum + 1
                        })
                    }
                } else {
                    console.log('加载失败')
                }
            },
            fail: err => {
                console.log('错误码：' + err.errCode);
                console.log('错误信息：' + err.errMsg);
            }
        });
    },
    onShow(){
        swan.setPageInfo({
            title: '见地公会'
        })
    },
    onShareAppMessage() {
        return {
            title: '邀请您使用见地阅读发现更多好内容',
            content: '一个专注于信息价值的内容社区，言之有物，即为@见地',
            imageUrl: 'https://product-jiandi.cdn.bcebos.com/%E8%A7%81%E5%9C%B0LOGO.png'
        }
    }
});