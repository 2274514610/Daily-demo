<template>
  <div class="map_wrap" style="position: relative">
    <div style="position: absolute;top: 0;right: 0;z-index:998;padding: 20px">
      <a-select style="width:200px;background:rgba(255,255,255,0.5)" placeholder="请选择路线" @change="handleChange">
        <a-select-option value="G2">京沪高速</a-select-option>
        <a-select-option value="G4">京港澳高速</a-select-option>
        <a-select-option value="G10">绥满高速</a-select-option>
        <a-select-option value="G12">珲春高速</a-select-option>
        <a-select-option value="G18">荣乌高速</a-select-option>
        <a-select-option value="G36">宁洛高速</a-select-option>
      </a-select>
    </div>
    <div style="position: absolute;top: 38px;right: 0;z-index:998;padding: 20px">
      <a-button type="primary" v-if="this.selectValue!=''" @click="display_pile">显示里程桩</a-button>
    </div>

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
                markerstart: '',  //存储起点
                markerend: '',   //存储终点
                selectValue: '',
                transit: '',  //路径规划实例
                PointData: '',  //海量点坐标
                pointCollection_Hm: '',  //存储百米桩坐标点
                pointCollection_Km: '',  //存储千米桩坐标点
                mapStyle: [
                    {
                        "featureType": "entertainmentlabel",
                        "elementType": "labels",
                        "stylers": {
                            "visibility": "off"
                        }
                    }, {
                        "featureType": "medicallabel",
                        "elementType": "labels",
                        "stylers": {
                            "visibility": "off"
                        }
                    }, {
                        "featureType": "scenicspotslabel",
                        "elementType": "labels",
                        "stylers": {
                            "visibility": "off"
                        }
                    }, {
                        "featureType": "scenicspotslabel",
                        "elementType": "labels.icon",
                        "stylers": {
                            "visibility": "off"
                        }
                    }, {
                        "featureType": "medicallabel",
                        "elementType": "labels.icon",
                        "stylers": {
                            "visibility": "off"
                        }
                    }, {
                        "featureType": "entertainmentlabel",
                        "elementType": "labels.icon",
                        "stylers": {
                            "visibility": "off"
                        }
                    }, {
                        "featureType": "restaurantlabel",
                        "elementType": "labels.icon",
                        "stylers": {
                            "visibility": "off"
                        }
                    }, {
                        "featureType": "restaurantlabel",
                        "elementType": "labels",
                        "stylers": {
                            "visibility": "off"
                        }
                    }, {
                        "featureType": "hotellabel",
                        "elementType": "labels.icon",
                        "stylers": {
                            "visibility": "off"
                        }
                    }, {
                        "featureType": "hotellabel",
                        "elementType": "labels",
                        "stylers": {
                            "visibility": "off"
                        }
                    }, {
                        "featureType": "shoppinglabel",
                        "elementType": "labels.icon",
                        "stylers": {
                            "visibility": "off"
                        }
                    }, {
                        "featureType": "shoppinglabel",
                        "elementType": "labels",
                        "stylers": {
                            "visibility": "off"
                        }
                    }, {
                        "featureType": "educationlabel",
                        "elementType": "labels",
                        "stylers": {
                            "visibility": "off"
                        }
                    }, {
                        "featureType": "educationlabel",
                        "elementType": "labels.icon",
                        "stylers": {
                            "visibility": "off"
                        }
                    }, {
                        "featureType": "highway",
                        "elementType": "geometry",
                        "stylers": {
                            "weight": 1
                        }
                    }, {
                        "featureType": "city",
                        "elementType": "labels.text.stroke",
                        "stylers": {
                            "weight": 1.4
                        }
                    }, {
                        "featureType": "country",
                        "elementType": "labels.text.stroke",
                        "stylers": {
                            "weight": 5
                        }
                    }
                ],   //地图样式
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
                this.selectValue = value
                if (value == 'G36') {
                    //宁洛高速
                    this.formatting('118.878311,32.111152', '112.366288,34.594791');
                } else if (value == 'G10') {
                    //绥满高速
                    this.formatting('131.047871,44.385387', '120.247364,49.187572');
                } else if (value == 'G2') {
                    // console.log('京沪高速')
                    this.formatting('116.580498,39.753363', '121.086648,31.325675');
                } else if (value == 'G12') {
                    //珲春高速
                    this.formatting('130.356949,42.819331', '122.172855,46.075304');
                } else if (value == 'G4') {
                    // console.log('京港澳高速')
                    this.formatting('116.178598,39.787347', '114.048096,30.687724');
                } else {
                    //荣乌高速
                    this.formatting('116.89778,39.174702', '106.856162,39.3239');
                }
            },
            initBMap() {
                let map = new BMap.Map("myBMap", {enableMapClick: false});   //设置地图的目标dom   并设置底图不可点击
                map.centerAndZoom(new BMap.Point(116.404, 39.915), 12);  //设置中心点,并设置缩放比例
                map.enableScrollWheelZoom();  //启用滚轮放大缩小
                map.setMapStyle({styleJson: this.mapStyle});  //添加地图样式
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
                //删除起终点的原始图标,并在起点设置新的图标,目的去除起终点的默认点击事件
                let onMarkersSet = (pois) => {
                    // console.log('起终点坐标', pois)
                    this.map.removeOverlay(this.markerstart);
                    this.map.removeOverlay(this.markerend);
                    //设置自己的图标
                    let myIconA = new BMap.Icon('https://webmap0.bdimg.com/wolfman/static/common/images/markers_new2_7621a9c.png',
                        new BMap.Size(26,42), {imageOffset: new BMap.Size(-199, -136),anchor:new BMap.Size(10,36)});
                    let markerstart = new BMap.Marker(pois[0].marker.getPosition(), {icon: myIconA}); // 创建新起点
                    this.markerstart = markerstart;
                    this.map.removeOverlay(pois[0].marker); //删除原来的起点
                    this.map.addOverlay(this.markerstart);
                    let myIconB = new BMap.Icon('https://webmap0.bdimg.com/wolfman/static/common/images/markers_new2_7621a9c.png',
                        new BMap.Size(26,42), {imageOffset: new BMap.Size(-225, -136),anchor:new BMap.Size(14,40)});
                    let markerend = new BMap.Marker(pois[1].marker.getPosition(),{icon: myIconB}); // 创建新终点
                    this.markerend = markerend;
                    this.map.removeOverlay(pois[1].marker);//删除原来的终点
                    this.map.addOverlay(this.markerend);
                };
                //驾车实例
                let transit = new BMap.DrivingRoute(this.map, {
                    renderOptions: {map: this.map},   //搜索结果呈现的配置
                    onSearchComplete: searchComplete,   //检索完成后的回调函数
                    onPolylinesSet: polylinesSet,    //折线添加完成后的回调函数
                    onMarkersSet: onMarkersSet,    //标注添加完成后的回调函数
                });
                //清除上一次的驾车导航实例
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
                    //设置搜索完成后的回调函数
                    transit.setSearchCompleteCallback(() => {
                        let Distance = transit.getResults().getPlan(0).getDistance(true);  //获取距离
                        console.log('两个坐标点之间的距离', Distance);
                        // let Plan = transit.getResults().getPlan(1);
                        // console.log('方案',Plan)
                        let pts = transit.getResults().getPlan(0).getRoute(0).getPath();    //通过驾车实例，获得一系列点的数组
                        this.PointData = pts;
                        let paths = pts.length;    //获得有几个点
                        // console.log('路线上的数组', pts);
                        // console.log('一共有多少点', paths);
                    });
                } else {
                    transit.search(startArr, endArr)
                }
            },
            //显示海量点坐标
            display_pile() {
                // console.log('海量点', this.PointData);
                let points_Hm = [];  // 百米桩
                let points_km = [];  //千米桩
                let options_Hm = {
                    // size: BMAP_POINT_SIZE_SMALL,
                    size: BMAP_POINT_SIZE_BIG,
                    shape: BMAP_POINT_SHAPE_CIRCLE,
                    color: '#d340c3'
                };
                let options_Km = {
                    // size: BMAP_POINT_SIZE_SMALL,
                    size: BMAP_POINT_SIZE_BIGGER,
                    shape: BMAP_POINT_SHAPE_CIRCLE,
                    color: '#f00'
                };
                let lcNum = 0;//里程桩数量
                let tempDistance = 0; //当前的距离
                this.PointData.forEach((item, index) => {
                    if (index < this.PointData.length - 1) {
                        let ax = this.PointData[index].lng;   //当前点的经度
                        let ay = this.PointData[index].lat;   //当前点的纬度
                        let nextIndex = Number(index + 1);    //相邻下一个点的索引
                        let bx = this.PointData[nextIndex].lng;  //相邻下一个点的经度
                        let by = this.PointData[nextIndex].lat;  //相邻下一个点的纬度
                        let pointA = new BMap.Point(ax, ay);   // 格式化当前点坐标点
                        let pointB = new BMap.Point(bx, by);   // 格式化下一个点的坐标点
                        // let d = (this.GetDistance(ax, ay, bx, by)).toFixed(2);
                        let d = (this.map.getDistance(pointA, pointB)).toFixed(2);   //求出两个坐标点之间的距离
                        let bax = bx - ax;  //两个坐标的经度偏移量
                        let bay = by - ay;  //两个坐标的纬度偏移量
                        let bcJl = 100 - tempDistance;   //产生一个百米桩需要下一段距离补充的距离
                        if (d >= bcJl) {
                            //画里程桩
                            let dx1 = bcJl * (bax) / d;   //下一个点的偏移量经度
                            let dy1 = bcJl * (bay) / d;   //下一个点的偏移量纬度
                            let xc1 = Number(Number(dx1) + Number(ax));  //求出里程桩的经度   //并以这个里程桩点的经纬度坐标点为新的起点
                            let yc1 = Number(Number(dy1) + Number(ay));  //求出里程桩的纬度
                            let first_point = new BMap.Point(xc1, yc1);
                            if (lcNum % 10 == 0 && lcNum != 0) {
                                points_km.push(first_point);
                                lcNum++;
                            } else {
                                points_Hm.push(first_point);
                                lcNum++;
                            }
                            let syJl = d - bcJl;   //这一段距离补给上个里程桩后，还剩下的距离
                            let bax1 = bx - xc1;   //求新起点与下一点之间的坐标经度偏移量
                            let bay1 = by - yc1;   //求新起点与下一点之间的坐标纬度偏移量

                            let n = Math.floor(syJl / 100);  //剩余的距离中还包含几个里程桩 向下取整

                            let dx = 100 * (bax1) / syJl;   //求下一个里程桩的坐标经度偏移量
                            let dy = 100 * (bay1) / syJl;   //求下一个里程桩的坐标纬度偏移量
                            let xc = Number(Number(dx) + Number(xc1));   //下一个里程桩的经度坐标
                            let yc = Number(Number(dy) + Number(yc1));   //下一个里程桩的纬度坐标
                            for (let i = 1; i <= n; i++) {
                                xc = Number(i * dx) + Number(xc1);
                                yc = Number(i * dy) + Number(yc1);
                                let new_point = new BMap.Point(xc, yc);
                                if (lcNum % 10 == 0 && lcNum != 0) {
                                    points_km.push(new_point)
                                    lcNum++;
                                } else {
                                    points_Hm.push(new_point);
                                    lcNum++;
                                }
                            }
                            tempDistance = (d - bcJl) % 100;
                        } else {
                            //画不了点，继续走下一个点
                            tempDistance = Number(Number(d) + Number(tempDistance));
                        }

                    }
                });
                //百米桩集合坐标点
                let pointCollection_Hm = new BMap.PointCollection(points_Hm, options_Hm);  // 百米桩
                //给每一个百米桩添加点击事件,并自定义信息窗口
                pointCollection_Hm.addEventListener('click', (e) => {
                    let num = '';
                    for (let i = 0; i < points_Hm.length; i++) {
                        if (points_Hm[i].lng == e.point.lng && points_Hm[i].lat == e.point.lat) {
                            let Dec = i % 9;  //取余
                            let Par = parseInt(i / 9);  //取整
                            if (i == 0) {
                                num = 'K' + Par;
                            } else if (Dec == 0) {
                                num = 'K' + (Par - 1) + ' ' + '+' + 900;
                            } else {
                                num = 'K' + Par + ' ' + '+' + Dec * 100;
                            }
                            break;
                        }
                    }
                    let ops = {
                        width: 200,  //信息窗口宽度
                        height: 50,
                        title: '百米桩',  //信息窗口标题
                        enableMessage: false,//设置允许信息窗发送短息
                    };
                    let point = new BMap.Point(e.point.lng, e.point.lat);
                    let infowindow = new BMap.InfoWindow("编号:" + ' ' + num, ops);
                    this.map.openInfoWindow(infowindow, point);
                });
                if (this.pointCollection_Hm) {
                    this.pointCollection_Hm.clear()
                }
                this.pointCollection_Hm = pointCollection_Hm;
                this.map.addOverlay(pointCollection_Hm);  // 添加Overlay
                //千米桩集合坐标点
                let pointCollection_Km = new BMap.PointCollection(points_km, options_Km);  // 千米桩
                //给每一个千米桩添加点击事件,并自定义信息窗口
                pointCollection_Km.addEventListener('click', (e) => {
                    let num1 = '';
                    for (let i = 0; i < points_km.length; i++) {
                        if (points_km[i].lng == e.point.lng && points_km[i].lat == e.point.lat) {
                            num1 = 'K' + (i + 1);
                            break;
                        }
                    }
                    let ops1 = {
                        width: 200,  //信息窗口宽度
                        height: 50,
                        title: '千米桩',  //信息窗口标题
                        enableMessage: false,//设置允许信息窗发送短息
                    };
                    let point1 = new BMap.Point(e.point.lng, e.point.lat);
                    let infowindow1 = new BMap.InfoWindow("编号:" + ' ' + num1, ops1);
                    this.map.openInfoWindow(infowindow1, point1);
                });
                if (this.pointCollection_Km) {
                    this.pointCollection_Km.clear()
                }
                this.pointCollection_Km = pointCollection_Km;
                this.map.addOverlay(pointCollection_Km);  // 添加Overlay
                console.log(lcNum + '个里程桩')
            },
            //得到搜索结果
            getSearchData() {
                let start_data = this.inputData.inputStart;
                let end_data = this.inputData.inputEnd;
                if (start_data.indexOf(',') >= 0 && end_data.indexOf(',') >= 0) {
                    let arr1 = this.inputData.inputStart.split(',');
                    let arr2 = this.inputData.inputEnd.split(',');
                    this.searchData.startArr = arr1;
                    this.searchData.endArr = arr2;
                    this.search_router();
                } else {
                    this.searchData.startArr = start_data;
                    this.searchData.endArr = end_data;
                    this.search_router()
                }
            },
            // Rad(d) {
            //     return d * Math.PI / 180.0; //经纬度转换成三角函数中度分表形式。
            // },
            //自己写的 计算距离，参数分别为第一点的纬度，经度；第二点的纬度，经度
            // GetDistance(lat1, lng1, lat2, lng2) {
            //     var radLat1 = this.Rad(lat1);
            //     var radLat2 = this.Rad(lat2);
            //     var a = radLat1 - radLat2;
            //     var b = this.Rad(lng1) - this.Rad(lng2);
            //     var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
            //     s = s * 6378.137; // 地球半径，千米;
            //     s = Math.round(s * 10000) / 10000; //输出为公里
            //     s = Math.round(s * 1000) / 1; //单位修改为米,取整
            //     //s=s.toFixed(4);
            //     return s;
            // },
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

  .BMap_noprint {
    background-position: -62px -36px;
  }

  .BMap_cpyCtrl {
    display: none;
  }

  .anchorBL {
    display: none;
  }

</style>
