import {Component, OnInit} from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-d3-bubble-interaction-chart',
  templateUrl: './d3-bubble-interaction-chart.component.html',
  styleUrls: ['./d3-bubble-interaction-chart.component.scss']
})
export class D3BubbleInteractionChartComponent implements OnInit {

  constructor() {
  }

  ngOnInit() {
    this.createBubbleChart();
  }

  createBubbleChart() {
    let width = 400;
    let height = 325;

    let svg = d3.select('#chart')
      .append('svg')
      .attr('height', height)
      .attr('width', width)
      .attr('transform', 'translate(0,0)')

    let radiusScale = d3.scaleSqrt().domain([64000, 1284332]).range([20, 50]);

    // forceSimulation will apply force to the circles to move them to a certain place
    // and how we want put circles to interact
    // STEP1 - get the circles to the middle
    // STEP2 - do not let them collide
    var simulation = d3.forceSimulation()
      .force('x', d3.forceX(width / 2).strength(0.05))
      .force('y', d3.forceY(height / 2).strength(0.05))
      .force('collide', d3.forceCollide((d) => radiusScale(+d['Customers']) + 1))

    d3.csv("../assets/CRSPartners.csv")
      .then(function (data) {
        console.log(data);
        ready(data);
      })
      .catch((err) => console.log(err));

    function ready(datapoints) {
      // make circles for every datapoint
      let circles = svg.selectAll('g')
        .data(datapoints)
        .enter()
        .append('g')

      circles.append('circle')
        .attr('class', 'node')
        .attr('r', (d) => radiusScale(+d['Customers']))
        .attr('fill', 'rgb(131, 216, 158)')
        .attr('stroke', '#565352')
        .attr('stroke-width', '0.5');

      circles.append('text')
        .text(function (d) {
          return d['Name'].substring(0, radiusScale(+d['Customers']) / 5);
        })
        .attr('font', '3px sans-serif')
        .style("text-anchor", "middle")

      circles.on('click', (d) => console.log(d));

      // pass the datapoints as nodes
      // on every single tick, the modes will be acted by the forces
      simulation.nodes(datapoints)
        .on('tick', ticked)

      // on every tick reposition the circles
      function ticked() {
        svg.selectAll('circle')
          .attr('cx', (d) => d['x'])
          .attr('cy', (d) => d['y'])

        svg.selectAll('text')
          .attr('x', (d) => d['x'])
          .attr('y', (d) => d['y'])
      }
    }
  }

}
