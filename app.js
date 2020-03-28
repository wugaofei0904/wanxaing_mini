/**
 * @file app.js
 * @author swan
 */

/* globals swan */
import { LRUMap } from './utils/lru'

App({
    cache: new LRUMap(30),
    onLaunch(options) {
        // do something when launch
        // 引导添加，参见文档： http://smartprogram.baidu.com/docs/design/component/guide_add/
        if (swan.canIUse('showFavoriteGuide')) {
            swan.showFavoriteGuide({
                type: 'bar',
                content: '一键关注小程序',
                success(res) {
                    console.log('关注成功：', res);
                },
                fail(err) {
                    console.log('关注失败：', err);
                }
            });
        }
    },
    onShow(options) {
        // do something when show

        this.getNetworkType();


    },
    onHide() {
        // do something when hide
    },
    getNetworkType() {
        swan.getNetworkType({
            success: res => {
                console.log(res.networkType)
                if (res.networkType == 'none') {
                    swan.showToast({
                        title: '网络不给力，请稍后再试',
                        icon: 'none'
                    });
                }
            },
            fail: err => {
                // swan.showToast({
                //     title: '获取网络状态失败'
                // });
                // swan.showToast({
                //     title: res.networkType,
                //     icon: 'none'
                // });
            },
            complete: res => {
                // swan.showToast({
                //     title: res.networkType,
                //     icon: 'none'
                // });
            }
        });
    }
});
