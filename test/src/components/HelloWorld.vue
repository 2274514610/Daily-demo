<template>
  <div class="map_wrap" style="position: relative">
    <div style="position: absolute;top: 0;right: 0;z-index:998;padding: 20px">
      <a-select style="width:200px;background:rgba(255,255,255,0.5)" placeholder="请选择路线" @change="handleChange">
        <a-select-option value="G1">京哈高速</a-select-option>
        <a-select-option value="G2">京沪高速</a-select-option>
        <a-select-option value="G3">京台高速</a-select-option>
        <a-select-option value="G4">京港澳高速</a-select-option>
        <a-select-option value="G5">京昆高速</a-select-option>
        <a-select-option value="G6">京藏高速</a-select-option>
        <a-select-option value="G7">京新高速</a-select-option>
        <a-select-option value="G75">兰海高速</a-select-option>
        <a-select-option value="G10">绥满高速</a-select-option>
        <a-select-option value="G12">珲春高速</a-select-option>
        <a-select-option value="G16">丹锡高速</a-select-option>
        <a-select-option value="G18">荣乌高速</a-select-option>
        <a-select-option value="G36">宁洛高速</a-select-option>
      </a-select>
    </div>
    <div style="position: absolute;top: 38px;right: 0;z-index:998;padding: 20px">
      <a-button type="primary" @click="display_pile">显示里程桩</a-button>
    </div>

    <!--    <div style="text-align: center;padding-bottom: 20px">-->
    <!--      <input type="text" placeholder="起点" v-model="inputData.inputStart">-->
    <!--      <span style="margin: 0 10px 0 10px">-</span>-->
    <!--      <input type="text" placeholder="终点" v-model="inputData.inputEnd" style="margin-right: 10px">-->
    <!--      <button @click="getSearchData">开始检索</button>-->
    <!--    </div>-->
    <div id="myBMap"></div>
  </div>
</template>

