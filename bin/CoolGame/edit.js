CoolGame.start = function(){
    var map = {
        emitter: {
            sequence:{cooly: new COOLY(), many:100, time:5000, lastTime:0},
            position:[85,85]
        },
        catcher: {
            position:[85, 700]
        },
        grounds:[
        ],
        powers:[],
        spikes:{}
    },
    emitter = new COOLYEMITTER(map.emitter),
    scene = new Scene(document.body, 2000, 1000),
    base = emitter.visual.moveTo(map.emitter.position[0], map.emitter.position[1]),
    basein = (new Sprite).fill("assets/in.png").size(150, 150).moveTo(map.catcher.position[0], map.catcher.position[1]),
    menu = new Node, menubackround = new Sprite().size(100,600).fill(250, 245, 225).moveTo(document.body.clientWidth-50, document.body.clientHeight/2),
    powers = [], powersedit = [],
    add = new Label().text("+").moveTo(document.body.clientWidth-50, document.body.clientHeight/2+250).scale(3,3),
    anti = new Sprite().size(100,100).fill("assets/anti.png"),
    edit = new Label().text("Edit mode").moveTo(1200, 10),
    save = new Label().text("Save map").moveTo(1200, 60);
    layer = new Node,
    background = new Sprite().size(4000, 2000).fill(0, 150, 250),
    items = new Node,
    itemsbackground = new Sprite().size(500, 150).fill(250, 245, 225).moveTo(document.body.clientWidth-150, document.body.clientHeight-75),
    readd = function(posx,posy, fill, scalex, scaley){ return function(){
        items.add(new Sprite().fill(fill).size(scalex,scaley).moveTo(posx, posy).event(["mousedown", "touchstart"], function(e){
            e.startDrag();
    e.swallow(["mouseup", "touchend"], function(e){
        if(!e.targetObject.spid)
            e.targetObject.spid = Object.keys(map.spikes).length+1
        map.spikes[e.targetObject.spid] = {position:e.screenPosition}
    })})
    )}},
    itemspikes = new Sprite().fill("assets/Pinchos2.svg").size(260,100).moveTo(document.body.clientWidth-130, document.body.clientHeight-50).
        event(["mousedown", "touchstart"], readd(document.body.clientWidth-130, document.body.clientHeight-50, "assets/Pinchos2.svg", 260, 100)),

    mode = "TEST", shape = [];
    scene.add(background);
    scene.add(base);
    scene.add(basein);
    scene.add(save)
    scene.add(edit);
    menu.add(menubackround);
    menu.add(add)
    scene.add(menu);
    items.add(itemsbackground);
    items.add(itemspikes);
    scene.add(items);

    var pows = function() {
        var layers = [], getNext = function(i){
            switch(i){
                case "anti": return "atra";
                case "atra": return "accele";
                case "accele": return "anti";
            }
        }
        return {
            add: function(i,v, first){
                if (typeof first === "undefined") first = true
                if(first) {
                    powersedit.push(v);
                    map.powers.push(v);
                }
                var s = (new Sprite).size(75,75).fill("assets/"+v+".png").
                        moveTo(document.body.clientWidth-50, document.body.clientHeight/2+95*i-235);
                menu.add(s);
                var layer = new Node;
                layers.push(layer);
                if(v === "anti"){
                    var antisprite = new Sprite().size(100,100).fill("assets/anti.png"),
                    antifield = new Circle().size(300,300).fill(107, 67, 151, 0.1),
                    antifield2 = new Circle().size(300,300).fill(107,67,151, 0.1).scale(0.5,0.5);
                    layer.add(antifield).add(antifield2).add(antisprite);
                }
                else if(v==="atra"){
                        var antisprite = new Sprite().size(100,100).fill("assets/atra.png"),
                        antifield = new Circle().size(300,300).fill(107, 67, 151, 0.1),
                        antifield2 = new Circle().size(300,300).fill(107,67,151, 0.1).scale(0.5,0.5);
                        layer.add(antifield).add(antifield2).add(antisprite);
                    }
                layer.event(["mousedown", "touchstart"], function(e){
                    e.startDrag();
                });
                s.event(["mousedown", "touchstart"], function(e){ if(mode === "TEST"){
                    scene.add(layer);
                    layer.moveTo(s.getPos().x+e.position.x, s.getPos().y+e.position.y);
                    powers.push({power:v, visual:layer, updateEffects:function(dt){
                        if(v === "anti"){
                                var r = antifield.scale().x;
                                r += dt/800;
                                r %= 1;
                                antifield.scale(r,r);
                                antifield.fill(243, 222, 83, 1-r)
                                var p = antifield2.scale().x;
                                p += dt/800;
                                p %= 1;
                                antifield2.scale(p,p);
                                antifield2.fill(243, 222, 83, 1-p)
                        }
                        else if(v ==="atra"){
                                var r = antifield.scale().x;
                                r = -r +1
                            r += dt/800;
                                r %= 1;
                                antifield.scale(1-r,1-r);
                                antifield.fill(107, 67, 151, r)
                                var p = antifield2.scale().x;
                            p = -p +1
                                p += dt/800;
                                p %= 1;
                                antifield2.scale(1-p,1-p);
                                antifield2.fill(107, 67, 151, p)
                        }
                    }});
                    menu.rem(s);
                }
                else if(mode === "EDIT"){
                    powersedit.splice(powersedit.indexOf(v),1);
                    map.powers.splice(map.powers.indexOf(v),1);
                    scene.rem(layer);
                    menu.rem(s);
                    pows.add(i, getNext(v));
                }
                })
            },
                reset: function(){
                    $.each(layers, function(i,v){
                        scene.rem(v);
                    });
                    powers = [];
                    for(var i in powersedit){
                        this.add(i, powersedit[i], false);
                    }
                }
        }
    }()

    var balls = {}, ids=0;
    var gravity = new box2d.Vec2(0, 100);
    var bounds = new box2d.AABB();
    bounds.minVertex.Set(-document.body.clientWidth, -document.body.clientHeight);
    bounds.maxVertex.Set(2*document.body.clientWidth,2*document.body.clientHeight);
    var world = new box2d.World(bounds, gravity, false);

    var ground = new box2d.PolyDef;
    ground.restitution = .6
    ground.density = 0;
    ground.friction = 1;

    var ballDef = new box2d.CircleDef;
    ballDef.radius = 15;
    ballDef.density = 1;
    ballDef.restitution = 0.2;
    ballDef.friction = 1;


    var bin = new box2d.PolyDef;
    bin.density = 0;
    bin.SetVertices([[-75,75],[-75,-75],[75,-75],[75,75]])

    var binbodydef = new box2d.BodyDef;
    binbodydef.position.Set(map.catcher.position[0], map.catcher.position[1]);
    binbodydef.AddShape(bin);

    binbodydef.userData = {name:"in"}
    var binbody = world.CreateBody(binbodydef);
    scene.add(layer);

    scene.substitute(scene.scene);
    var listener = {}, todelete = {};
    listener.BeginContact = function(a,b){
        if(a.GetUserData().name === "cooly"){
            if(b.GetUserData().name === "spikes"){
                world.DestroyBody(a);
                layer.rem(a.GetUserData().visual);
            }
            else if(b.GetUserData().name === "in"){
                world.DestroyBody(a);
                layer.rem(a.GetUserData().visual);
            }
        }
        else if(b.GetUserData().name === "cooly"){
            if(a.GetUserData().name === "spikes"){
                world.DestroyBody(b);
                layer.rem(b.GetUserData().visual);
            }
            else if(a.GetUserData().name === "in"){
                world.DestroyBody(b);
                layer.rem(b.GetUserData().visual);
            }
}
    }

    lime.scheduleManager.schedule(function(dt) { if(mode === "TEST"){
         $.each(todelete, function(i,a){
            world.DestroyBody(a);
            layer.rem(a.GetUserData().visual);
            delete balls[a.GetUserData().ids];
        });
        $.each(powers, function(i,p){
            $.each(balls, function(i,v){
                var d = v.physics.GetCenterPosition().Copy().subtract(p.visual.getPos());
                var dlength = d.Normalize()
                if(p.power === "anti" && dlength < 150)
                    v.physics.ApplyImpulse(box2d.Vec2.multiplyScalar(300000/(dlength^2), d), p.visual.getPos());
		else if(p.power === "atra" && dlength <150)
	            v.physics.ApplyImpulse(box2d.Vec2.multiplyScalar(-300000/(dlength^2), d), p.visual.getPos());
	    });
            p.updateEffects(dt);
        })

        world.Step(dt / 1000, 3);
        $.each(balls, function(i,v){
            var pos = v.physics.GetCenterPosition().clone();
            var rot = v.physics.GetRotation();

            v.visual.rotation(-rot/Math.PI*180);
            v.visual.moveTo(pos.x, pos.y);
        });
        var c = emitter.getNext(dt);
        if(c){
            ids ++;
            var c = c.createVisual();
            var v = new box2d.BodyDef;
            v.userData = {name:"cooly", visual:c};;
            v.position.Set(base.getPos().x, base.getPos().y);
            v.angularDamping = 0;
            v.id = ids;
            v.AddShape(ballDef);
            v = world.CreateBody(v);
            balls[ids] = {visual:c, physics:v};
            layer.add(c);
        }
        for(var c=world.GetContactList(); c; c = c.GetNext()){
            listener.BeginContact(c.getBodies()[0], c.getBodies()[1]);
        }
    }},this);

    edit.event(["mousedown", "touchstart"], function(e){
        if(mode === "TEST"){
             mode = "EDIT"
             pows.reset();
        }
        else{
            mode = "TEST"
            var c = new box2d.Vec2();
            var a = 0;
            for(var i = 0; i< shape.length-1; i++){
                a+= 0.5*(shape[i].x*shape[i+1].y -shape[i+1].x*shape[i].y)
            }
            if(a < 0) shape.reverse();
            for ( i=0; i < shape.length-1; i++ ) {
                c.x += (shape[i].x + shape[i+1].x)*(shape[i].y*shape[i+1].x -shape[i].x*shape[i+1].y)/(6*a);
                c.y += (shape[i].y + shape[i+1].y)*(shape[i].y*shape[i+1].x -shape[i].x*shape[i+1].y)/(6*a);
             }
             var l = [];
            $.each(shape, function(i,v){
                shape[i] = box2d.Vec2.subtract(v,c);
                l.push([shape[i].x, shape[i].y])
            });

            map.grounds.push({shape:shape, position:c});

            ground = new box2d.PolyDef;
            ground.restitution = .6
            ground.density = 0;
            ground.friction = 1;
            ground.SetVertices(l);
            var gbody = new box2d.BodyDef;
            gbody.position.Set(c.x, c.y);
            gbody.AddShape(ground);
            gbody.userData = {name:"ground"}

            layer.rem(groundv);
            var vis = new Polygon(shape).fill("assets/Metal.png").moveTo(c.x, c.y);
            layer.add(vis);

            shape = [];
            world.CreateBody(gbody);
        }
    });

    save.event(["mousedown"], function(e){
        map.emitter.position = [base.getPos().x, base.getPos().y]
        map.catcher.position = [basein.getPos().x, basein.getPos().y]
        window.location.href = "data:application/x-download;charset=utf-8," + encodeURIComponent(JSON.stringify(map));
    });

    background.event(["mousedown", "touchstart"], function(e){
        if(mode === "TEST") return;
        else {
            if(e.position.x>1100) return;
            shape.push(e.position);
            layer.rem(groundv);
            groundv.setShape(shape);
            layer.add(groundv);
        }
    });

    base.event(["mousedown", "touchstart"], function(e){
        e.startDrag();
    });
    basein.event(["mousedown", "touchstart"], function(e){
        binbody.SetCenterPosition(basein.getPos())
        e.startDrag();
    })

    add.event(["mousedown", "touchstart"], function(e){
        pows.add(powersedit.length, "anti");
    });
}
goog.exportSymbol('CoolGame.start', CoolGame.start);

