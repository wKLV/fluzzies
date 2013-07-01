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

var defaultFixture = new b2FixtureDef;
    defaultFixture.density = 1;
    defaultFixture.restitution = 1;
    defaultFixture.friction = 1;


Sprite.prototype.physics = function(fixture, bod){
  if(this.physics) return this.physics;
  var body;
  else if(typeof fixture === "undefined"){
    fixture = defaultFixture;
    fixture.shape.SetAsBox(this.size().x, this.size().y)
  }
  else if(typeof body !== "undefined")
    body = bod;
  else{
    body = new b2BodyDef();
    body.position.Set(this.getPos().x, this.getPos().y);
  }
  body = world.CreateBody(body);
  this.physics = body.CreateFixture(fixture);
  return this;
}
