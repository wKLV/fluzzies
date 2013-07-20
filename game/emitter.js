function createEmitter(parameters){
    var logicobj = {};
    logicobj.sequence ={}, logicobj.position = parameters.position, logicobj.i = {i: 0};
    var steps = 0, coolies = 0;
    $.extend(true, logicobj.sequence, parameters.sequence);
    var i = this.i;
    // With this we take the complex list of sequences and make it plain
    function iterateSequence(sequence){
        function repeatArray(count, arr){
          var ln = arr.length;
          var b = new Array();
          for(i=0; i<count*ln; i++) {
            b.push(arr[i%ln]);
          }
        return b;
    }
    if(sequence.cooly.hability){
        return repeatArray(sequence.many,[{cooly:sequence.cooly, time:sequence.time}]);
    }
        else if (sequence.cooly instanceof Array){
        var list = [];
        $.each(sequence.cooly, function(i,v){
        list = list.concat(iterateSequence(v));
        });
            list.push({none:true, time:sequence.time});
        return repeatArray(sequence.many, list);
    }
        else{
            var list = iterateSequence(sequence.cooly);
            list.splice(0,0).push({none:true, time:sequence.time});
        return repeatArray(sequence.many, list);
        }
    }
    logicobj.sequence = iterateSequence(logicobj.sequence);
    var needsteps = logicobj.sequence[0].time;
            needsteps -= 2500 *(Math.atan(2*logicobj.i.i-30)+Math.atan(30))
        needsteps /= Step;

    // Advance the state one step and return the cooly if it should
    logicobj.iterate = function(s){
    steps+= s;
    if(steps >= needsteps){
        var c = logicobj.sequence[coolies];
        if(c){
            steps = 0;
            needsteps = c.time
            coolies ++; if(this.i.i<15) this.i.i ++;
            if(!c.none){
            return function(){
                parameters.visual.op(parameters.visual);
                setTimeout(function(){parameters.visual.cl(parameters.visual)},1000)
                fluzzies.push(FluzzyM(c.cooly.hability));
                fluzziesL.add(fluzzies[fluzzies.length-1].moveTo(parameters.position[0], parameters.position[1]));
                if(c.cooly.hability === "none") makeNoneFluzzyPhysics(fluzzies[fluzzies.length-1])
                else if(c.cooly.hability === "heavy") makeHeavyFluzzyPhysics(fluzzies[fluzzies.length-1])
            }
            }
            else
                return "none"
        }
        // The last cooly is out
        else return "iterateend";
        }
    else return "none";
    }
    logicobj.visual = parameters.visual;
    return logicobj;
}

function createCatcher(params){
    if(pass !== true) pass = params.pass
    if(star1 !== true) star1 = params.star1
    if(star2 !== true) star2 = params.star2
    if(star3 !== true) star3 = params.star3;

    makeCatcherPhysics(params.visual);

    params.visual.event(["mousedown"], function(){
        if(pass === true) win3stars();//$(success).show();
    })

    params.iterate = function(){return "none"}
    return params;
}
