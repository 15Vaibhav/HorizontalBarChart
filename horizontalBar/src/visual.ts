module powerbi.extensibility.visual {
    interface DataPoint {
        categories: string,
        nsrValue: number,
        bpValue: number,
        mtd: number,
        mtdChange: number,
        ytd: number,
        ytdChange: number

    };
    interface ViewModel {
        dataPoints: DataPoint[],
        maxValue_y: number
    };

    export class Visual implements IVisual {
        private settings: VisualSettings;
        private visualSettings: VisualSettings;
        private viewModel: ViewModel;
        private svg: d3.Selection<SVGElement>;
        private xAxisGroup: d3.Selection<SVGElement>;
        private yAxisGroup: d3.Selection<SVGElement>;
        private BarGroup: d3.Selection<SVGElement>;
        private LineGroup: d3.Selection<SVGElement>;


        private setting = {
            axis: {
                x: { padding: 40 },
                y: { padding: 10 }
            }
        };


        constructor(options: VisualConstructorOptions) {
            options.element.style.overflowY = 'auto';
            options.element.style.overflowX = 'none';


            this.svg = d3.select(options.element)
                .append('svg')
                .classed('svgClass', true);
            this.xAxisGroup = this.svg.append('g')
                .classed('x-axis', true)
            this.yAxisGroup = this.svg.append('g')
                .classed('y-axis', true)
            this.BarGroup = this.svg.append('g')
                .classed('barGroup', true)
            this.LineGroup = this.svg.append('g')
                .classed('barGroup', true)
        }

        public update(options: VisualUpdateOptions) {
            this.viewModel = this.getViewModel(options);
            let width: number = options.viewport.width;
            let height: number =options.viewport.height;
           
            let single_heading = ((height+20)/3);
            console.log('height...',height+20)
            console.log('single_height...',single_heading)
            let multiply=0;
            if(this.viewModel.dataPoints.length>3){
            multiply = (Math.abs(this.viewModel.dataPoints.length-3)*72)
            }
            height =((height-20)+multiply)
            this.svg.attr({ width: width, height:(height)})
            // this.svg.attr('overflow',"scroll !important")
            this.settings = Visual.parseSettings(options && options.dataViews && options.dataViews[0]);
            console.log(this.settings.Arc.first_bar)

            this.svg.selectAll('path').remove()
            this.svg.selectAll('barGroup').remove()
            this.svg.selectAll('.bpline').remove()
            this.svg.selectAll('.bar').remove()
            this.svg.selectAll('.horizontalline').remove()
            this.svg.selectAll('.firstLine').remove()
            this.svg.selectAll('.allVerticalLine').remove()
            this.svg.selectAll('.text1').remove()
            this.svg.selectAll('.text2').remove()
            



            let xScale = d3.scale.linear()
                .range([this.setting.axis.x.padding, width - this.setting.axis.x.padding])
                .domain([0, 2 * this.viewModel.maxValue_y]);


        


            let yScale = d3.scale.ordinal()
                .domain(this.viewModel.dataPoints.map(d => d.categories))
                .rangeRoundBands([2*this.setting.axis.y.padding, height+20], .8);

            let yAxis = d3.svg.axis()
                .scale(yScale)
                .tickSize(.4)
                .orient("left")
            this.yAxisGroup
                .call(yAxis)
                .attr({ transform: 'translate(' + (this.setting.axis.x.padding) + ',0)' })
                .style('font-size','12px')

// BP line *******************************************************************************
              for(let i=0;i<this.viewModel.dataPoints.length;i++){
                this.svg.
                    append('line')
                    .style("stroke", "black")
                    .classed('bpline',true)
                    .attr("x1",xScale(this.viewModel.dataPoints[i].bpValue-(.3*this.viewModel.dataPoints[i].bpValue))+this.setting.axis.x.padding)
                    .attr("y1",  yScale(this.viewModel.dataPoints[i].categories)-.75*yScale.rangeBand())
                    .attr("x2",xScale(this.viewModel.dataPoints[i].bpValue-(.3*this.viewModel.dataPoints[i].bpValue))+this.setting.axis.x.padding)
                    .attr("y2", yScale(this.viewModel.dataPoints[i].categories)+1.5*yScale.rangeBand())
                }
                

            let bars = this.BarGroup.
                selectAll(".bar")
                .data(this.viewModel.dataPoints)
                .enter()
         let green = this.settings.Arc.first_bar
        let red = this.settings.Arc.seconed_bar

            bars.append("rect")
                .attr("class", "bar")
                .attr("y", function (d) {
                    return yScale(d.categories);
                })
                .attr("height", yScale.rangeBand())
                .attr("x", this.setting.axis.x.padding)
                .attr("width", function (d) {
                    return xScale(d.nsrValue-(.3*d.nsrValue));
                })
                .style('fill', function(d){
                    if(d.nsrValue>=d.bpValue){
                        return green

                    }
                    return red
                })


// horizontal line*****************************************************************
            for(let i=0;i<this.viewModel.dataPoints.length-1;i++){
                this.svg.
                append('line')
                .style("stroke", "#DCDCDC")
                .classed('horizontalline',true)
                // .style("stroke-width", 2)
                .style("stroke-dasharray", ("3, 3")) 
                .attr("x1",0)
                .attr("y1",  yScale(this.viewModel.dataPoints[i].categories)+ yScale.rangeBand()+2*yScale.rangeBand())
                .attr("x2", width)
                .attr("y2",  yScale(this.viewModel.dataPoints[i].categories)+ yScale.rangeBand()+2*yScale.rangeBand())
                }
        

            // for(let i=0;i<this.viewModel.dataPoints.length-1;i++){
            //         this.svg.
            //         append('line')
            //         .style("stroke", "#DCDCDC")
            //         // .style("stroke-width", 2)
            //         .style("stroke-dasharray", ("3, 3")) 
            //         .attr("x1",0)
            //         .attr("y1",  yScale(this.viewModel.dataPoints[i].categories)+ yScale.rangeBand()+2*yScale.rangeBand())
            //         .attr("x2", width)
            //         .attr("y2",  yScale(this.viewModel.dataPoints[i].categories)+ yScale.rangeBand()+2*yScale.rangeBand())
            //         }

// first vertical line***************************************************************************************************

                    this.svg.
                    append('line')
                    .style("stroke", "#DCDCDC")
                    .classed('firstLine',true)
                    .style("stroke-dasharray", ("3, 3")) 
                    .attr("x1",xScale(this.viewModel.maxValue_y-(.3*this.viewModel.maxValue_y))+1.2*this.setting.axis.x.padding)
                    .attr("y1",  2*this.setting.axis.y.padding)
                    .attr("x2",xScale(this.viewModel.maxValue_y-(.3*this.viewModel.maxValue_y))+1.2*this.setting.axis.x.padding)
                    .attr("y2", height)
                     
                    let margin=0;
                     if(this.viewModel.dataPoints.length!=3){
                         margin=20;
                     }
                    let cell = (width-margin)-(xScale(this.viewModel.maxValue_y-.3*this.viewModel.maxValue_y)+1.2*this.setting.axis.x.padding);
                    cell = cell/4;
                    
                    
// all vertical line except first*********************************************************************************** 


                for(let i=0;i<3;i++){
                        this.svg.
                        append('line')
                        .style("stroke", "#DCDCDC")
                        // .style("stroke-width", 2)
                        .style("stroke-dasharray", ("3, 3")) 
                        .classed('allVerticalLine',true)
                        .attr("x1",xScale(this.viewModel.maxValue_y-(.3*this.viewModel.maxValue_y))+1.2*this.setting.axis.x.padding+(i+1)*cell)
                        .attr("y1",  2*this.setting.axis.y.padding)
                        .attr("x2",xScale(this.viewModel.maxValue_y-(.3*this.viewModel.maxValue_y))+1.2*this.setting.axis.x.padding+(i+1)*cell)
                        .attr("y2", height)
                }

                        
            let textArr =['Month','Change','YTD','Change']

            for(let i=0;i<4;i++){
                this.svg.append("text")
                .attr({
                    y: 18,
                    x:(xScale(this.viewModel.maxValue_y-.3*this.viewModel.maxValue_y)+1.2*this.setting.axis.x.padding+(i+.5)*(cell))
                    })
                .classed('text1', true)
                .text(textArr[i])
                .style('fill', 'black')
                .style('font-size',width*(this.settings.Arc.Heading/10000)+'em')
                .style('text-anchor', 'middle')
                .style('font-family', 'serif') 
                .style('font-weight', 'bolder') 
                .style('border','true')

                
                this.svg.
                append('line')
                .style("stroke", "red")
                .classed('firstLine',true)
                // .style("solid") 
                .attr("x1",xScale(this.viewModel.maxValue_y-.3*this.viewModel.maxValue_y)+1.2*this.setting.axis.x.padding+(i+.2)*(cell))
                .attr("y1",  22)
                .attr("x2",xScale(this.viewModel.maxValue_y-.3*this.viewModel.maxValue_y)+1.2*this.setting.axis.x.padding+(i+.3)*(cell)+20)
                .attr("y2", 22)


            }  
             

            for(let i=0;i<this.viewModel.dataPoints.length;i++){
                let mtd_change = this.viewModel.dataPoints[i].mtdChange>=0?green:red;
                let ytd_change = this.viewModel.dataPoints[i].ytdChange>=0?green:red;
                
                this.svg.append("text")
                .attr({
                    y:yScale(this.viewModel.dataPoints[i].categories)+ yScale.rangeBand(),
                    x:(xScale(this.viewModel.maxValue_y-.3*this.viewModel.maxValue_y)+1.2*this.setting.axis.x.padding+(0+.5)*cell)
                })
                .classed('text2', true)
                .text(this.viewModel.dataPoints[i].mtd)
                .style('fill', 'black')
                .style('font-size',width*(this.settings.Arc.Values/10000)+'em')
                .style('font-family', 'arial') 
                .style('text-anchor', 'middle')


                this.svg.append("text")
                .attr({
                    y: yScale(this.viewModel.dataPoints[i].categories)+ yScale.rangeBand(),
                    x:(xScale(this.viewModel.maxValue_y-.3*this.viewModel.maxValue_y)+1.2*this.setting.axis.x.padding+(1+.5)*cell)
                    })
                .classed('text2', true)
                .text(this.viewModel.dataPoints[i].mtdChange)
                .style('fill', mtd_change)
                .style('font-size',width*(this.settings.Arc.Values/10000)+'em')
                .style('text-anchor', 'middle')
                .style('font-family', 'arial') 

                this.svg.append("text")
                .attr({
                    y:(yScale(this.viewModel.dataPoints[i].categories)+ yScale.rangeBand()),
                    x:(xScale(this.viewModel.maxValue_y-.3*this.viewModel.maxValue_y)+1.2*this.setting.axis.x.padding+(2+.5)*cell)
                    })
                .classed('text2', true)
                .text(this.viewModel.dataPoints[i].ytd)
                .style('fill','black')
                .style('font-size',width*(this.settings.Arc.Values/10000)+'em')
                .style('text-anchor', 'middle')
                .style('font-family', 'arial') 
            

                this.svg.append("text")
                .attr({
                    y:(yScale(this.viewModel.dataPoints[i].categories)+ yScale.rangeBand()),
                    x:(xScale(this.viewModel.maxValue_y-.3*this.viewModel.maxValue_y)+1.2*this.setting.axis.x.padding+(3+.5)*cell)
                    })
                .classed('text2', true)
                .text(this.viewModel.dataPoints[i].ytdChange)
                .style('fill', ytd_change)
                .style('font-size',width*(this.settings.Arc.Values/10000)+'em')
                .style('text-anchor', 'middle')
                .style('font-family', 'arial') 
                
            }

        }

        private static parseSettings(dataView: DataView): VisualSettings {
            console.log('dvvv', VisualSettings.parse(dataView) as VisualSettings)
            return VisualSettings.parse(dataView) as VisualSettings;
        }
        public enumerateObjectInstances(options: EnumerateVisualObjectInstancesOptions): VisualObjectInstanceEnumeration {
            const settings: VisualSettings = this.visualSettings ||
                VisualSettings.getDefault() as VisualSettings;
            return VisualSettings.enumerateObjectInstances(settings, options);
        }

        private getViewModel(options: VisualUpdateOptions): ViewModel {
            let viewModel = {
                dataPoints: [],
                maxValue_y: 0
            }
            let dv = options.dataViews;
            let view = dv[0].categorical;
            let categories = view.categories[0];
            console.log('categories', categories)
            console.log('view values', view.values)
            let nsrValue_1 = view.values[0];
            let bpValue_1 = view.values[1];
            let mtd_1 = view.values[2];
            let mtdChange_1 = view.values[3];
            let ytd_1 = view.values[4];
            let ytdChange_1 = view.values[5];
            let nsrMax = nsrValue_1.maxLocal
            let bpMax = bpValue_1.maxLocal


            console.log('nsrValue', nsrValue_1)
            console.log('BpValue', bpValue_1)
            for (let i = 0; i <categories.values.length; i++) {
                viewModel.dataPoints.push({
                    categories: <string>categories.values[i],
                    nsrValue: <number>nsrValue_1.values[i],
                    bpValue: <number>bpValue_1.values[i],
                    mtd: <number>mtd_1.values[i],
                    mtdChange: <number>mtdChange_1.values[i],
                    ytd: <number>ytd_1.values[i],
                    ytdChange: <number>ytdChange_1.values[i]
                })
            }
            console.log('datapoint', viewModel.dataPoints)
            console.log('nsr Max', nsrMax)
            console.log('bp Max', bpMax)
            viewModel.maxValue_y = <number>(bpMax > nsrMax ? bpMax : nsrMax);
            console.log('max Value ', viewModel.maxValue_y)
            return viewModel
        }
    }
}



