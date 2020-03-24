//important define
let scene, camera, renderer;
let controls;
let keyboard = {};
let player = { height:70, speed:0.2, turnSpeed:Math.PI*0.02 };
let USE_WIREFRAME = false;
let composer;

function init(){

  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 1000);
  renderer = new THREE.WebGLRenderer({antialias:true});
  renderer.setSize(window.innerWidth,window.innerHeight);
  document.body.appendChild(renderer.domElement);

  //LIGHTS
  let light = new THREE.PointLight( 0xFCC81F, 1, 1000 );
  light.position.set( 0, 0, 1 );
  scene.add( light );

  let directionalLight = new THREE.DirectionalLight(0x4A91E2);
  directionalLight.position.set(0,0,1);
  scene.add(directionalLight);

  let ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
  scene.add(ambientLight);
 
  
  //spiral stars
  let spiralGeometry = new THREE.Geometry();
  let loader = new THREE.TextureLoader();
  loader.setCrossOrigin("");
  map = loader.load("assets/textures/sparkly.png");
  let colors = [0xffffff];
  for (let i = 0; i < 50000; i++) {
		let d = Math.random() * 12 + i / 800;
		let r = i / 7000 * Math.PI + Math.random() * 2;
		vertex = new THREE.Vector3();
		vertex.x = Math.sin(r) * d;
		vertex.z = Math.cos(r) * d;
		vertex.y = Math.random() * 1 - 2;
		spiralGeometry.vertices.push(vertex);
		spiralGeometry.colors.push(
			new THREE.Color(
				colors[Math.floor(Math.random() * colors.length)]
			).multiplyScalar(Math.random())
		);
	}

	stars = new THREE.Points(
		spiralGeometry,
		new THREE.PointsMaterial({
			map: map,
			size: 0.5,
			depthTest: false,
			transparent: true,
			blending: THREE.AdditiveBlending,
			opacity: 2,
			vertexColors: THREE.VertexColors
		})
	);
   stars.position.z=0;
   stars.position.y=0;
   stars.rotation.x += 120;

	scene.add(stars);



   //sprite sun
        let sun = new THREE.TextureLoader().load("assets/textures/glow1.png", function ( texture ) {
         texture.wrapS = texture.wrapT = THREE.ClampToEdgeWrapping;
         texture.repeat.set( 1, 1); // or whatever you like
     
     } );
        let sunSprite = new THREE.Sprite(
           new THREE.SpriteMaterial({
              color: 0xffffff,
              map: sun,
              depthTest: false,
              transparent: true,
              blending: THREE.AdditiveBlending,
              opacity: 2
              
           })
        );
        sunSprite.scale.set(70, 70, 70);
        scene.add(sunSprite);

//particles for scattered stars
  let normalRandom = (mean, std) => {
   let n = 0
   
   for (let i = 1; i <= 12; i++) {
     n += Math.random()
   }

   return (n - 6) * std + mean
}

let geometryStars = new THREE.Geometry()
let galaxySize = 30000

//Generate particles for stars:
for (let i = 0; i < 10000; i++) {
   let theta = THREE.Math.randFloatSpread(360) 
 let phi = THREE.Math.randFloatSpread(360)
 let distance = THREE.Math.randFloatSpread(galaxySize)

 geometryStars.vertices.push(new THREE.Vector3(
     distance * Math.sin(theta) * Math.cos(phi),
    distance * Math.sin(theta) * Math.sin(phi),
    distance * Math.cos(theta) / 10
 ))
}
//star texture
let sprite = new THREE.TextureLoader().load( 'assets/textures/sparkly.png' );
     let starMaterial = new THREE.PointsMaterial({
       color: 0xaaaaaa,
       size: 2,
       transparent: true,
       blending: THREE.AdditiveBlending,
       alphaTest: 0.5,
       map: sprite
       
     });

     
let starGalaxy = new THREE.Points(geometryStars, starMaterial)
scene.add(starGalaxy);
starGalaxy.rotation.x += 0.01;
starGalaxy.rotation.y += 0.01;

