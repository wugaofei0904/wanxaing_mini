
Page({
    data: {
        listData: [],
        pageNum: 1,
        isNoDta: 0
    },
    onLoad() {
        let that = this;
        let { pageNum } = this.data;
        swan.request({
            url: 'https://pub.suwenyj.xyz/open/article/list-page?pageSize=10&pageNum=' + pageNum + '&status=1', // 仅为示例，并非真实的接口地址
            header: {
                'content-type': 'application/json'
            },
            success: res => {
                if (res.data.success) {
                    that.removeSkeleton()
                    if (res.data.data.length < 10) {
                        this.setData({
                            listData: res.data.data,
                            isNoDta: 1
                        })
                    } else {
                        that.removeSkeleton()
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
    lower() {
        let that = this;
        let { pageNum, listData, isNoDta } = this.data;

        console.log(isNoDta)
        if (isNoDta) {
            return
        }

        swan.showLoading();
        swan.request({
            url: 'https://pub.suwenyj.xyz/open/article/list-page?pageSize=15&pageNum=' + pageNum + '&status=1', // 仅为示例，并非真实的接口地址
            header: {
                'content-type': 'application/json'
            },
            success: res => {
                if (res.data.success) {
                    swan.hideLoading();
                    if (res.data.data.length < 10) {
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
});