var playButton, accelerateButton, resetButton;
var touchIcon, touchNumber, fluzzyIcon,fluzzyNumber;
var menuPowers;
var passIcon, star1Icon, star2Icon, star3Icon;
var activePowers = [];
function initUI(){
    playButton = new Sprite("pause").size(70,70).moveTo(1260,60);
    accelerateButton = new Sprite("timeplus").size(70,70).moveTo(1350,60);
    resetButton = new Sprite("reset").size(70,70).moveTo(1440,60);
    playButton.event(["mousedown"], function(){if(ongame) stopTime(); else startTime()});
    accelerateButton.event(["mousedown"], function(){if(speed === 4) reduceSpeed(4); else augmentSpeed(4)});
    resetButton.event(["mousedown"], function(){
        fluzziesin =0, touches = pows.length;
        fluzzyNumber.text(""+fluzziesin);
        touchNumber.text(""+touches);
        static.render();
        initLogic()
    });
    passIcon = new Sprite("door").moveTo(1000, 60);
    star1Icon = new Sprite("star").moveTo(1050, 60);
    star2Icon = new Sprite("star").moveTo(1100,60);
    star3Icon = new Sprite("star").moveTo(1150, 60)
    menuPowers = new Layer().moveTo(1450,500); menuPowers.add(new Rect().size(100,600).fill("rgb(250, 245, 225)"));

    touchIcon = new Sprite("touch").moveTo(1450, 120);
    touchNumber = new Label().text("0").moveTo(1445,145).stroke("rgba(0,0,0,0)").scale(1.5);
    fluzzyIcon = new Sprite("fluzzy").moveTo(1400, 120);
    fluzzyNumber = new Label().text("0").moveTo(1390,140).stroke("rgba(0,0,0,0)").scale(1.5)

    uiL.add(playButton).add(accelerateButton).add(resetButton).add(menuPowers)
    .add(touchIcon).add(touchNumber).add(fluzzyIcon).add(fluzzyNumber)
    .add(passIcon).add(star1Icon).add(star2Icon).add(star3Icon);
}

var pows = [];
function initPowers(powers){
    for(var i=0; i<powers.length; i++){
        initP(i);
    }

    function initP(i){
        var p = powers[i];
        // The sprite in the menu
        var sm = new Sprite(p).size(75,75).moveTo(0, -250+95*i);
        menuPowers.add(sm);
        // the layer of the power with its effects
        var powerL = new Layer;
        switch(p){
        case "anti":
            var antisprite = sm,
            antifield = new Circle().radius(150).fill("rgba(243, 222, 83, 0.1)").stroke("rgba(0,0,0,0)"),
            antifield2 = new Circle().radius(150).fill("rgba(243, 222, 83, 0.1)").stroke("rgba(0,0,0,0)").scale(0.5,0.5);
            powerL.add(antifield).add(antifield2);
            break;
        case "atra":
            var antisprite = sm;
            antifield = new Circle().radius(150).fill("rgba(107, 67, 151, 0.1)").stroke("rgba(0,0,0,0)"),
            antifield2 = new Circle().radius(150).fill("rgba(107,67,151, 0.1)").stroke("rgba(0,0,0,0)").scale(0.5,0.5);
            powerL.add(antifield).add(antifield2);
            break;
        case "accele":
            var rotateSprite = sm;
            var rotateField = new Circle().radius(150).stroke("rgba(0,0,0,0)").fill("rgba(10,250,20, 0.2)");
            powerL.add(rotateField);
            break;
        }
        // When you press on a power in the menu
        sm.event(["mousedown"], function(e){
            increaseTouch();
            pows.push({power:p, visual:powerL});
            menuPowers.rem(sm);
            static.render();
            sm.size(100,100).moveTo(0,0);
            powerL.add(sm);
            power = {visual:powerL, power:p};
            powersL.add(powerL);
            powerL.follow(muu.getMouse());
            activePowers.push({power:p});
            switch(p){
            case 'anti': addGraphUpdate(function(dt){
                var r = antisprite.rotation();
                antisprite.rotation(r-dt/48)
                r = antifield.scale();
                r += dt/80;
                r %= 1;
                if(r===0) r= 0.0001
                antifield.scale(r);
                var p = antifield2.scale();
                p += dt/80;
                p %= 1;
                if(p===0) p=0.0001
                antifield2.scale(p);
               });
               break;
            case 'atra': addGraphUpdate(function(dt){
                var r = antisprite.rotation();
                antisprite.rotation(r-dt/48)
                r = antifield.scale();
                r = -r +1
                r += dt/80;
                r %= 1;
                antifield.scale(1-r,1-r);
                var p = antifield2.scale();
                p = -p +1
                p += dt/80;
                p %= 1;
                antifield2.scale(1-p,1-p);
                });
                break;
            case 'accele': addGraphUpdate(function(dt){
                var r = rotateSprite.rotation();
                rotateSprite.rotation(r-dt*10)
                rotateField.rotation(r-dt);
                });
            };
         // Remove this event
         sm.clearEvent("mousedown");
         sm.event(["mousedown"], function(e){
            if(!powerL._follow)
                increaseTouch()
            powerL.follow(muu.getMouse());
         });
         sm.event(["mouseup"], function(){powerL.unfollow()});
        })
    }

}

