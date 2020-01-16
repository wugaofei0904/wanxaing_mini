let timer = null
Component({
    properties: {
        hours: { // 属性名
            type: String, 
        },
        minutes: { // 属性名
            type: String, 
        },
        seconds: { // 属性名
            type: String, 
        },
    },
// {hours}}:{{minutes}}:{{seconds}}</view>
    data: {
        
    }, // 私有数据，可用于模版渲染

    // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
    attached: function () { 
        // this.leftTimer('2020/01/16 13:59:36')
    },

    detached: function () { },
    ready: function () {
        // debugger
        
    },

    methods: {
        onTap: function () {
            this.setData({
                // 更新属性和数据的方法与更新页面数据的方法类似
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
                    this.leftTimer(date)
                }, 1000);
            }
        },
        paddingZero(i) { //将0-9的数字前面加上0，例1变为01 
            return i < 10 ? "0" + i : i;
        }
    }
});