/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image
} from 'react-native';

//引入计数器类库
var  TimeMixin = require('react-timer-mixin');

var  ImageData = require('./ImageData.json');

var Dimensions = require('Dimensions');
var {width} = Dimensions.get('window');
var ScrollerDemo = React.createClass({

        //注册计数器
        mixins:[TimeMixin],
    //设置固定值
    getDefaultProps(){
       return{

           //每个多少时间
           duration:1000,

       }
    },
    //设置初始值
    getInitialState(){
      return{
          //当天的一个页面
          currentPage:0


      }
    },
        render(){
            return(
                <View style={styles.scrollerStyle}>
                  <ScrollView
                      ref='scrollView'
                      horizontal={true}
                      showHorizontalScrollIndicator={false}
                      pagingEnabled={true}
                      //当一帧滚动结束
                      onMomentumScrollEnd={(e)=>this.onAnimationEnd(e)}
                      onScrollBeginDrag = {this.onScrollBeginDrag}
                      // 停止拖拽
                      onScrollEndDrag={this.onScrollEndDrag}
                      >
                      {this.rederAllImage()}

                  </ScrollView>
                    {/*返回指示器*/}
                    <View style={styles.pageViewStyle}>
                        {/*返回5个圆点*/}
                        {this.renderpageCircle()}
                    </View>
                </View>
            );
        },
    //开始拖拽
    onScrollBeginDrag(){
    //停止定时器
        this.clearInterval(this.timer);

    },
// 调用停止拖拽
    onScrollEndDrag(){
        // 开启定时器
        this.startTimer();
    },
    //返回对应的远点
    renderpageCircle(){
        var  allpage = [];
        var style1;
        var imagNum = ImageData.data;

        for(var i = 0;i < imagNum.length; i++){
            style1 = (i==this.state.currentPage)?{color:'orange'} :{color:'#ffffff'};
        allpage.push(
         //判断

            <Text key={i} style={[{fontSize:25},style1]}>&bull;</Text>
        );
        }
        return allpage;
    },

    //返回所以的图片
    rederAllImage(){

        var  allImage =[];
        var imageArr = ImageData.data;
        for(var i = 0;i < imageArr.length;i++){
            var imgItems = imageArr[i];
          allImage.push(
             <Image key={i} source = {{uri:imgItems.img}} style={{width:width, height:120}} />
          );
        }

        return  allImage;
    },

//当一帧滚动结束的时候
    onAnimationEnd(e){
        //1.求出水平方向的编译量
        var  offSetX = e.nativeEvent.contentOffset.x;
        //2。求出当前的页数
        var  currentPage = Math.floor(offSetX/width);
        //console.log(currentPage);
        //3.更新状态机，重新绘制UI
        this.setState({
            currentPage:currentPage
        });
    },
    //实现一些复杂的操作
    componentDidMount(){

        //开启定时器
        this.startTimer();

    },

    //开始定时器
    startTimer(){
        //1.拿到scrollerView
        var scrollView = this.refs.scrollView;
      var ImageCount = ImageData.data.length;
        //2.添加定时器
      this.timer =  this.setInterval(function () {

            //2.1设置原点
            var activePaqe = 0;
            if((this.state.currentPage+1) >=ImageCount){//越界
                activePaqe = 0;

            }else {

                activePaqe = this.state.currentPage + 1;
            }

           //2.3更新状态机
            this.setState({
                currentPage:activePaqe,
            });

            //2.4让scrollerView滚动起来
            var  offsetX = activePaqe * width;
            scrollView.scrollResponderScrollTo({x:offsetX, y:0, animated:true});

        },this.props.duration);

    }
    });

//class ScrollerDemo extends Component {
//  render() {
//    return (
//      <View style={styles.container}>
//        <ScrollView
//            horizontal={true}
//            pagingEnabled={true}
//
//            >
//          {this.renderChildView()}
//        </ScrollView>
//      </View>
//    );
//  }
//
//  renderChildView(){
//   var  allChild =[];
//    var colors =['red','green','blue','yellow','black'];
//    for(var i = 0;i < 5; i++){
//      allChild.push(
//          <View key={i} style={{backgroundColor:colors[i],width:350,height:200}}><Text>{i}</Text>
//          </View>
//      );
//    }
//    return allChild;
//  }
//}

const styles = StyleSheet.create({
scrollerStyle:{

    marginTop:20,

},
    pageViewStyle:{
        width:width,
        height:25,
        backgroundColor:'rgba(241,241,0.8,0.8)',

        //定位
        position:'absolute',
        bottom:0,
        flexDirection:'row',
        alignItems:'center'
    }
});

AppRegistry.registerComponent('ScrollerDemo', () => ScrollerDemo);
