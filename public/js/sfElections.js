var checked;

var ballotSelector = d3.selectAll('#ballot-dropdown li a')
                        .on('click', function(){
                            var ob = d3.select(this);
                            var val = ob.attr('value');
                            var letter = val.toLowerCase();
                            var alp = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l'];

                            var moneyOb = ballots[alp.indexOf(letter)]

                            d3.select('#ballot-name').html('Measure '+ val)
                            d3.select('#ballot-title').html(moneyOb.title);

                            //support or oppose to load correct cf data

                            //load votes and load campaign finance data

                            var money ={support:[], oppose:[]}
                            

                            var ballotURL = "/data/m_"+ letter+ "_votes.json";


                            console.log("/data/m_"+ letter+ "_votes.json");


                            d3.select('#supp-opp-radio').style('opacity', 1)
                            d3.select('#oppRadio').attr('checked', true);



                            queue()
                                .defer(d3.json, ballotURL)
                                //.defer(d3.json, money)
                                .await(votesAndMoney);  




                        });


var votesTooltip = d3.select('#map1')
              .append('div')
              .attr('id', 'votes-tooltip')


var width = 960,
    height = 600;

var rateById = d3.map();

var quantize = d3.scale.quantize()
    .domain([0, 1])
    .range(d3.range(9).map(function(i) { return "q" + i + "-9"; }));

var projection = d3.geo.mercator()
    .center([-122.433701, 37.767683])
    .scale(250000)
    .translate([width / 2, height / 2]);

var path = d3.geo.path()
    .projection(projection);

var svg = d3.select("#map1").append("svg")
    .attr("width", width)
    .attr("height", height);


var sfMapData;
var sfNeighData;
var ballotVotesData;

var precincts;

var neighIdx =[];
var allNeigh =[];


queue()
    
    .defer(d3.json, "/data/precincts.json")
    .defer(d3.json, "/data/prect2neigh.json")
    //.defer(d3.json, "/data/m_f_votes.json")
    .await(ready);

function ready(error, sf, neigh) {
  if (error) throw error;


  sfMapData = sf;
  sfNeighData = neigh;


  neigh.forEach(function(d, i){
  		var id = d.VotingPrecinctID;

  		neighIdx.push((id).toString());

  	if(allNeigh.indexOf(d.Neighborhood) == -1){
  		allNeigh.push(d.Neighborhood)
  		}
  })

    

var clr = d3.scale.category20c()
			.domain(allNeigh)    

precincts= svg.append("g")
    .attr("class", "precincts Reds")
    .selectAll("path")
    .data(topojson.feature(sf, sf.objects.precincts).features)
    .enter().append("path")
    	
      //.attr("class", function(d) { return quantize(rateById.get(d.id)); })

    .attr("d", path)
    .attr('class', 'precinct')
    .attr("id", function(d) {

    	if(d.properties.PREC_2012){
    		//console.log(d.properties.PREC_2012)
    		return "pc_"+ d.properties.PREC_2012}
    	});


    //select by neighborhood
    neigh.forEach(function(d, i){
    		var id = d.VotingPrecinctID;
    		var nh = d.Neighborhood;
    		var fillClr = clr(nh)
        //select d3 precincts by id and do something thing

    })
      
}//ready


function votesAndMoney(error, votes){
  if (error) throw error;

  //console.log(votes)
  
  ballotVotesData = votes;

  var votesIdx =[];

  votes.forEach(function(d,  i){

      var id = d.PrecinctID;
      //console.log(d)
      votesIdx.push((id).toString());
  })

 
function changeValue(checked){
      votes.forEach(function(d, i){

        var id = d.PrecinctID;
        var pct = d[checked]/d['Ballots Cast'];
        var qt = quantize(pct)

        
        d3.select('#pc_'+id)
        //.attr('class', 'Reds')
        .attr('class',  qt)
        //.style('fill', fillClr)
        .on('mouseover', function(d){

          //console.log(d.properties.PREC_2012)
          //console.log(votesIdx.length)

          var prId = (d.properties.PREC_2012).toString()

          var idx = votesIdx.indexOf(prId);
          var neIdx = neighIdx.indexOf(prId);

          //console.log(idx)
          var voteOb = votes[idx];
          var neighOb = sfNeighData[neIdx]
          //console.log(idx)
          var neighborhood = neighOb['Neighborhood'];
          //var pct = voteOb['No']/voteOb['Ballots Cast'];

          var html = (pct*100).toFixed(2) + '% in '+ neighborhood 
          //console.log(pct*100 + '% oppose in '+ neighborhood)

          votesTooltip
          .html(html)
          .transition()
          .duration(500)
          .style('left', function(){
            
            return d3.event.pageX + 'px'
          })
          .style('top', function(){
           
            return d3.event.pageY - 300 + 'px'
          })
          .style('opacity', 1)
          

        })
        .on('mouseout', function(){
          votesTooltip
          .transition()
          .duration(500)
          .style('opacity', 0)

        })



      })

}
      
       d3.select('#supp-opp-radio').on('change', function(){
                              

           checked = $('input:radio[name=inlineRadioOptions]:checked').val()

           if(checked=='support'){

              d3.selectAll('.precincts')
              .classed('Reds', false)
              .classed('Blues', true)

              changeValue('Yes');

           }
           else{
              d3.selectAll('.precincts')
              .classed('Reds', true)
              .classed('Blues', false)

              changeValue('No')
           }

                              
         })

    //Default
    changeValue('No')

}



