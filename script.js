const screens = [...document.querySelectorAll(".screen")];
const musicBtn = document.getElementById("musicBtn");
const song = document.getElementById("birthdaySong");
const gift = document.getElementById("gift");
const openGift = document.getElementById("openGift");
const countNumber = document.getElementById("countNumber");

function showScreen(id){
  screens.forEach(s => s.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

function confetti(amount=100){
  const box=document.getElementById("confetti");
  const chars=["✦","✧","❤","•","✿"];
  for(let i=0;i<amount;i++){
    const el=document.createElement("span");
    el.className="conf";
    el.textContent=chars[Math.floor(Math.random()*chars.length)];
    el.style.left=Math.random()*100+"vw";
    el.style.fontSize=(8+Math.random()*14)+"px";
    el.style.animationDuration=(2.5+Math.random()*3)+"s";
    el.style.animationDelay=(Math.random()*1.2)+"s";
    box.appendChild(el);
    setTimeout(()=>el.remove(),6500);
  }
}


/* Music: starts on the very first tap and keeps playing till the end */
function setPlayingUI(on){
  musicBtn.classList.toggle("playing",on);
  musicBtn.innerHTML=on?"🎵 <span>Playing our song</span>":"🎵 <span>Play our song</span>";
}
let musicStarted=false;
function startMusic(){
  if(musicStarted)return;
  song.volume=0.9;
  const p=song.play();
  if(p&&p.then){
    p.then(()=>{musicStarted=true;setPlayingUI(true);}).catch(()=>{});
  }
}
/* first tap anywhere on the page starts the song (browsers need a tap) */
document.addEventListener("pointerdown",startMusic,{once:false});
document.addEventListener("keydown",startMusic);

openGift.addEventListener("click",()=>{
  startMusic();
  gift.classList.add("open");
  confetti(70);
  setTimeout(()=>{ showScreen("countdownScreen"); startCountdown(); },850);
});

gift.addEventListener("click",()=>openGift.click());

function startCountdown(){
  let n=3;
  countNumber.textContent=n;
  const timer=setInterval(()=>{
    n--;
    if(n>0) countNumber.textContent=n;
    else{
      clearInterval(timer);
      countNumber.textContent="🎉";
      setTimeout(()=>{showScreen("hero"); confetti(160)},700);
    }
  },900);
}

document.querySelectorAll(".next").forEach(btn=>{
  btn.addEventListener("click",()=>{
    const id=btn.dataset.next;
    showScreen(id);
    if(id==="message") startTyping();
  });
});

const message = `Dear Aparna,

Happy Birthday to my girl! 🎂❤️

Nuvvu naa life lo vachina friend matrame kaadu,
slow ga naa story lo oka beautiful part aipoyav.

Mana silly conversations, random laughs,
crazy moments, small fights and all those little memories...
avi anni naaku chaala special.

Life lo enni changes vachina,
manam enni years grow aina,
mana friendship lo aa same craziness and comfort
always undali ani korukuntunna.

Nee life lo happiness, success,
peace and beautiful memories ekkuvaga undali.

Always keep smiling, keep shining,
and never stop being the wonderful Aparna that you are.

Janmalu enni maarina... mana friendship
ilaane undali. 🫶

Happy Birthday once again, my girl! 🎉💗

— Sugali Swapna ❤️`;

let typed=false;
function startTyping(){
  if(typed)return;
  typed=true;
  const el=document.getElementById("typedMessage");
  let i=0;
  function type(){
    if(i<message.length){
      el.textContent+=message[i++];
      setTimeout(type,22);
    }
  }
  type();
}

document.querySelectorAll(".reason").forEach(card=>{
  card.addEventListener("click",()=>{
    document.querySelectorAll(".reason").forEach(c=>c.classList.remove("selected"));
    card.classList.add("selected");
    document.getElementById("reasonText").textContent=card.dataset.text;
  });
});

musicBtn.addEventListener("click",async(e)=>{
  e.stopPropagation();
  try{
    if(song.paused){
      await song.play();
      musicStarted=true;
      setPlayingUI(true);
    }else{
      song.pause();
      musicStarted=true; /* user chose to pause: don't auto-restart */
      setPlayingUI(false);
    }
  }catch(err){
    alert("Song file not found. Keep janmalu-enni-maarina.mp3 in the same folder as index.html.");
  }
});
musicBtn.addEventListener("pointerdown",e=>e.stopPropagation());

/* Secret hold */
const heart=document.getElementById("holdHeart");
let holdTimer=null;
let unlocked=false;

function startHold(){
  if(unlocked)return;
  heart.classList.add("holding");
  holdTimer=setTimeout(()=>{
    unlocked=true;
    heart.classList.remove("holding");
    document.getElementById("lock").textContent="🔓";
    document.getElementById("secretReveal").classList.add("show");
    document.getElementById("finalBtn").classList.remove("hidden");
    confetti(80);
  },2000);
}
function cancelHold(){
  clearTimeout(holdTimer);
  heart.classList.remove("holding");
}
heart.addEventListener("pointerdown",startHold);
heart.addEventListener("pointerup",cancelHold);
heart.addEventListener("pointerleave",cancelHold);
heart.addEventListener("pointercancel",cancelHold);

document.getElementById("finalBtn").addEventListener("click",()=>{
  showScreen("final");
  confetti(120);
});

/* Fireworks */
const canvas=document.getElementById("fireworks");
const ctx=canvas.getContext("2d");
let particles=[];
let fireworksOn=false;

function resize(){
  canvas.width=innerWidth;
  canvas.height=innerHeight;
}
resize();
addEventListener("resize",resize);

function burst(x,y){
  for(let i=0;i<70;i++){
    const a=Math.random()*Math.PI*2;
    const speed=1.5+Math.random()*5;
    particles.push({
      x,y,
      vx:Math.cos(a)*speed,
      vy:Math.sin(a)*speed,
      life:90+Math.random()*30,
      size:1+Math.random()*2
    });
  }
}
function animate(){
  if(!fireworksOn)return;
  ctx.clearRect(0,0,canvas.width,canvas.height);
  particles.forEach((p,i)=>{
    p.x+=p.vx;p.y+=p.vy;p.vy+=.035;p.life-=1;
    ctx.globalAlpha=Math.max(0,p.life/110);
    ctx.fillStyle="#ffafd5";
    ctx.beginPath();ctx.arc(p.x,p.y,p.size,0,Math.PI*2);ctx.fill();
    if(p.life<=0)particles.splice(i,1);
  });
  ctx.globalAlpha=1;
  requestAnimationFrame(animate);
}

document.getElementById("wishBtn").addEventListener("click",()=>{
  fireworksOn=true;
  particles=[];
  burst(innerWidth*.5,innerHeight*.32);
  burst(innerWidth*.25,innerHeight*.28);
  burst(innerWidth*.75,innerHeight*.28);
  burst(innerWidth*.5,innerHeight*.18);
  confetti(220);
  document.getElementById("wishDone").classList.add("show");
  animate();
  setTimeout(()=>{
    fireworksOn=false;
    ctx.clearRect(0,0,canvas.width,canvas.height);
  },8500);
});

document.getElementById("restart").addEventListener("click",()=>{
  location.reload();
});

/* Floating hearts */
function floatingHeart(){
  const h=document.createElement("div");
  h.className="particle";
  h.textContent=Math.random()>.5?"♡":"✦";
  h.style.left=Math.random()*100+"vw";
  h.style.fontSize=(10+Math.random()*18)+"px";
  h.style.animationDuration=(6+Math.random()*5)+"s";
  document.getElementById("particles").appendChild(h);
  setTimeout(()=>h.remove(),12000);
}
setInterval(floatingHeart,900);
