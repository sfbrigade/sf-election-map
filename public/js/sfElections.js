
/*
// create a map in the "map" div, set the view to a given place and zoom
var map = L.map('map').setView([37.8, -122.43], 10);

// add an OpenStreetMap tile layer
L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

*/

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

var schAUrl = "http://data.sfgov.org/resource/q66q-d2tr.json?"

var cmtFor =[];
var cmtAg = [];

var mfor;
var ag;


var checked;

function swtichMoney(currval){

  console.log('Switch Money value is ' + currval)

 d3.selectAll('.zipareas').selectAll('.red').classed('red', false)
 d3.selectAll('.zipareas').selectAll('.blue').classed('blue', false)
 
 


   var moneyFor = [];
  var moneyAg = [];
                            if(currval == 'support'){  

                               


                            cmtFor.forEach(function(url, i){
                              console.log(url)

                               d3.json(url, function(json){
                                  //mapMarkes(json, 'blue')

                                  mfor = moneyFor.concat(json)

                                 if(i==cmtFor.length-1){
                                  mapMarkes(mfor, 'blue')
                                  }
                                 });

                                
                               
                            });
                           } 
                            
                           if(currval == 'oppose'){ 

                            

                            cmtAg.forEach(function(url, i){
                              console.log(url)
                               d3.json(url, function(json){

                                  console.log(json)
                                  ag = moneyAg.concat(json)

                                  if(i==cmtAg.length-1){
                                  mapMarkes(ag, 'red')
                                }
                                  
                               });
                              
                            });

                          } 
}





var ballotSelector = d3.selectAll('#ballot-dropdown li a')
                        .on('click', function(){
                            var ob = d3.select(this);
                            var val = ob.attr('value');
                            var letter = val.toLowerCase();
                            var alp = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l'];
                            var lIdx = alp.indexOf(letter);

                            var moneyOb = ballots[lIdx]

                            
                            var currval = $('input:radio[name=inlineRadioOptions]:checked').val()


                             d3.selectAll('.zipareas')
                                .classed(['red', 'blue'], false)
                            
                            cmtFor =[];
                            cmtAg = [];

                            moneyOb.cmt_for.forEach(function(f){
                                if(f.query){
                                  //add to queue
                                  cmtFor.push(schAUrl + f.query);
                                }
                            });

                            

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


                            //var schAJson = schAUrl + "'" +cmtAg+ "'";

                            //console.log(schAJson);

                           

                            var allzips = {};
                            allzips.for_sum = 0;
                            allzips.ag_sum = 0;


                            var forzips = {};
                            forzips.sum = 0;

                            var agzips = {};
                            agzips.sum = 0;

 
                            swtichMoney(currval);

                            d3.select('#supp-opp-radio').style('opacity', 1)
                            //d3.select('#oppRadio').attr('checked', true);

                           

                            queue()
                                .defer(d3.json, ballotURL)
                                //.defer(d3.json, money)
                                .await(votesAndMoney);  

                        });


function mapMarkes(schAJson, color){

  //console.log(schAJson)

  var allamts = d3.map(schAJson, function(d){ return d.tran_amt2})

  var total = d3.sum(allamts);


  schAJson.forEach(function(d){

    

    if(d.tran_zip4){

      //console.log(d)
      //var lat = d.tran_location.latitude;
      //var lng = d.tran_location.longitude; 
      var amt = d.tran_amt2;
      var z_code = d.tran_zip4;
      var mapId = '#zip_' + z_code;
      var pct = d.tran_amt2/total
      var qt = quantize(pct)


      //console.log(amt)
      //console.log([lat, lng])
     

      d3.select(mapId)
        //.attr('class', qt)
        //.classed(capitalizeFirstLetter(color), true)
        //.style('fill', color)
        .classed(color, true)


      


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


var projection2 = d3.geo.mercator()
                  .translate([width / 2, height / 2])
                  .scale([79900])
                  .center([-122.43198394775389, 37.76365837331252]);

var path2 = d3.geo.path()
    .projection(projection2);






var svg = d3.select("#map1").append("svg")
    .attr("width", width)
    .attr("height", height);

var svg2 = d3.select("#map2").append("svg")
    .attr("width", width)
    .attr("height", height);    


var sfMapData;
var sfNeighData;
var ballotVotesData;

var precincts;
var zips;

var neighIdx =[];
var allNeigh =[];


queue()
    
    .defer(d3.json, "/data/precincts.json")
    .defer(d3.json, "/data/prect2neigh.json")
    //.defer(d3.json, "/data/sfzipcode.json")
    .defer(d3.json, "/data/sf.json")
    .await(ready);

function ready(error, sf, neigh, zipmap) {
  if (error) throw error;

  console.log(zipmap)

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


zips = svg2.append("g")
             .attr("class", "zipareas")
              .selectAll("path")
              //.data(topojson.feature(zipmap, zipmap.objects.sfzipcode).features)
              .data(topojson.feature(zipmap, zipmap.objects.geo).features)
              .enter().append("path")
                
                //.attr("class", function(d) { return quantize(rateById.get(d.id)); })
              .attr('id', function(d){
                 return 'zip_' + d.properties.ZIP;
              })
              .attr("d", path2)
              .attr('class', 'zip')




      
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

        console.log('change color function is ' + checked);

        swtichMoney(checked)

            if(checked=='support'){

              d3.selectAll('.precincts')
              .classed('Reds', false)
              .classed('Blues', true)

              changeValue('Yes');
              //mapMarkes(mfor, 'blue')

           }
           else{
              d3.selectAll('.precincts')
              .classed('Reds', true)
              .classed('Blues', false)

              changeValue('No')

              //mapMarkes(ag, 'red')
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



