var COOLY = function(parameters){
    if(typeof parameters === "undefined") parameters = {hability:"none"}
    this.hability = parameters.hability;
    this.velocity = 5;
    var fill = "assets/pelusa.png";
    switch (this.hability){
        case "none": fill = "assets/pelusa.svg"; break;
        case "heavy": fill = "assets/pelusa-heavy.png"; break;
    }
	this.createVisual = function(){
		return (new Sprite)
        .fill(fill)
	    .size(60, 60);
	}
}

var COOLYEMITTER = function(parameters){
    this.sequence = parameters.sequence, this.position = parameters.position, this.i = {i: 0};
    var i = this.i;
    var r = false;
    function nextsequence(sequence){
        function deploy(sequence,many, time, finished){ return function(){
            if(i.i > 25) i.i = 25;
            if(sequence instanceof Array){
                deploy(sequence[0].cooly, sequence[0].many, sequence[0].time, finished)()
            }
            else if(sequence.hability){
                r = new COOLY(sequence)
                if(many <= 0)
                    finished();
                else{
                    setTimeout(deploy(sequence, many-1, time, finished),time -2500 *(Math.atan(2*i.i-50)+Math.atan(50)));
                    i.i++;
                }
            }
        }}
        sequence.finished = function(){
            if(sequence.many <=0) return;
            if(sequence.cooly instanceof Array){
                var seq = sequence.cooly.splice(0,1);
                sequence.many --;
                deploy(sequence.cooly, sequence.many, sequence.time, sequence.finished)();
                sequence.cooly = sequence.cooly.concat(seq);
            }
        }
        setTimeout(deploy(sequence.cooly, sequence.many, sequence.time , sequence.finished), sequence.time);
    }
    nextsequence(this.sequence)
    this.getNext = function(time){
        if(r){
            var rr = r;
            r = false;
            return rr;
        }
    }
	this.visual = (new Sprite)
        .fill("assets/in.svg")
	    .size(150, 150);
}
