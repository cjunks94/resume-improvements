/**
 * 3D Wireframe Village Background
 * Low-poly countryside scene with interactive elements.
 * Uses Three.js (loaded via CDN).
 */
(function() {
    'use strict';

    // ========================================================================
    // WEBGL CHECK & EARLY EXIT
    // ========================================================================
    if (typeof THREE === 'undefined') return;
    try {
        var c = document.createElement('canvas');
        if (!(c.getContext('webgl') || c.getContext('experimental-webgl'))) return;
    } catch (e) { return; }

    // ========================================================================
    // CONFIG
    // ========================================================================
    var CONFIG = {
        cameraPos: { x: 0, y: 14, z: 22 },
        orbitStrength: { x: 3, y: 1 },
        orbitDamping: 0.03,
        scrollParallax: 4,
        maxPlantedTrees: 20,
        treeGrowFrames: 20,
        groundSize: 50,
        groundDivisions: 25
    };

    // ========================================================================
    // STATE
    // ========================================================================
    var animationId = null;
    var isRunning = false;
    var mouse = { x: 0, y: 0 };
    var scrollOffset = 0;
    var currentHovered = null;
    var plantedTrees = [];
    var growingTrees = [];
    var wavingCharacters = [];
    var allMaterials = [];
    var windowMeshes = [];
    var characterArms = [];
    var scene, camera, renderer, canvas;
    var groundPlane, solidGround;
    var raycaster = new THREE.Raycaster();
    var mouseVec = new THREE.Vector2();
    var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // ========================================================================
    // COLORS FROM CSS
    // ========================================================================
    function getColors() {
        var style = getComputedStyle(document.documentElement);
        var ink = style.getPropertyValue('--c-ink').trim() || '#121212';
        var bg = style.getPropertyValue('--c-bg').trim() || '#f4f1de';
        return { ink: ink, bg: bg };
    }

    function updateColors() {
        var colors = getColors();
        var inkColor = new THREE.Color(colors.ink);
        allMaterials.forEach(function(m) {
            if (m.color) m.color.set(inkColor);
        });
        if (solidGround) {
            solidGround.material.color.set(new THREE.Color(colors.bg));
        }
    }

    // ========================================================================
    // SHARED MATERIALS
    // ========================================================================
    var colors = getColors();
    var wireMat = new THREE.LineBasicMaterial({ color: colors.ink });
    var windowMatOff = new THREE.MeshBasicMaterial({ color: colors.ink, side: THREE.DoubleSide });
    var windowMatOn = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide });
    allMaterials.push(wireMat);

    function wireframe(geometry) {
        return new THREE.LineSegments(new THREE.WireframeGeometry(geometry), wireMat);
    }

    // ========================================================================
    // GEOMETRY BUILDERS
    // ========================================================================
    function createCottage(x, z, scale, rotation) {
        var group = new THREE.Group();
        group.userData.type = 'cottage';
        var s = scale || 1;

        // Body
        var body = wireframe(new THREE.BoxGeometry(2 * s, 1.5 * s, 2 * s));
        body.position.y = 0.75 * s;
        group.add(body);

        // Roof
        var roof = wireframe(new THREE.ConeGeometry(1.6 * s, 1.2 * s, 4));
        roof.position.y = (1.5 + 0.6) * s;
        roof.rotation.y = Math.PI / 4;
        group.add(roof);

        // Door
        var door = wireframe(new THREE.PlaneGeometry(0.4 * s, 0.7 * s));
        door.position.set(0, 0.35 * s, 1.01 * s);
        group.add(door);

        // Windows (interactive)
        var winGeo = new THREE.PlaneGeometry(0.3 * s, 0.3 * s);
        var win1 = new THREE.Mesh(winGeo, windowMatOff.clone());
        win1.position.set(-0.5 * s, 1.0 * s, 1.01 * s);
        win1.userData.type = 'window';
        group.add(win1);
        windowMeshes.push(win1);

        var win2 = new THREE.Mesh(winGeo, windowMatOff.clone());
        win2.position.set(0.5 * s, 1.0 * s, 1.01 * s);
        win2.userData.type = 'window';
        group.add(win2);
        windowMeshes.push(win2);

        group.position.set(x, 0, z);
        if (rotation) group.rotation.y = rotation;
        return group;
    }

    function createTree(x, z, variant) {
        var group = new THREE.Group();
        group.userData.type = 'tree';

        // Trunk
        var trunk = wireframe(new THREE.CylinderGeometry(0.08, 0.12, 0.8, 5));
        trunk.position.y = 0.4;
        group.add(trunk);

        // Canopy
        var canopy;
        if (variant === 'round') {
            canopy = wireframe(new THREE.SphereGeometry(0.6, 5, 4));
            canopy.position.y = 1.2;
        } else {
            canopy = wireframe(new THREE.ConeGeometry(0.5, 1.5, 6));
            canopy.position.y = 1.55;
        }
        group.add(canopy);

        group.position.set(x, 0, z);
        return group;
    }

    function createGarden(x, z, rotation) {
        var group = new THREE.Group();
        group.userData.type = 'garden';

        // Plot
        var plot = wireframe(new THREE.PlaneGeometry(2.5, 1.5, 5, 3));
        plot.rotation.x = -Math.PI / 2;
        plot.position.y = 0.01;
        group.add(plot);

        // Small plants
        for (var i = 0; i < 4; i++) {
            var px = -0.8 + i * 0.5 + (Math.random() - 0.5) * 0.2;
            var pz = (Math.random() - 0.5) * 0.8;
            var bush = wireframe(new THREE.SphereGeometry(0.12, 4, 3));
            bush.position.set(px, 0.12, pz);
            group.add(bush);
        }

        group.position.set(x, 0, z);
        if (rotation) group.rotation.y = rotation;
        return group;
    }

    function createFence(startX, startZ, endX, endZ, segments) {
        var group = new THREE.Group();
        var count = segments || 6;
        for (var i = 0; i <= count; i++) {
            var t = i / count;
            var fx = startX + (endX - startX) * t;
            var fz = startZ + (endZ - startZ) * t;
            var post = wireframe(new THREE.BoxGeometry(0.06, 0.4, 0.06));
            post.position.set(fx, 0.2, fz);
            group.add(post);
        }
        // Horizontal rails
        var points = [
            new THREE.Vector3(startX, 0.15, startZ),
            new THREE.Vector3(endX, 0.15, endZ)
        ];
        var points2 = [
            new THREE.Vector3(startX, 0.3, startZ),
            new THREE.Vector3(endX, 0.3, endZ)
        ];
        var railGeo = new THREE.BufferGeometry().setFromPoints(points);
        var railGeo2 = new THREE.BufferGeometry().setFromPoints(points2);
        group.add(new THREE.Line(railGeo, wireMat));
        group.add(new THREE.Line(railGeo2, wireMat));
        return group;
    }

    function createCharacter(x, z) {
        var group = new THREE.Group();
        group.userData.type = 'character';

        // Head
        var head = wireframe(new THREE.SphereGeometry(0.15, 4, 3));
        head.position.y = 1.1;
        group.add(head);

        // Body
        var bodyPts = [new THREE.Vector3(0, 0.95, 0), new THREE.Vector3(0, 0.45, 0)];
        group.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(bodyPts), wireMat));

        // Left arm
        var leftArmPts = [new THREE.Vector3(0, 0.85, 0), new THREE.Vector3(-0.25, 0.55, 0)];
        group.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(leftArmPts), wireMat));

        // Right arm (animatable)
        var rightArmGroup = new THREE.Group();
        rightArmGroup.position.set(0, 0.85, 0);
        var armPts = [new THREE.Vector3(0, 0, 0), new THREE.Vector3(0.25, -0.3, 0)];
        rightArmGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(armPts), wireMat));
        rightArmGroup.userData.restZ = 0;
        group.add(rightArmGroup);
        characterArms.push({ arm: rightArmGroup, waving: false, parent: group });

        // Legs
        var leftLegPts = [new THREE.Vector3(0, 0.45, 0), new THREE.Vector3(-0.15, 0, 0)];
        var rightLegPts = [new THREE.Vector3(0, 0.45, 0), new THREE.Vector3(0.15, 0, 0)];
        group.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(leftLegPts), wireMat));
        group.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(rightLegPts), wireMat));

        group.position.set(x, 0, z);
        return group;
    }

    function createPath(x1, z1, x2, z2) {
        var dx = x2 - x1;
        var dz = z2 - z1;
        var len = Math.sqrt(dx * dx + dz * dz);
        var path = wireframe(new THREE.PlaneGeometry(0.5, len, 1, Math.max(2, Math.floor(len))));
        path.rotation.x = -Math.PI / 2;
        path.position.set((x1 + x2) / 2, 0.005, (z1 + z2) / 2);
        path.rotation.z = -Math.atan2(dz, dx) + Math.PI / 2;
        return path;
    }

    // ========================================================================
    // SCENE SETUP
    // ========================================================================
    function initScene() {
        scene = new THREE.Scene();
        scene.add(new THREE.AmbientLight(0xffffff, 0.8));

        // Ground
        var groundGeo = new THREE.PlaneGeometry(
            CONFIG.groundSize, CONFIG.groundSize,
            CONFIG.groundDivisions, CONFIG.groundDivisions
        );
        groundPlane = wireframe(groundGeo);
        groundPlane.rotation.x = -Math.PI / 2;
        groundPlane.userData.type = 'ground';
        scene.add(groundPlane);

        // Solid background plane
        var solidGeo = new THREE.PlaneGeometry(CONFIG.groundSize * 2, CONFIG.groundSize * 2);
        solidGround = new THREE.Mesh(solidGeo, new THREE.MeshBasicMaterial({
            color: getColors().bg, side: THREE.DoubleSide
        }));
        solidGround.rotation.x = -Math.PI / 2;
        solidGround.position.y = -0.02;
        scene.add(solidGround);

        // Cottages
        scene.add(createCottage(-5, -3, 1, 0));
        scene.add(createCottage(4, -4, 0.9, Math.PI / 6));
        scene.add(createCottage(-2, 3, 1.1, -Math.PI / 8));
        scene.add(createCottage(6, 2, 0.85, Math.PI / 3));

        // Gardens (near cottages)
        scene.add(createGarden(-3, -3, 0));
        scene.add(createGarden(6, -4, Math.PI / 4));
        scene.add(createGarden(-0.5, 3, Math.PI / 6));
        scene.add(createGarden(8, 2, -Math.PI / 6));

        // Trees
        scene.add(createTree(-8, -6, 'cone'));
        scene.add(createTree(-7, 5, 'round'));
        scene.add(createTree(9, -2, 'cone'));
        scene.add(createTree(10, 5, 'round'));
        scene.add(createTree(-9, 0, 'cone'));
        scene.add(createTree(2, 7, 'round'));
        scene.add(createTree(-4, -8, 'cone'));
        scene.add(createTree(7, 8, 'round'));

        // Paths
        scene.add(createPath(-5, -3, -2, 3));
        scene.add(createPath(-2, 3, 4, -4));
        scene.add(createPath(4, -4, 6, 2));

        // Fences
        scene.add(createFence(-7, -5, -3, -5, 5));
        scene.add(createFence(3, 5, 8, 5, 6));

        // Characters
        scene.add(createCharacter(-1, -1));
        scene.add(createCharacter(5, 0));
    }

    // ========================================================================
    // RENDERER & CAMERA
    // ========================================================================
    function initRenderer() {
        canvas = document.createElement('canvas');
        canvas.id = 'village-canvas';
        canvas.setAttribute('aria-hidden', 'true');
        canvas.setAttribute('role', 'presentation');
        canvas.tabIndex = -1;
        document.body.insertBefore(canvas, document.body.firstChild);

        renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
        renderer.setClearColor(0x000000, 0);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setSize(window.innerWidth, window.innerHeight);

        camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
        camera.position.set(CONFIG.cameraPos.x, CONFIG.cameraPos.y, CONFIG.cameraPos.z);
        camera.lookAt(0, 0, 0);

        // Context loss handling
        canvas.addEventListener('webglcontextlost', function(e) {
            e.preventDefault();
            if (animationId) cancelAnimationFrame(animationId);
        });
        canvas.addEventListener('webglcontextrestored', function() {
            animate();
        });
    }

    // ========================================================================
    // INTERACTIONS
    // ========================================================================
    function onMouseMove(e) {
        mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
        mouse.y = (e.clientY / window.innerHeight) * 2 - 1;
        mouseVec.set(mouse.x, -mouse.y);
    }

    function onScroll() {
        scrollOffset = window.scrollY / (document.body.scrollHeight - window.innerHeight || 1);
    }

    function onClick(e) {
        var clickMouse = new THREE.Vector2(
            (e.clientX / window.innerWidth) * 2 - 1,
            -(e.clientY / window.innerHeight) * 2 + 1
        );
        raycaster.setFromCamera(clickMouse, camera);

        // Only intersect ground
        var hits = raycaster.intersectObject(solidGround);
        if (hits.length > 0) {
            var pt = hits[0].point;
            var variant = Math.random() > 0.5 ? 'cone' : 'round';
            var tree = createTree(pt.x, pt.z, variant);
            tree.scale.set(0, 0, 0);
            scene.add(tree);
            growingTrees.push({ obj: tree, frame: 0 });
            plantedTrees.push(tree);

            // Cap at max
            if (plantedTrees.length > CONFIG.maxPlantedTrees) {
                var old = plantedTrees.shift();
                scene.remove(old);
            }
        }
    }

    function checkHover() {
        raycaster.setFromCamera(mouseVec, camera);

        // Check cottages
        var cottages = [];
        var characters = [];
        scene.traverse(function(obj) {
            if (obj.userData.type === 'cottage') cottages.push(obj);
            if (obj.userData.type === 'character') characters.push(obj);
        });

        // Cottage hover
        var cottageHit = false;
        for (var i = 0; i < cottages.length; i++) {
            var hits = raycaster.intersectObjects(cottages[i].children, true);
            if (hits.length > 0) {
                if (currentHovered !== cottages[i]) {
                    unhoverAll();
                    currentHovered = cottages[i];
                    cottages[i].traverse(function(child) {
                        if (child.userData.type === 'window') {
                            child.material = windowMatOn;
                        }
                    });
                }
                cottageHit = true;
                break;
            }
        }

        // Character hover
        if (!cottageHit) {
            var charHit = false;
            for (var j = 0; j < characters.length; j++) {
                var charHits = raycaster.intersectObjects(characters[j].children, true);
                if (charHits.length > 0) {
                    if (currentHovered !== characters[j]) {
                        unhoverAll();
                        currentHovered = characters[j];
                        characterArms.forEach(function(ca) {
                            if (ca.parent === characters[j]) ca.waving = true;
                        });
                    }
                    charHit = true;
                    break;
                }
            }
            if (!charHit && currentHovered) {
                unhoverAll();
            }
        }
    }

    function unhoverAll() {
        if (currentHovered) {
            currentHovered.traverse(function(child) {
                if (child.userData.type === 'window') {
                    child.material = windowMatOff;
                }
            });
            characterArms.forEach(function(ca) { ca.waving = false; });
            currentHovered = null;
        }
    }

    // ========================================================================
    // ANIMATION LOOP
    // ========================================================================
    var elapsed = 0;
    function animate() {
        animationId = requestAnimationFrame(animate);
        elapsed += 0.016;

        if (reducedMotion) {
            renderer.render(scene, camera);
            cancelAnimationFrame(animationId);
            return;
        }

        // Camera orbit
        var targetX = CONFIG.cameraPos.x + mouse.x * CONFIG.orbitStrength.x;
        var targetY = CONFIG.cameraPos.y - mouse.y * CONFIG.orbitStrength.y;
        var targetZ = CONFIG.cameraPos.z - scrollOffset * CONFIG.scrollParallax;
        camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetX, CONFIG.orbitDamping);
        camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetY, CONFIG.orbitDamping);
        camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, CONFIG.orbitDamping);
        camera.lookAt(0, 0, 0);

        // Hover check (every other frame for perf)
        if (Math.floor(elapsed * 60) % 2 === 0) {
            checkHover();
        }

        // Character wave animation
        characterArms.forEach(function(ca) {
            if (ca.waving) {
                ca.arm.rotation.z = Math.sin(elapsed * 8) * 0.6;
            } else {
                ca.arm.rotation.z = THREE.MathUtils.lerp(ca.arm.rotation.z, 0, 0.1);
            }
        });

        // Growing trees
        for (var i = growingTrees.length - 1; i >= 0; i--) {
            var gt = growingTrees[i];
            gt.frame++;
            var progress = Math.min(gt.frame / CONFIG.treeGrowFrames, 1);
            var eased = 1 - Math.pow(1 - progress, 3);
            gt.obj.scale.set(eased, eased, eased);
            if (progress >= 1) growingTrees.splice(i, 1);
        }

        renderer.render(scene, camera);
    }

    // ========================================================================
    // TOGGLE BUTTON
    // ========================================================================
    function createToggle() {
        var btn = document.createElement('button');
        btn.className = 'village-toggle';
        btn.setAttribute('aria-label', 'Toggle 3D village background');
        btn.setAttribute('aria-pressed', 'true');
        btn.textContent = '3D [ON]';
        document.body.appendChild(btn);

        btn.addEventListener('click', function() {
            if (isRunning) {
                stopScene();
                btn.textContent = '3D [OFF]';
                btn.setAttribute('aria-pressed', 'false');
                localStorage.setItem('village-scene-enabled', 'false');
            } else {
                startScene();
                btn.textContent = '3D [ON]';
                btn.setAttribute('aria-pressed', 'true');
                localStorage.setItem('village-scene-enabled', 'true');
            }
        });

        return btn;
    }

    function startScene() {
        if (canvas) canvas.style.display = 'block';
        document.body.classList.add('village-active');
        isRunning = true;
        animate();
    }

    function stopScene() {
        if (animationId) cancelAnimationFrame(animationId);
        if (canvas) canvas.style.display = 'none';
        document.body.classList.remove('village-active');
        isRunning = false;
    }

    // ========================================================================
    // RESIZE
    // ========================================================================
    var resizeTimer;
    function onResize() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            if (!renderer) return;
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        }, 250);
    }

    // ========================================================================
    // INIT
    // ========================================================================
    function init() {
        var savedState = localStorage.getItem('village-scene-enabled');
        if (savedState === 'false') {
            var btn = createToggle();
            btn.textContent = '3D [OFF]';
            btn.setAttribute('aria-pressed', 'false');
            return;
        }

        initScene();
        initRenderer();
        createToggle();

        // Event listeners
        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('scroll', onScroll);
        canvas.addEventListener('click', onClick);
        window.addEventListener('resize', onResize);

        // Theme changes
        window.addEventListener('themechange', updateColors);
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', updateColors);

        // Reduced motion
        window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', function(e) {
            reducedMotion = e.matches;
            if (reducedMotion && isRunning) {
                renderer.render(scene, camera);
                cancelAnimationFrame(animationId);
            } else if (!reducedMotion && isRunning) {
                animate();
            }
        });

        startScene();
    }

    // Wait for DOM
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
