
export default{
    // 格式评论时间
    dateFormat:  time=>{
        if(typeof time != "string"){
            return time;
        }
        time = time.replace(/-/g,"/");
        let nowTime = new Date();
        let formatTime = new Date(time.replace(/-/g,"/"));
        var diffTime = (nowTime - formatTime) / 1000;
        console.log(diffTime);
        if(diffTime >= 0 && diffTime < 60){
            return "刚刚";
        }else if(diffTime >= 60 && diffTime < 60 * 60){
            return `${Math.floor(diffTime / 60)}分钟前`;
        }else if(diffTime >= 60 * 60 && diffTime < 60 * 60 * 24){
            return `${Math.floor(diffTime / 60 / 60)}小时前`;
        }else if(diffTime >= 60 * 60 * 24 && diffTime < 60 * 60 * 24 *4 ){
            return `${Math.floor(diffTime / 60 / 60 /24)}天前`;
        }else{
            return time.substr(2,8);
        }
    },
    // 格式化点赞数量
    likeFormat: count=>{
        count = Number(count);
        if(!count){
            return "";
        }
        if(count >= 1000 && count < 10000){
            return `${Number(String(count / 1000).replace(/^(\-)*(\d+)\.(\d).*$/, '$1$2.$3'))}K`;
        }else if(count >= 10000 && count < 1000000){
            return `${Number(String(count / 1000).replace(/^(\-)*(\d+)\.(\d).*$/, '$1$2.$3'))}万`;
        }else if(count > 1000000){
            return `${Math.floor(count / 1000000)}百万`;
        }
        return count;
    },
    stringFormat: obj=>{
        for(let i in obj){
            if(typeof obj[i] !="string"){
                obj[i] = String(obj[i]);
            }
        }
        return obj;
    },
    // 返回省略文字
    ellipsis: data=>{
        if(data.item.length > data.limit && !data.ellipsis){
            console.log(data.item.substr(0,data.limit) + "...");
            return data.item.substr(0,data.limit) + "..."
        }
        return data.item;
    }
}