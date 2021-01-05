class Drop {
  constructor(x, y, z) {
    this.x = random(-width / 2, width / 2);
    this.y = random(-height / 2, height / 2);
    this.z = random(height);
    
    this.pz = this.z;
    this.speed = 10;
  }

  update() {
    this.z = this.z - this.speed;
    if (this.z < 1) {
      this.x = random(-width / 2, width / 2);
      this.y = random(-height / 2, height / 2);
      this.z = height;
      this.pz = this.z;
    }
  }
  show() {
    fill(255);
    noStroke();

    let sx = map(this.x / this.z, 1, -1, 0, width);
    let sy = map(this.y / this.z, 0.4, 0.5, 0, height);
    
	// let r = map(this.z, 0, width, 12, 0);
    //ellipse(sx, sy, r, r);
    
    let px = map(this.x / this.pz, 1, -1, 0, width);
    let py = map(this.y / this.pz, 0.4, 0.5, 0, height);
    
    this.pz = this.z;
    stroke(255);
    line(px,py,sx,sy);
    
    
  }
  
  
}