//clouds 1st layer geometry
let geometryCloudfirst = new THREE.TorusBufferGeometry( 75, 8, 16, 64 );

let loaderCloudfirst = new THREE.TextureLoader();
let texture = loaderCloudfirst.load( 'assets/textures/smoke.png', function ( texture ) {
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set( 3, 4);

} );

let materialCloudfirst = new THREE.MeshPhongMaterial( {
    size:100,
    transparent: true,
    map: texture
} );

meshCloudfirst = new THREE.Mesh( geometryCloudfirst, materialCloudfirst );
meshCloudfirst.position.z = 0;
meshCloudfirst.position.x = 0;
meshCloudfirst.position.y = 0;
meshCloudfirst.rotation.y += 0.01;

meshCloudfirst.rotation.x = -1;
scene.add( meshCloudfirst );

//clouds 2nd layer geometry
let geometryCloudsecond = new THREE.TorusBufferGeometry( 77, 8, 16, 64 );
let loaderCloudsecond = new THREE.TextureLoader();
let textureCloudsecond = loaderCloudsecond.load( 'assets/textures/smoke.png', function ( textureCloudsecond ) {
    textureCloudsecond.wrapS = texture.wrapT = THREE.RepeatWrapping;
    textureCloudsecond.repeat.set( 3, 4);

} );

let materialCloudsecond = new THREE.MeshPhongMaterial( {
    size:100,
    transparent: true,
    map: textureCloudsecond
} );

meshCloudsecond = new THREE.Mesh( geometryCloudsecond, materialCloudsecond );
meshCloudsecond.position.z = 0;
meshCloudsecond.position.x = 0;
meshCloudsecond.position.y = 0;
meshCloudsecond.rotation.y = 0;

meshCloudsecond.rotation.x = -1;
scene.add( meshCloudsecond );

//clouds 3rd layer geometry
let geometryCloudthree = new THREE.TorusBufferGeometry( 20, 5, 10, 15 );
meshCloudthree = new THREE.Mesh( geometryCloudthree, materialCloudsecond );
meshCloudthree.position.z = 0;
meshCloudthree.position.x = 0;
meshCloudthree.position.y = -5;
meshCloudthree.rotation.y = 0;

meshCloudthree.rotation.x = -1;
scene.add( meshCloudthree );

//clouds 4th layer geometry
let geometryCloudfourth = new THREE.TorusBufferGeometry( 40, 5, 10, 15 );
meshCloudfourth = new THREE.Mesh( geometryCloudfourth, materialCloudsecond );
meshCloudfourth.position.z = 0;
meshCloudfourth.position.x = 0;
meshCloudfourth.position.y = -5;
meshCloudfourth.rotation.y = 0;

meshCloudfourth.rotation.x = -1;
scene.add( meshCloudfourth );

//clouds 5th layer geometry
let geometryCloudfifth = new THREE.TorusBufferGeometry( 80, 8, 16, 64 );
let loaderCloudfifth = new THREE.TextureLoader();
let textureCloudfifth = loaderCloudfifth.load( 'assets/textures/smoke.png', function ( textureCloudfifth ) {
   textureCloudfifth.wrapS = textureCloudfifth.wrapT = THREE.RepeatWrapping;
   textureCloudfifth.repeat.set( 3, 4);

} );

let materialCloudfifth = new THREE.MeshPhongMaterial( {
    size:100,
    transparent: true,
    map: textureCloudfifth
} );

meshCloudfifth = new THREE.Mesh( geometryCloudfifth, materialCloudfifth );
meshCloudfifth.position.z = 0;
meshCloudfifth.position.x = 0;
meshCloudfifth.position.y = 0;
meshCloudfifth.rotation.y = 0;

meshCloudfifth.rotation.x = -1;
scene.add( meshCloudfifth );

//blue godrays light and sphere sun light
        
