

// create a map in the "map" div, set the view to a given place and zoom
var map = L.map('map').setView([37.8, -122.43], 10);

// add an OpenStreetMap tile layer
L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);



var schAUrl = "http://data.sfgov.org/resource/q66q-d2tr.json?"




var checked;

var ballotSelector = d3.selectAll('#ballot-dropdown li a')
                        .on('click', function(){
                            var ob = d3.select(this);
                            var val = ob.attr('value');
                            var letter = val.toLowerCase();
                            var alp = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l'];
                            var lIdx = alp.indexOf(letter);

                            var moneyOb = ballots[lIdx]

                            //if there are elements then create a query





                            var cmtFor =[];


                            moneyOb.cmt_for.forEach(function(f){
                                if(f.query){
                                  //add to queue
                                  cmtFor.push(schAUrl + f.query);
                                }
                            });

                            var cmtAg = [];

                            moneyOb.cmt_against.forEach(function(a){
                                if(a.query){
                                  //add to queue
                                  cmtAg.push(schAUrl + a.query);
                                }
                            });

                            d3.select('#ballot-name').html('Measure '+ val)
                            d3.select('#ballot-title').html(moneyOb.title);
                            d3.select('#ballot-about').html(moneyOb.about);
                            d3.select('#ballot-pass').html(function(){

                                if(moneyOb.pass){
                                  return "Passed : <span class='text-success glyphicon glyphicon-ok'></span>"
                                }
                                else{
                                  return "Passed : <span class='text-danger glyphicon glyphicon-remove'></span>"
                                }


                            })

                            //support or oppose to load correct cf data

                            //load votes and load campaign finance data

                            var money ={support:[], oppose:[]}
                            

                            var ballotURL = "/data/m_"+ letter+ "_votes.json";


                            console.log("/data/m_"+ letter+ "_votes.json");


                            var schAJson = schAUrl + "'" +cmtAg+ "'";

                            console.log(schAJson);

                            
                            cmtFor.forEach(function(url){
                               d3.json(url, function(json){
                                  mapMarkes(json, 'blue')
                               })
                            });
                            

                            cmtAg.forEach(function(url){
                               d3.json(url, function(json){
                                  mapMarkes(json, 'red')
                               })
                            });
                            

                            d3.select('#supp-opp-radio').style('opacity', 1)
                            //d3.select('#oppRadio').attr('checked', true);



                            queue()
                                .defer(d3.json, ballotURL)
                                //.defer(d3.json, money)
                                .await(votesAndMoney);  

                        });


function mapMarkes(schAJson, color){

  console.log(schAJson.length, color)

  schAJson.forEach(function(d){

    if(d.tran_location){
      var lat = d.tran_location.latitude;
      var lng = d.tran_location.longitude; 
      var amt = d.tran_amt2;


      console.log(amt)
      console.log([lat, lng])

      //map.latLngToLayerPoint([lng, lat])


      var circle = L.circle([lat, lng], 50, {
            color: color,
            fillColor: color,
            fillOpacity: 0.5
        }).addTo(map);


    }
  })
}


var votesTooltip = d3.select('#map1')
              .append('div')
              .attr('id', 'votes-tooltip')


var width = 960*.6,
    height = 600*.6;

var rateById = d3.map();

var quantize = d3.scale.quantize()
    .domain([0, 1])
    .range(d3.range(9).map(function(i) { return "q" + i + "-9"; }));

var projection = d3.geo.mercator()
    .center([-122.433701, 37.767683])
    .scale(250000*.6)
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


function changeColor(checked){

        console.log(checked);

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
}


 
function changeValue(checked){



      votes.forEach(function(d, i){

        var id = d.PrecinctID;
        var pct = d[checked]/d['Ballots Cast'];
        var qt = quantize(pct)
        var prctName = d['PrecinctName'] + '<br>'

        
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

          

          var html = prctName + (pct*100).toFixed(2) + '% in '+ neighborhood 
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


           changeColor(checked)
                              
         })

    //Default
    d3.select('#oppRadio').attr('checked', true);
    checked = $('input:radio[name=inlineRadioOptions]:checked').val()
    changeColor(checked)

}



