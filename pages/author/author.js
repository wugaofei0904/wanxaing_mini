import {api} from '../../config.js'
Page({
    data: {
        authorId: null,
        pageNum: 1,
        isComplate: false,
        articleList: [],

        animation: null,
        animationData: {},
        animation1: null,
        animationData1: {},

        canvasHeight: 2000
    },
    onLoad: function(option) {
        this.setData({
            authorId: option.authorId
        })
        this.animation = swan.createAnimation({
            duration: 300,
            timingFunction: 'ease-out',
        })
        this.animation1 = swan.createAnimation({
            duration: 600,
            timingFunction: 'ease-out',
        })

        this.getAuthorDetail()
        this.getArticleList()
    },

    getAuthorDetail() {
        swan.request({
            url: api + '/open/author/info?authorId=' + this.data.authorId,
            header: {
                'content-type': 'application/json'
            },
            success: res => {
            if (res.data.data){
              let _data = res.data.data
              if (_data.business){
                _data.business = _data.business.replace(/<br\/>/g,'\r\n')
              }
              this.setData({
                authorDetail: _data
              })
            }
            },
            fail: err => {
                console.log('错误码：' + err.errCode);
                console.log('错误信息：' + err.errMsg);
            }
        });
    },
    
    getArticleList() {
        if (this.data.isComplate) {
            return false
        }
        swan.request({
            url: api + `/article/list-page-m?pageNum=${this.data.pageNum}&pageSize=10&authorId=${this.data.authorId}`,
            header: {
                'content-type': 'application/json'
            },
            success: res => {
            if (res.data.data){
                this.setData({
                    articleList: this.data.articleList.concat(res.data.data)
                })
            }
            if (res.data.data.length >= 10){
                this.setData({
                    pageNum: this.data.pageNum + 1
                })
            } else {
                this.data.isComplate = true
            }
            },
            fail: err => {
                console.log('错误码：' + err.errCode);
                console.log('错误信息：' + err.errMsg);
            }
        });
    },

    onReachBottom() {
        this.getArticleList()
    },

    showDialog() {
        this.animation.bottom(0).step().opacity(1).step()
        this.animation1.bottom(0).step()
        this.setData({
            animationData: this.animation.export(),
            animationData1: this.animation1.export()
        })
    },
    
    closeDialog() {
        // swan.hideLoading()
        this.animation.opacity(0).step().bottom(-1000).step()
        this.animation1.bottom(-1000).step()
        this.setData({
            animationData: this.animation.export(),
            animationData1: this.animation1.export(),
        })
    },
    catchClose() {},

    drawCanvas() {
        swan.showLoading({
          title: '图片绘制中…',
          mask: true,
        })
        let detail = this.data.authorDetail

        let promiseArr = []
        promiseArr.push(this.getImgInfo(detail.headImg))
        // if (detail.qrCode && detail.qrCode != 'null') {
        //   promiseArr.push(this.getImgInfo(detail.qrCode))
        // }

        Promise.all(promiseArr).then( resList => {
          let ctx = swan.createCanvasContext('canvasId', this)
          ctx.setTextBaseline('top')
          // 画背景
          ctx.setFillStyle('#fff')
          ctx.fillRect(0, 0, 670, 2000)

          // 画头像加边框
          ctx.drawImage(resList[0], 40, 40, 590, 590)
          // ctx.setStrokeStyle('#979797')
          // ctx.strokeRect(40, 40, 590, 590)

          // 姓名
          ctx.setFillStyle('#333333')
          ctx.setFontSize(42)//设置字体大小，默认10
          ctx.fillText(detail.name, 40, 669)
          ctx.fillText(detail.name, 41, 669)
          ctx.fillText(detail.name, 40, 670)

          let mark = 720

          // 画简介(return 行数)
          mark += this.drawDetail(ctx, detail.detail) * 45
          mark += 15

          ctx.setFillStyle('#999999')
          ctx.setFontSize(22)
        
          let textArr = []
          // detail.wxId && textArr.push(`公众号ID：${detail.wxId}`)
          detail.business && ( textArr = textArr.concat(detail.business.split('\r\n')) )
          textArr.push('见地  |  特邀作者')

          // if (detail.qrCode && detail.qrCode != 'null'){
          //   if (textArr.length > 4){
          //     this.drawText(ctx, textArr, mark)
          //     this.drawQrCode(ctx, resList[1], mark + (textArr.length * 40 - 160))
          //     mark += textArr.length * 40
          //   } else {
          //     this.drawQrCode(ctx, resList[1], mark)
          //     mark += 160 - textArr.length * 40
          //     ctx.setFillStyle('#999999')
          //     ctx.setFontSize(22) w
          //     this.drawText(ctx, textArr, mark)
              
          //     mark += textArr.length * 40
          //   }
          // } else {
          //   this.drawText(ctx, textArr, mark)
          //   mark += textArr.length * 40
          // }

          this.drawText(ctx, textArr, mark)
          mark += textArr.length * 40

          this.setData({
            canvasHeight: mark + 30
          })

          ctx.draw(true, () => {
            setTimeout(()=>{
              this.creatTempFile()
            }, 1000);
          })
        }).catch( err => {
          swan.hideLoading()
          console.log(err)
        })
      },
    
      drawDetail(ctx, detail){
        ctx.setFillStyle('#666666')//文字颜色：默认黑色
        ctx.setFontSize(28)//设置字体大小，默认10
        let detailArr = detail.split('')
        let detailTemp = ''
        let detailRow = []
        for (let i = 0,length = detailArr.length; i < length; i++) {
          if (ctx.measureText(detailTemp).width < 550) {
            detailTemp += detailArr[i]
          } else {
            i--
            detailRow.push(detailTemp)
            detailTemp = ''
          }
        }
        detailRow.push(detailTemp)
        for (let i = 0; i < detailRow.length; i++) {
          ctx.fillText(detailRow[i], 40, 720 + 36.5 * i + 8.5 * (i+1))
        }
        return detailRow.length
      },
    
      // drawQrCode(ctx, url, mark) {
      //   ctx.drawImage(url, 510 , mark, 120, 120)
      //   ctx.setFillStyle('#999999')
      //   ctx.setFontSize(16)
      //   ctx.fillText('扫一扫进入公众号', 505, mark + 120 + 16)
      // },
    
      drawText(ctx, arr, mark) {
        for (let i = 0; i < arr.length; i++) {
          if (this.measureText(arr[i], 22) < 400){
            ctx.fillText(arr[i], 40, mark + 31 * i + 9 * (i+1))
          } else {
            for (let j = arr[i].length - 1; j >= 0; j--){
              if(this.measureText(arr[i].substr(0, j), 22) < 400){
                ctx.fillText(arr[i].substring(0, j), 40, mark + 31 * i + 9 * (i+1))
                arr.splice(i+1, 0, arr[i].substring(j))
                break;
              }
            }
          }
        }
      },
      measureText (text, fontSize=10) {
        text = String(text);
        var text = text.split('');
        var width = 0;
        text.forEach(function(item) {
            if (/[a-zA-Z]/.test(item)) {
                width += 7;
            } else if (/[0-9]/.test(item)) {
                width += 5.5;
            } else if (/\./.test(item)) {
                width += 2.7;
            } else if (/-/.test(item)) {
                width += 3.25;
            } else if (/[\u4e00-\u9fa5]/.test(item)) {  //中文匹配
                width += 10;
            } else if (/\(|\)/.test(item)) {
                width += 3.73;
            } else if (/\s/.test(item)) {
                width += 2.5;
            } else if (/%/.test(item)) {
                width += 8;
            } else {
                width += 10;
            }
        });
        return width * fontSize / 10;
      },
    
      /**
       * 保存canvas内容为图片
       */
      creatTempFile(){
        swan.canvasToTempFilePath({
          x: 0,
          y: 0,
          width: 670,
          height: this.data.canvasHeight,
          destWidth: 670,
          destHeight: this.data.canvasHeight,
          canvasId: 'canvasId',
          fileType: 'jpg',
          quality: 1,
          success: (res) => {
            this.saveImg(res)
          },
          fail: (err) => {
            console.log(err)
            swan.hideLoading()
            swan.showToast({
              title: '绘制图片失败，请重试',
              icon: 'none'
            })
          }
        }, this)
      },
    
      /**
       * 保存图片
       */
      saveImg(imgUrl) {
        swan.getSetting({
          success: res => {
            if(!res.authSetting['scope.writePhotosAlbum']) {
              swan.authorize({
                scope: 'scope.writePhotosAlbum',
                success: () => {
                  this.saveImg(imgUrl)
                },
                fail: () => {
                  swan.showToast({
                    title: '请授权保存图片权限',
                    icon: 'none'
                  })
                }
              })
            } else {
              swan.saveImageToPhotosAlbum({
                filePath: imgUrl.tempFilePath,
                success: data => {
                  swan.hideLoading()
                  swan.showToast({
                    title: '保存成功',
                    icon: 'none'
                  })
                },
                fail: (error) => {
                  console.log(error)
                  swan.hideLoading()
                  swan.showToast({
                    title: '保存失败，请重试',
                    icon: 'none'
                  })
                }
              })
            }
          }
        })
      },
    
      getImgInfo(url){
        return new Promise((resolve, reject) => {
          swan.getImageInfo({
            src: url,
            success: (res) => {
              resolve(res.path)
            },
            fail: (error) => {
              reject(error)
            }
          })
        })
      },

      copy(e) {
        let text = e.currentTarget.dataset.text
        swan.setClipboardData({
          data: text,
          success (res) {
            swan.showToast({
              title: '复制成功',
              icon: 'none'
            })
          }
        })
      },

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

      onShareAppMessage() {
        return {
          title: `@${this.data.authorDetail.name} 的作者主页`,
          imageUrl: this.data.authorDetail.headImg,
          content: `#见地 | 特邀作者# ${this.data.authorDetail.detail}`
        }
    }
});