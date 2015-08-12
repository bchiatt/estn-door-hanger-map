/* globals Parse, google */

(function(){
  'use strict';

  angular.module('app')
    .controller('mapController', mapController);

  function mapController(){
    var vm = this;
    vm.clearPoly = clearPoly;
    vm.initPoly = initPoly;
    vm.paths = [];
    vm.poly = null;
    vm.polylines = [];
    vm.savePoly = savePoly;

    var mapOptions = {
          center: {lat: 36.2, lng: -86.7},
          zoom: 11
        },
        map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

    function addLatLng(event){
      if(!vm.poly){ return; }
      var path = vm.poly.getPath();
      path.push(event.latLng);
    }

    function clearAllPolyLines(){
      angular.forEach(vm.polylines, function(poly){
        poly.setMap(null);
      });
      vm.polylines = [];
    }

    function clearPoly(){
      vm.poly.setMap(null);
      vm.poly = null;
      drawPolylines(map);
    }

    function drawPolylines(thisMap){
      angular.forEach(vm.paths, function(path){
        var line = new google.maps.Polyline({
          path: path,
          strokeColor: '#FF0000',
          strokeOpacity: 1.0,
          strokeWeight: 2
        });
        line.setMap(thisMap);
        vm.polylines.push(line);
      });
    }

    function initPoly(){
      clearAllPolyLines();
      var polyOptions = {
        strokeColor: '#000000',
        strokeOpacity: 1.0,
        strokeWeight: 3,
        editable: true
      };
      vm.poly = new google.maps.Polyline(polyOptions);
      google.maps.event.addListener(map, 'click', addLatLng);
      vm.poly.setMap(map);
    }

    function savePoly(){
      var Report = Parse.Object.extend('Report'),
          report = new Report(),
          points = vm.poly.getPath().j;
      console.log(points);
      report.save({points: points, data: true}).then(function(object){
        vm.paths.push(points);
        vm.poly.setMap(null);
        vm.poly = null;
        drawPolylines(map);
      });
    }
  }
}());
