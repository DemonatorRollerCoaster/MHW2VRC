// Reactive liquid-like background using blended blurred particles
(function(){
  const canvas = document.getElementById('bg');
  const ctx = canvas.getContext('2d');
  let DPR = Math.max(1, window.devicePixelRatio || 1);

  function resize(){
    DPR = Math.max(1, window.devicePixelRatio || 1);
    canvas.width = Math.floor(window.innerWidth * DPR);
    canvas.height = Math.floor(window.innerHeight * DPR);
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';
    ctx.setTransform(DPR,0,0,DPR,0,0);
  }

  window.addEventListener('resize', resize);
  resize();

  const colors = [
    'rgba(141, 255, 199, 0.95)', // mint
    'rgba(150, 222, 255, 0.95)', // sky
    'rgba(210, 180, 255, 0.95)', // lilac
    'rgba(115, 90, 255, 0.95)',  // indigo
    'rgba(175, 85, 255, 0.95)',  // purple
    'rgba(255, 80, 170, 0.95)'   // hot pink
  ];

  const particles = [];
  const COUNT = 7;
  const pointer = {x: null, y: null, down:false};

  function rand(min, max){ return min + Math.random()*(max-min); }

  class P{
    constructor(existing){
      this.reset(true, existing);
    }
    reset(init, existing){
      // velocity
      const a = Math.random()*Math.PI*2;
      const s = rand(0.2, 1.4);
      this.vx = Math.cos(a)*s;
      this.vy = Math.sin(a)*s;
      // radius (reduced max to avoid excessive overlap)
      this.r = rand(60, 180);
      this.color = colors[Math.floor(Math.random()*colors.length)];
      this.phase = Math.random()*Math.PI*2;

      // place without overlapping existing particles (for initial placement)
      if(init && Array.isArray(existing)){
        let attempts = 0;
        let placed = false;
        while(!placed && attempts < 500){
          this.x = rand(0, window.innerWidth);
          this.y = rand(0, window.innerHeight);
          placed = true;
          for(const o of existing){
            const dx = this.x - o.x;
            const dy = this.y - o.y;
            const d = Math.sqrt(dx*dx + dy*dy);
            if(d < (this.r + o.r) * 0.95){
              placed = false; break;
            }
          }
          attempts++;
        }
        if(!placed){
          this.x = rand(0, window.innerWidth);
          this.y = rand(0, window.innerHeight);
        }
      } else {
        // fallback/random placement
        this.x = rand(0, window.innerWidth);
        this.y = rand(0, window.innerHeight);
      }

      // if reset during runtime, occasionally spawn near pointer
      if(!init && Math.random()<0.2){
        if(pointer.x!=null){
          this.x = pointer.x + rand(-80,80);
          this.y = pointer.y + rand(-80,80);
        }
      }
    }
    step(dt){
      this.phase += dt * 0.001 * (0.2 + Math.random()*0.6);
      this.vx += Math.cos(this.phase)*0.002;
      this.vy += Math.sin(this.phase)*0.002;
      if(pointer.x!=null){
        const dx = this.x - pointer.x;
        const dy = this.y - pointer.y;
        const d2 = dx*dx + dy*dy;
        const min = 120*120;
        if(d2 < min){
          const f = (1 - Math.sqrt(d2)/120) * (pointer.down? 4 : 1.6);
          this.vx += dx * 0.002 * f;
          this.vy += dy * 0.002 * f;
        }
      }
      this.x += this.vx;
      this.y += this.vy;
      if(this.x < -300) this.x = window.innerWidth + 300;
      if(this.x > window.innerWidth + 300) this.x = -300;
      if(this.y < -300) this.y = window.innerHeight + 300;
      if(this.y > window.innerHeight + 300) this.y = -300;
      this.vx *= 0.995;
      this.vy *= 0.995;
    }
    draw(ctx){
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      ctx.filter = 'blur(36px)';
      const g = ctx.createRadialGradient(this.x, this.y, Math.max(2,this.r*0.02), this.x, this.y, this.r);
      g.addColorStop(0, this.color.replace(/,\s*0.95\)/, ', 1)'));
      g.addColorStop(0.45, this.color);
      g.addColorStop(1, this.color.replace(/\d+\)$/,'0)') );
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI*2);
      ctx.fill();
      ctx.restore();
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      ctx.filter = 'blur(8px)';
      const g2 = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.r*0.45);
      g2.addColorStop(0, this.color);
      g2.addColorStop(1, this.color.replace(/\d+\)$/,'0)') );
      ctx.fillStyle = g2;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r*0.45, 0, Math.PI*2);
      ctx.fill();
      ctx.restore();
    }
  }

  for(let i=0;i<COUNT;i++) particles.push(new P(particles));

  let last = performance.now();
  function frame(now){
    const dt = now - last; last = now;
    ctx.clearRect(0,0,canvas.width, canvas.height);
    const bgG = ctx.createLinearGradient(0,0,0,window.innerHeight);
    bgG.addColorStop(0,'#ffffff');
    bgG.addColorStop(1,'#f8f8ff');
    ctx.fillStyle = bgG;
    ctx.fillRect(0,0,window.innerWidth, window.innerHeight);
    for(const p of particles){
      p.step(dt);
      p.draw(ctx);
    }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
  function setPointer(e){
    pointer.x = e.clientX;
    pointer.y = e.clientY;
  }
  window.addEventListener('pointermove', setPointer);
  window.addEventListener('pointerdown', (e)=>{ pointer.down=true; setPointer(e); });
  window.addEventListener('pointerup', ()=>{ pointer.down=false; });
  window.addEventListener('pointerleave', ()=>{ pointer.x = null; pointer.y = null; pointer.down=false; });

})();
