var bdParse = require('./../../bdparse/bdParse/bdParse.js');
// let timer = null

const App = getApp();
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
        getJdAdList: [],
        adNumber: '0',
        showIcon: false,
        noLineHeight: false,
        // hidecontent: true,
        // showContent: false,
        hidecontent: false,
        showContent: true,
        adid_1: '6859839',
        adid_2: '6859974',
        adid_3: '6860042',
        showadid_1: false,
        showadid_2: false,
        showadid_3: false,
        contentHeight: 1000
    },
    getNetworkType() {
        swan.getNetworkType({
            success: res => {
                // console.log(res.networkType)
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
    leftTimer(date) {

        const that = this;
        var leftTime = new Date(date).getTime() - new Date().getTime(); //计算剩余的毫秒数 
        if (leftTime <= 0) {
            //到时间
            leftTime = 0;
            that.setData({
                adHide: true  //广告无效
            })
            return false
        }

        clearTimeout(timer);

        var days = parseInt(leftTime / 1000 / 60 / 60 / 24);
        var hours = parseInt(leftTime / 1000 / 60 / 60 % 24);
        var minutes = parseInt(leftTime / 1000 / 60 % 60);
        var seconds = parseInt(leftTime / 1000 % 60);
        days = this.paddingZero(days);
        hours = this.paddingZero(hours);
        minutes = this.paddingZero(minutes);
        seconds = this.paddingZero(seconds);
        if (days == '00') {
            //显示倒计时
            that.setData({
                timeLose: true
            })
        }
        that.setData({
            hours: hours,
            minutes: minutes,
            seconds: seconds,
        })

        if (leftTime >= 0) {
            timer = setTimeout(() => {
                that.leftTimer(date)
            }, 1000);
        }
    },
    paddingZero(i) { //将0-9的数字前面加上0，例1变为01 
        return i < 10 ? "0" + i : i;
    },
    onLoad: function (option) {

        // console.log(option)
        swan.setPageInfo({
            title: option.title
        })

        this.getNetworkType();
        // this.leftTimer('2020/01/16 13:59:36')
        // console.log(option.id)
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

        //加载jd广告
        this.getJdAd(option.id)

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
        let { adNumber } = this.data;
        this.setData({
            hidecontent: false,
            adNumber: adNumber + 1
        })
    },
    updateAd() {
        let { adNumber } = this.data;
        let _this = this;
        setTimeout(() => {
            _this.setData({
                adNumber: adNumber + 1
            })
        }, 100);

    },
    aderror1() {
        this.setData({
            showadid_1: true
        })
    },
    aderror2() {
        this.setData({
            showadid_2: true
        })
    },
    aderror3() {
        this.setData({
            showadid_3: true
        })
    },
    setContentHeight() {
        try {
            const result = swan.getSystemInfoSync();
            console.log('getSystemInfoSync success', result.windowHeight);
            this.setData({
                contentHeight: result.windowHeight * 3
            })
        } catch (e) {
            console.log('getSystemInfoSync fail', e);
        }

    },
    yueduAdd(id) {

        swan.request({
            url: 'https://www.jiandi.life/open/article/read?id=' + id,
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

    getJdAd(id) {
        swan.request({
            url: 'https://www.jiandi.life/open/ad/list-ad-m?id=' + id,
            header: {
                'content-type': 'application/json'
            },
            success: res => {
                // console.log(res.data);
                if (res.data.success) {
                    // debugger
                    this.setData({
                        getJdAdList: res.data.data
                    })
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
            url: 'https://www.jiandi.life/open/article/like?id=' + id,
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
        const cache = App.cache.get(id)
        console.log('cache:', App.cache.entries())
        let _this = this;

        const successFun = function (res) {
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
                        },0);


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
                      
                        bdParse.bdParse('article', 'html', _body1, _this, 5, '<ad appid="f1522535" apid="6928971" class="ad" type="banner" ></ad>');

                        _this.setContentHeight();
                        _this.getTuijianList(res.data.data.authorName);
                    })

                } else {
                    swan.showToast({
                        title: res.data.msg
                    });
                }
            }

            console.log('cache', cache)
            if (cache) {
                successFun.bind(this)(cache)
            } else {
                swan.request({
                    url: 'https://www.jiandi.life/open/article/article?id=' + id,
                    header: {
                        'content-type': 'application/json'
                    },
                    success: successFun.bind(this),
                    fail: err => {
                        console.log('错误码：' + err.errCode);
                        console.log('错误信息：' + err.errMsg);
                    }
                });
            }
    },
    getTuijianList(name) {
        let { id } = this.data;
        swan.request({
            url: 'https://www.jiandi.life/open/article/list-page-m?id=' + id + '&pageSize=20&pageNum=1&status=&title=&authorName=' + name + '&startTime=&endTime=',
            header: {
                'content-type': 'application/json'
            },
            success: res => {
                if (res.data.success) {
                    let arrtype = res.data.data;
                    // 隔三个添加广告
                    var hasAdlist = [];
                    for (var i = 0, len = arrtype.length; i < len; i += 3) {
                        hasAdlist.push(arrtype.slice(i, i + 3));
                    }
                    hasAdlist.forEach(item => {
                        item.push('')
                    });
                    arrtype = [].concat.apply([], hasAdlist);
                    // console.log(arrtype)
                    this.setData({
                        tuijianList: arrtype
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