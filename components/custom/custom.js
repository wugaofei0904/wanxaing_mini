// 自定义组件逻辑 (custom.js)
Component({
    properties: {
        // 定义了name属性，可以在使用组件时，由外部传入。此变量可以直接在组件模板中使用
        name: {
            type: String,
            value: 'swan',
        }
    },
    data: {
        age: 1
    },
    methods: {
        tap: function () { },
        jumpDetail: function () {
            swan.navigateTo({
                url: '/pages/detail/detail',
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