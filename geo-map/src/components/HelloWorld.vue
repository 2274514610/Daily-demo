<template>
    <div class="hello">
        <div id="map_box" ref="rootMap"></div>
    </div>
</template>

<script>
    import 'ol/ol.css'
    import {Map, View} from 'ol'
    import TileLayer from 'ol/layer/Tile'
    import OSM from 'ol/source/OSM'
    import TileWMS from 'ol/source/TileWMS'

    export default {
        name: 'HelloWorld',
        data() {
            return {
                map: null
            }
        },
        mounted() {
            let mapContainer = this.$refs.rootMap;
            this.map = new Map({
                target: 'map_box',
                layers: [
                    new TileLayer({
                        source: new OSM()
                    })
                ],
                view: new View({
                    projection: 'EPSG:4326',
                    center: [114.064839, 22.548857],
                    zoom: 4
                })
            });
            let china_map = new TileLayer({
                source: new TileWMS({   //声明一个数据源,OpenLayers使用TileWMS接口来加载WMS服务
                    url: '/api/geoserver/test_map/wms',//地图服务地址:'http://localhost:8080/geoserver/gwc/service/wms'
                    params: {
                        LAYERS: 'test_map:china_test',//图层名称如：'tasmania'
                        'TILED': true,   //是否要将数据制作成切片，省略后返回的是一张完整图。
                        VERSION: '1.1.0' //版本如：'1.1.1'
                    },
                    serverType: 'geoserver',
                    projection: 'EPSG:4326',
                })
            });
            this.map.addLayer(china_map)
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    #map_box {
        width: 100vw;
        height: 100vh;
        position: fixed;
    }
</style>
