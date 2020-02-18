var timer = null;
Component({
    properties: {
        itemData: { // 属性名
            type: Object, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
            value: {}, // 属性初始值（必填）
            observer: function (newVal, oldVal) {
                // 属性被改变时执行的函数（可选）
                console.log(newVal, 'newVal')
                if (newVal.salePoint) {
                    let _arr = newVal.salePoint.split(',')
                    this.setData({
                        salePoint: _arr,
                        price: newVal.price.toFixed(2),
                        salePrice: newVal.salesPrice.toFixed(2),
                    })
                }
            }
        }
    },

    data: {
        timeLose: false,
        andText: '123',
        adHide: false,
        osc: 'android',
        hours: '00',
        minutes: '00',
        seconds: '00',
        price: 0,
        salePrice: 0,
        salePoint: []
    }, // 私有数据，可用于模版渲染

    // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
    attached: function () { },

    detached: function () { },
    ready: function () {
        let that = this;
        let date = this.data.itemData.offlineTime;
        let _date = date.replace(/-/g, "/");
        this.leftTimer(_date)

        // this.leftTimer('2020/01/16 13:59:36')

        wx.getSystemInfo({
            success: res => {
                console.log('res', res.system);
                if (res.system.indexOf('iOS') != -1) {
                    that.setData({
                        osc: 'ios'
                    })
                }
            },
            fail: err => {
                wx.showToast({
                    title: '获取失败'
                });
            }
        });

    },
    methods: {
        onTap: function () {
            this.setData({
                // 更新属性和数据的方法与更新页面数据的方法类似
            });
        },
        navigateToSmartProgram() {

            this.jdYuedu();

            let _path = 'pages/proxy/union/union?isUnion=1&spreadUrl=' + encodeURIComponent(this.data.itemData.adUrl)
            console.log(_path)
            wx.navigateToMiniProgram({
                appKey: '4VvF29wlVg61mjRYCp4tY5dqkBgOyoYN', // 要打开的小程序 App Key
                path: _path, // 打开的页面路径，如果为空则打开首页
                success: res => {
                    console.log('navigateToSmartProgram success', res);
                },
                fail: err => {
                    console.log('navigateToSmartProgram fail', err);
                }
            });
        },

        jdYuedu() {
            wx.request({
                url: 'https://pub.suwenyj.xyz/open/ad/ad-read?id=' + this.data.itemData.id,
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

        leftTimer(date) {

            let that = this;
            var leftTime = new Date(date).getTime() - new Date().getTime(); //计算剩余的毫秒数 
            if (leftTime <= 0) {
                //到时间
                leftTime = 0;
                this.setData({
                    adHide: true  //广告无效
                })
                // return false
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
                this.setData({
                    timeLose: true
                })
            }

            this.setData({
                hours,
                minutes,
                seconds
            })

            if (leftTime >= 0) {
                timer = setTimeout(() => {
                    that.leftTimer(date)
                }, 1000);
            }
        },
        paddingZero(i) { //将0-9的数字前面加上0，例1变为01 
            return i < 10 ? "0" + i : i;
        }
    }
});