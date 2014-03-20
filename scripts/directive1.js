/* D3.js+Angular.JS Demo. Copyright (c) 2014 Uri Shaked, MIT Licence. */

'use strict';

angular.module('D3Demo').directive('liveMap', function () {
	return {
		scope: {
			data: '=checkinData'
		},
		link: function (scope, element) {
			var svg = d3.select(element[0]).append('svg').attr({
				width: 600,
				height: 600
			});
			var map = null;
			var circlesContainer = svg.append('g');

			d3.xml('map.svg', 'image/svg+xml', function (xml) {
				angular.element(svg[0][0]).prepend(xml.getElementById('Map'));
				map = svg.select('#Map');
				var scale = Math.min(svg.attr('width') / 639.0, svg.attr('height') / 544.0);
				map.attr('transform', 'scale(' + scale + ')');
			});

			function keyFunction(element) {
				return element.x + ',' + element.y;
			}

			scope.$watch('data', function (newData) {
				if (newData) {
					var circles = circlesContainer.selectAll('circle').data(newData.slice(0), keyFunction);

					circles
						.transition(1000)
						.attr({
							cx: function (data) {
								return data.x;
							},
							cy: function (data) {
								return data.y;
							},
							r: function (data) {
								return data.size * 8;
							}
						});

					circles.enter()
						.append('circle')
						.attr({
							cx: function (data) {
								return data.x;
							},
							cy: function (data) {
								return data.y;
							},
							r: function (data) {
								return data.size * 8;
							}
						})
						.style({
							fill: 'red'
						});

					circles.exit()
						.remove();
				}
			}, true);
		}
	};
});