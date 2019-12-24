var bdParse = require('./../../bdparse/bdParse/bdParse.js');
Page({
    data: {
        id: 0,
        detailData: {},
        likeNum: 0,
        hasLike: false,
        tuijianList: [],
        textBody: '',
        renderedByHtml: false,
        time: '',
        showIcon: false,
        noLineHeight: false,
        hidecontent: true,
        showContent: false
    },
    onLoad: function (option) {

        console.log(option.id)
        // 监听页面加载的生命周期函数
        this.setData({
            id: option.id,
            hasLike: false
        })
        //阅读加一
        this.yueduAdd(option.id)

        //获取详情
        this.getDetailData(option.id)


        const likedData = JSON.parse(swan.getStorageSync('liked') || '{}');
        if (likedData[option.id]) {
            this.setData({
                hasLike: true
            })
        };

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
    showMore() {
        this.setData({
            hidecontent: false
        })
    },
    yueduAdd(id) {

        swan.request({
            url: 'https://pub.suwenyj.xyz/open/article/read?id=' + id,
            header: {
                'content-type': 'application/json'
            },
            success: res => {
                // console.log(res.data);
                if (res.data.success) {
                }
            },
            fail: err => {
                console.log('错误码：' + err.errCode);
                console.log('错误信息：' + err.errMsg);
            }
        });
    },
    likeAdd() {
        let { hasLike } = this.data;
        if (hasLike) return;
        let { id, likeNum } = this.data;

        const likedData = JSON.parse(swan.getStorageSync('liked') || '{}');
        if (likedData[id]) return;


        swan.request({
            url: 'https://pub.suwenyj.xyz/open/article/like?id=' + id,
            header: {
                'content-type': 'application/json'
            },
            success: res => {
                // console.log(res.data);
                if (res.data.success) {
                    this.setData({
                        likeNum: likeNum + 1,
                        hasLike: true
                    })
                    likedData[id] = 1;
                    swan.setStorageSync('liked', JSON.stringify(likedData));
                } else {
                    swan.showToast({
                        title: res.data.msg
                    });
                }
            },
            fail: err => {
                console.log('错误码：' + err.errCode);
                console.log('错误信息：' + err.errMsg);
            }
        });
    },
    getDetailData(id) {

        let _this = this;
        swan.request({
            url: 'https://pub.suwenyj.xyz/open/article/article?id=' + id,
            header: {
                'content-type': 'application/json'
            },
            success: res => {

                if (res.data.success) {
                    this.setData({
                        detailData: res.data.data,
                        likeNum: res.data.data.likeNum,
                    }, () => {
                        let _time = res.data.data.createTime.split(' ')[0].split('-');
                        // let _time = res.data.data.createTime.split('T')[0].split('-');
                        _this.setData({
                            time: _time[1] + '月' + _time[2] + '日'
                        })
                        setTimeout(() => {
                            try {
                                _this.removeSkeleton()
                            } catch (err) {

                            }
                            _this.setData({
                                showIcon: true,
                                showContent: true
                            })
                        }, 500);


                        let num = 0;
                        let str = res.data.data.body;
                        while (str.indexOf('line-height') !== -1) {
                            str = str.slice(str.indexOf('line-height') + 1)
                            num += 1
                        }
                        if (num < 10) {
                            _this.setData({
                                noLineHeight: true
                            })
                        }
                        let _body1 = res.data.data.body.replace(/http:/g, 'https:');

                        let _body = bdParse.bdParse('article', 'html', _body1, _this, 5);

                        // console.log(_body1,'_body1')
                        // _this.setData({ content: _body })
                        _this.getTuijianList(res.data.data.authorName);
                    })

                } else {
                    swan.showToast({
                        title: res.data.msg
                    });
                }
            },
            fail: err => {
                console.log('错误码：' + err.errCode);
                console.log('错误信息：' + err.errMsg);
            }
        });

    },
    getTuijianList(name) {
        let { id } = this.data;
        swan.request({
            url: 'https://pub.suwenyj.xyz/open/article/list-page-m?id=' + id + '&pageSize=20&pageNum=1&status=&title=&authorName=' + name + '&startTime=&endTime=',
            header: {
                'content-type': 'application/json'
            },
            success: res => {
                console.log(res.data.data);
                if (res.data.success) {
                    this.setData({
                        tuijianList: res.data.data
                    })
                } else {
                    swan.showToast({
                        title: res.data.msg
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