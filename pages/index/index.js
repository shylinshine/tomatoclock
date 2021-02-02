// index.js
// 获取应用实例
const app = getApp()

Page({
  data: {
    time:'5',
    mtime:'300000',
    timeStr:'',
    clockHeight:0,
    rate:'',
    clockShow:false,
   cateArr:[
     {
       icon:'work',
       text:'工作'
     },
     {
       icon:'study',
       text:'学习'
     },
     {
      icon:'think',
      text:'思考'
    },
    {
      icon:'write',
      text:'写作'
    },
    {
      icon:'sport',
      text:'运动'
    },
    {
      icon:'read',
      text:'阅读'
    }
   ],
   cateActive:'0',
   okShow:false,
   pauseShow:true,
   continueCancelShow:false,
   timer:null
  },
  // 事件处理函数
  bindViewTap() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad() {
    // 设备信息
    var res=wx.getSystemInfoSync()
    //不同设备，单位换算
    var rate=750/res.windowWidth
    // console.log(rate)
    this.setData({
      rate:rate,
      clockHeight:rate*res.windowHeight
    })
    // console.log(res)
  },
  getUserInfo(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  slideChange:function(e){
    this.setData({
      time:e.detail.value
    })
    // console.log(e)

  },
  clickCate:function(e){
    console.log(e)
    this.setData({
      cateActive:e.currentTarget.dataset.index
    })
  },
  start:function()
  {
    this.setData({
      clockShow:true,
      mtime:this.data.time*60*1000,
      timeStr:parseInt(this.data.time)>=10? this.data.time+':00':'0'+this.data.time+':00'
    })
    this.drawBg();
    this.drawActive();
  },
  // 画圆
  drawBg:function(){
    var lineWidth=6 /this.data.rate;//转换单位
    var ctx=wx.createCanvasContext('progress_bg');
    ctx.setLineWidth(lineWidth);
    ctx.setStrokeStyle('#ffffff');
    ctx.setLineCap('round');
    ctx.beginPath();
    ctx.arc(400/this.data.rate/2,400/this.data.rate/2,400/this.data.rate/2-lineWidth,0,2*(Math.PI),true);
    
    ctx.stroke();
    ctx.draw();
   

  },
  //画白圆
  drawActive:function(){
    //定时器
    var _this=this;
    var timer=setInterval(function(){
      var angle=1.5+2*(_this.data.time*60*1000 - _this.data.mtime)/(_this.data.time*60*1000);
      var currentTime=_this.data.mtime-100
      _this.setData({
        mtime:currentTime
      })
      if(angle<3.5){
        if(currentTime%1000==0){
          var timeStr1=currentTime/1000;//s
          var timeStr2=parseInt(timeStr1 /60);//m
          var timeStr3=(timeStr1-timeStr2*60)>=10?(timeStr1 -timeStr2*60):'0'+(timeStr1-timeStr2*60);
          var timeStr2=timeStr2>=10?timeStr2:'0'+timeStr2;
          _this.setData({
            timeStr:timeStr2+':'+timeStr3
          })
        }
      var lineWidth=6 /_this.data.rate;//转换单位
      var ctx=wx.createCanvasContext('progress_active');
      ctx.setLineWidth(lineWidth);
      ctx.setStrokeStyle('#000000');
      ctx.setLineCap('round');
      ctx.beginPath();
      ctx.arc(400/_this.data.rate/2,400/_this.data.rate/2,400/_this.data.rate/2-lineWidth,1.5*Math.PI,angle*(Math.PI),true);
      ctx.stroke();
      ctx.draw();
      }else{
        clearInterval(timer)

      }
    
    },100);
    _this.setData({
      timer:timer
    })
    
   

  },
  pause:function(){
    clearInterval(this.data.timer)
    this.setData({
      pauseShow:false,
      continueCancelShow:true,
      okShow:false
    })
   
    
  },
  continue:function(){
    this.drawActive();

    this.setData({
      pauseShow:true,
      continueCancelShow:false,
      okShow:false
    })

  }
})
