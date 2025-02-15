import React, { Component } from "react";
import * as d3 from "d3";

class Child2 extends Component {
  constructor(props) {
    super(props);
    this.chartRef = React.createRef();
  }

  componentDidMount() {
    this.renderBarChart();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.data2 !== this.props.data2) {
      this.renderBarChart();
    }
  }

  renderBarChart() {
    const data = this.props.data2;
    if (!data || data.length === 0) return;

    const avgTipByDay = d3.rollups(
      data,
      (v) => d3.mean(v, (d) => d.tip),
      (d) => d.day
    );

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
      .scaleBand()
      .domain(avgTipByDay.map((d) => d[0]))
      .range([0, width])
      .padding(0.3);

    // Y Scale
    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(avgTipByDay, (d) => d[1])])
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
      .text("Day");

    // Y Axis
    svg.append("g").call(d3.axisLeft(yScale));

    // Y Axis Label
    svg
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -height / 2)
      .attr("y", -margin.left + 10)
      .attr("text-anchor", "middle")
      .text("Average Tip");

    // Title
    svg
      .append("text")
      .attr("x", width / 2)
      .attr("y", -5)
      .attr("text-anchor", "middle")
      .style("font-size", "16px")
      .text("Average Tip by Day");

    // Draw Bars
    svg
      .selectAll("rect")
      .data(avgTipByDay)
      .join("rect")
      .attr("x", (d) => xScale(d[0]))
      .attr("y", (d) => yScale(d[1]))
      .attr("width", xScale.bandwidth())
      .attr("height", (d) => height - yScale(d[1]))
      .attr("fill", "#69b3a2")
      .attr("opacity", 0.7);
  }

  render() {
    return <div ref={this.chartRef}></div>;
  }
}

export default Child2;
