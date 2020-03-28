Component({
    properties: {
        dataList: { // 属性名
            type: Object, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
            value: {}, // 属性初始值（必填）
            observer: function(newVal, oldVal) {
                // 属性被改变时执行的函数（可选）
                if(oldVal.data&&newVal.data[0].id != oldVal.data[0].id){
                    this.setData({
                        "toggleShow": false
                    },()=>{
                        this.setData({
                            "toggleShow": true
                        })
                    })
                }
            }
        },
        showAll: { //是否显示查看全部评论按钮
            type: Boolean,
            value: true
        },
        article: {// 文章id和title
            type: Object,
            value: {}
        },
        getuser: { //没有用户信息时显示 获取用户信息按钮
            type:Boolean,
            value: true
        }
    },

    data: {
        ellipsisObj:{},// 需要省略文字
        limit: 400, // 限制文字长度
        toggleShow: true, // 重新渲染列表，用于点赞组件的缓存问题
    }, // 私有数据，可用于模版渲染

    // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
    attached: function () {
    },

    detached: function () {},

    methods: {
        onTap: function () {
            this.setData({
                // 更新属性和数据的方法与更新页面数据的方法类似
            });
        },
        // 显示全部评论点击
        checkall() {
            this.triggerEvent("checkall");
        },
        // 显示全部回复点击
        checkReplay(e){
            const comment = e.currentTarget.dataset.comment
            this.triggerEvent("checkreplay",comment);
        },
        // 点击回复按钮
        replay(e){
            const comment = e.currentTarget.dataset.comment;
            this.triggerEvent("replay",{...comment,type:1});
        },
        // 点赞成功
        likeSuccess(e){
            let comment = e.currentTarget.dataset.comment;
            comment.status = e.detail.type;
            comment.type = 1;
            this.triggerEvent("likesuccess",comment);
        },
        // 没有登陆
        likeError(){
            this.triggerEvent("likeerror");
        },
        // 获取用户信息
        returnUserInfo(e){
            const userInfo = e.detail.userInfo;
            let comment = e.currentTarget.dataset.comment;
            comment.type = 1;
            this.triggerEvent("getuser",{userInfo,comment});
        },
        // 显示全部用户信息
        showAll(e){
            const id = e.currentTarget.dataset.id;
            let {ellipsisObj} = this.data;
            if(ellipsisObj[id]){
                ellipsisObj[id].show = 1;
            }else{
                ellipsisObj[id] = {
                    show: 1
                }
            }
            this.setData({
                ellipsisObj: ellipsisObj
            })
        },
        showAnserAll(e){
            const id = e.currentTarget.dataset.id;
            let {ellipsisObj} = this.data;
            if(ellipsisObj[id]){
                ellipsisObj[id].answerShow = 1;
            }else{
                ellipsisObj[id] = {
                    answerShow: 1
                }
            }
            this.setData({
                ellipsisObj: ellipsisObj
            })
        }
    }
});