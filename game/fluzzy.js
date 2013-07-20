function Fluzzy(config){
    this.hairs = [];
    this.color = config.color,
    this.body = muu.getSprite(config.body),
    this.eyesop = muu.getSprite(config.eyes+"opened"),
    this.eyescl = muu.getSprite(config.eyes+"closed"),
    this.eyesopened = true,
    this.mouthcl = muu.getSprite(config.mouth+"closed"),
    this.mouthop = muu.getSprite(config.mouth+"opened")
    this.mouthopened = false;
    this.size = config.size, this.eyessize = config.eyessize, this.mouthsize = config.mouthsize,
    this.eyesposx = config.eyesposx, this.eyesposy = config.eyesposy,
    this.mouthposx = config.mouthposx, this.mouthposy = config.mouthposy;
    var hairs = config.hairs;
    for(var j=0; j<hairs.length; j++){
        var h = hairs[j];
        for(var i=0; i<h.hairs; i++){
             // Circunference with 102-2*(i+1)%50 hairs
               pos = new v2(Math.cos(i/h.hairs*6.28)+h.displx,
                            Math.sin(i/h.hairs*6.28)+h.disply)
                            // radius of the circunference
                            .scalar(h.radius);
            this.hairs.push({d1:new v2(0,0),d2:new v2,w:Math.random()*h.randomwidth+h.basewidth, pos:pos,length:h.baselength+Math.random()*h.randomlength})
        }
    }
}
Fluzzy.prototype = new muuNode();
Fluzzy.prototype.constructor = Fluzzy;

Fluzzy.prototype.step = function(s){
    var r = this.rotation(), c = Math.cos(r), s = Math.sin(r),
    v = this.physics().m_linearVelocity, av = Math.floor(10*this.physics().m_angularVelocity)/10,
    lastlen={};
    for(var i=0; i<this.hairs.length; i++){
      var p = this.hairs[i].pos;
      this.hairs[i].d1 = new v2(v.x*c + v.y*s,
                               v.y*c - v.x*s).norm().scalar(50)
                      // .addEventListenerd(new v2(this.hairs[i].pos.y, -this.hairs[i].pos.x).
                       //  scalar(Math.max(.0,this.physics().m_angularVelocity)-this.hairs[i].lav))
                       .add(v2.norm(p).scalar(2.1))
                       .add(new v2(p.y, -p.x).scalar(av*100))
                       //.scalar(1/Math.sqrt(5))
                       .norm()
                       .scalar(this.hairs[i].length*.3)
                       .add(this.hairs[i].d1.scalar(0.7))
    this.hairs[i].d2 = new v2(v.x*c + v.y*s,
                               v.y*c - v.x*s).norm().scalar(-2)
                      // .addEventListenerd(new v2(this.hairs[i].pos.y, -this.hairs[i].pos.x).
                       //  scalar(Math.max(.0,this.physics().m_angularVelocity)-this.hairs[i].lav))
                       .add(v2.norm(p).scalar(2.1))
                       .add(new v2(p.y, -p.x).scalar(av*100))
                       .norm()//.scalar(1/Math.sqrt(5))
                       .scalar(this.hairs[i].length).scalar(0.1)
                       .add(this.hairs[i].d2.scalar(0.9))
            //           .scalar(Math.sqrt(lastlen.len))

    }
    if(Math.abs(av)>10)
        this.eyesopened = false;
    else if(Math.random()>0.99/s){
        this.eyesopened = false; setTimeout(function(){this.eyesopened = true}, 1000);
    }
    else
        this.eyesopened = true;
    if(v.Length() > 100)
        this.mouthopened = true;
    else this.mouthopened = false;
}


