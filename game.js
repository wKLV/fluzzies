(function() {
  var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
                              window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
  window.requestAnimationFrame = requestAnimationFrame;
})();

var   b2Vec2 = Box2D.Common.Math.b2Vec2
            ,   b2 = Box2D.Common.Math
            ,   b2BodyDef = Box2D.Dynamics.b2BodyDef
            ,   b2Body = Box2D.Dynamics.b2Body
            ,   b2FixtureDef = Box2D.Dynamics.b2FixtureDef
            ,   b2Fixture = Box2D.Dynamics.b2Fixture
            ,   b2World = Box2D.Dynamics.b2World
            ,   b2MassData = Box2D.Collision.Shapes.b2MassData
            ,   b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape
            ,   b2CircleShape = Box2D.Collision.Shapes.b2CircleShape
            ;

window.onload = function(){
var speed = 1, Step = 10; //Speed changes how many steps are processed in real time. Step is the length of each Step
var star1 = star2 = star3 = false // We start without stars :(
// Add stuff
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
    play = new Sprite("pause").size(70,70).moveTo(1260,60),
    reset, resetlabel = new Sprite("Reset").size(70,70).moveTo(1440,60),
    timeplus = new Sprite("timeplus").size(70,70).moveTo(1350, 60)
    play.event(["mousedown"], function(e){
       if(stop) { stop = false; play.change("pause"); instructions.hide(); lastTime = 0;}
       else { stop = true; play.change("play"); lastTime = 0;}
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

    // Layers organization in fluzzies
    staticroot.add(menu).add(ground).add(labels);
    dinroot.add(spikes).add(layer).add(pows);

    // Box2D stuff
    var world = new b2World(new b2Vec2(0, 50), false);

    var normalDef = new b2FixtureDef;
    normalDef.density = 0.5;
    normalDef.restitution = 0.2;
    normalDef.friction = 1;

    var heavyDef = new b2FixtureDef;
    heavyDef.density = 4;
    heavyDef.restitution = 0.6;
    heavyDef.friction = 0.7;

    var normalball = new b2CircleShape(15);

    // To get what level are we in
    var params = document.URL.split("?")
    if(params[1]!== "11")
    $.getJSON("map"+params[1]+".js", function(data){
        // If in level 0 tutorial
        if(params[1] === "0"){
            instructions.show().css("background-image", "url(assets/instruction0.png)");
            stop = true; lastTime = 0;
            play.change("play");
        }
        map = data;
        ready = true;
        emitter = new COOLYEMITTER(data.emitter);
        base = emitter.visual.moveTo(data.emitter.position[0], data.emitter.position[1]),
        basein = new Sprite("in").size(150, 150).moveTo(data.catcher.position[0], data.catcher.position[1])
        layer.add(base).add(basein);

        var binbodydef = new b2BodyDef;
        var binfix = new b2FixtureDef;
        binbodydef.position.Set(data.catcher.position[0], data.catcher.position[1])
        binfix.shape = new b2PolygonShape;
        binfix.shape.SetAsBox(75,75)

        binbodydef.userData = {name:"in", visual:basein};
        var binbody = world.CreateBody(binbodydef);
        binbody.CreateFixture(binfix);

        basein.event(["mousedown"], function(e){
            if(passed) win();
        })
        bain = basein, basin = data.catcher;
        // function to check if we have won a star or pass to the next level
        checkStars = function(){
            if(!passed && nballs >= basin.pass.coolies && (ntouches <= basin.pass.touches || typeof basin.pass.touches === "undefined")){
                passed = true; basein.change("in-open"); pass.change("doorgot");
                if(params[1] === "0"){
                    stop= true; play.change("play"); instructions.css("background-image", "url(assets/instruction1.png)").show(); lastTime = 0;
                }
            }if(!star1 && nballs >= basin.star1.coolies && (ntouches <= basin.star1.touches || typeof basin.star1.touches === "undefined")){
               star1s.change("stargot"); star1 = true;
            }if(!star2 && nballs >= basin.star2.coolies && (ntouches <= basin.star2.touches || typeof basin.star2.touches === "undefined")){
               star2s.change("stargot");star2= true;
            }if(!star3 && nballs >= basin.star3.coolies && (ntouches <= basin.star3.touches || typeof basin.star3.touches === "undefined")){
                star3s.change("stargot");star3=true; win();
            }
        }
        // To reset the level
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
           position = new b2Vec2(position.x, position.y)
            var ground = new b2PolygonShape;
            ground.SetAsArray(l, l.length);
            var gbody = new b2BodyDef;
            gbody.position.Set(position.x, position.y);
            gbody.userData = {name:"ground"}
            var gfix = new b2FixtureDef;
            gfix.restitution = .6
            gfix.density = 0;
            gfix.friction = 1;
            gfix.shape = ground;
            world.CreateBody(gbody).CreateFixture(gfix);
       }
        var img = new Image();
        img.onload = function(){
            var texture = staticroot.context.createPattern(img, "repeat")
            $.each(data.grounds, function(i,v){
                if(v.shape){
                    var shape = v.shape, position= v.position, l = [];
                    $.each(shape, function(i,v){
                        l.push(new b2Vec2(shape[i].x, shape[i].y))
                        shape[i] = new v2(shape[i].x, shape[i].y)
                    });

                    createGround(v, l);
                    var shape = v.shape, position= v.position, l = [];
                    var vis = new Polygon(shape).fill(texture).stroke('rgb(0,0,0)').moveTo(position.x, position.y);
                    ground.add(vis);
                }
                else if(v.megashape){
                    $.each(v.megashape, function(i,v){
                        var shape = v.shape, position= v.position, l = [];
                        $.each(shape, function(i,v){
                            l.push(new b2Vec2(shape[i].x, shape[i].y))
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

            var spiks = new b2PolygonShape;
            spiks.restitution = .6
            spiks.density = 0;
            spiks.friction = 1;
            spiks.SetAsBox(130,50);

            var sbodyDef = new b2BodyDef;
            sbodyDef.position.Set(v.position.x, v.position.y);
            var sfix = new b2FixtureDef;
            sfix.density = 0;
            sfix.restitution = 0.1;
            sfix.friction = 10;
            sfix.shape = spiks;

            sbodyDef.userData = {name:"spikes"};

            var spikes_body = world.CreateBody(sbodyDef);
            spikes_body.CreateFixture(sfix);

            spikes.add(sprite);
        });
        $.each(data.powers, function(i,v){
            // The sprite in the menu
            var s = new Sprite(v).size(75,75).moveTo(1500-50, 250+95*i);
            menu.add(s);
            // the layer of the power with its effects
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
                var rotateField = new Circle().radius(150).stroke("rgba(0,0,0,0)").fill("rgba(10,250,20, 0.2)");
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
    else{
        function updateBlinks(){}
        var renderSuccess = function(){
            updateBlinks()
            $.each(balls, function(i,v){
            if(Math.abs(v.physics.GetAngularVelocity())>10)
                if(Math.abs(v.physics.GetLinearVelocity().Length() > 100) && v.physics.GetContactList())
                    v.visual.change("pelusa"+v.hab+"eyesmouth")
                else
                    if(v.visual.sprite() === "pelusa"+v.hab+"eyesmouth" || v.visual.sprite() === "pelusa"+v.hab+"mouth")
                        setTimeout(function(){v.visual.change("pelusa"+v.hab+"eyes");},1000);
                    else
                        v.visual.change("pelusa"+v.hab+"eyes")
            else
                if(Math.abs(v.physics.GetLinearVelocity().Length()) > 100 && v.physics.GetContactList())
                    v.visual.change("pelusa"+v.hab+"mouth")
                else
                    if(v.visual.sprite() === "pelusa"+v.hab+"mouth" || v.visual.sprite() == "pelusa"+v.hab+"yesmouth")
                        setTimeout(function(){v.visual.change("pelusa"+v.hab);},1000);
                    else
                        v.visual.change("pelusa"+v.hab)


            var pos = v.physics.GetWorldCenter().Copy();
            var rot = v.physics.GetAngle();

            v.visual.rotation(rot);
            v.visual.moveTo(pos.x, pos.y);
        });

            muu.render()
            world.Step(1/70, 8)
            requestAnimationFrame(renderSuccess);
        }
        for(var i =0; i< 100; i++){
                ids ++;
            var pos = new v2(Math.random()*1400, Math.random()*900)
            var c = new COOLY({hability:"heavy"}).createVisual().moveTo(pos.x, pos.y);
                var v = new b2BodyDef;
                v.type = b2Body.b2_staticBody;
                v.position.Set(pos.x, pos.y);
                v.userData = {name:"cooly", visual:c, id:ids, hab:"heavy"};
                v.angularDamping = 0;
                heavyDef.id = ids;
                heavyDef.shape = normalball;
                v = world.CreateBody(v)
                v.CreateFixture(heavyDef);
                balls[ids] = {visual:c, physics:v,ids:ids, hab:"heavy"};
                layer.add(c);
        }
        for(var i=0; i<30; i++){
                ids ++;
            var pos = new v2(Math.random()*1400, Math.random()*900)
            var c = new COOLY().createVisual().moveTo(pos.x, pos.y);
                var v = new b2BodyDef;
                v.type = b2Body.b2_dynamicBody;
                v.position.Set(pos.x, pos.y);
                v.userData = {name:"cooly", visual:c, id:ids, hab:"none"};
                v.angularDamping = 0;
                normalDef.id = ids;
                normalDef.shape = normalball;
                v = world.CreateBody(v)
                v.CreateFixture(normalDef);
                balls[ids] = {visual:c, physics:v, ids:ids, hab:"none"};
                layer.add(c);
        }
        for(var i=0; i<10; i++){
            ids++;
            var pos = new v2(Math.random()*1400, Math.random()*900)
            var c = new COOLY({hability:"heavy"}).createVisual().moveTo(pos.x, pos.y);
                var v = new b2BodyDef;
                v.type = b2Body.b2_dynamicBody;
                v.position.Set(pos.x, pos.y);
                v.userData = {name:"cooly", visual:c, id:ids, hab:"heavy"};
                v.angularDamping = 0;
                heavyDef.id = ids;
                heavyDef.shape = normalball;
                v = world.CreateBody(v)
                v.CreateFixture(heavyDef);
                balls[ids] = {visual:c, physics:v, ids:ids, hab:"heavy"};
                layer.add(c);
        }
        pows.add(new Label("CONGRATULATIONS").moveTo(600, 400).scale(3));
        pows.add(new Label("this is only a basic version of what this game will become").moveTo(470, 430).scale(2.5));
        pows.add(new Label("if you liked it stay tuned for more!").moveTo(570, 460).scale(2.75));
        requestAnimationFrame(renderSuccess);
    }


    var listener = {}, todelete = {}, ntodelete = {};
    listener.PreSolve = function(contact){
        var a = contact.m_fixtureA.m_body, b = contact.m_fixtureB.m_body;
        if(a.GetUserData().name === "cooly" && ! deleted[a.GetUserData().id]){
            if(b.GetUserData().name === "spikes"){
                if(!deleted[a.GetUserData().id]) todelete[a.GetUserData().id] = a, deleted[a.GetUserData().id]=true;
            } else if(b.GetUserData().name === "in"){
                    b.GetUserData().visual.change("in-open")
                    setTimeout(function(){ if(!passed)b.GetUserData().visual.change("in")}, 1500);
                nballs ++;
                nballslabel.text(""+nballs).scale(2);
                setTimeout(function(){
                    nballslabel.scale(1.5,1.5); staticroot.render();
                }, 1500);
                staticroot.render();
                checkStars();
                if(!deleted[a.GetUserData().id]) todelete[a.GetUserData().id] = a, deleted[a.GetUserData().id]=true;
            }
        }
        else if(b.GetUserData().name === "cooly" && ! deleted[b.GetUserData().id])
            if(a.GetUserData().name === "spikes"){
                if(!deleted[b.GetUserData().id]) todelete[b.GetUserData().id] = b, deleted[b.GetUserData().id]=true;
            } else if(a.GetUserData().name === "in"){
                nballs ++;
                nballslabel.text(""+nballs).scale(2);
                setTimeout(function(){
                    nballslabel.scale(1.5,1.5);staticroot.render();
                }, 1500);
                staticroot.render();
                checkStars();
                    a.GetUserData().visual.change("in-open")
                    setTimeout(function(){if(!passed)a.GetUserData().visual.change("in")}, 500);
                if(!deleted[b.GetUserData().id]) todelete[b.GetUserData().id] = b, deleted[b.GetUserData().id]=true;
            }
    }
    var lis = new Box2D.Dynamics.b2ContactListener;
    lis.PreSolve = listener.PreSolve;
    world.SetContactListener(lis);

    var step = Step, deleted = {}, lastTime = 0;
    function render(dt) {
    if(ready && !stop){
        if(lastTime === 0) lastTime = dt;
        var t = lastTime;
        lastTime = dt, dt -= t;
        var steps = Math.floor(dt / step * speed *2)
        for(var i=0; i< steps; i++){
            $.each(todelete, function(i,a){
                var v = balls[a.GetUserData().id]
                function reduce(){
                    var s = v.visual.scale();
                    var r = v.visual.rotation()
                    r %= Math.PI*2
                    v.visual.rotation(r+ r/s)
                    v.visual.scale(s-0.1)
                    if(s > 0.1) setTimeout(reduce, 100);
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
                    var d = v.physics.GetWorldCenter().Copy()
                    d.Subtract(p.visual.getPos());
                    var dlength = d.Normalize()
                    if(dlength<5)
                        dlength = 5;
                    if(p.power === "anti" && dlength < 150){
         //               if(b2Vec2.CrossV2V2(v.physics.GetLinearVelocity(),new b2Vec2(0,1)) === 0)
                          //  v.physics.ApplyTorque(1);
                        d.Multiply(1500)
                        v.physics.ApplyImpulse(d, p.visual.getPos());
                    }
            //        if(dlength <30) dlength = 30
                    else if(p.power === "atra" && dlength <150){
         //               if(b2Vec2.CrossV2V2(v.physics.GetLinearVelocity(),new b2Vec2(0,1)) === 0)
            //                v.physics.ApplyTorque(10);
                        d.Multiply(-250);
                        v.physics.ApplyImpulse(d, p.visual.getPos());
                    }
                    else if(p.power === "accele" && dlength <150)
                        v.physics.ApplyTorque(600000)
            });
                p.updateEffects(10);
            })
            world.Step(1/50, 8);
            var c = emitter.getNext();
            if (c.none){}
            else if(c.end){
                if(params[1]==="0" && !passed){
                    stop=true; play.change("play"); lastTime = 0;
                    instructions.css("background-image", "url(assets/instruction2.png)").show();
                }
            }
            else if(c){
                emitter.visual.change("in-open")
                setTimeout(function(){emitter.visual.change("in")}, 1500);
                ids ++;
                var hab = c.hability;
                switch(c.hability){
                    case "none": fixDef = normalDef; ballDef = normalball; break
                    case "heavy": fixDef = heavyDef; ballDef = normalball; break;
                }
                var c = c.createVisual().moveTo(emitter.position[0], emitter.position[1]);
                var v = new b2BodyDef;
                v.type = b2Body.b2_dynamicBody;
                v.position.Set(map.emitter.position[0], map.emitter.position[1]);
                v.userData = {name:"cooly", visual:c,hab:hab, id:ids};
                v.angularDamping = 0;
                fixDef.id = ids;
                fixDef.shape = ballDef;
                v = world.CreateBody(v)
                v.CreateFixture(fixDef);
                balls[ids] = {visual:c, physics:v, hab:hab, ids:ids};
                layer.add(c);
            }
            world.ClearForces();
        }
        $.each(balls, function(i,v){
            if(Math.abs(v.physics.GetAngularVelocity())>10)
                if(Math.abs(v.physics.GetLinearVelocity().Length() > 100) && v.physics.GetContactList())
                    v.visual.change("pelusa"+v.hab+"eyesmouth")
                else
                    if(v.visual.sprite() === "pelusa"+v.hab+"eyesmouth" || v.visual.sprite() === "pelusa"+v.hab+"mouth")
                        setTimeout(function(){v.visual.change("pelusa"+v.hab+"eyes");},1000);
                    else
                        v.visual.change("pelusa"+v.hab+"eyes")
            else
                if(Math.abs(v.physics.GetLinearVelocity().Length()) > 100 && v.physics.GetContactList())
                    v.visual.change("pelusa"+v.hab+"mouth")
                else
                    if(v.visual.sprite() === "pelusa"+v.hab+"mouth" || v.visual.sprite() == "pelusa"+v.hab+"yesmouth")
                        setTimeout(function(){v.visual.change("pelusa"+v.hab);},1000);
                    else
                        v.visual.change("pelusa"+v.hab)


            var pos = v.physics.GetWorldCenter().Copy();
            var rot = v.physics.GetAngle();

            v.visual.rotation(rot);
            v.visual.moveTo(pos.x, pos.y);
        });
           // for(var c=world.GetContactList(); c; c = c.GetNext()){
              //  var a = listener.PreSolve(c.getBodies()[0], c.getBodies()[1])
             //   if(a) if(!deleted[a.GetUserData().id]) todelete[a.GetUserData().id] = a, deleted[a.GetUserData().id]=true;
        //    }
              //  todelete;
              //  ntodelete = {};
    }
    muu.render();
    requestAnimationFrame(render);
    }
});

}
