let scene, camera, renderer;
let treeModel, rockModel, houseModel, benchModel, lampModel;
let shaderProgram;

async function main() {
    const canvas = document.getElementById('webgl-canvas');
    renderer = new THREE.WebGLRenderer({ canvas });

    // Configuração da cena
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, canvas.width / canvas.height, 0.1, 1000);
    camera.position.set(0, 5, 20);
    camera.lookAt(0, 0, 0);
    // Adicionando luzes
    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    const gl = renderer.getContext();

    // Carregar shaders
    const vertexShaderSource = await loadShaderFile('vertexShader.glsl');
    const fragmentShaderSource = await loadShaderFile('fragmentShader.glsl');
    shaderProgram = await createProgram(gl, vertexShaderSource, fragmentShaderSource);

    // Carregar modelos 3D
    treeModel = await loadModel('assets/modelos/arvore.obj');
    rockModel = await loadModel('assets/modelos/rocha.obj');
    houseModel = await loadModel('assets/modelos/casa.obj');
    benchModel = await loadModel('assets/modelos/banco.obj');
    lampModel = await loadModel('assets/modelos/lampiao.obj');
    const treeMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 }); // verde
    const rockMaterial = new THREE.MeshBasicMaterial({ color: 0x888888 }); // cinza
    const houseMaterial = new THREE.MeshBasicMaterial({ color: 0x663300 }); // marrom
    const benchMaterial = new THREE.MeshBasicMaterial({ color: 0x654321 }); // marrom escuro
    const lampMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 }); // amarelo

    // Inicializar controles
    initializeControls();

    // Gerar um novo cenário ao carregar a página
    generateNewScene();

    // Evento para gerar novo cenário ao clicar no botão
    const generateButton = document.getElementById('generate-button');
    generateButton.addEventListener('click', generateNewScene);

    gl.useProgram(shaderProgram);
}

async function loadShaderFile(filePath) {
    const response = await fetch(filePath);
    return response.text();
}

async function createShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('Error compiling shader:', gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }
    return shader;
}

async function createProgram(gl, vertexShaderSource, fragmentShaderSource) {
    const vertexShader = await createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = await createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error('Error linking program:', gl.getProgramInfoLog(program));
        return null;
    }
    return program;
}

function initializeControls() {
    const treeCountInput = document.getElementById('tree-count');
    const rockCountInput = document.getElementById('rock-count');
    const houseCountInput = document.getElementById('house-count');
    const benchCountInput = document.getElementById('bench-count');
    const lampCountInput = document.getElementById('lamp-count');

    treeCountInput.addEventListener('input', () => {
        document.getElementById('tree-value').textContent = treeCountInput.value;
    });

    rockCountInput.addEventListener('input', () => {
        document.getElementById('rock-value').textContent = rockCountInput.value;
    });

    houseCountInput.addEventListener('input', () => {
        document.getElementById('house-value').textContent = houseCountInput.value;
    });

    benchCountInput.addEventListener('input', () => {
        document.getElementById('bench-value').textContent = benchCountInput.value;
    });

    lampCountInput.addEventListener('input', () => {
        document.getElementById('lamp-value').textContent = lampCountInput.value;
    });
}

function generateNewScene() {
    clearScene();

    const numberOfTrees = parseInt(document.getElementById('tree-count').value, 10);
    const numberOfRocks = parseInt(document.getElementById('rock-count').value, 10);
    const numberOfHouses = parseInt(document.getElementById('house-count').value, 10);
    const numberOfBenches = parseInt(document.getElementById('bench-count').value, 10);
    const numberOfLamps = parseInt(document.getElementById('lamp-count').value, 10);

    for (let i = 0; i < numberOfTrees; i++) {
        const position = generateRandomPosition();
        placeModel(treeModel, position);
    }

    for (let i = 0; i < numberOfRocks; i++) {
        const position = generateRandomPosition();
        placeModel(rockModel, position);
    }

    for (let i = 0; i < numberOfHouses; i++) {
        const position = generateHousePosition();
        placeModel(houseModel, position);
    }

    for (let i = 0; i < numberOfBenches; i++) {
        const position = generateBenchPosition();
        placeModel(benchModel, position);
    }

    for (let i = 0; i < numberOfLamps; i++) {
        const position = generateLampPosition();
        placeModel(lampModel, position);
    }

    renderer.render(scene, camera);
}

function loadModel(url) {
    return new Promise((resolve, reject) => {
        const loader = new THREE.OBJLoader();
        console.log(`Carregando modelo de ${url}`);

        loader.load(
            url,
            (object3D) => {
                console.log(`Modelo carregado de ${url}`);
                resolve(object3D);
            },
            (xhr) => {
                console.log(`Progresso do carregamento do modelo de ${url}: ${xhr.loaded / xhr.total * 100}%`);
            },
            (error) => {
                console.error(`Erro carregando modelo de ${url}`, error);
                reject(error);
            }
        );
    });
}

function clearScene() {
    while (scene.children.length > 0) {
        scene.remove(scene.children[0]);
    }
}

function generateRandomPosition() {
    const minX = -50;
    const maxX = 50;
    const minY = 0;
    const maxY = 10;
    const minZ = -50;
    const maxZ = 50;

    const x = Math.random() * (maxX - minX) + minX;
    const y = Math.random() * (maxY - minY) + minY;
    const z = Math.random() * (maxZ - minZ) + minZ;

    return { x, y, z };
}

function generateHousePosition() {
    const minX = -40;
    const maxX = 40;
    const minY = 0;
    const maxY = 5;
    const minZ = -40;
    const maxZ = 40;

    let x, y, z;
    do {
        x = Math.random() * (maxX - minX) + minX;
        y = Math.random() * (maxY - minY) + minY;
        z = Math.random() * (maxZ - minZ) + minZ;
    } while (!isValidHousePosition(x, z));

    return { x, y, z };
}

function isValidHousePosition(x, z) {
    return (x > -30 && x < 30 && z > -30 && z < 30);
}

function generateBenchPosition() {
    const minX = -30;
    const maxX = 30;
    const minY = 0;
    const maxY = 0.5;
    const minZ = -30;
    const maxZ = 30;

    let x, y, z;
    do {
        x = Math.random() * (maxX - minX) + minX;
        y = Math.random() * (maxY - minY) + minY;
        z = Math.random() * (maxZ - minZ) + minZ;
    } while (!isValidBenchPosition(x, z));

    return { x, y, z };
}

function isValidBenchPosition(x, z) {
    return (x > -20 && x < 20 && z > -20 && z < 20);
}

function generateLampPosition() {
    const minX = -35;
    const maxX = 35;
    const minY = 2;
    const maxY = 4;
    const minZ = -35;
    const maxZ = 35;

    let x, y, z;
    do {
        x = Math.random() * (maxX - minX) + minX;
        y = Math.random() * (maxY - minY) + minY;
        z = Math.random() * (maxZ - minZ) + minZ;
    } while (!isValidLampPosition(x, z));

    return { x, y, z };
}

function isValidLampPosition(x, z) {
    return (x > -25 && x < 25 && z > -25 && z < 25);
}

function placeModel(modelData, position) {
    const { x, y, z } = position;
    const model = modelData.clone();
    model.position.set(x, y, z);
    scene.add(model);
}

window.onload = main;