var Step = 10, speed = 1, ongame = true;
var fluzziesin = 0; dfluzzies =0; touches = 0;
function setFlow(maptype){

}

function getSteps(time){
    if(ongame)
        return time /Step * speed;
    else return 0;
}

function augmentSpeed(ratio){
    speed *= ratio;
    accelerateButton.change("timereg");
}

function reduceSpeed(ratio){
   speed /= ratio;
    accelerateButton.change("timeplus");
}

function stopTime(){
   ongame = false;
   playButton.change("play");
}

function startTime(){
   ongame = true;
   playButton.change("pause");
}

fluzziestodelete =[];
function fluzzyDie(fluzzy){
    if(typeof(fluzzy)=== "undefined"){if(fluzziestodelete.length){
        for(var i=0; i<fluzziestodelete.length; i++){
            var fluzzy = fluzziestodelete[i];
            fluzziesL.rem(fluzzy.visual);
            if(fluzzy.visual._physics)
            world.DestroyBody(fluzzy.visual.physics());
            delete fluzzy.visual._physics;
        }
        var ctut = [].concat(fluzzies);
        var nl = ctut.splice(0, fluzziestodelete[0].id)
        if(fluzzies.length > 1)
        for(i=0; i<fluzziestodelete.length; i++){
            var ctut = [].concat(fluzzies);
            var nl = nl.concat(ctut.splice(fluzziestodelete[i].id+1,
                i+1<fluzziestodelete.length?fluzziestodelete[i+1].id-fluzziestodelete[i].id-1:ctut.length-fluzziestodelete[i].id));
        }
        fluzzies = nl; delete nl; delete ctut; fluzziestodelete = [];
        for(i=0; i<fluzzies.length;i++){
            if(!fluzzies[i]._physics)
                console.log("red alert")
            fluzzies[i].physics().GetUserData().id = i;
        }
    }}
    else fluzziestodelete.push(fluzzy);
}

function fluzzyEnters(fluzzy, door){
    // SCORE STUFF
    fluzziesin++;
    checkStars();
    // EFFECTS STUFF
    door.change("in-open");
    if(pass !== true)
        setTimeout(function(){door.change("in")}, 1000)

    fluzzyNumber.text(""+fluzziesin).scale(2); static.render();
    setTimeout(function(){fluzzyNumber.scale(1.5); static.render()}, 1500)
}

function increaseTouch(){
    touches++;
    touchNumber.text(""+touches).scale(2); static.render();
    setTimeout(function(){touchNumber.scale(1.5); static.render()}, 1500);
}

function checkStars(){
    if(pass !== true) if(fluzziesin >= pass.coolies && (touches < pass.touches || !pass.touches)) {pass = true; passIcon.change("doorgot")}
    if (star1 !== true) if(fluzziesin >= star1.coolies && (touches <= star1.touches || !star1.touches)) {star1 = true; star1Icon.change("stargot")}
    if (star2 !== true) if(fluzziesin >= star2.coolies && (touches <= star2.touches || !star2.touches)) {star2 = true; star2Icon.change("stargot")}
    if (star3 !== true) if(fluzziesin >= star3.coolies && (touches <= star3.touches || !star3.touches)) {star3 = true; star3Icon.change("stargot")}
}
