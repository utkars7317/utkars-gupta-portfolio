document.getElementById('resumeBtn').addEventListener('click', function(e){
  if (this.getAttribute('href') === '#') {
    e.preventDefault();
    alert('Add your resume PDF and update this button\'s href to point to it (e.g. "resume.pdf").');
  }
});

const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
navToggle.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', isOpen);
});
navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  navLinks.classList.remove('open');
  navToggle.setAttribute('aria-expanded', 'false');
}));

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const revealEls = document.querySelectorAll('.reveal');
if (reduceMotion) {
  revealEls.forEach(el => el.classList.add('in'));
} else {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('in'); });
  }, { threshold: 0.15 });
  revealEls.forEach(el => io.observe(el));
}

/* ============ THREE.JS AURORA KNOT HERO ============ */
(function initHero(){
  const canvas = document.getElementById('hero-canvas');
  const heroSection = document.querySelector('.hero');
  let width = heroSection.clientWidth, height = heroSection.clientHeight;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, width/height, 0.1, 100);
  camera.position.set(0, 0, 10);

  const renderer = new THREE.WebGLRenderer({ canvas, antialias:true, alpha:true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(width, height);

  const ambient = new THREE.AmbientLight(0x1a2050, 1.2);
  scene.add(ambient);
  const cyanLight = new THREE.PointLight(0x3fe3ff, 3.4, 34);
  cyanLight.position.set(6, 3, 6);
  scene.add(cyanLight);
  const violetLight = new THREE.PointLight(0x8b5cf6, 3.0, 34);
  violetLight.position.set(-6, -3, 5);
  scene.add(violetLight);
  const pinkLight = new THREE.PointLight(0xec6ff0, 1.6, 30);
  pinkLight.position.set(0, -5, -4);
  scene.add(pinkLight);

  const knotGeo = new THREE.TorusKnotGeometry(1.7, 0.48, 180, 24, 2, 3);
  const knotMat = new THREE.MeshPhysicalMaterial({
    color: 0x1a2050, metalness: 0.25, roughness: 0.12,
    transmission: 0.78, thickness: 1.4, ior: 1.45,
    transparent: true, opacity: 0.94, clearcoat: 1, clearcoatRoughness: 0.08,
    envMapIntensity: 1.5
  });
  const knot = new THREE.Mesh(knotGeo, knotMat);
  knot.position.set(2.6, 0, -1.5);
  scene.add(knot);

  const wireGeo = new THREE.TorusKnotGeometry(1.74, 0.5, 180, 24, 2, 3);
  const wireMat = new THREE.MeshBasicMaterial({ color: 0x7df3ff, wireframe: true, transparent:true, opacity:0.35 });
  const wire = new THREE.Mesh(wireGeo, wireMat);
  wire.position.copy(knot.position);
  scene.add(wire);

  const starCount = 260;
  const starGeo = new THREE.BufferGeometry();
  const positions = new Float32Array(starCount * 3);
  const colorsArr = new Float32Array(starCount * 3);
  const c1 = new THREE.Color(0x3fe3ff), c2 = new THREE.Color(0x8b5cf6);
  for (let i=0;i<starCount;i++){
    positions[i*3]   = (Math.random()-0.5) * 28;
    positions[i*3+1] = (Math.random()-0.5) * 17;
    positions[i*3+2] = (Math.random()-0.5) * 16 - 3;
    const c = Math.random() > 0.5 ? c1 : c2;
    colorsArr[i*3]=c.r; colorsArr[i*3+1]=c.g; colorsArr[i*3+2]=c.b;
  }
  starGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  starGeo.setAttribute('color', new THREE.BufferAttribute(colorsArr, 3));
  const starMat = new THREE.PointsMaterial({ size: 0.05, transparent:true, opacity:0.75, vertexColors:true });
  const stars = new THREE.Points(starGeo, starMat);
  scene.add(stars);

  let mouseX = 0, mouseY = 0, targetX = 0, targetY = 0;
  window.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5);
    mouseY = (e.clientY / window.innerHeight - 0.5);
  });

  function onResize(){
    width = heroSection.clientWidth; height = heroSection.clientHeight;
    camera.aspect = width/height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  }
  window.addEventListener('resize', onResize);

  const clock = new THREE.Clock();
  function animate(){
    requestAnimationFrame(animate);
    const t = clock.getElapsedTime();

    knot.rotation.x = t * 0.22;
    knot.rotation.y = t * 0.3;
    wire.rotation.copy(knot.rotation);

    stars.rotation.y = t * 0.012;

    targetX += (mouseX - targetX) * 0.04;
    targetY += (mouseY - targetY) * 0.04;
    camera.position.x = targetX * 2.4;
    camera.position.y = -targetY * 1.6;
    camera.lookAt(0,0,0);

    renderer.render(scene, camera);
  }
  if (!reduceMotion) { animate(); } else {
    renderer.render(scene, camera);
  }
})();

function openCertificate(imageSrc) {
    const modal = document.getElementById("certificateModal");
    const fullImage = document.getElementById("certificateFullImage");

    fullImage.src = imageSrc;
    modal.style.display = "flex";
}

function closeCertificate() {
    document.getElementById("certificateModal").style.display = "none";
}


// Close when clicking outside certificate
document.getElementById("certificateModal").addEventListener("click", function(e) {
    if (e.target === this) {
        closeCertificate();
    }
});


// Close with Escape key
document.addEventListener("keydown", function(e) {
    if (e.key === "Escape") {
        closeCertificate();
    }
});