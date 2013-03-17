goog.require('box2d.BodyDef');
goog.require('box2d.BoxDef');
goog.require('box2d.CircleDef');
goog.require('box2d.CircleShape');
goog.require('box2d.PolyDef');
goog.require('box2d.Vec2');
goog.require('box2d.World');

var muu;
window.onload = function(){
muu = new muu2d() ,speed = 1, star1 = star2 = star3 = false, Step = 5;
muu.addAtlas("assets/graphics.png", "assets/graphics.js");
var staticroot = muu.addCanvas("static", false);
var dinroot = muu.addCanvas("dinamic", true);
muu.whenReady(function(){
    var map, ready = false, stop = false,
    emitter, ground = new Layer,
    base, basein, menu = new Layer,
    menubackround = new Rect().size(100,600).fill("rgb(250, 245, 225)").moveTo(1400, 200),
    powers = [], power = true, pows = new Layer,
    layer = new Layer, spikes = new Layer,
   // background = new Rect().size(1500, 1000).
     //   moveTo(750, 500).fill("assets/fondo1.png"),
    instructions = $("#instructions"),
    labels = new Layer,
    nballslabel = new Label("0").moveTo(90,10).stroke("rgba(0,0,0,0)"),
    nballs = 0, ballsSavedlabel = new Label("fluzzies saved").moveTo(130, 10).stroke("rgba(0,0,0,0)"),
    ntouches = 0, ntoucheslabel = new Label("0").moveTo(220,10).stroke("rgba(0,0,0,0)"),
    tocheslabel = new Label("touches").moveTo(250, 10).stroke("rgba(0,0,0,0)"),
    pass = new Sprite("door").size(20,20).moveTo(330, 10),
    star1s = new Sprite("star").size(20,20).moveTo(360, 10),
    star2s = new Sprite("star").size(20,20).moveTo(390, 10),
    star3s = new Sprite("star").size(20,20).moveTo(430, 10),
    checkStars, passed = false,
    play = new Sprite("pause").size(50,50).moveTo(1360,30),
    reset, resetlabel = new Sprite("Reset").size(50,50).moveTo(1470,30),
    timeplus = new Sprite("timeplus").size(50,50).moveTo(1420, 30)
    play.event(["mousedown"], function(e){
       if(stop) { stop = false; play.change("pause"); instructions.hide(); }
       else { stop = true; play.change("play");}
    })
    timeplus.event(["mousedown"], function(e){
        if(speed <4){
            emitter.i.i = 15, speed = 4;
            timeplus.change("timereg");
        } else {
        speed = 1; timeplus.change("timeplus");
        }
    });

    balls = {}, ids=0;
    labels.add(nballslabel).add(ballsSavedlabel).add(ntoucheslabel).add(tocheslabel).
        add(pass).add(star1s).add(star2s).add(star3s).add(resetlabel).add(timeplus).add(play);
   // scene.add(background);
    menu.add(menubackround);
    staticroot.add(menu).add(ground).add(labels);
    dinroot.add(spikes).add(layer).add(pows);
    var params = document.URL.split("?")
    $.getJSON("map"+params[1]+".js", function(data){
        if(params[1] === "0"){
            instructions.show().css("background-image", "url(assets/instruction0.png)");
            stop = true;
            play.change("play");
        }
        map = data;
        ready = true;
        emitter = new COOLYEMITTER(data.emitter);
        base = emitter.visual.moveTo(data.emitter.position[0], data.emitter.position[1]),
        basein = new Sprite("in").size(150, 150).moveTo(data.catcher.position[0], data.catcher.position[1])
        layer.add(base).add(basein);

        var binbodydef = new box2d.BodyDef;
        binbodydef.position.Set(data.catcher.position[0], data.catcher.position[1])
        binbodydef.AddShape(bin);
        binbodydef.userData = {name:"in", visual:basein};
        var binbody = world.CreateBody(binbodydef);
        binbodydef.userData = {name:"in", visual:basein}

        basein.event(["mousedown"], function(e){
            if(passed) win();
        })
        bain = basein, basin = data.catcher;
        checkStars = function(){
            if(!passed && nballs >= basin.pass.coolies && (ntouches <= basin.pass.touches || typeof basin.pass.touches === "undefined")){
                passed = true; basein.change("in-open"); pass.change("doorgot");
                if(params[1] === "0"){
                    stop= true; play.change("play"); instructions.css("background-image", "url(assets/instruction1.png)").show();
                }
            }if(!star1 && nballs >= basin.star1.coolies && (ntouches <= basin.star1.touches || typeof basin.star1.touches === "undefined")){
               star1s.change("stargot"); star1 = true;
            }if(!star2 && nballs >= basin.star2.coolies && (ntouches <= basin.star2.touches || typeof basin.star2.touches === "undefined")){
               star2s.change("stargot");star2= true;
            }if(!star3 && nballs >= basin.star3.coolies && (ntouches <= basin.star3.touches || typeof basin.star3.touches === "undefined")){
                star3s.change("stargot");star3=true; win();
            }
        }
        resetlabel.event(["mousedown"],function(){
            $.each(balls, function(i,v){
                todelete[v.ids] = v.physics;
            });
            emitter = new COOLYEMITTER(data.emitter);
            layer.rem(base);
            base = emitter.visual.moveTo(data.emitter.position[0], data.emitter.position[1])
            layer.add(base)
            nballs = 0, ntouches = powers.length;
            nballslabel.text(""+nballs);
            ntoucheslabel.text(""+ntouches);
            if(stop === true){
                stop = false; play.change("pause"); instructions.hide();
            }
        });
       function createGround(v, l){
            var position= v.position;
           position = new box2d.Vec2(position.x, position.y)
            var ground = new box2d.PolyDef;
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
        var img = new Image();
        img.onload = function(){
            var texture = staticroot.context.createPattern(img, "repeat")
            $.each(data.grounds, function(i,v){
                if(v.shape){
                    var shape = v.shape, position= v.position, l = [];
                    $.each(shape, function(i,v){
                        l.push([shape[i].x, shape[i].y])
                        shape[i] = new v2(shape[i].x, shape[i].y)
                    });

                    createGround(v, l);
                    var shape = v.shape, position= v.position, l = [];
                    var vis = new Polygon(shape).fill(texture).stroke(3, 'rgb(0,0,0)').moveTo(position.x, position.y);
                    ground.add(vis);
                }
                else if(v.megashape){
                    $.each(v.megashape, function(i,v){
                        var shape = v.shape, position= v.position, l = [];
                        $.each(shape, function(i,v){
                            l.push([shape[i].x, shape[i].y])
                            shape[i] = new v2(shape[i].x, shape[i].y)
                         });

                         if(v.visual){
                            var vis = new Polygon(v.shape).fill(texture).stroke(3, 'rgb(0,0,0)').
                            moveTo(position.x, position.y);
                            ground.add(vis);
                        }
                        else if(v.shape)
                            createGround(v, l);
                    });
                }
                  });
            staticroot.render();
        }
        img.src = "assets/Metal.png"
        $.each(data.spikes, function(i,v){
            var sprite = new Sprite("Pinchos2").size(260, 100).moveTo(v.position.x, v.position.y);

            var spiks = new box2d.PolyDef;
            spiks.restitution = .6
            spiks.density = 0;
            spiks.friction = 1;
            spiks.SetVertices([[-130,50],[-130,-50],[130,-50],[130,50]]);

            var sbodyDef = new box2d.BodyDef;
            sbodyDef.position.Set(v.position.x, v.position.y);
            sbodyDef.AddShape(spiks);

            sbodyDef.userData = {name:"spikes"};

            var spikes_body = world.CreateBody(sbodyDef);

            spikes.add(sprite);
        });
        $.each(data.powers, function(i,v){
            var s = new Sprite(v).size(75,75).
                moveTo(1500-50, 250+95*i);
            menu.add(s);
            var layer = new Layer;
            if(v === "anti"){
                var antisprite = s,
                antifield = new Circle().radius(150).fill("rgba(243, 222, 83, 0.1)").stroke("rgba(0,0,0,0)"),
                antifield2 = new Circle().radius(150).fill("rgba(243, 222, 83, 0.1)").stroke("rgba(0,0,0,0)").scale(0.5,0.5);
                layer.add(antifield).add(antifield2)
            }
            else if(v==="atra"){
                var antisprite = s;
                antifield = new Circle().radius(150).fill("rgba(107, 67, 151, 0.1)").stroke("rgba(0,0,0,0)"),
                antifield2 = new Circle().radius(150).fill("rgba(107,67,151, 0.1)").stroke("rgba(0,0,0,0)").scale(0.5,0.5);
                layer.add(antifield).add(antifield2)
            }
            else if(v=="accele"){
                var rotateSprite = s;
                var rotateField = new Circle().radius(300).fill("rgba(10,250,20, 0.2)");
                layer.add(rotateField);
            }
            layer.event(["mousedown"], function(e){
                layer.follow(muu.getMouse());
                ntouches ++;
                ntoucheslabel.text(""+ntouches).scale(2,2); staticroot.render();
                setTimeout(function(){
                    ntoucheslabel.scale(1.5,1.5); staticroot.render();
                }, 3000);

            }, s.region());
            s.event(["mousedown"], function(e){
                menu.rem(s);
                staticroot.render();
                s.size(100,100).moveTo(0,0);
                layer.add(s);
                power = {visual:layer, power:v};
                pows.add(layer);
                layer.follow(muu.getMouse());
                powers.push({power:v, visual:layer, updateEffects:function(dt){
                if(v === "anti"){
                    var r = antisprite.rotation();
                    antisprite.rotation(r-dt/480)
                    r = antifield.scale();
                    r += dt/800;
                    r %= 1;
                    if(r===0) r= 0.0001
                    antifield.scale(r);
                    var p = antifield2.scale();
                    p += dt/80;
                    p %= 1;
                    if(p===0) p=0.0001
                    antifield2.scale(p);
                }
                else if(v ==="atra"){
                    var r = antisprite.rotation();
                    antisprite.rotation(r-dt/480)
                    r = antifield.scale();
                    r = -r +1
                    r += dt/800;
                    r %= 1;
                    antifield.scale(1-r,1-r);
                    var p = antifield2.scale();
                    p = -p +1
                    p += dt/800;
                    p %= 1;
                    antifield2.scale(1-p,1-p);
                }
                else if(v==="accele"){
                    rotateSprite.size(100,100)
                    var r = rotateSprite.rotation();
                    var p = rotateField.rotation();
                    rotateSprite.rotation(r-dt)
                    rotateField.rotation(r-dt/10);
                }
             }});
             s.clearEvent("mousedown");
             s.event(["mousedown"], function(e){
                layer.follow(muu.getMouse());
             });
                s.event(["mouseup"], function(){layer.unfollow()});

        })

        });
        muu.renderAll();
        requestAnimationFrame(render);
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

    var listener = {}, todelete = {}, ntodelete = {};
    listener.PreSolve = function(a,b){
        if(a.GetUserData().name === "cooly" && ! deleted[a.GetUserData().id]){
            if(b.GetUserData().name === "spikes")
                return a;
            else if(b.GetUserData().name === "in"){
                    b.GetUserData().visual.change("in-open")
                    setTimeout(function(){ if(!passed)b.GetUserData().visual.change("in")}, 1500);

                nballs ++;
                nballslabel.text(""+nballs).scale(2,2);
                setTimeout(function(){
                    nballslabel.scale(1.5,1.5); staticroot.render();
                }, 1500);
                staticroot.render();
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
                    nballslabel.scale(1.5,1.5);staticroot.render();
                }, 1500);
                staticroot.render();
                checkStars();
                    a.GetUserData().visual.change("in-open")
                    setTimeout(function(){if(!passed)a.GetUserData().visual.change("in")}, 500);

                return b;
            }
    }
    var step = Step, deleted = {};
    function render(dt) {
    if(ready && !stop){
        dt /= 500;
        var steps = Math.floor(dt / Step * speed)
        for(var i=0; i< steps; i++){
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
                p.updateEffects(step/2);
            })
            world.Step(step/1000, 8);
 	    var c = emitter.getNext();
	    if (c.none){}
            else if(c.end){
		        if(params[1]==="0" && !passed){
                    stop=true; play.change("play");
                    instructions.css("background-image", "url(assets/instruction2.png)").show();
                }
	    }
	   else if(c){
                emitter.visual.change("in-open")
                setTimeout(function(){emitter.visual.change("in")}, 1500);
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
                        v.visual.change("pelusa"+v.hab+"eyesmouth")
                    else
                        if(v.visual.sprite() === "pelusa"+v.hab+"eyesmouth" || v.visual.sprite() === "pelusa"+v.hab+"mouth")
                            setTimeout(function(){v.visual.change("pelusa"+v.hab+"eyes");},1000);
                        else
                            v.visual.change("pelusa"+v.hab+"eyes")
                else
                    if(Math.abs(v.physics.GetLinearVelocity().magnitude()) > 100 && v.physics.GetContactList())
                        v.visual.change("pelusa"+v.hab+"mouth")
                    else
                        if(v.visual.sprite() === "pelusa"+v.hab+"mouth" || v.visual.sprite() == "pelusa"+v.hab+"yesmouth")
                            setTimeout(function(){v.visual.change("pelusa"+v.hab);},1000);
                        else
                            v.visual.change("pelusa"+v.hab)


                var pos = v.physics.GetCenterPosition().clone();
                var rot = v.physics.GetRotation();

                v.visual.rotation(rot);
                v.visual.moveTo(pos.x, pos.y);
            });
            for(var c=world.GetContactList(); c; c = c.GetNext()){
                var a = listener.PreSolve(c.getBodies()[0], c.getBodies()[1])
                if(a) if(!deleted[a.GetUserData().id]) todelete[a.GetUserData().id] = a, deleted[a.GetUserData().id]=true;
            }
              //  todelete;
              //  ntodelete = {};
        }
        muu.render();
        requestAnimationFrame(render);
     }

     //background.event(rRect(["mousedown", "touchstart"], function(e){
       /* if(power){
            power.visual.moveTo(e.position.x, e.position.y);
            ntouches ++;
            ntoucheslabel.text(""+ntouches).scale(2,2);
            setTimeout(function(){
                ntoucheslabel.scale(1.5,1.5);
            }, 3000);

        }*/
      // console.log(e.screenPosition)
    //});
});
}
//goog.exportSymbol('CoolGame.start', CoolGame.start);

//$(document).ready(function(){
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

//});

