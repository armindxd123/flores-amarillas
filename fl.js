var escena, camara, renderizador, grupoOrbita;
var frases = [
    "Eres mi luz", "Mi flor favorita", "Alegras mis días",
    "Pura luz ✨", "Solo para ti", "Sonríe siempre",
    "Atesoro tu compañía", "Un detalle amarillo", "Siempre brillas",
    "Eres muy especial", "Feliz día"
];

function comenzar() {
    document.getElementById("inicio").style.display = "none";
    var audio = document.getElementById("musica");
    audio.play();

    iniciarEscena();
}

function iniciarEscena() {
    escena = new THREE.Scene();
    
    camara = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camara.position.set(0, 15, 30);
    camara.lookAt(0, 0, 0);

    renderizador = new THREE.WebGLRenderer({ antialias: true });
    renderizador.setSize(window.innerWidth, window.innerHeight);
    document.getElementById("contenedor-3d").appendChild(renderizador.domElement);

    grupoOrbita = new THREE.Group();
    escena.add(grupoOrbita);

    // 1. Agujero Negro Central (Disco brillante)
    var geometriaDisco = new THREE.RingGeometry(2, 6, 64);
    var materialDisco = new THREE.MeshBasicMaterial({ 
        color: 0xffd700, 
        side: THREE.DoubleSide 
    });
    var disco = new THREE.Mesh(geometriaDisco, materialDisco);
    disco.rotation.x = Math.PI / 2;
    escena.add(disco);

    var geometriaCentro = new THREE.SphereGeometry(2, 32, 32);
    var materialCentro = new THREE.MeshBasicMaterial({ color: 0x000000 });
    var centro = new THREE.Mesh(geometriaCentro, materialCentro);
    escena.add(centro);

    // 2. Fondo de Estrellas
    crearEstrellas();

    // 3. Crear elementos en órbita (Flores y Textos)
    crearElementosEnOrbita();

    animar();
}

function crearEstrellas() {
    var estrellasGeo = new THREE.BufferGeometry();
    var cantidad = 1000;
    var posiciones = new Float32Array(cantidad * 3);

    for (var i = 0; i < cantidad * 3; i++) {
        posiciones[i] = (Math.random() - 0.5) * 200;
    }

    estrellasGeo.setAttribute('position', new THREE.BufferAttribute(posiciones, 3));
    var estrellasMat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.5 });
    var estrellas = new THREE.Points(estrellasGeo, estrellasMat);
    escena.add(estrellas);
}

function crearElementosEnOrbita() {
    var radioMin = 8;
    var radioMax = 22;
    var totalElementos = 30;

    for (var i = 0; i < totalElementos; i++) {
        var angulo = (i / totalElementos) * Math.PI * 2;
        var radio = radioMin + Math.random() * (radioMax - radioMin);

        var x = Math.cos(angulo) * radio;
        var z = Math.sin(angulo) * radio;
        var y = (Math.random() - 0.5) * 2;

        // Alternar entre girasoles y textos
        if (i % 2 === 0) {
            var flor = crearSpriteGirasol();
            flor.position.set(x, y, z);
            grupoOrbita.add(flor);
        } else {
            var textoStr = frases[Math.floor(Math.random() * frases.length)];
            var texto = crearSpriteTexto(textoStr);
            texto.position.set(x, y, z);
            grupoOrbita.add(texto);
        }
    }
}

function crearSpriteGirasol() {
    var canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    var ctx = canvas.getContext('2d');

    // Dibujo simple de girasol en canvas
    ctx.fillStyle = '#ffd700';
    for (var i = 0; i < 12; i++) {
        ctx.beginPath();
        ctx.arc(64 + Math.cos(i) * 35, 64 + Math.sin(i) * 35, 12, 0, Math.PI * 2);
        ctx.fill();
    }
    ctx.fillStyle = '#5c3a21';
    ctx.beginPath();
    ctx.arc(64, 64, 20, 0, Math.PI * 2);
    ctx.fill();

    var textura = new THREE.CanvasTexture(canvas);
    var mat = new THREE.SpriteMaterial({ map: textura });
    var sprite = new THREE.Sprite(mat);
    sprite.scale.set(3, 3, 1);
    return sprite;
}

function crearSpriteTexto(mensaje) {
    var canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 64;
    var ctx = canvas.getContext('2d');

    ctx.font = 'Bold 22px Arial';
    ctx.fillStyle = '#ffd700';
    ctx.textAlign = 'center';
    ctx.fillText(mensaje, 128, 40);

    var textura = new THREE.CanvasTexture(canvas);
    var mat = new THREE.SpriteMaterial({ map: textura });
    var sprite = new THREE.Sprite(mat);
    sprite.scale.set(6, 1.5, 1);
    return sprite;
}

function animar() {
    requestAnimationFrame(animar);

    // Rotación de la órbita de flores y textos
    if (grupoOrbita) {
        grupoOrbita.rotation.y += 0.003;
    }

    renderizador.render(escena, camara);
}

window.addEventListener('resize', function() {
    if (camara && renderizador) {
        camara.aspect = window.innerWidth / window.innerHeight;
        camara.updateProjectionMatrix();
        renderizador.setSize(window.innerWidth, window.innerHeight);
    }
});