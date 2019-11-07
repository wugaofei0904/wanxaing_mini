// 自定义组件逻辑 (custom.js)
Component({
    properties: {
        dataitem: { // 属性名
            type: Object, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
            value: {}, // 属性初始值（必填）
            observer: function (newVal, oldVal) {
                // 属性被改变时执行的函数（可选）

                console.log(newVal)
            }
        },
        noMargin: false
    },
    data: {
        age: 1
    },
    methods: {
        tap: function () { },
        jumpDetail: function (e) {
            let _id = e.currentTarget.dataset.id;
            console.log(e.currentTarget.dataset.id)
            swan.navigateTo({
                url: '/pages/detail/detail?id=' + _id,
                success: res => {
                    console.log('navigateTo success')
                },
                fail: err => {
                    console.log('navigateTo fail')
                }
            });
        }
    }
});