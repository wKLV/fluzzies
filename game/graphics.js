var img = new Image(), cont = false;

var funs =  [];
function loadAssets(type){
    var type = type.type;

    muu.addAtlas("assets/UI.png", "assets/UI.js");
    if(type === "puzzle") {
        muu.addAtlas("assets/fluzzies.png", "assets/fluzzies.json")
        muu.addAtlas("assets/Metal Fluzzies.png", "assets/Metal Fluzzies.js");

        muu.addAtlas("assets/atlas-bp.png", "assets/atlas-bp.js");
        gStroke = 'rgb(255,255,255)'
    }
    else{
        muu.addAtlas("assets/fluzzies.png", "assets/fluzzies.json")
        muu.addAtlas("assets/Metal Fluzzies.png", "assets/Metal Fluzzies.js");
    }
    muu.addAtlas("assets/atlas2.png", "assets/atlas2.js");

    img.src = "assets/Metal.png"
}


var graphics = [], nonrenew = [];
function getGroundGraphics(g){
    var a = new Polygon(g.shape).fill(static.context.createPattern(img, 'repeat')).stroke("rgb(10,10,10)");
    a.bp = function(nbp){nbp.fill("rgba(0,0,0,0)").stroke("rgb(255,255,255)")}
    a.nbp = function(bp){bp.fill(static.context.createPattern(img, "repeat")).stroke("rgb(10,10,10)")};
    graphics.push(a);
    nonrenew.push(a);
    return a;
}

function getWorldAsset(info){
    var a;
    switch(info){
        case "emitter":
           a = new Sprite("entrance-closed").size(127.6,200);
           a.bp = function(nbp){nbp.change("entrance-bp");}
           a.nbp = function(bp){bp.change("entrance-closed")};
           a.op = function(cl){if(mode==="puzzle" && planning) cl.change("entrance-bp-open")
                                else cl.change("entrance-open")};
           a.cl = function(op){if(mode==="puzzle" && planning) op.change("entrance-bp")
                                else op.change("entrance-closed")}
           break;
        case "catcher":
            a = new Sprite("in").size(150,150);
            a.bp = function(nbp){nbp.change("in-bp")};
            a.nbp = function(bp){bp.change("in")};
            a.op = function(cl){if(mode==="puzzle" && planning) cl.change("in-bp-open")
                                else cl.change("in-open")};
            a.cl = function(op){if(mode==="puzzle" && planning) op.change("in-bp")
                                else op.change("in")}
            break;
        case "spikes":
            a = new Sprite("spikes").size(260,100);
            a.bp = function(nbp){nbp.change("spikes-bp")};
            a.nbp = function(bp){bp.change("spikes")};
            break;
    }
    graphics.push(a);
    return a;
}

function getPowerAsset(p){
    var a = new Sprite(p).size(75,75);
    a.bp = function(nbp){nbp.change(p+"-bp")}
    a.nbp = function(bp){bp.change(p)}
    graphics.push(a);
    nonrenew.push(a);
    return a;
}

function updateGraphics(dt){
    for(var i=0; i<funs.length; i++) funs[i](dt);
    for(var i=0; i<fluzzies.length; i++) fluzzies[i].step();
}

function addGraphUpdate(fun){
    funs.push(fun);
}

function changeGraphicstoBP(){
    for(var i=0; i<graphics.length; i++){
        graphics[i].bp(graphics[i]);
    }
    $("#background").css("background-image", "url(assets/fondo-bp.png)");
}

function changeGraphicstoNonBP(){
    for(var i=0; i<graphics.length; i++){
        graphics[i].nbp(graphics[i]);
    }
    $("#background").css("background-image", "url(assets/fondo1.png)")
}
