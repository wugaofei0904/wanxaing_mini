Component({
    properties: {
        dataitem: { // 属性名
            type: Object, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
            value: {}, // 属性初始值（必填）
            observer: function(newVal, oldVal) {
                // 属性被改变时执行的函数（可选）
                let baseImng = newVal.picUrl.split(',')[0];
                this.setData({
                    imgurl: baseImng,
                    // headerImg: baseImng,
                })
            }
        },
        noMargin: { // 第一个没有上边距
            type: Boolean,
            value: false
        }
    },

    data: {
        age: 1,
        imgurl: "",
        headerImg: ''
    }, // 私有数据，可用于模版渲染

    // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
    attached: function () {},

    detached: function () {},

    methods: {
        jumpDetail: function(e) {
            let _id = e.currentTarget.dataset.id;
            let _title = e.currentTarget.dataset.title;
            swan.navigateTo({
                url: '/pages/detail/detail?id=' + _id + '&title=' + _title,
                success: res => {
                    console.log('navigateTo success')
                },
                fail: err => {
                    console.log('navigateTo fail')
                }
            });
        },
    }
});