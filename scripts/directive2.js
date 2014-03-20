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
			var circlesContainer = svg.append('g').attr('transform', 'translate(-15, 0)');

			d3.selectAll('.legend').classed('ng-hide', false);

			d3.xml('map.svg', 'image/svg+xml', function (xml) {
				angular.element(svg[0][0]).prepend(xml.getElementById('Map'));
				map = svg.select('#Map');
				var scale = Math.min(svg.attr('width') / 639.0, svg.attr('height') / 544.0);
				map.attr('transform', 'scale(' + scale + ') translate(-15, 0)');
			});

			function keyFunction(element) {
				return element.x + ',' + element.y;
			}

			var arcScale = d3.scale.linear()
				.domain([0,1])
				.range([0, Math.PI * 2]);

			var boysArc = d3.svg.arc()
				.innerRadius(0)
				.outerRadius(8)
				.startAngle(0)
				.endAngle(function(d) { return arcScale(d.ratio); });

			var girlsArc = d3.svg.arc()
				.innerRadius(0)
				.outerRadius(8)
				.startAngle(function(d) { return arcScale(d.ratio);})
				.endAngle(Math.PI * 2);

			var addArcs = function() {
				this.append('path')
					.attr('transform', 'translate(-13.5, -25) scale(0.05)')
					.attr('class', 'checkin')
					.attr('d', 'M 405,339.5 269,512 133,339.5 C 108.66667,314.16667 92.083333,284.41667 83.25,250.25 74.416667,216.08333 74.416667,181.91667 83.25,147.75 92.083333,113.58333 108.66667,83.666667 133,58 151.66667,39 172.91667,24.583333 196.75,14.75 220.58333,4.9166667 244.66667,0 269,0 293.33333,0 317.41667,4.9166667 341.25,14.75 365.08333,24.583333 386.33333,39 405,58 c 24.33333,25.666667 40.91667,55.58333 49.75,89.75 8.83333,34.16667 8.83333,68.33333 0,102.5 -8.83333,34.16667 -25.41667,63.91667 -49.75,89.25 z');

				this.append('path')
					.attr('transform', 'translate(0, -15)')
					.attr('class', 'boys')
					.attr('d', boysArc)
					.each(function(d) {
						this._lastRatio = d.ratio;
					});

				this.append('path')
					.attr('transform', 'translate(0, -15)')
					.attr('class', 'girls')
					.attr('d', girlsArc)
					.each(function(d) {
						this._lastRatio = d.ratio;
					});
			};

			function tweenArc(arcFn) {
				return function (d) {
					var interpolate = d3.interpolate(this._lastRatio, d.ratio);
					this._lastRatio = d.ratio;
					d = angular.copy(d);
					return function(t) {
						d.ratio = interpolate(t);
						return arcFn(d);
					};
				};
			}

			scope.$watch('data', function (newData) {
				if (newData) {
					newData = newData.slice(0);
					var arcs = circlesContainer.selectAll('g').data(newData, keyFunction);

					var transition = arcs.order().transition(1000)
						.attr({
							transform: function(d) {return 'translate(' + d.x + ',' + d.y + ') scale(' + d.size + ')'; }
						});
					transition.select('path.boys').attrTween('d', tweenArc(boysArc));
					transition.select('path.girls').attrTween('d', tweenArc(girlsArc));

					arcs.enter()
						.append('g')
						.attr({
							transform: function(d) {return 'translate(' + d.x + ',' + d.y + ') scale(' + d.size + ')'; }
						})
						.call(addArcs);

					arcs.exit()
						.remove();
				}
			}, true);
		}
	};
});