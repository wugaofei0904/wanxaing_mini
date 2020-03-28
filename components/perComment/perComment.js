Component({
    properties: {
        item: { // 属性名
            type: Object, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
            value: {}, // 属性初始值（必填）
            observer: function(newVal, oldVal) {
                // 属性被改变时执行的函数（可选）
            }
        },
        is_ellipsis: {//是否显示省略号
            type: Boolean,
            value: false,
            observer: function(newVal, oldVal) {
                // 属性被改变时执行的函数（可选）
            }
        },
        index: { //当前index
            type: Number,
            value: 0,
            observer: function(newVal, oldVal) {
                // 属性被改变时执行的函数（可选）
            }
        },
        length: {//总list 长度
            type: Number,
            value: 0,
            observer: function(newVal, oldVal) {
                // 属性被改变时执行的函数（可选）
            }
        },
        isComment:{ //是否是评论
            type: Boolean,
            value: false
        },
        article:{ // 文章信息
            type: Object,
            value: {}
        },
        getuser: { //没有用户信息时显示 获取用户信息按钮
            type:Boolean,
            value: true
        },
        toggleShow:{ // 重新渲染列表，用于点赞组件的缓存问题
            type:Boolean,
            value: true,
            observer: function(newVal, oldVal) {
                // 属性被改变时执行的函数（可选）
                // console.log(newVal);
            }
        }
    },

    data: {}, // 私有数据，可用于模版渲染

    // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
    attached: function () {},

    detached: function () {},

    methods: {
        onTap: function () {
            this.setData({
                // 更新属性和数据的方法与更新页面数据的方法类似
            });
        },
        replay(e){
            const comment = e.currentTarget.dataset.comment;
            let returnData = {...comment,type:1}
            if(!this.properties.isComment){
                returnData.type = 2;
            }
            this.triggerEvent("reply",returnData);
        },
        // 点赞成功
        likeSuccess(e){
            let comment = e.currentTarget.dataset.comment;
            comment.status = e.detail.type;
            comment.type = this.data.isComment?1:2;
            this.triggerEvent("likesuccess",comment);
        },
        // 没有登陆
        likeError(){
            this.triggerEvent("likeerror");
        },
        // 获取用户信息
        returnUserInfo(e){
            const userInfo = e.detail.userInfo
            const comment = e.currentTarget.dataset.comment;
            let returnData = {...comment,type:1}
            if(!this.properties.isComment){
                returnData.type = 2;
            }
            this.triggerEvent("getuser",{userInfo,comment:returnData});
        }
    }
});