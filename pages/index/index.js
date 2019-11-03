
Page({
    data: {
        listData: []
    },
    onLoad() {
        console.log(123)
        swan.request({
            url: 'http://open.suwenyj.xyz:8080/article/list-page?pageSize=15&pageNum=1&status=1', // 仅为示例，并非真实的接口地址
            header: {
                'content-type': 'application/json'
            },
            success: res => {
                // console.log(res.data);
                if (res.data.success) {
                    this.setData({
                        listData: res.data.data
                    })
                } else {
                    swan.showToast({
                        title:  res.data.msg,
                        success: res => {
                            console.log('showToast success');
                        },
                        fail: err => {
                            console.log('showToast fail', err);
                        }
                    });
                }
            },
            fail: err => {
                console.log('错误码：' + err.errCode);
                console.log('错误信息：' + err.errMsg);
            }
        });

    }
});