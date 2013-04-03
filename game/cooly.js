// A cooly is the name for what will be the fluzzies. This prototype
// should save also the physics, it's in the TODO list
var COOLY = function(parameters, time){
    if(typeof parameters === "undefined") parameters = {hability:"none"}
    this.hability = parameters.hability;
    this.time = time;
    var fill = "pelusanone.png";
    switch (this.hability){
        case "none": fill = "pelusanone"; break;
        case "heavy": fill = "pelusaheavy"; break;
    }
	this.createVisual = function(){
		return new Sprite(fill).size(60, 60);
	}
}

var COOLYEMITTER = function(parameters){
    this.sequence ={}, this.position = parameters.position, this.i = {i: 0};
    var steps = 0, coolies = 0;
    $.extend(true, this.sequence, parameters.sequence);
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
	    return repeatArray(sequence.many,[new COOLY(sequence.cooly, sequence.time)]);
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
    this.sequence = iterateSequence(this.sequence);
    var needsteps = this.sequence[0].time;
            needsteps -= 2500 *(Math.atan(2*this.i.i-30)+Math.atan(30))
	    needsteps /= Step;

    // Advance the state one step and return the cooly if it should
    this.getNext = function(){
	steps++;
	if(steps >= needsteps){
        var c = this.sequence[coolies];
		if(c){
            steps = 0;
            //The formula is for accelerating the rythm of coolies
            needsteps = (c.time -2500 *(Math.atan(2*this.i.i-30)+Math.atan(30)))/Step
            coolies ++; if(this.i.i<15) this.i.i ++;
			return c
		}
        // The last cooly is out
		else return {end:true};
        }
	else return false;
    }
	this.visual = new Sprite("in").size(150, 150);
}