$(document).ready(function(){
 /*   var renderer = new THREE.WebGLRenderer({antialias:true});
    var body = document.body, html = document.documentElement;
    renderer.setSize( document.body.clientWidth, Math.max( body.scrollHeight, body.offsetHeight,
            html.clientHeight, html.scrollHeight, html.offsetHeight ) );
    document.body.appendChild(renderer.domElement);
    renderer.setClearColorHex(0x111111, 1.0);
    renderer.clear();

    var scene = new THREE.Scene;
    var camera = new THREE.PerspectiveCamera(
        35,         // Field of view
        800 / 640,  // Aspect ratio
        .1,         // Near
        10000       // Far
    );
    camera.position.set(0,0 ,10);


    var cube = function(){return new THREE.Mesh(
        new THREE.CubeGeometry(0.5,0.5,0.5),
        new THREE.MeshLambertMaterial({color:0x444444})
    )}

    scene.add(camera);

    var directionallight = new THREE.DirectionalLight(0xffffff, 1.5);
    directionallight.position.set(1, -1, 3);
    scene.add(directionallight);

*/
/*    var render = function(time){
        renderer.render(scene, camera);
        var c = emitter.getNext(time);
        if(c){
            var c = cube();

            scene.add(c);
        }
        requestAnimationFrame(render);
}

    requestAnimationFrame(render);
*/

});
