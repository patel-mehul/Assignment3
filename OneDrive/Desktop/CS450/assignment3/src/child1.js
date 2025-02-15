import React, { Component } from "react";
import * as d3 from "d3";

class Child1 extends Component {
  constructor(props) {
    super(props);
    this.chartRef = React.createRef();
  }

  componentDidMount() {
    this.renderScatterPlot();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.data1 !== this.props.data1) {
      this.renderScatterPlot();
    }
  }

  renderScatterPlot() {
    const data = this.props.data1;
    if (!data || data.length === 0) return;

    const margin = { top: 20, right: 30, bottom: 50, left: 50 };
    const width = 500 - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;

    d3.select(this.chartRef.current).selectAll("*").remove();

    const svg = d3
      .select(this.chartRef.current)
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // X Scale
    const xScale = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.total_bill)])
      .range([0, width]);

    // Y Scale
    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.tip)])
      .range([height, 0]);

    // X Axis
    svg
      .append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(xScale));

    // X Axis Label
    svg
      .append("text")
      .attr("x", width / 2)
      .attr("y", height + margin.bottom - 10)
      .attr("text-anchor", "middle")
      .text("Total Bill");

    // Y Axis
    svg.append("g").call(d3.axisLeft(yScale));

    // Y Axis Label
    svg
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -height / 2)
      .attr("y", -margin.left + 10)
      .attr("text-anchor", "middle")
      .text("Tips");

    // Title
    svg
      .append("text")
      .attr("x", width / 2)
      .attr("y", -5)
      .attr("text-anchor", "middle")
      .style("font-size", "16px")
      .text("Total Bill vs Tips");

    svg
      .selectAll("circle")
      .data(data)
      .join("circle")
      .attr("cx", (d) => xScale(d.total_bill))
      .attr("cy", (d) => yScale(d.tip))
      .attr("r", 4)
      .attr("fill", "#69b3a2")
      .attr("opacity", 0.7);
  }

  render() {
    return <div ref={this.chartRef}></div>;
  }
}

export default Child1;
