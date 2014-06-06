define(['d3', 'drtv-d3', 'underscore', 'jquery'], function(d3, drtvD3, _, $) {

	drtvD3.directive('d3Bar', d3BarFactory);

	function d3BarFactory() {
		return {
			restrict: 'E',
			scope: {
				data: "=",
				label: "@",
				quantity: "@",
				direction: "@"
			},
			link: function(scope, ele, attrs, ctrl) {
				var chart
				,	margin = { top: 20, right: 30, bottom: 30, left: 40 }
				,	w = (+(attrs.width || ele.width() || 500) - margin.left - margin.right)
				,	h = (+(attrs.height || ele.height() || 500) - margin.top - margin.bottom)
				
				,	xScale = d3.scale.ordinal().rangeRoundBands([0, w], 0.1) //0.5 is padding
				//,	yScale = d3.scale.linear().range([10, h])
				,	yScale = d3.scale.linear().range([h, 0])
				,	labels
				;


				chart = d3.select(ele[0]).append('svg')
					.attr({
						'width': w + margin.left + margin.right,
						'height': h + margin.top + margin.bottom
					})
					.append('g')
					.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

				function gTransform() {
						var trans = 'translate({x}, {y})';
						trans = trans.replace('{x}', margin.left);
						trans = trans.replace('{y}', margin.top);
						return trans;
				}

				scope.$watch('data', function() {
					if (!angular.isDefined(scope.data))
						return false;

					var data = scope.data
					,	maxRange = _.max(data, function(it) {return it[scope.quantity];})[scope.quantity]
					,	minRange = _.min(data, function(it) {return it[scope.quantity];})[scope.quantity];

					labels = _.map(scope.data, function(it) {return it[scope.label]});
					xScale.domain(labels);
					yScale.domain([minRange - (maxRange - minRange) * 0.10, maxRange + (maxRange - minRange) * 0.10]);



					var gs = 
						chart.selectAll('g').remove()
							.data(data)
							.enter().append('g')
							.attr('transform', gTransform2)
					;
					gs.append('rect')
						.attr({
							'fill': 'teal',
							'width': xScale.rangeBand(),
							'y': function(d) { return yScale(d[scope.quantity]); },
							'height': function(d) { 
								return h - yScale(d[scope.quantity]); 
							}
						});
					
					gs.append('text')
						.attr({							
							'text-anchor': 'middle',
							'fill': 'black',
							'font-size': '11px',
							"x": function(d, i) { return xScale.rangeBand() / 2; },
							"dy": "-0.5em",
							"y": function(d, i) { return yScale(d[scope.quantity]) + 3; }
						})
						.text(function(d) { return d[scope.label]; });
					/*gs.append('text')
						.attr({
							'text-anchor': 'middle',
							'fill': 'red',
							'font-size': '11px',
							"x": function(d, i) { return xScale.rangeBand() / 2; },
							"y": function(d, i) { return (yScale(d[scope.quantity]) - yScale.range()[0]) / 2; }	
						})
						.text(function(d, i) { return d[scope.quantity]; });*/
					
					
					function gTransform2(d, i) {
						var trans = 'translate({x}, 0)';
						trans = trans.replace('{x}', xScale(d[scope.label]));
						return trans;
					}


				});
			}
		}
	}
	return drtvD3;
});