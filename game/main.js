(function() {
  var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
                              window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
  window.requestAnimationFrame = requestAnimationFrame;
})();


var static, groundL, uiL, dinroot, powersL, fluzziesL, fluzzies = [];
var initLogic;
var tutos = [];
window.onload = function(){
    static = muu.addCanvas("static", false),
    groundL = new Layer(); static.add(groundL);
    uiL = new Layer(); static.add(uiL)
    dinroot = muu.addCanvas("dinamic", true);
    fluzziesL = new Layer(); dinroot.add(fluzziesL)
    powersL = new Layer(); dinroot.add(powersL);
    params = document.URL.split("?"),
    type = params[1], level = params[2];

    loadAssets({type:type})

    muu.whenReady(function(){

    initUI();

    $.getJSON("maps/"+type+"/map"+params[2]+".js", function(data){
        for (var i=0; i<data.grounds.length; i++){
            var ground = data.grounds[i];
            // GET GRAPHICS
            var gg = getGroundGraphics(ground);
            gg.moveTo(ground.position.x, ground.position.y)
            groundL.add(gg);
            // ADD TO PHYSICS
            if(!ground.megashape)
                makeGroundPhysics(gg);
            if(ground.megashape)
                makeMegaGroundPhysics(ground.megashape);
        }

        initPowers(data.powers);

        // LOGIC OBJS
        var logicobjs = [];
        initLogic = function(){
            for (var i=0; i<fluzzies.length; i++){
                fluzzyDie({visual:fluzzies[i], physics:fluzzies[i].physics()})
                delete fluzzies[i];
            }
            fluzzies = [];
            for(i=0; i<logicobjs.length; i++){
                static.rem(logicobjs[i].visual);
                if(logicobjs[i].visual._physics)
                    world.DestroyBody(logicobjs[i].visual.physics());
                delete logicobjs[i];
            }
            logicobjs = [];
            //Emitters
            for (i=0; i<data.logicobjs.emitters.length; i++){
                var logicobj = data.logicobjs.emitters[i];
                // get graphics
                var emitter = getWorldAsset("emitter").moveTo(logicobj.position[0], logicobj.position[1]);
                static.add(emitter);
                logicobj.visual = emitter;
                // Add logic
                logicobjs.push(createEmitter(logicobj));
            }
            for (i=0; i<data.logicobjs.catchers.length; i++){
               logicobj = data.logicobjs.catchers[i];
                   // get graphics
                   var catcher = getWorldAsset("catcher").moveTo(logicobj.position[0], logicobj.position[1]);
                   static.add(catcher);
                   logicobj.visual = catcher;
                   // Add logic
                   logicobjs.push(createCatcher(logicobj));
            }
            for (i=0; i<data.logicobjs.spikes.length; i++){
               logicobj = data.logicobjs.spikes[i];
               var spikes = getWorldAsset("spikes").moveTo(logicobj.position.x, logicobj.position.y).rotation(logicobj.rotation*6.2832/360);
               static.add(spikes);
               logicobj.visual = spikes;
               makeSpikesPhysics(spikes);
            }
        }
        initLogic();
        static.render();
        var dt, lt = 0, todelete = [];
        var render = function(t){
            // Time is difference of this time and last or this time if there is no previous
            dt = lt ? t -lt : t;
            lt = t;

            var s = getSteps(dt);

            for(var i=0; i<logicobjs.length; i++){
                var n = logicobjs[i].iterate(s);
                if(n === "none"){}
                else if(n === "iterateend"){ todelete.push(i)}
                else n();
            }
            if(todelete.length){
                var nl = logicobjs.splice(0, todelete[0])
                for(i=0; i<todelete.length; i++){
                    var nl = nl.concat(logicobjs.splice(todelete[i]+1, i+1<todelete.length?todelete[i]-todelete[i+1]-1:todelete.length-todelete[i]));
                }
                logicobjs = nl; delete nl; todelete = [];
            }

            for(i=0; i<tutos.length; i++){
                var t = true;
                for(var j in tutos[i].conds) if(!tutos[i].conds[j]()){ t = false; break; }
                if(t){
                    tutos[i].callback(); stopTime(); todelete.push(i);
                }
            }

            if(todelete.length){
                var ctut = [].concat(tutos);
                var nl = ctut.splice(0, todelete[0])
                for(i=0; i<todelete.length; i++){
                    var ctut = [].concat(tutos);
                    var nl = nl.concat(ctut.splice(todelete[i]+1, i+1<todelete.length?todelete[i]-todelete[i+1]-1:ctut.length-todelete[i]));
                }
                tutos = nl; delete nl; delete ctut; todelete = [];
            }

            runSteps(s); // Run PHYSICS

            updateGraphics(s) // Update fluzzies and stuff

            muu.render();

            requestAnimationFrame(render);
        }

        requestAnimationFrame(render);
    });
    });
    document.onkeydown = function(e){
        if(e.keyCode === 38)
            window.location = dinroot.context.canvas.toDataURL("image/png")
    }
}

function addTuto(condition, callback){
    var equalityChecker = function(cond){
        var ts = cond.split("=");
        return function(){return eval(ts[1]+"==="+ts[2])}
    }
    var greaterChecker = function(cond){
        var ts = cond.split(">");
        return function(){return eval(ts[1]+">"+ts[2])}
    }

    var conds = condition.split(";");
    var nconds = [];
    for(var i=0; i<conds.length; i++){
        if(conds[i]==="init") nconds.push(function(){return true})
        else if(conds[i][0] === "=") nconds.push(equalityChecker(conds[i]))
        else if(conds[i][0]=== ">") nconds.push(greaterChecker(conds[i]))
    }
    tutos.push({conds:nconds, callback:callback});
}

