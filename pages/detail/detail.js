Page({
    data: {

    },
    onLoad: function (option) {
        console.log(option.id)
        // 监听页面加载的生命周期函数
        this.setData({
            id: option.id
        })
        //阅读加一
        this.yueduAdd(option.id)
    },
    onReady: function () {
        // 监听页面初次渲染完成的生命周期函数
    },
    onShow: function () {
        // 监听页面显示的生命周期函数
    },
    onHide: function () {
        // 监听页面隐藏的生命周期函数
    },
    onUnload: function () {
        // 监听页面卸载的生命周期函数
    },
    onPullDownRefresh: function () {
        // 监听用户下拉动作
    },
    onReachBottom: function () {
        // 页面上拉触底事件的处理函数
    },
    onShareAppMessage: function () {
        // 用户点击右上角转发
    },
    yueduAdd(id) {
        swan.request({
            url: 'http://open.suwenyj.xyz:8080/article/read?id=1',
            header: {
                'content-type': 'application/json'
            },
            success: res => {
                // console.log(res.data);
                if (res.data.success) {


                } else {
                    // swan.showToast({
                    //     title: res.data.msg,
                    //     success: res => {
                    //         console.log('showToast success');
                    //     },
                    //     fail: err => {
                    //         console.log('showToast fail', err);
                    //     }
                    // });
                }
            },
            fail: err => {
                console.log('错误码：' + err.errCode);
                console.log('错误信息：' + err.errMsg);
            }
        });
    },
    likeAdd() {

        let { id } = this.data;

        swan.request({
            url: 'http://open.suwenyj.xyz:8080/article/like?id=1',
            header: {
                'content-type': 'application/json'
            },
            success: res => {
                // console.log(res.data);
                if (res.data.success) {
                    debugger
                    swan.showToast({
                        title: '已点赞',
                        success: res => {
                            console.log('showToast success');
                        },
                        fail: err => {
                            console.log('showToast fail', err);
                        }
                    });
                } else {
                    // swan.showToast({
                    //     title: res.data.msg,
                    //     success: res => {
                    //         console.log('showToast success');
                    //     },
                    //     fail: err => {
                    //         console.log('showToast fail', err);
                    //     }
                    // });
                }
            },
            fail: err => {
                console.log('错误码：' + err.errCode);
                console.log('错误信息：' + err.errMsg);
            }
        });
    }
});