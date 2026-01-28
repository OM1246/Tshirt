/**
 * three-bg.js
 * Implements a Cyberpunk/Sci-Fi 3D Background using Three.js
 * Features: Moving Grid, Floating Particles, Mouse Interaction
 */

document.addEventListener('DOMContentLoaded', () => {
    initThreeJS();
});

function initThreeJS() {
    // Container
    const container = document.createElement('div');
    container.id = 'three-bg';
    container.style.position = 'fixed';
    container.style.top = '0';
    container.style.left = '0';
    container.style.width = '100%';
    container.style.height = '100%';
    container.style.zIndex = '-1'; // Behind everything
    container.style.background = '#050510'; // Fallback
    document.body.prepend(container);

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x050510, 0.002); // Distance fog

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 30;
    camera.position.y = 10;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    // --- OBJECTS ---

    // 1. Moving Grid (Retro Wave Style)
    const gridHelper = new THREE.GridHelper(200, 50, 0x00f3ff, 0xbc13fe);
    gridHelper.position.y = -10;
    scene.add(gridHelper);

    // 2. Floating Particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 700;
    const posArray = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i++) {
        // Spread particles wide
        posArray[i] = (Math.random() - 0.5) * 150;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

    // Custom material for particles (Glowing squares)
    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.5,
        color: 0x0aff00,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });

    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    // 3. Floating Geometric Shapes (Icosahedrons)
    const geometries = [];
    const material = new THREE.MeshBasicMaterial({ color: 0x00f3ff, wireframe: true, transparent: true, opacity: 0.3 });

    for (let i = 0; i < 5; i++) {
        const geo = new THREE.IcosahedronGeometry(Math.random() * 4 + 1, 0);
        const mesh = new THREE.Mesh(geo, material);

        mesh.position.x = (Math.random() - 0.5) * 80;
        mesh.position.y = (Math.random() - 0.5) * 50;
        mesh.position.z = (Math.random() - 0.5) * 50;

        scene.add(mesh);
        geometries.push({
            mesh: mesh,
            speed: Math.random() * 0.02,
            rotSpeed: (Math.random() - 0.5) * 0.02
        });
    }

    // --- INTERACTION ---
    let mouseX = 0;
    let mouseY = 0;

    document.addEventListener('mousemove', (event) => {
        mouseX = (event.clientX / window.innerWidth) * 2 - 1;
        mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    });

    // --- ANIMATION LOOP ---
    const animate = () => {
        requestAnimationFrame(animate);

        // Move Grid to simulate speed
        gridHelper.position.z += 0.1;
        if (gridHelper.position.z > 10) {
            gridHelper.position.z = 0;
        }

        // Rotate Particles slowly
        particlesMesh.rotation.y += 0.001;
        particlesMesh.rotation.x += 0.0005;

        // Mouse Parallax
        camera.position.x += (mouseX * 10 - camera.position.x) * 0.05;
        camera.position.y += (-mouseY * 5 + 10 - camera.position.y) * 0.05;
        camera.lookAt(0, 0, 0);

        // Animate Geometries
        geometries.forEach(obj => {
            obj.mesh.rotation.x += obj.rotSpeed;
            obj.mesh.rotation.y += obj.rotSpeed;
            // Bobbing effect
            obj.mesh.position.y += Math.sin(Date.now() * 0.001 + obj.mesh.position.x) * 0.05;
        });

        renderer.render(scene, camera);
    };

    animate();

    // Resize Handle
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}