<script>
    import BMap from 'BMap'

    export default {
        name: 'HelloWorld',
        data() {
            return {
                searchData: {  //搜索数据
                    startArr: '',
                    endArr: '',
                },
                inputData: {  //输入框中的数据
                    inputStart: '',
                    inputEnd: '',
                },
                points: [],   //点坐标
                map: '',   //地图实例
                transit: '',  //路径规划实例
                PointData: '',  //海量点坐标
                pointCollection_Hm: '',  //存储百米桩坐标点
                pointCollection_Km: '',  //存储千米桩坐标点
                markerstart: '',  //存储起点
                markerend: '',   //存储终点
            }
        },
        components: {},
        methods: {
            formatting(value1, value2) {   //坐标赋值函数并执行搜索操作
                this.inputData.inputStart = value1;
                this.inputData.inputEnd = value2;
                this.getSearchData();
            },
            handleChange(value) {
                if (value == 'G1') {
                    // console.log('京哈高速')
                    this.formatting('116.554678,39.874977', '126.62679,45.643178');
                } else if (value == 'G2') {
                    // console.log('京沪高速')
                    this.formatting('116.602247,39.74025', '121.086648,31.325675');
                } else if (value == 'G3') {
                    // console.log('京台高速')
                    this.formatting('116.455164,39.722139', '119.635848,25.707961');
                } else if (value == 'G4') {
                    // console.log('京港澳高速')
                    this.formatting('116.178598,39.787347', '114.048096,30.687724');
                } else if (value == 'G5') {
                    // console.log('京昆高速')
                    this.formatting('115.90267,39.631174', '102.376205,25.50851');
                } else if (value == 'G6') {
                    // console.log('京藏高速')
                    this.formatting('116.226513,40.222865', '90.717376,29.914123');
                } else if (value == 'G7') {
                    // console.log('京新高速')
                    this.formatting('115.961958,40.509827', '88.666598,43.074229');
                } else if (value == 'G75') {
                    //兰海高速
                    this.formatting('103.776133,35.997652', '109.902505,21.567699');
                } else if (value == 'G10') {
                    //绥满高速
                    this.formatting('131.047871,44.385387', '120.247364,49.187572');
                } else if (value == 'G12') {
                    //珲春高速
                    this.formatting('130.356949,42.819331', '122.172855,46.075304');
                } else if (value == 'G16') {
                    //丹锡高速
                    this.formatting('123.539996,39.978548', '116.148809,43.905088');
                } else if (value == 'G18') {
                    //荣乌高速
                    this.formatting('116.89778,39.174702', '106.856162,39.3239');
                } else if (value == 'G20') {
                    //宁洛高速
                    this.formatting('118.878311,32.111152', '112.366288,34.594791');
                }
            },
            initBMap() {
                let map = new BMap.Map("myBMap", {enableMapClick: false});
                map.centerAndZoom(new BMap.Point(116.404, 39.915), 12);
                map.enableScrollWheelZoom();  //启用滚轮放大缩小
                this.map = map;
            },
            search_router() {
                let output = "";
                //搜索完成执行的函数
                let searchComplete = function (results) {
                    if (transit.getStatus() != BMAP_STATUS_SUCCESS) {
                        return;
                    }
                    let plan = results.getPlan(0);    //获得第一个导航策略
                    // console.log(results);
                    // output = plan.getDuration(true);  //获取时间
                    output = plan.getDistance(true);     //获取距离
                };
                let polylinesSet = function () {
                    setTimeout(function () {
                        // console.log('我是距离',output);
                    }, 1000);
                };
                let onMarkersSet = (pois) => {
                    console.log(111111111111111111111, pois);
                    this.map.removeOverlay(this.markerstart);
                    this.map.removeOverlay(this.markerend);
                    let myIconB = new BMap.Icon('https://webmap0.bdimg.com/wolfman/static/common/images/markers_new2_7621a9c.png',
                        new BMap.Size(50,50));
                    let markerstart = new BMap.Marker(pois[0].marker.getPosition(),{icon:myIconB}); // 创建新起点
                    this.markerstart = markerstart;
                    this.map.removeOverlay(pois[0].marker); //删除原来的起点
                    this.map.addOverlay(this.markerstart);
                    let markerend = new BMap.Marker(pois[1].marker.getPosition()); // 创建新终点
                    this.markerend = markerend;
                    this.map.removeOverlay(pois[1].marker);//删除原来的终点
                    this.map.addOverlay(this.markerend);
                };
                //驾车实例
                let transit = new BMap.DrivingRoute(this.map, {
                    renderOptions: {map: this.map,},   //搜索结果呈现的配置
                    onSearchComplete: searchComplete,   //检索完成后的回调函数
                    onPolylinesSet: polylinesSet,    //折线添加完成后的回调函数
                    onMarkersSet: onMarkersSet,   //标注添加完成后的回调函数
                });

                if (this.transit) {
                    this.transit.clearResults()
                }
                this.transit = transit;
                let startArr = this.searchData.startArr;
                let endArr = this.searchData.endArr;
                if (Array.isArray(this.searchData.startArr) && Array.isArray(this.searchData.endArr)) {
                    let start = new BMap.Point(parseFloat(startArr[0]), parseFloat(startArr[1]));
                    let end = new BMap.Point(parseFloat(endArr[0]), parseFloat(endArr[1]));
                    // console.log('start',start);
                    // console.log('end',end);
                    transit.search(start, end);
                    transit.setSearchCompleteCallback(() => {
                        let Distance = transit.getResults().getPlan(0).getDistance(true);  //获取距离
                        console.log('两个坐标点之间的距离', Distance);
                        // let Plan = transit.getResults().getPlan(1);
                        // console.log('方案',Plan)
                        let pts = transit.getResults().getPlan(0).getRoute(0).getPath();    //通过驾车实例，获得一系列点的数组
                        this.PointData = pts;
                        let paths = pts.length;    //获得有几个点
                        console.log('路线上的数组', pts);
                        console.log('一共有多少点', paths)
                        if (this.pointCollection_Hm) {
                            this.pointCollection_Hm.clear()
                        }
                        if (this.pointCollection_Km) {
                            this.pointCollection_Km.clear()
                        }
                        // let points_Hm = [];  // 百米桩
                        // let points_km = [];  //千米桩
                        // pts.forEach((item,index)=> {
                        //     if(index%10 == 0) {
                        //         // points_km.push(new BMap.Point(this.data[index][0], this.data[index][1]))
                        //         points_km.push(new BMap.Point(pts[index].lng, pts[index].lat))
                        //     }else {
                        //         points_Hm.push(new BMap.Point(pts[index].lng, pts[index].lat))
                        //     }
                        // });
                        // console.log('百米桩',points_Hm);
                        // console.log('千米桩',points_km);
                        // let options_Hm = {
                        //     // size: BMAP_POINT_SIZE_SMALL,
                        //     size: BMAP_POINT_SIZE_BIG,
                        //     shape: BMAP_POINT_SHAPE_STAR,
                        //     color: '#d340c3'
                        // };
                        // let options_Km = {
                        //     // size: BMAP_POINT_SIZE_SMALL,
                        //     size: BMAP_POINT_SIZE_BIGGER,
                        //     shape: BMAP_POINT_SHAPE_STAR,
                        //     color: '#f00'
                        // };
                        // let pointCollection_Hm = new BMap.PointCollection(points_Hm, options_Hm);  // 百米桩
                        // if (this.pointCollection_Hm) {
                        //     this.pointCollection_Hm.clear()
                        // }
                        // this.pointCollection_Hm = pointCollection_Hm;
                        // this.map.addOverlay(pointCollection_Hm);  // 添加Overlay
                        // let pointCollection_Km = new BMap.PointCollection(points_km, options_Km);  // 千米桩
                        // if (this.pointCollection_Km) {
                        //     this.pointCollection_Km.clear()
                        // }
                        // this.pointCollection_Km = pointCollection_Km;
                        // this.map.addOverlay(pointCollection_Km);  // 添加Overlay
                    });
                } else {
                    transit.search(startArr, endArr)
                }

            },
            display_pile() {
                // console.log('海量点', this.PointData);
                let points_Hm = [];  // 百米桩
                let points_km = [];  //千米桩
                this.PointData.forEach((item, index) => {
                    if (index % 10 == 0) {
                        // points_km.push(new BMap.Point(this.data[index][0], this.data[index][1]))
                        points_km.push(new BMap.Point(this.PointData[index].lng, this.PointData[index].lat))
                    } else {
                        points_Hm.push(new BMap.Point(this.PointData[index].lng, this.PointData[index].lat))
                    }
                });
                console.log('百米桩', points_Hm);
                console.log('千米桩', points_km);
                let options_Hm = {
                    // size: BMAP_POINT_SIZE_SMALL,
                    size: BMAP_POINT_SIZE_BIG,
                    shape: BMAP_POINT_SHAPE_STAR,
                    color: '#d340c3'
                };
                let options_Km = {
                    // size: BMAP_POINT_SIZE_SMALL,
                    size: BMAP_POINT_SIZE_BIGGER,
                    shape: BMAP_POINT_SHAPE_STAR,
                    color: '#f00'
                };
                let pointCollection_Hm = new BMap.PointCollection(points_Hm, options_Hm);  // 百米桩
                pointCollection_Hm.addEventListener('click', (e) => {
                    console.log(11111111111111111, e);
                    e.number = '我是11111111111111';
                    alert('百米桩')
                });
                if (this.pointCollection_Hm) {
                    this.pointCollection_Hm.clear()
                }
                this.pointCollection_Hm = pointCollection_Hm;
                this.map.addOverlay(pointCollection_Hm);  // 添加Overlay
                let pointCollection_Km = new BMap.PointCollection(points_km, options_Km);  // 千米桩
                pointCollection_Km.addEventListener('click', () => {
                    alert('千米桩')
                });
                if (this.pointCollection_Km) {
                    this.pointCollection_Km.clear()
                }
                this.pointCollection_Km = pointCollection_Km;
                this.map.addOverlay(pointCollection_Km);  // 添加Overlay

                // let _this = this;
                // //编写自定义函数,创建标注
                // function addMarker(point) {
                //     let marker = new BMap.Marker(point);
                //     _this.map.addOverlay(marker);  // 添加Overlay
                // }
                // //添加道路轨迹点中模拟的千米桩
                // points_km.forEach(item=> addMarker(item))
            },
            getSearchData() {
                let start_data = this.inputData.inputStart;
                let end_data = this.inputData.inputEnd;
                if (start_data.indexOf(',') >= 0 && end_data.indexOf(',') >= 0) {
                    let arr1 = this.inputData.inputStart.split(',');
                    let arr2 = this.inputData.inputEnd.split(',');
                    this.searchData.startArr = arr1;
                    this.searchData.endArr = arr2;
                    this.search_router();
                    // this.mass_point();
                } else {
                    this.searchData.startArr = start_data;
                    this.searchData.endArr = end_data;
                    this.search_router()
                }

            },
            mass_point() {
                if (document.createElement('canvas').getContext) {  // 判断当前浏览器是否支持绘制海量点
                    console.log('11111111111', this.PointData)
                    // let points = [];     //所有的桩
                    let points_Hm = [];  // 百米桩
                    let points_km = [];  //千米桩
                    // for (let i = 0; i < this.data.length; i++) {
                    //     points.push(new BMap.Point(this.data[i][0], this.data[i][1]));
                    // }
                    this.data.forEach((item, index) => {
                        if ((index + 1) % 10 == 0) {
                            points_km.push(new BMap.Point(this.data[index][0], this.data[index][1]))
                        } else {
                            points_Hm.push(new BMap.Point(this.data[index][0], this.data[index][1]))
                        }
                    });
                    console.log('百米桩', points_Hm);
                    console.log('千米桩', points_km)
                    let options_Hm = {
                        // size: BMAP_POINT_SIZE_SMALL,
                        size: BMAP_POINT_SIZE_BIG,
                        shape: BMAP_POINT_SHAPE_STAR,
                        color: '#d340c3'
                    };
                    let options_Km = {
                        // size: BMAP_POINT_SIZE_SMALL,
                        size: BMAP_POINT_SIZE_BIGGER,
                        shape: BMAP_POINT_SHAPE_STAR,
                        color: '#f00'
                    };

                    let pointCollection_Hm = new BMap.PointCollection(points_Hm, options_Hm);  // 百米桩
                    this.map.addOverlay(pointCollection_Hm);  // 添加Overlay
                    let pointCollection_Km = new BMap.PointCollection(points_km, options_Km);  // 千米桩
                    this.map.addOverlay(pointCollection_Km);  // 添加Overlay
                } else {
                    alert('请在chrome、safari、IE8+以上浏览器查看本示例')
                }
            },
        },
        mounted() {
            this.initBMap()
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .map_wrap {
    width: 100%;
    height: 100vh;
    position: fixed;
    overflow: hidden;
  }

  #myBMap {
    width: 100%;
    height: 100%;
  }

  .BMap_cpyCtrl {
    display: none;
  }

  .anchorBL {
    display: none;
  }

</style>