Fluzzy.prototype.paintTo = function(context){
      context.translate(this.getPos().x, this.getPos().y);
      context.rotate(this.rotation());
      context.scale(this.scale(), this.scale());

      context.translate(-this.size/2, -this.size/2)
      this.body.paintTo(context, new v2(this.size, this.size));
      context.translate(this.size/2, this.size/2)

      context.strokeStyle = this.color;
    var r = this.rotation(), c= Math.cos(r), s=Math.sin(r);
    for(var i=0; i<this.hairs.length; i++){
      var pos = this.hairs[i].pos, color = this.hairs[i].color,
        dir1 = this.hairs[i].d1, dir2 = this.hairs[i].d2;
      context.lineWidth = this.hairs[i].w;
      context.beginPath();
      context.moveTo(pos.x, pos.y);
     // context.lineTo(pos.x+len*dir.x, pos.y+len*dir.y);
      context.quadraticCurveTo(pos.x + dir1.x, pos.y + dir1.y, pos.x+dir2.x,pos.y+dir2.y);
      //context.strokeStyle = this.hairs[i].color;
      context.stroke();
    }

    context.translate(this.eyesposx, this.eyesposy);
    if(this.eyesopened)
        this.eyesop.paintTo(context, {x:this.eyessize*this.eyesop.size.x, y:this.eyessize*this.eyesop.size.y});
    else this.eyescl.paintTo(context, {x:this.eyessize*this.eyescl.size.x, y:this.eyessize*this.eyescl.size.y});
    context.translate(this.mouthposx-this.eyesposx, this.mouthposy-this.eyesposy)
    if(this.mouthopened)
        this.mouthop.paintTo(context, {x:this.mouthsize* this.mouthop.size.x, y:this.mouthsize*this.mouthop.size.y});
    else this.mouthcl.paintTo(context, {x:this.mouthsize* this.mouthcl.size.x, y:this.mouthsize*this.mouthcl.size.y});
    context.translate(-this.mouthposx, -this.mouthposy)
    context.scale(1/this.scale(), 1/this.scale());
    context.rotate(-this.rotation());
    context.translate(-this.getPos().x, -this.getPos().y)
}

Fluzzy.prototype._defShape = function(){return new b2CircleShape(30)};

function FluzzyM(what){
    if(mode !== "puzzle" || !planning)
    switch(what){
        case "none":
            return new Fluzzy({color:"#cab568", body:"pelusanonebody", eyes:"pelusakawaiieyes", mouth:"pelusanonemouth",
                                size:60, eyessize:0.65, mouthsize:0.19, eyesposx:-12, eyesposy:-15, mouthposx:-1, mouthposy:12,
                                hairs:[{hairs:50, displx:0, disply:0, radius:6, basewidth:1.7, randomwidth:2,
                                        baselength:28, randomlength:5}]})
        case "heavy":
            return new Fluzzy({color:"#adadad", body:"pelusaheavybody", eyes:"MetalBlue", mouth:"MetalMouth",
                                size:60, eyessize:0.17, mouthsize:0.14, eyesposx:-25, eyesposy:-25, mouthposx:-3.3, mouthposy:9,
                                hairs:[{hairs:55, displx:0, disply:0, radius:30, basewidth:3.8, randomwidth:3.6,
                                        baselength:9, randomlength:10.5}]})

    }
    else
    switch(what){
        case "none":
            return new Fluzzy({color:"#ffffff", body:"nothing", eyes:"nothing", mouth:"nothing",
                                size:60, eyessize:0, mouthsize:0, eyesposx:0, eyesposy:0, mouthposx:0, mouthposy:0,
                                hairs:[{hairs:50, displx:0, disply:0, radius:30, basewidth:1.7, randomwidth:2,
                                        baselength:10, randomlength:5}]})
        case "heavy":
            return new Fluzzy({color:"#ffffff", body:"nothing", eyes:"nothing", mouth:"nothing",
                                size:60, eyessize:0, mouthsize:0, eyesposx:0, eyesposy:0, mouthposx:0, mouthposy:0,
                                hairs:[{hairs:55, displx:0, disply:0, radius:30, basewidth:3.8, randomwidth:3.6,
                                        baselength:9, randomlength:10.5}]})
    }
}
