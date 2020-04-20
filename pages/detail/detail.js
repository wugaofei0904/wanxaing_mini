var bdParse = require('./../../bdparse/bdParse/bdParse.js');
import {api} from '../../config.js'
// let timer = null
const debounce = (fn, delay = 500) => {
    let timer   = null;
    return function () {
        clearTimeout(timer);
        timer = setTimeout(() => {
            fn.apply(this, arguments);
        }, delay);
        // if (timer) {
        //     console.log(this);
        //     clearTimeout(timer);
        //     timer = setTimeout(() => {
        //         fn.apply(this, arguments);
        //     }, delay);
        // } else {
        //     timer = setTimeout(()=>{
        //         fn.apply(this, arguments);
        //     }, delay);
        // }
    }
}
let app = getApp()
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
        contentHeight: 1000,
        commentList:{
            "data": "",
            "total": 0
        },
        showCommentList: false,// 评论列表是否显示
        showCommentDetail: false,//评论详情是否显示
        currentComment:{
        },// 评论详情当前评论
        showGood: false,// 专享好物是否显示
        showPublish: false,//是否显示半屏发布器
        // commentParam: { //半屏发布器参数
            
        // },
        code: "",//用户登陆后 获取到的code
        openid: "",// 用户openid
        pageCommentData:{//分页列表数据
            pageSize: 20,
            pageNum: 1,
            isGet: false,
            noMore: false,
            total:0,
            data:""
        },
        commentDetailData:{ // 评论详情数据
            pageSize: 20,
            pageNum: 1,
            isGet: false,
            noMore: false,
            total:0,
            data:""
        },
        commentSendData:{},// 点击评论发送的数据
        goodList:"",//专享好物列表
        commentValue: "谈谈你的见解...", //底bar 输入内容
        getUserInfo:false,// 显示获取用户信息
        currentLikeIdAndStatus: "",// 当前正在点赞id和点赞状态
        commentLikedDataTemp:{},// 当前用户点赞对象
        detailLikeToggle:true,// 重新渲染列表，用于点赞组件的缓存问题
        canIUseFollow: swan.canIUse('follow-swan'), // 是否可以使用关注组件
        _showFollow: false,
        showFollow: false,// 60s 后显示关注
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
        Object.defineProperty(app.globalData,"showFollow",{
            set:()=>{
                return this.data._showFollow;
            },
            set:val=>{
                this.setData("showFollow",val);
                this.data._showFollow = val;
            }
        })
        if(swan.canIUse("follow-swan") && swan.canIUse("checkFavor")){
            swan.checkFavor({
                appid:"f1522535",
                success: res=>{
                    if(res){
                        this.setData("isFollow", true);
                    }
                }
            })
        }
        // 获取当前用户点赞对象，保存到临时变量中
        this.data.commentLikedDataTemp = JSON.parse(swan.getStorageSync('commentLikedData') || '{}');
        // swan.setPageInfo({
        //     title: option.title
        // })

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

        //获取2条评论列表
        this.get2Comment(option.id);
        //获取商品列表
        this.getGoodList();
        //判断用户登陆态
        this.checkLogin();
        
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
            // console.log('getSystemInfoSync success', result.windowHeight);
            this.setData({
                contentHeight: result.windowHeight * 3
            })
        } catch (e) {
            console.log('getSystemInfoSync fail', e);
        }

    },
    yueduAdd(id) {
        swan.request({
            url: api+'/article/read?id=' + id,
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
            url: api+'/ad/list-ad-m?id=' + id,
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
        if (hasLike) {
            this.cancelLike();
            return;
        }
        let { id, likeNum } = this.data;

        const likedData = JSON.parse(swan.getStorageSync('liked') || '{}');
        if (likedData[id]) return;
        swan.request({
            url: api+'/article/like?id=' + id,
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
    // 判断当前用户登陆态
    checkLogin(){
        let res = swan.isLoginSync();
        if(res.isLogin){
            this.getOpenid().then(res=>{
            })
        }
    },
    //取消点赞
    cancelLike(){
        let {id, hasLike } = this.data;
        if(!hasLike){
            return;
        }
        swan.request({
            url: api+'/article/cancel-like?id=' + id,
            header: {
                'content-type': 'application/json'
            },
            success: res => {
                // console.log(res.data);
                if (res.data.success) {
                    this.setData({
                        likeNum: likeNum - 1,
                        hasLike: false
                    })
                    delete likedData[id];
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
        })
    },
    getDetailData(id) {
        let _this = this;
        swan.request({
            url: api+'/article/article?id=' + id,
            header: {
                'content-type': 'application/json'
            },
            success: res => {
                if (res.data.success) {
                    setTimeout(() => {
                      _this.removeSkeleton()
                    }, 0)
                    this.setData({
                        detailData: res.data.data,
                        likeNum: res.data.data.likeNum,
                        showIcon: true,
                        showContent: true,
                    }, () => {
                      let _body1 = res.data.data.body.replace(/http:/g, 'https:');
                      bdParse.bdParse('article', 'html', _body1, _this, 5, '<ad appid="f1522535" apid="6928971" class="ad" type="banner" ></ad>');
                        let _time = res.data.data.createTime.split(' ')[0].split('-');
                        // let _time = res.data.data.createTime.split('T')[0].split('-');
                        _this.setData({
                            time: _time[1] + '月' + _time[2] + '日',
                        })
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
                        

                        _this.setContentHeight();
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
            url: api+'/article/list-page-m?id=' + id + '&pageSize=20&pageNum=1&status=&title=&authorName=' + name + '&startTime=&endTime=',
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

    },
    // 获取用户openid
    getOpenid() {
        return new Promise((reslove,reject)=>{
            if(this.data.openid){
                reslove(this.data.openid);
                return;
            }
            swan.login({
                success: res => {
                    swan.request({
                        url: 'https://spapi.baidu.com/oauth/jscode2sessionkey',
                        method: 'POST',
                        header: {
                            'content-type': 'application/x-www-form-urlencoded'
                        },
                        data: {
                            // swan.login()返回的 code
                            code: res.code,
                            client_id: 'PBwrbTdDLzOgoOMbyPwRXbboUx1Xw7Sh',
                            sk: 'qUWBEI32Q3sThqqnDfEVr1pddW5ZaaOx'
                        },
                        success: res => {
                            if (res.statusCode === 200) {
                                this.setData({
                                    openid: res.data.openid
                                })
                                reslove(res.data.openid)
                            }else{
                                reject();
                            }  
                        },
                        fail: res => {
                            reject(res);
                        }
                    });
                },
                fail:res => {
                    reject(res);
                }
            });
        })
    },
    // 获取2条评论
    get2Comment(id){
        const reqData = {
            articleId: id,
            appType: 0
        }
        swan.request({
            url: api+'/comment/m/list',
            header: {
                'content-type': 'application/json'
            },
            data: reqData,
            success: res => {
                if (res.data.success) {
                    res.data.data = this.addIsLike(res.data.data);
                    this.setData({
                        commentList: res.data
                    })
                }
            }
        })
    },
    // 点击评论
    commentThis(){
        this.initPublisher({detail:{type: 0}})
    },
    // 对评论的评论
    commentToComment(){
        this.initPublisher({detail:{...this.data.currentComment,type: 1}})
    },
    // 初始化半屏发布器
    initPublisher(data){
        const e = data.detail;
        // this.setData({
        //     showPublish: true
        // })
        if(!this.data.userInfo){
            swan.getSetting({
                success:res=>{
                    if(res.authSetting["scope.userInfo"]){ //如果用户已授权 不弹出授权弹窗
                        swan.getUserInfo({
                            success:res=>{
                                this.setData({
                                    userInfo: res.userInfo,
                                    commentSendData: e,
                                    showPublish: true
                                })
                            }
                        });
                    }
                    // else{
                    //     this.setData({
                    //         getUserInfo: true,
                    //         commentSendData: e
                    //     })
                    // }
                },
                fail:error=>{
                    // this.setData({
                    //     getUserInfo: true,
                    //     commentSendData: e
                    // })
                }
            })
        }else{
            this.setData({
                showPublish: true,
                commentSendData: e
            })
        }
        // console.log(this.data.showPublish);
        setTimeout(()=>{
            this.setData({
                showPublish: false
            })
        }, 500);
        // return;
        // this.getOpenid().then(res=>{
            
        // })
    },
    // 用户授权后返回
    publisherShow(e){
        this.setData({
            userInfo:e.detail,
            showPublish: true
        });
        setTimeout(()=>{
            this.setData({
                showPublish: false
            })
        }, 500);
    },
    // 同步评论数据到百度后台 失败回调 
    publishFail(e){
        console.log(e);
        // swan.showToast({
        //     mask: true,
        //     title: '评论失败',
        //     icon: 'none',
        //     mask: false,
        //     success: res => {
        //         console.log('showToast success', res);
        //     },
        //     fail: err => {
        //         console.log('showToast fail', err);
        //     }
        // });
    },
    // 发送评论
    releseComment(e){
        if(e.inputValue.trim().length == 0)return;
        let {id,openid,userInfo,commentSendData,detailData,currentComment} = this.data;
        let reqData = {
            nickname: userInfo.nickName,
            headimg: userInfo.avatarUrl,
            body:e.inputValue,
            type: commentSendData.type, 
	        articleId: id,
	        appType: 0
        }
        if(commentSendData.type){
            reqData.pId = commentSendData.id,
            reqData.answerName = commentSendData.nickname
        }
        if(commentSendData.type==2){
            reqData.pId = currentComment.id
        }
        swan.request({
            url: api+'/comment/m/comment',
            data: reqData,
            header: {
                'content-type': 'application/json'
            },
            method: 'GET',
            success: res => {
                if (res.data.success) {
                    let commentParam = {
                        appkey: "PBwrbTdDLzOgoOMbyPwRXbboUx1Xw7Sh",
                        openid: openid,
                        snid:id,
                        srid: String(res.data.data),
                        title: detailData.title,
                        content: detailData.detail,
                        path:"/pages/detail/detail?id="+id
                    }
                    let {commentList,pageCommentData,commentDetailData} = this.data;
                    let item = {
                        "id": res.data.data,
                        "nickname": reqData.nickname,
                        "likeNum": 0,
                        "headimg": reqData.headimg,
                        "body": reqData.body,
                        "createTime": this.getNow()
                    }
                    if(commentSendData.type){ //type=1 表示回复
                        commentParam.spid = String(commentSendData.id); 
                        item.answerName = commentSendData.nickname;
                        item.type = commentSendData.type;               
                        if(commentSendData.type==2){ // 有回复的人时，指代回复的回复
                            commentDetailData.total++;
                            commentDetailData.data.unshift(JSON.parse(JSON.stringify(item)));
                            const index2 = this.returnIndex(pageCommentData.data,currentComment.id);
                            if(index2>-1){
                                pageCommentData.data[index2].answer.total++;
                            }
                            const index3 = this.returnIndex(commentList.data,currentComment.id);
                            if(index3>-1){
                                commentList.data[index3].answer.total++;
                            }
                        }else{
                            const index = this.returnIndex(commentList.data,commentSendData.id);
                            if(index>-1){
                                const answer = commentList.data[index].answer;
                                let total = answer&&answer.toString()!="{}"&&typeof answer.total=="number"?answer.total:0
                                item.total = total+1;
                                commentList.data[index].answer = JSON.parse(JSON.stringify(item));
                            }
                            const index2 = this.returnIndex(pageCommentData.data,commentSendData.id);
                            if(index2>-1){
                                const answer2 = pageCommentData.data[index2].answer;
                                let total2 = answer2&&answer2.toString()!="{}"&&typeof answer2.total=="number"?answer2.total:0
                                item.total = total2+1;
                                pageCommentData.data[index2].answer = JSON.parse(JSON.stringify(item));
                                console.log( pageCommentData.data[index2].answer)
                            }
                            if(this.data.currentComment.id == commentSendData.id){//当前评论详情显示评论id 等于当前正在评论id
                                commentDetailData.total++;
                                commentDetailData.data.unshift(JSON.parse(JSON.stringify(item)));
                            }
                        }
                    }else{
                        commentList.data.push(JSON.parse(JSON.stringify(item)));
                        commentList.total++;
                        if(pageCommentData.data){
                            pageCommentData.data.unshift(JSON.parse(JSON.stringify(item)));
                            pageCommentData.total++;
                        }
                    }
                    this.setData({
                        commentParam: commentParam,
                        commentList: commentList,
                        pageCommentData: pageCommentData,
                        commentDetailData: commentDetailData
                    },()=>{
                        this.detailLikeToggleFn();
                    });
                }else{
                    // 评论提交错误的回调
                }
            },
            fail: err => {
                console.log('错误码：' + err.errCode);
                console.log('错误信息：' + err.errMsg);
            }
        });
    },

    detailLikeToggleFn(){
        this.setData({
            detailLikeToggle: false
        },()=>{
            this.setData({
                detailLikeToggle: true
            })
        })
    },
    // 获取当前时间
    getNow(){
        let now = new Date();
        let y = now.getFullYear();
        let m = String(now.getMonth()+1).padStart(2,"0");
        let d = String(now.getDate()).padStart(2,"0");
        let h = String(now.getHours()).padStart(2,"0");
        let min = String(now.getMinutes()).padStart(2,"0");
        let s = String(now.getSeconds()).padStart(2,"0");
        return `${y}-${m}-${d} ${h}:${min}:${s}`;
    },
    // 根据 id 返回评论的index
    returnIndex(arr,id){
        if(!Array.isArray(arr)){
            return -1;
        }
        for(let i in arr){
            if(arr[i].id == id){
                return i;
            }
        }
        return -1;
    },
    publishError(){
    },
    // 半屏发布器 失去焦点触发
    publishClose(e){
        console.log(e);
    },
    // 获取评论列表
    getPageComment(){
        let {pageCommentData,id} = this.data;
        if(pageCommentData.isGet || pageCommentData.noMore){
            return;
        }
        pageCommentData.isGet = true;
        this.setData({
            pageCommentData:pageCommentData
        })
        const reqData = {
            articleId: id,
            appType: 0,
            pageSize: pageCommentData.pageSize,
            pageNum: pageCommentData.pageNum
        }
        swan.request({
            url: api+'/comment/m/list-page',
            header: {
                'content-type': 'application/json'
            },
            data: reqData,
            success: res => {
                if (res.data.success) {
                    let {data} = res;
                    data.data = this.addIsLike(data.data);
                    pageCommentData.data = pageCommentData.data?pageCommentData.data.concat(data.data):data.data;
                    if(data.total < pageCommentData.data.length || data.total == pageCommentData.data.length){
                        pageCommentData.noMore = true;
                    }else{
                        pageCommentData.pageNum++;
                    }
                    pageCommentData.total = data.total;
                    pageCommentData.isGet = false;
                    this.setData({
                        pageCommentData:pageCommentData
                    })
                }
            },
            fail: res => {
                pageCommentData.isGet = false;
                this.setData({
                    pageCommentData:pageCommentData
                })
            }
        })
        
    },
    //显示评论列表
    commentListShow() {
        this.setData({
            showCommentList: true
        })
        if(this.data.pageCommentData.data){
            return;
        }else{
            this.getPageComment();
        }
        
    },
    //评论列表 返回
    commentListHide() {
        this.setData({
            showCommentList: false
        })
    },
    //显示评论详情
    commentDetailShow(e){
        let {commentDetailData,currentComment} = this.data;
        if(currentComment.id != e.id){
            commentDetailData.noMore = false;
            commentDetailData.isGet = false;
            commentDetailData.pageNum = 1;
            commentDetailData.data = [];
            this.setData({
                currentComment: e,
                commentDetailData: commentDetailData
            },()=>{
                this.getCommetDetail();
            })
            
        }
        this.setData({
            showCommentDetail: true,
            
        })
    },
    // 获取评论详情数据
    getCommetDetail(){
        let {commentDetailData,currentComment} = this.data;
        if(commentDetailData.isGet || commentDetailData.noMore){
            return;
        }
        commentDetailData.isGet = true;
        this.setData({
            commentDetailData:commentDetailData
        })
        const reqData = {
            id: currentComment.id,
            appType: 0,
            pageSize: commentDetailData.pageSize,
            pageNum: commentDetailData.pageNum
        }
        swan.request({
            url: api+'/comment/m/list-page-s',
            header: {
                'content-type': 'application/json'
            },
            data: reqData,
            success: res => {
                if (res.data.success) {
                    let {data} = res;
                    data.data = this.addIsLike(data.data);
                    commentDetailData.data = typeof commentDetailData.data == "string"?data.data:commentDetailData.data.concat(data.data)
                    if(data.total < commentDetailData.data.length || data.total == commentDetailData.data.length){
                        commentDetailData.noMore = true;
                    }else{
                        commentDetailData.pageNum++;
                    }
                    commentDetailData.total = data.total;
                    commentDetailData.isGet = false;
                    this.setData({
                        commentDetailData:commentDetailData
                    })
                }
            },
            fail: res => {
                commentDetailData.isGet = false;
                this.setData({
                    commentDetailData:commentDetailData
                })
            }
        })
    },
    // 隐藏获取用户
    getUserHide(){
        this.setData("getUserInfo",false)
    },
    //隐藏评论详情
    commentDetailHide(e){
        this.setData({
            showCommentDetail: false
        })        
    },
    //显示商品
    goodShow(){
        this.setData({
            showGood: true
        })
    },
    //隐藏商品
    goodHide(){
        this.setData({
            showGood: false
        })
    },
    //获取商品数据
    getGoodList(){
        const {id} = this.data;
        swan.request({
            url: api+'/ad/list-ad-m?id='+id,
            header: {
                'content-type': 'application/json'
            },
            success: res => {
                console.log(res);
                if (res.data.success) {
                    this.setData("goodList",res.data.data);
                }
            }
        })
    },
    // 跳转商品链接
    jumpUrl(e){
        // console.log(e.currentTarget.dataset)
        const url = e.currentTarget.dataset.url;

        let _path = 'pages/proxy/union/union?isUnion=1&spreadUrl=' + encodeURIComponent(url)
        swan.navigateToSmartProgram({
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
    startAuthor(){
        swan.navigateTo({
            url: `/pages/author/author?authorId=${this.data.detailData.authorId}`,
            success: res => {
                console.log('navigateTo success')
            },
            fail: err => {
                console.log('navigateTo fail')
            }
        });
    },
    // 分享文章
    shareArticle(){
        const {detailData,id} = this.data;
        swan.openShare({
            title: detailData.title,
            imageUrl: detailData.picUrl,
            path: "pages/detail/detail?id="+id,
            content: detailData.detail,
            success: function(){
                // swan.showToast({
                //     title: "分享成功",
                //     icon:"success"
                // })
            }
        });
    },
    // 点赞处理处理未登陆
    likeError(){
        this.getOpenid().then(res=>{
            this.setData("userInfo","");
        })
        // if(!this.data.openid)
    },
    // 点赞成功处理
    likeSuceess(e){
        const comment = e.detail;
        // console.log(comment);
        const id = comment.id;
        if(this.data.currentLikeIdAndStatus == `${id}_${comment.status}`)return;
        this.data.currentLikeIdAndStatus = `${id}_${comment.status}`;
        let {commentLikedDataTemp} = this.data;
        if(comment.status != Boolean(commentLikedDataTemp[id])){
            this.handleLikeNum(id,comment.type,comment.status);
            if(comment.status){
                commentLikedDataTemp[id] = 1;
            }else{
                delete commentLikedDataTemp[id]
            }
            this.data.commentLikedDataTemp = commentLikedDataTemp;
            const _this = this;
            debounce(function(){
                _this.submitLike(id,comment.status)
            })();
        }
    },
    // 处理 点赞数量 
    handleLikeNum(id,type,isPlus){
        if(type == 1){ //type 为1 表示点赞对象为评论 2 表示 回复点赞
            let {commentList,pageCommentData,currentComment} = this.data;
            let setObj = {};
            // 处理文章页列表
            for(let i in commentList.data){
                if(commentList.data[i].id == id){
                    if(isPlus){
                        commentList.data[i].likeNum ++;
                        commentList.data[i].isLike = 1;
                    }else{
                        commentList.data[i].likeNum --;
                        commentList.data[i].isLike = 0;
                    }
                    break;
                }
            }
            setObj.commentList = commentList;
            // 处理评论浮层列表
            if(pageCommentData.data){
                for(let i in pageCommentData.data){
                    if(pageCommentData.data[i].id == id){
                        if(isPlus){
                            pageCommentData.data[i].likeNum ++;
                            pageCommentData.data[i].isLike = 1;
                        }else{
                            pageCommentData.data[i].likeNum --;
                            pageCommentData.data[i].isLike = 0;
                        }
                        break;
                    }
                }
                setObj.pageCommentData = pageCommentData;
            }
            // 处理 评论详情 评论
            if(currentComment.id == id){
                if(isPlus){
                    currentComment.likeNum ++;
                    currentComment.isLike = 1;
                }else{
                    currentComment.isLike = 0;
                    currentComment.likeNum --;
                }
                setObj.currentComment = currentComment;
            }
            this.setData(setObj)
        }else{
            let {commentDetailData} = this.data;
            if(commentDetailData.data){
                for(let i in commentDetailData.data){
                    if(commentDetailData.data[i].id == id){
                        if(isPlus){
                            commentDetailData.data[i].likeNum ++;
                            commentDetailData.data[i].isLike = 1;
                        }else{
                            commentDetailData.data[i].likeNum --;
                            commentDetailData.data[i].isLike = 0;
                        }
                        break;
                    }
                }
                this.setData({
                    commentDetailData: commentDetailData
                })
            }
        }
    },
    // 点赞后与后台交互
    submitLike:function(id,isPlus){
        // const commentLikedData = JSON.parse(swan.getStorageSync('commentLikedData') || '{}');
        if(isPlus){ //点赞态
            swan.request({
                url: api+'/comment/m/like?id='+id,
                header: {
                    'content-type': 'application/json'
                },
                success: res => {
                },
                complete:()=>{
                }
            })
        }else{
            swan.request({
                url: api+'/comment/m/cancel-like?id='+id,
                header: {
                    'content-type': 'application/json'
                },
                success: res => {
                },
                complete:()=>{
                }
            })
        }
        swan.setStorageSync('commentLikedData',JSON.stringify(this.data.commentLikedDataTemp));
    },
    // 给列表加上是否点赞
    addIsLike(arr){
        if(!Array.isArray(arr))return arr;
        const commentLikedData = this.data.commentLikedDataTemp;
        for(let i in arr){
            if(commentLikedData[arr[i].id]){
                arr[i].isLike = 1;
            }else{
                arr[i].isLike = 0;
            }
        }
        return arr;
    },

    //
    judgeLogin(){
        console.log("judgeLogin");
    },
    // 用户授权后回调(底bar+评论列表)
    returnUserInfo(e){
        // console.log(e);
        this.setData({
            userInfo: e.detail.userInfo,
        })
        this.commentThis();
    },
    // 用户授权后回调(评论列表+评论详情)
    returnUserInfo2(e){
        const userInfo = e.detail.userInfo;
        const comment = e.detail.comment;
        this.setData({
            userInfo: userInfo,
        })
        this.initPublisher({detail:comment});
    },
    // 用户授权后回调(评论详情头部)
    returnUserInfo3(e){
        const userInfo = e.detail.userInfo;
        // const comment = e.detail.comment;
        this.setData({
            userInfo: userInfo,
        })
        this.commentToComment();
    },
    onShareAppMessage() {
        return {
            title: this.data.detailData.title,
            imageUrl: this.data.detailData.picUrl,
            content: this.data.detailData.corePoint ? this.data.detailData.corePoint : `作者：${this.data.detailData.authorName}`,
        }
    },
    // 不支持follow-swan 组件 点击关注
    followAction(d){
        swan.showFavoriteGuide({
            type: 'tip',
            content:'关注小程序',
            complete: res=>{
                console.log(res)
            }
        })
    }
});
