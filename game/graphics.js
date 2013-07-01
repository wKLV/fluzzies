var img = new Image(), cont = false;
var gStroke;

var funs =  [];
function loadAssets(type){
    var type = type.type;

    muu.addAtlas("assets/UI.png", "assets/UI.js");
    gStroke = 'rgb(10,10,10)';
    if(type === "puzzle") {
        muu.addAtlas("assets/blueprint.png", "assets/blueprint.js");
        gStroke = 'rgb(255,255,255)'
    }
    else{
        muu.addAtlas("assets/fluzzies.png", "assets/fluzzies.json")
        muu.addAtlas("assets/Metal Fluzzies.png", "assets/Metal Fluzzies.js");
    }
    muu.addAtlas("assets/atlas2.png", "assets/atlas2.js");

    img.src = "assets/Metal.png"
}

function getFluzzy(fluzzy){

}

function getGroundGraphics(g){
    return new Polygon(g.shape).fill(static.context.createPattern(img, 'repeat')).stroke(gStroke);
}

function getWorldAsset(info){
    switch(info){
        case "emitter": return new Sprite("entrance").size(154.4,200);
        case "catcher": return new Sprite("in").size(150,150)
        case "spikes": return new Sprite("spikes").size(260,100)
    }
}

function updateGraphics(dt){
    for(var i=0; i<funs.length; i++) funs[i](dt);
    for(var i=0; i<fluzzies.length; i++) fluzzies[i].step();
}

function addGraphUpdate(fun){
    funs.push(fun);
}
