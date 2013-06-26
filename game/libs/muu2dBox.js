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
Box2D.Common.b2Settings.b2_velocityThreshold = 0;

var defaultFixture = new b2FixtureDef;
    defaultFixture.density = 1;
    defaultFixture.restitution = 1;
    defaultFixture.friction = 1;


muuNode.prototype.physics = function(fixture, bod){
  var body, type = b2Body.b2_dynamicBody
  if(this._physics) return this._physics;
  if(fixture === "static"){
    type = b2Body.b2_staticBody;
    fixture = undefined;
  }
  if(typeof fixture === "undefined"){
    fixture = defaultFixture;
    fixture.shape = this._defShape();
  }
  if(typeof bod !== "undefined")
    body = bod;
  else{
    body = new b2BodyDef();
    body.type = type;
    body.position.Set(this.getPos().x, this.getPos().y);
    body.angle = this.rotation()
  }
  this._physics = world.CreateBody(body);
  this._physics.CreateFixture(fixture);
  this.getPos = function(){ return this._physics.GetWorldCenter()};
  this.rotation = function(rot){return this._physics.GetAngle() }
  return this;
}

Sprite.prototype._defShape = function(){ var a = new b2PolygonShape(); a.SetAsBox(this.size().x/2, this.size().y/2); return a;}

Rect.prototype._defShape = function(){var a = new b2PolygonShape(); a.SetAsBox(this.size().x/2, this.size().y/2); return a;}

Circle.prototype._defShape = function(){ return new b2CircleShape(this.r)}

Polygon.prototype._defShape = function(){ 
    var a = new b2PolygonShape;
    a.SetAsArray(this.shape, this.shape.length);
    return a;
}
