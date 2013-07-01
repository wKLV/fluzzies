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

var world = new b2World(new b2Vec2(0,10), true);

world.SetContactListener({BeginContact:function(contact){
     if(!twoCollide(contact.m_fixtureA.m_body, contact.m_fixtureB.m_body))
        twoCollide(contact.m_fixtureB.m_body, contact.m_fixtureA.m_body);
     }
     , PreSolve:function(){}, EndContact:function(){}, PostSolve:function(){}});

function runSteps(steps){
    for(var k=0; k<steps; k++){
        for(var i=0; i<pows.length; i++)
        for(var j=0; j<fluzzies.length; j++){
            var p = pows[i];
            var v = fluzzies[j];
            var d = new v2(v.getPos().x, v.getPos().y);
            d.add(v2.minus(p.visual.getPos()));
            var dlength = d.len();
            d.scalar(1/dlength);
            if(dlength<5)
                dlength = 5;
            if(p.power === "anti" && dlength < 150){
                d.scalar(1500)
                v.physics().ApplyImpulse(d, p.visual.getPos());
            }
            else if(p.power === "atra" && dlength <150){
                d.scalar(-250);
                v.physics().ApplyImpulse(d, p.visual.getPos());
            }
            else if(p.power === "accele" && dlength <150)
                v.physics().ApplyTorque(600000)
        }
        world.Step(1/60, 8, 2)
        world.ClearForces();
    }
}

function twoCollide(a,b){
   if(a.GetUserData().name !== "fluzzy")
      return false
   switch(b.GetUserData().name){
      case "in":
         var fluzzy = a.GetUserData();
         fluzzyDie(fluzzy);
         fluzzyEnters(fluzzy, b.GetUserData().visual);
         break;
      case "spikes":
         var fluzzy = a.GetUserData();
         fluzzyDie(fluzzy);
         dfluzzies++;
         break;
   }
   return true;
}

function makeGroundPhysics(g){
    var gbody = new b2BodyDef;
    gbody.userData = {name:"ground"}
    gbody.type = b2Body.b2_staticBody;
    gbody.position.Set(g.getPos().x, g.getPos().y);
    var gfix = new b2FixtureDef;
    gfix.restitution = .6
    gfix.density = 0;
    gfix.friction = 1;
    gfix.shape = g._defShape();
    g.physics(gfix, gbody);
}

function makeMegaGroundPhysics(shapes){
    for(var i=0; i<shapes.length; i++){
        var gbody = new b2BodyDef;
        gbody.userData = {name:"ground"}
        gbody.type = b2Body.b2_staticBody;
        gbody.position.Set(shapes[i].position.x, shapes[i].position.y);
        var gfix = new b2FixtureDef;
        gfix.restitution = .6
        gfix.density = 0;
        gfix.friction = 1;
        gfix.shape = new b2PolygonShape();
        gfix.shape.SetAsArray(shapes[i].shape, shapes[i].shape.length)
        var body = world.CreateBody(gbody);
        body.CreateFixture(gfix);
    }
}

function makeNoneFluzzyPhysics(f){
    var normalDef = new b2FixtureDef;
    normalDef.density = 0.5;
    normalDef.restitution = 0.2;
    normalDef.friction = 1;
    var v = new b2BodyDef;
    v.type = b2Body.b2_dynamicBody;
    v.position.Set(f.getPos().x, f.getPos().y);
    v.userData = {name:"fluzzy", visual:f, id:fluzzies.length-1, hab:"none"};
    v.angularDamping = 0;
    normalDef.id = fluzzies.length-1;
    normalDef.shape = new b2CircleShape(15);
    f.physics(normalDef, v);
}

function makeHeavyFluzzyPhysics(f){
    var normalDef = new b2FixtureDef;
    normalDef.density = 4;
    normalDef.restitution = 0.6;
    normalDef.friction = 0.7;
    var v = new b2BodyDef;
    v.type = b2Body.b2_dynamicBody;
    v.position.Set(f.getPos().x, f.getPos().y);
    v.userData = {name:"fluzzy", visual:f, id:fluzzies.length-1, hab:"heavy"};
    v.angularDamping = 0;
    normalDef.id = fluzzies.length-1;
    normalDef.shape = new b2CircleShape(15);
    f.physics(normalDef, v);
}

function makeCatcherPhysics(f){
    var binbodydef = new b2BodyDef;
    var binfix = new b2FixtureDef;
    binbodydef.position.Set(f.getPos().x, f.getPos().y)
    binfix.shape = new b2PolygonShape;
    binfix.shape.SetAsBox(75,75)
    binfix.isSensor = true;

    binbodydef.userData = {name:"in", visual:f};
    f.physics(binfix, binbodydef);
}

function makeSpikesPhysics(f){
   var binbodydef = new b2BodyDef;
   var binfix = new b2FixtureDef;
   binbodydef.position.Set(f.getPos().x, f.getPos().y);
   binfix.shape = new b2PolygonShape;
   binfix.shape.SetAsBox(130, 50);
   binfix.isSensor = true;

   binbodydef.userData = {name:"spikes", visual:f}
   f.physics(binfix, binbodydef);
}
