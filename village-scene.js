/**
 * Village Scene — Low-poly wireframe countryside
 * Registers with SceneManager.
 */
(function() {
    'use strict';
    if (typeof THREE === 'undefined' || !window.SceneManager) return;

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

    var scene, camera;
    var mouse = { x: 0, y: 0 };
    var scrollOffset = 0;
    var currentHovered = null;
    var plantedTrees = [];
    var growingTrees = [];
    var allMaterials = [];
    var windowMeshes = [];
    var characterArms = [];
    var solidGround;
    var raycaster = new THREE.Raycaster();
    var mouseVec = new THREE.Vector2();

    var colors = SceneManager.getColors();
    var wireMat = new THREE.LineBasicMaterial({ color: colors.ink });
    var windowMatOff = new THREE.MeshBasicMaterial({ color: colors.ink, side: THREE.DoubleSide });
    var windowMatOn = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide });
    allMaterials.push(wireMat);

    function wireframe(geo) {
        return new THREE.LineSegments(new THREE.WireframeGeometry(geo), wireMat);
    }

    // --- Geometry builders (unchanged) ---
    function createCottage(x, z, scale, rotation) {
        var g = new THREE.Group(); g.userData.type = 'cottage'; var s = scale || 1;
        var body = wireframe(new THREE.BoxGeometry(2*s, 1.5*s, 2*s)); body.position.y = 0.75*s; g.add(body);
        var roof = wireframe(new THREE.ConeGeometry(1.6*s, 1.2*s, 4)); roof.position.y = (1.5+0.6)*s; roof.rotation.y = Math.PI/4; g.add(roof);
        var door = wireframe(new THREE.PlaneGeometry(0.4*s, 0.7*s)); door.position.set(0, 0.35*s, 1.01*s); g.add(door);
        var winGeo = new THREE.PlaneGeometry(0.3*s, 0.3*s);
        var w1 = new THREE.Mesh(winGeo, windowMatOff.clone()); w1.position.set(-0.5*s, 1.0*s, 1.01*s); w1.userData.type = 'window'; g.add(w1); windowMeshes.push(w1);
        var w2 = new THREE.Mesh(winGeo, windowMatOff.clone()); w2.position.set(0.5*s, 1.0*s, 1.01*s); w2.userData.type = 'window'; g.add(w2); windowMeshes.push(w2);
        g.position.set(x, 0, z); if (rotation) g.rotation.y = rotation; return g;
    }

    function createTree(x, z, variant) {
        var g = new THREE.Group(); g.userData.type = 'tree';
        var trunk = wireframe(new THREE.CylinderGeometry(0.08, 0.12, 0.8, 5)); trunk.position.y = 0.4; g.add(trunk);
        if (variant === 'round') { var c = wireframe(new THREE.SphereGeometry(0.6, 5, 4)); c.position.y = 1.2; g.add(c); }
        else { var c = wireframe(new THREE.ConeGeometry(0.5, 1.5, 6)); c.position.y = 1.55; g.add(c); }
        g.position.set(x, 0, z); return g;
    }

    function createGarden(x, z, rotation) {
        var g = new THREE.Group(); g.userData.type = 'garden';
        var plot = wireframe(new THREE.PlaneGeometry(2.5, 1.5, 5, 3)); plot.rotation.x = -Math.PI/2; plot.position.y = 0.01; g.add(plot);
        for (var i = 0; i < 4; i++) {
            var bush = wireframe(new THREE.SphereGeometry(0.12, 4, 3));
            bush.position.set(-0.8 + i*0.5 + (Math.random()-0.5)*0.2, 0.12, (Math.random()-0.5)*0.8); g.add(bush);
        }
        g.position.set(x, 0, z); if (rotation) g.rotation.y = rotation; return g;
    }

    function createFence(sx, sz, ex, ez, segs) {
        var g = new THREE.Group(); var n = segs || 6;
        for (var i = 0; i <= n; i++) { var t = i/n; var post = wireframe(new THREE.BoxGeometry(0.06, 0.4, 0.06)); post.position.set(sx+(ex-sx)*t, 0.2, sz+(ez-sz)*t); g.add(post); }
        g.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(sx,0.15,sz), new THREE.Vector3(ex,0.15,ez)]), wireMat));
        g.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(sx,0.3,sz), new THREE.Vector3(ex,0.3,ez)]), wireMat));
        return g;
    }

    function createCharacter(x, z) {
        var g = new THREE.Group(); g.userData.type = 'character';
        var head = wireframe(new THREE.SphereGeometry(0.15, 4, 3)); head.position.y = 1.1; g.add(head);
        g.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0,0.95,0), new THREE.Vector3(0,0.45,0)]), wireMat));
        g.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0,0.85,0), new THREE.Vector3(-0.25,0.55,0)]), wireMat));
        var arm = new THREE.Group(); arm.position.set(0, 0.85, 0);
        arm.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0,0,0), new THREE.Vector3(0.25,-0.3,0)]), wireMat));
        g.add(arm); characterArms.push({ arm: arm, waving: false, parent: g });
        g.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0,0.45,0), new THREE.Vector3(-0.15,0,0)]), wireMat));
        g.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0,0.45,0), new THREE.Vector3(0.15,0,0)]), wireMat));
        g.position.set(x, 0, z); return g;
    }

    function createPath(x1, z1, x2, z2) {
        var dx = x2-x1, dz = z2-z1, len = Math.sqrt(dx*dx+dz*dz);
        var p = wireframe(new THREE.PlaneGeometry(0.5, len, 1, Math.max(2, Math.floor(len))));
        p.rotation.x = -Math.PI/2; p.position.set((x1+x2)/2, 0.005, (z1+z2)/2); p.rotation.z = -Math.atan2(dz, dx) + Math.PI/2; return p;
    }

    function unhoverAll() {
        if (!currentHovered) return;
        currentHovered.traverse(function(c) { if (c.userData.type === 'window') c.material = windowMatOff; });
        characterArms.forEach(function(ca) { ca.waving = false; });
        currentHovered = null;
    }

    function checkHover() {
        raycaster.setFromCamera(mouseVec, camera);
        var cottages = [], characters = [];
        scene.traverse(function(o) { if (o.userData.type === 'cottage') cottages.push(o); if (o.userData.type === 'character') characters.push(o); });

        var hit = false;
        for (var i = 0; i < cottages.length; i++) {
            if (raycaster.intersectObjects(cottages[i].children, true).length > 0) {
                if (currentHovered !== cottages[i]) { unhoverAll(); currentHovered = cottages[i]; cottages[i].traverse(function(c) { if (c.userData.type === 'window') c.material = windowMatOn; }); }
                hit = true; break;
            }
        }
        if (!hit) {
            for (var j = 0; j < characters.length; j++) {
                if (raycaster.intersectObjects(characters[j].children, true).length > 0) {
                    if (currentHovered !== characters[j]) { unhoverAll(); currentHovered = characters[j]; characterArms.forEach(function(ca) { if (ca.parent === characters[j]) ca.waving = true; }); }
                    hit = true; break;
                }
            }
        }
        if (!hit) unhoverAll();
    }

    // --- Scene interface for SceneManager ---
    window.SceneManager.register('village', {
        init: function(renderer, canvas) {
            scene = new THREE.Scene();
            scene.add(new THREE.AmbientLight(0xffffff, 0.8));
            var gGeo = new THREE.PlaneGeometry(CONFIG.groundSize, CONFIG.groundSize, CONFIG.groundDivisions, CONFIG.groundDivisions);
            var gp = wireframe(gGeo); gp.rotation.x = -Math.PI/2; gp.userData.type = 'ground'; scene.add(gp);
            var sGeo = new THREE.PlaneGeometry(CONFIG.groundSize*2, CONFIG.groundSize*2);
            solidGround = new THREE.Mesh(sGeo, new THREE.MeshBasicMaterial({ color: SceneManager.getColors().bg, side: THREE.DoubleSide }));
            solidGround.rotation.x = -Math.PI/2; solidGround.position.y = -0.02; scene.add(solidGround);

            scene.add(createCottage(-5,-3,1,0)); scene.add(createCottage(4,-4,0.9,Math.PI/6)); scene.add(createCottage(-2,3,1.1,-Math.PI/8)); scene.add(createCottage(6,2,0.85,Math.PI/3));
            scene.add(createGarden(-3,-3,0)); scene.add(createGarden(6,-4,Math.PI/4)); scene.add(createGarden(-0.5,3,Math.PI/6)); scene.add(createGarden(8,2,-Math.PI/6));
            scene.add(createTree(-8,-6,'cone')); scene.add(createTree(-7,5,'round')); scene.add(createTree(9,-2,'cone')); scene.add(createTree(10,5,'round'));
            scene.add(createTree(-9,0,'cone')); scene.add(createTree(2,7,'round')); scene.add(createTree(-4,-8,'cone')); scene.add(createTree(7,8,'round'));
            scene.add(createPath(-5,-3,-2,3)); scene.add(createPath(-2,3,4,-4)); scene.add(createPath(4,-4,6,2));
            scene.add(createFence(-7,-5,-3,-5,5)); scene.add(createFence(3,5,8,5,6));
            scene.add(createCharacter(-1,-1)); scene.add(createCharacter(5,0));

            camera = new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight, 0.1, 100);
            camera.position.set(CONFIG.cameraPos.x, CONFIG.cameraPos.y, CONFIG.cameraPos.z);
            camera.lookAt(0,0,0);
        },
        animate: function(elapsed) {
            var tx = CONFIG.cameraPos.x + mouse.x * CONFIG.orbitStrength.x;
            var ty = CONFIG.cameraPos.y - mouse.y * CONFIG.orbitStrength.y;
            var tz = CONFIG.cameraPos.z - scrollOffset * CONFIG.scrollParallax;
            camera.position.x = THREE.MathUtils.lerp(camera.position.x, tx, CONFIG.orbitDamping);
            camera.position.y = THREE.MathUtils.lerp(camera.position.y, ty, CONFIG.orbitDamping);
            camera.position.z = THREE.MathUtils.lerp(camera.position.z, tz, CONFIG.orbitDamping);
            camera.lookAt(0,0,0);
            if (Math.floor(elapsed*60) % 2 === 0) checkHover();
            characterArms.forEach(function(ca) { ca.arm.rotation.z = ca.waving ? Math.sin(elapsed*8)*0.6 : THREE.MathUtils.lerp(ca.arm.rotation.z, 0, 0.1); });
            for (var i = growingTrees.length-1; i >= 0; i--) { var gt = growingTrees[i]; gt.frame++; var p = Math.min(gt.frame/CONFIG.treeGrowFrames, 1); var e = 1-Math.pow(1-p,3); gt.obj.scale.set(e,e,e); if (p >= 1) growingTrees.splice(i,1); }
        },
        onMouseMove: function(x, y) { mouse.x = x; mouse.y = y; mouseVec.set(x, -y); },
        onScroll: function(offset) { scrollOffset = offset; },
        onClick: function(x, y) {
            raycaster.setFromCamera(new THREE.Vector2(x, y), camera);
            var hits = raycaster.intersectObject(solidGround);
            if (hits.length > 0) {
                var pt = hits[0].point; var tree = createTree(pt.x, pt.z, Math.random()>0.5?'cone':'round');
                tree.scale.set(0,0,0); scene.add(tree); growingTrees.push({obj:tree,frame:0}); plantedTrees.push(tree);
                if (plantedTrees.length > CONFIG.maxPlantedTrees) { scene.remove(plantedTrees.shift()); }
            }
        },
        resize: function(w, h) { if (camera) { camera.aspect = w/h; camera.updateProjectionMatrix(); } },
        getScene: function() { return scene; },
        getCamera: function() { return camera; },
        updateColors: function(c) {
            var ink = new THREE.Color(c.ink);
            allMaterials.forEach(function(m) { if (m.color) m.color.set(ink); });
            if (solidGround) solidGround.material.color.set(new THREE.Color(c.bg));
        },
        destroy: function() { scene = null; camera = null; plantedTrees = []; growingTrees = []; windowMeshes = []; characterArms = []; currentHovered = null; }
    });
})();
