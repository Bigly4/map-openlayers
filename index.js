import 'ol/ol.css';
import {Map, View} from 'ol';
import Feature from 'ol/Feature';
//Popup
import Overlay from 'ol/Overlay';

import {toStringHDMS} from 'ol/coordinate';

import {fromLonLat, toLonLat} from 'ol/proj';
// Orka Map
//import {transform} from 'ol/proj';
import XYZ from 'ol/source/OSM';

// Icon
import Point from 'ol/geom/Point';
import {Icon, Style} from 'ol/style';
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer';
// GeoJSON
import GeoJSON from 'ol/format/GeoJSON';

import VectorSource from 'ol/source/Vector';

//var pos = transform([12.07409, 54.06996], 'EPSG:4326', 'EPSG:3857');

var iconStyle = new Style({
    image: new Icon({
        anchor: [0.5, 0.8],
        src: 'data/icon2.png',
        scale: 0.2
    })
});

var vectorLayer = new VectorLayer({
    source: new VectorSource({
        format: new GeoJSON(),
        url: './data/company.json'
    }),
    style: iconStyle
});
var Maplayer = new TileLayer({
    source: new XYZ({
        attributions: ["Kartenbild © Hanse- und Universitätsstadt Rostock (CC BY 4.0) | Kartendaten © OpenStreetMap (ODbL) und LkKfS-MV."],
        projection: 'EPSG:3857',
        url: 'https://www.orka-mv.de/geodienste/orkamv/tiles/1.0.0/'
            + 'orkamv/GLOBAL_WEBMERCATOR/{z}/{x}/{y}.png'
    }),
    crossOrigin: ''
});
var map = new Map({
    layers: [Maplayer, vectorLayer],
    target: 'map',
    view: new View({
        center: [
            1348516.0,
            7185872.0
        ],
        zoom: 11
    })
});

var container = document.getElementById('popup');
var content = document.getElementById('popup-content');
var closer = document.getElementById('popup-closer');

var popup = new Overlay({
    element: container,
    autoPan: true,
    autoPanAnimation: {
        duration: 250
    }
});

/**
 * Add a click handler to hide the popup.
 * @return {boolean} Don't follow the href.
 */

closer.onclick = function() {
    popup.setPosition(undefined);
    closer.blur();
    return false;
};
map.addOverlay(popup);
// display popup on click
map.on('singleclick', function(evt) {
    var feature = map.forEachFeatureAtPixel(evt.pixel,
        function(feature) {
            return feature;
        });
    if (feature) {
        var coordinates = feature.getGeometry().getCoordinates();
        text = feature.get("title");
        content.innerHTML = '<p>Name: </p><code>' + text +
        '</code>';
        popup.setPosition(coordinates);
    }
});
//