let circleBluelight = new THREE.CircleGeometry(60,80);
let circleMatBluelight = new THREE.MeshBasicMaterial({
   color: 0x1F41EF, transparent: true,depthTest: true
});
let circleBlue = new THREE.Mesh(circleBluelight, circleMatBluelight);
circleBlue.position.set(0 ,-10 ,0 );
circleBlue.rotation.x=-1;
circleBlue.scale.setX(1);
scene.add(circleBlue);

let circleSungeo = new THREE.SphereBufferGeometry(10, 12, 11);
let circleSunMat = new THREE.MeshBasicMaterial({
   color: 0xE6CF71, transparent: true,depthTest: true, blending: THREE.AdditiveBlending
});
let circleSun = new THREE.Mesh(circleSungeo, circleSunMat);
circleSun.position.set(0 ,-1 ,0 );
circleSun.rotation.x=-1;
circleSun.scale.setX(1);
scene.add(circleSun);

let areaImage = new Image();
   areaImage.src = POSTPROCESSING.SMAAEffect.areaImageDataURL;
let searchImage = new Image();
   searchImage.src = POSTPROCESSING.SMAAEffect.searchImageDataURL;

//godrays for blue light
let godraysEffect = new POSTPROCESSING.GodRaysEffect(camera, circleBlue, {
   resolutionScale: 1,
   density: 0.8,
   decay: 0.95,
   weight: 0.3,
   samples: 35
});

//godrays for sun
let godraysEffect1 = new POSTPROCESSING.GodRaysEffect(camera, circleSun, {
   resolutionScale: 1,
   density: 0.8,
   decay: 0.95,
   weight: 0.3,
   samples: 100
});

//render composer for postprocessing
let renderPass = new POSTPROCESSING.RenderPass(scene, camera);
let effectPass = new POSTPROCESSING.EffectPass(camera,godraysEffect,godraysEffect1);
effectPass.renderToScreen = true;
composer = new POSTPROCESSING.EffectComposer(renderer);
composer.addPass(renderPass);
composer.addPass(effectPass);   

       
//camera position
  camera.position.set(120, player.height, -20);
  camera.rotation.y=500;
  camera.rotation.x=200;
  camera.rotation.z=100;
  camera.lookAt(new THREE.Vector3(0,player.height,0));
 
  
  scene.fog = new THREE.FogExp2(0x111111, 0.001);
  renderer.setClearColor(scene.fog.color);

//enable shadows
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.BasicShadowMap;

  
   controls = new THREE.OrbitControls (camera);
   
  animate();
  
}





function animate(){
   composer.render(0.1);
   
  requestAnimationFrame(animate);
  controls.update();

//rotation
stars.rotation.y += 0.01;
meshCloudfirst.rotation.z = 35;
meshCloudsecond.rotation.z =10;
meshCloudfifth.rotation.z = 5;



  if(keyboard[87]){ // W key
     camera.position.x -= Math.sin(camera.rotation.y) * player.speed;
     camera.position.z -= -Math.cos(camera.rotation.y) * player.speed;
  }
  if(keyboard[83]){ // S key
     camera.position.x += Math.sin(camera.rotation.y) * player.speed;
     camera.position.z += -Math.cos(camera.rotation.y) * player.speed;
  }
  if(keyboard[65]){ // A key
     camera.position.x += Math.sin(camera.rotation.y + Math.PI/2) * player.speed;
     camera.position.z += -Math.cos(camera.rotation.y + Math.PI/2) * player.speed;
  }
  if(keyboard[68]){ // D key
     camera.position.x += Math.sin(camera.rotation.y - Math.PI/2) * player.speed;
     camera.position.z += -Math.cos(camera.rotation.y - Math.PI/2) * player.speed;
  }
 
  if(keyboard[37]){ // left arrow key
     camera.rotation.y -= player.turnSpeed;
  }
  if(keyboard[39]){ // right arrow key
     camera.rotation.y += player.turnSpeed;
  }
 
  renderer.render(scene, camera);
}
 
function keyDown(event){
  keyboard[event.keyCode] = true;
}
 
function keyUp(event){
  keyboard[event.keyCode] = false;
}

window.addEventListener('keydown', keyDown);
window.addEventListener('keyup', keyUp);

window.onload = init;

