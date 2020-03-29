Component({
    properties: {
        title: { // 属性名
            type: String, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
            value: 'modal', // 属性初始值（必填）
            observer: function(newVal, oldVal) {
                // 属性被改变时执行的函数（可选）
            }
        },
        show: { //是否显示
            type: Boolean,
            value: false,
            observer: function(newVal, oldVal){
                if(newVal){
                    this.setData({
                        modalShow: true
                    })
                    // setTimeout(()=>{
                        
                    // }, 50);
                    
                }
            }
        },
        autoHeight: { // 是否高度自适应
            type: Boolean,
            value: false,
        }
    },

    data: {
        modalShow: false
    }, // 私有数据，可用于模版渲染

    // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
    attached: function () {},

    detached: function () {},

    methods: {
        onTap: function () {
            this.setData({
                // 更新属性和数据的方法与更新页面数据的方法类似
            });
        },
        //点击返回按钮
        back: function(){
            this.setData({
                modalShow:false
            })
            setTimeout(()=>{
                this.triggerEvent('back');
            },350)
            
        },
        touchStart(e) {

        },
        touchMove(e) {

        }
    }
});