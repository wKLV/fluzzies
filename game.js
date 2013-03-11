var speed = 1, star1 = star2 = star3 = false, Step = 5;
CoolGame.start = function(){
    var map, ready = false, stop = false,
    emitter,
    scene = new Scene(document.body, 1500,1000),
    base, basein, menu = new Node,
    menubackround = new Sprite().size(100,600).fill(250, 245, 225).moveTo(1500-50, 1000/2),
    powers = [], power = true,
    layer = new Node, spikes = new Node,
    background = new Sprite().size(1500, 1000).
        moveTo(750, 500).fill("assets/fondo1.png"),
    instructions = new Sprite().size(1500,1000).moveTo(750,500).fill(0,0,0,0),
    labels = new Node,
    nballslabel = new Label("0").moveTo(90,10),
    nballs = 0, ballsSavedlabel = new Label("fluzzies saved").moveTo(160, 10),
    ntouches = 0, ntoucheslabel = new Label("0").moveTo(260,10),
    tocheslabel = new Label("touches").moveTo(290, 10),
    pass = new Sprite().size(20,20).fill("assets/door.svg").moveTo(330, 10),
    star1s = new Sprite().size(20,20).fill("assets/star.svg").moveTo(360, 10),
    star2s = new Sprite().size(20,20).fill("assets/star.svg").moveTo(390, 10),
    star3s = new Sprite().size(20,20).fill("assets/star.svg").moveTo(430, 10),
    checkStars, passed = false, play = new Sprite().fill("assets/pause.svg").size(50,50).moveTo(1360,30).event(["mousedown", "touchstart"], function(e){
       if(stop) { stop = false; play.fill("assets/pause.svg"); instructions.fill(0,0,0,0);}
       else { stop = true; play.fill("assets/play.svg");}
    }), reset, resetlabel = new Sprite().fill("assets/Reset.svg").size(50,50).moveTo(1470,30),
    timeplus = new Sprite().fill("assets/timeplus.svg").size(50,50).moveTo(1420, 30).event(["mousedown", "touchstart"], function(e){
        if(speed <4){
                    emitter.i.i = 15, speed = 4;
	            timeplus.fill("assets/timereg.svg");
	} else {
		speed = 1; timeplus.fill("assets/timeplus.svg");
	}
    });
    balls = {}, ids=0;
    labels.add(nballslabel).add(ballsSavedlabel).add(ntoucheslabel).add(tocheslabel).
        add(pass).add(star1s).add(star2s).add(star3s).add(resetlabel).add(timeplus).add(play);
    scene.add(background);
    menu.add(menubackround);
    scene.add(layer);
    scene.add(spikes);
    scene.add(menu);
    scene.add(labels);
    scene.add(instructions);
    var params = document.URL.split("?")
    $.getJSON("map"+params[1]+".js", function(data){
	if(params[1] === "0"){ 
		instructions.fill("assets/instruction0.png")
		stop = true;
		play.fill("assets/play.svg");
        }
        map = data;
        ready = true;
        emitter = new COOLYEMITTER(data.emitter);
        base = emitter.visual.moveTo(data.emitter.position[0], data.emitter.position[1]),
        basein = (new Sprite).fill("assets/in.png").size(150, 150).moveTo(data.catcher.position[0], data.catcher.position[1])
        layer.add(base);
        layer.add(basein);

        var binbodydef = new box2d.BodyDef;
        binbodydef.position.Set(data.catcher.position[0], data.catcher.position[1])
        binbodydef.AddShape(bin);
        binbodydef.userData = {name:"in", visual:basein};
        var binbody = world.CreateBody(binbodydef);
        binbodydef.userData = {name:"in", visual:basein}

        basein.event(["mousedown", "touchstart"], function(e){
            if(passed) win();
        })
        bain = basein, basein = data.catcher;
        checkStars = function(){
            if(!passed && nballs >= basein.pass.coolies && (ntouches <= basein.pass.touches || typeof basein.pass.touches === "undefined")){
                passed = true; bain.fill("assets/in-open.png"); pass.fill("assets/doorgot.svg"); 
		if(params[1] === "0"){ 
			stop= true; play.fill("assets/play.svg"); instructions.fill("assets/instruction1.png");
		}
            }if(!star1 && nballs >= basein.star1.coolies && (ntouches <= basein.star1.touches || typeof basein.star1.touches === "undefined")){
               star1s.fill("assets/stargot.svg"); star1 = true;
            }if(!star2 && nballs >= basein.star2.coolies && (ntouches <= basein.star2.touches || typeof basein.star2.touches === "undefined")){
               star2s.fill("assets/stargot.svg");star2= true;
            }if(!star3 && nballs >= basein.star3.coolies && (ntouches <= basein.star3.touches || typeof basein.star3.touches === "undefined")){
                star3s.fill("assets/stargot.svg");star3=true; win();
            }
        }
        resetlabel.event(["mousedown", "touchstart"],function(){
            $.each(balls, function(i,v){
                todelete[v.ids] = (v.physics);
            });
            emitter = new COOLYEMITTER(data.emitter);
            layer.rem(base);
            base = emitter.visual.moveTo(data.emitter.position[0], data.emitter.position[1])
            layer.add(base)
            nballs = 0, ntouches = powers.length;
            nballslabel.text(""+nballs);
            ntoucheslabel.text(""+ntouches);
	    if(stop === true){
		stop = false; play.fill("assets/pause.svg"); instructions.fill(0,0,0,0);
	    }
        });
       function createGround(v, l){
            var position= v.position;
           position = new box2d.Vec2(position.x, position.y)
            ground = new box2d.PolyDef;
            ground.restitution = .6
            ground.density = 0;
            ground.friction = 1;
            ground.SetVertices(l);
            var gbody = new box2d.BodyDef;
            gbody.position.Set(position.x, position.y);
            gbody.AddShape(ground);
            gbody.userData = {name:"ground"}
            world.CreateBody(gbody);

       }
        $.each(data.grounds, function(i,v){
            if(v.shape){
                var shape = v.shape, position= v.position, l = [];
                $.each(shape, function(i,v){
                    l.push([shape[i].x, shape[i].y])
                    shape[i] = new goog.math.Coordinate(shape[i].x, shape[i].y)
                });

                createGround(v, l);
                var shape = v.shape, position= v.position, l = [];
                var vis = new Polygon(shape).fill("assets/Metal.png").stroke(3, 'rgb(0,0,0)').moveTo(position.x, position.y);
                layer.add(vis);
            }
            else if(v.megashape){
                $.each(v.megashape, function(i,v){
                    var shape = v.shape, position= v.position, l = [];
                    $.each(shape, function(i,v){
                        l.push([shape[i].x, shape[i].y])
                        shape[i] = new goog.math.Coordinate(shape[i].x, shape[i].y)
                     });

                     if(v.visual){
                        var vis = new Polygon(v.shape).fill("assets/Metal.png").stroke(3, 'rgb(0,0,0)').
                            moveTo(position.x, position.y);
                        layer.add(vis);
                    }
                    else if(v.shape)
                        createGround(v, l);
                });
            }
        });
    $.each(data.spikes, function(i,v){
        var sprite = new Sprite().size(260, 100).fill("assets/Pinchos2.svg").moveTo(v.position.x, v.position.y);

        var spiks = new box2d.PolyDef;
        spiks.restitution = .6
        spiks.density = 0;
        spiks.friction = 1;
        spiks.SetVertices([[-130,50],[-130,-50],[130,-50],[130,50]]);

        var sbodyDef = new box2d.BodyDef;
        sbodyDef.position.Set(v.position.x, v.position.y);
        sbodyDef.AddShape(spiks);

        sbodyDef.userData = {name:"spikes"};
i
        var spikes_body = world.CreateBody(sbodyDef);

        spikes.add(sprite);
    });
        $.each(data.powers, function(i,v){
            var s = (new Sprite).size(75,75).fill("assets/"+v+".svg").
                moveTo(1500-50, 1000/2+95*i-235);
            menu.add(s);
            var layer = new Node;
            if(v === "anti"){
                var antisprite = new Sprite().size(100,100).fill("assets/anti.svg"),
                antifield = new Circle().size(300,300).fill(107, 67, 151, 0.1),
                antifield2 = new Circle().size(300,300).fill(107,67,151, 0.1).scale(0.5,0.5);
                layer.add(antifield).add(antifield2).add(antisprite);
            }
	    else if(v==="atra"){
                var antisprite = new Sprite().size(100,100).fill("assets/atra.svg");
                antifield = new Circle().size(300,300).fill(107, 67, 151, 0.1),
                antifield2 = new Circle().size(300,300).fill(107,67,151, 0.1).scale(0.5,0.5);
                layer.add(antifield).add(antifield2).add(antisprite);
            }
        else if(v=="accele"){
            var rotateSprite = new Sprite().size(100,100).fill("assets/accele.svg");
            var rotateField = new Circle().size(330,270).fill(10,250,20, 0.2);
            layer.add(rotateField).add(rotateSprite);
        }
        layer.event(["mousedown", "touchstart"], function(e){
            e.startDrag();
            ntouches ++;
            ntoucheslabel.text(""+ntouches).scale(2,2);
            setTimeout(function(){
                ntoucheslabel.scale(1.5,1.5);
            }, 3000);

        });
        s.event(["mousedown", "touchstart"], function(e){
            power = {visual:layer, power:v};
            scene.add(layer);
            layer.moveTo(s.getPos().x+e.position.x, s.getPos().y+e.position.y);
            powers.push({power:v, visual:layer, updateEffects:function(dt){
            if(v === "anti"){
                var r = antisprite.rotation();
                antisprite.rotation(r+dt/10)
                var r = antifield.scale().x;

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
                var r = antisprite.rotation();
                antisprite.rotation(r-dt/10)
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
            else if(v==="accele"){
                var r = rotateSprite.rotation();
                var p = rotateField.rotation();
                rotateSprite.rotation(r-dt)
                rotateField.rotation(r-dt/10);
            }
                }});
                menu.rem(s);
            })
        });
    })

    var gravity = new box2d.Vec2(0, 100);
    var bounds = new box2d.AABB();
    bounds.minVertex.Set(-document.body.clientWidth, -document.body.clientHeight);
    bounds.maxVertex.Set(2*document.body.clientWidth,2*document.body.clientHeight);
    var world = new box2d.World(bounds, gravity, false);


    var normalDef = new box2d.CircleDef;
    normalDef.radius = 15;
    normalDef.density = 0.5;
    normalDef.restitution = 0.2;
    normalDef.friction = 1;

    var heavyDef = new box2d.CircleDef;
    heavyDef.radius = 15;
    heavyDef.density = 4;
    heavyDef.restitution = 0.1;
    heavyDef.friction = 0.7;


    var bin = new box2d.PolyDef;
    bin.density = 0;
    bin.SetVertices([[-75,75],[-75,-75],[75,-75],[75,75]])

    scene.substitute(scene.scene);
    var listener = {}, todelete = {}, ntodelete = {};
    listener.PreSolve = function(a,b){
        if(a.GetUserData().name === "cooly" && ! deleted[a.GetUserData().id]){
            if(b.GetUserData().name === "spikes")
                return a;
            else if(b.GetUserData().name === "in"){
                    b.GetUserData().visual.fill("assets/in-open.png")
                    setTimeout(function(){ if(!passed)b.GetUserData().visual.fill("assets/in.png")}, 1500);

                nballs ++;
                nballslabel.text(""+nballs).scale(2,2);
                setTimeout(function(){
                    nballslabel.scale(1.5,1.5);
                }, 1500);
                checkStars();
                return a;
            }
        }
        else if(b.GetUserData().name === "cooly" && ! deleted[b.GetUserData().id])
            if(a.GetUserData().name === "spikes")
                return b;
            else if(a.GetUserData().name === "in"){
                nballs ++;
                nballslabel.text(""+nballs).scale(2,2);
                setTimeout(function(){
                    nballslabel.scale(1.5,1.5);
                }, 1500);
                checkStars();
                    a.GetUserData().visual.fill("assets/in-open.png")
                    setTimeout(function(){if(!passed)a.GetUserData().visual.fill("assets/in.png")}, 500);

                return b;
            }
    }
    var step = Step, deleted = {};
    lime.scheduleManager.schedule(function(dt) {if(ready && !stop){
        $.each(todelete, function(i,a){
            var v = balls[a.GetUserData().id]
            function reduce(){
                var s = v.visual.scale().x;
                var r = v.visual.rotation()
                v.visual.rotation(r+ dt/s)
                v.visual.scale(s-0.1, s-0.1)
                if(s > 0.1) setTimeout(reduce, 50);
                else {layer.rem(v.visual);
                    delete balls[v.ids];
                }
            }
            world.DestroyBody(a);
            reduce();
            //layer.rem(a.GetUserData().visual);
        });
        todelete = {};
        var steps = Math.floor(dt / Step * speed)
        for(var i=0; i< steps; i++){
            $.each(powers, function(i,p){
                $.each(balls, function(i,v){

                    var d = v.physics.GetCenterPosition().Copy().subtract(p.visual.getPos());
                    var dlength = d.Normalize()
                    if(dlength<5)
                        dlength = 5;
                    if(p.power === "anti" && dlength < 150){
                        if(box2d.Vec2.cross(v.physics.GetLinearVelocity(),new box2d.Vec2(0,1)) === 0)
                            v.physics.ApplyTorque(1);
                        v.physics.ApplyImpulse(box2d.Vec2.multiplyScalar(1280*step, d), p.visual.getPos());
                    }
                    if(dlength <30) dlength = 30
                    else if(p.power === "atra" && dlength <150){
                        if(box2d.Vec2.cross(v.physics.GetLinearVelocity(),new box2d.Vec2(0,1)) === 0)
                            v.physics.ApplyTorque(10);
                        v.physics.ApplyImpulse(box2d.Vec2.multiplyScalar(-1280*step, d), p.visual.getPos());
                    }
                    else if(p.power === "accele" && dlength <150)
                        v.physics.ApplyTorque(2000000*step)
            });
                p.updateEffects(step);
            })
            world.Step(step/1000, 8);
 	    var c = emitter.getNext();
	    if (c.none){}
            else if(c.end){
		if(params[1]==="0" && !passed){ stop=true; play.fill("assets/play.svg"); instructions.fill("assets/instruction2.png");}
	    }
	   else if(c){
                emitter.visual.fill("assets/in-open.png")
                setTimeout(function(){emitter.visual.fill("assets/in.png")}, 1500);
                ids ++;
                var hab = c.hability;
                switch(c.hability){
                    case "none": ballDef = normalDef; break
                    case "heavy": ballDef = heavyDef; break;
                }
                var c = c.createVisual().moveTo(emitter.position[0], emitter.position[1]);
                var ballDef;
                var v = new box2d.BodyDef;
                v.userData = {name:"cooly", visual:c,hab:hab, id:ids};
                v.position.Set(emitter.position[0], emitter.position[1]);
                v.angularDamping = 0;
                v.id = ids;
                v.AddShape(ballDef);
                v = world.CreateBody(v);
                balls[ids] = {visual:c, physics:v, hab:hab, ids:ids};
                layer.add(c);
            }
            }
            $.each(balls, function(i,v){
                if(Math.abs(v.physics.GetAngularVelocity())>10)
                    if(Math.abs(v.physics.GetLinearVelocity().magnitude() > 100) && v.physics.GetContactList())
                        v.visual.fill("assets/pelusa"+v.hab+"eyesmouth.png")
                    else
                        if(v.visual.fill() === "assets/pelusa"+v.hab+"eyesmouth.png" || v.visual.fill() === "assets/pelusa"+v.hab+"mouth.png")
                            setTimeout(function(){v.visual.fill("assets/pelusa"+v.hab+"eyes.png");},1000);
                        else
                            v.visual.fill("assets/pelusa"+v.hab+"eyes.png")
                else
                    if(Math.abs(v.physics.GetLinearVelocity().magnitude()) > 100 && v.physics.GetContactList())
                        v.visual.fill("assets/pelusa"+v.hab+"mouth.png")
                    else
                        if(v.visual.fill() === "assets/pelusa"+v.hab+"mouth.png" || v.visual.fill() == "assets/pelusa"+v.hab+"yesmouth.png")
                            setTimeout(function(){v.visual.fill("assets/pelusa"+v.hab+".png");},1000);
                        else
                            v.visual.fill("assets/pelusa"+v.hab+".png")


                var pos = v.physics.GetCenterPosition().clone();
                var rot = v.physics.GetRotation();

                v.visual.rotation(-rot/Math.PI*180);
                v.visual.moveTo(pos.x, pos.y);
            });
           
            for(var c=world.GetContactList(); c; c = c.GetNext()){
                var a = listener.PreSolve(c.getBodies()[0], c.getBodies()[1])
                if(a) if(!deleted[a.GetUserData().id]) todelete[a.GetUserData().id] = a, deleted[a.GetUserData().id]=true;
            }
              //  todelete;
              //  ntodelete = {};
        }
     },this);

     background.event(["mousedown", "touchstart"], function(e){
       /* if(power){
            power.visual.moveTo(e.position.x, e.position.y);
            ntouches ++;
            ntoucheslabel.text(""+ntouches).scale(2,2);
            setTimeout(function(){
                ntoucheslabel.scale(1.5,1.5);
            }, 3000);

        }*/
       console.log(e.screenPosition)
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

