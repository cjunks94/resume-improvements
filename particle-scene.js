/**
 * Particle Morph Scene — Floating particles that morph between shapes.
 * Circle → Triangle → Square with slow transitions.
 * Mouse hover splits particles apart.
 * Registers with SceneManager.
 */
(function() {
    'use strict';
    if (typeof THREE === 'undefined' || !window.SceneManager) return;

    var PARTICLE_COUNT = 800;
    var SHAPE_HOLD = 3.0;       // seconds to hold each shape
    var SHAPE_TRANSITION = 2.0; // seconds to morph between shapes
    var CYCLE_TIME = SHAPE_HOLD + SHAPE_TRANSITION;
    var SPLIT_RADIUS = 0.15;    // normalized mouse radius for split effect
    var SPLIT_FORCE = 3.0;      // how hard particles push away from cursor
    var FLOAT_AMPLITUDE = 0.3;  // gentle floating motion

    var scene, camera, points;
    var positions, targets, velocities, basePositions;
    var mouse = { x: 0, y: 0 };
    var scrollOffset = 0;
    var currentShape = 0;
    var shapeTime = 0;
    var inkColor;

    // ========================================================================
    // SHAPE GENERATORS — return array of {x, y, z} positions
    // ========================================================================
    function generateCircle(count, radius) {
        var pts = [];
        for (var i = 0; i < count; i++) {
            var angle = (i / count) * Math.PI * 2;
            var r = radius * (0.7 + Math.random() * 0.3);
            pts.push({
                x: Math.cos(angle) * r,
                y: Math.sin(angle) * r,
                z: (Math.random() - 0.5) * 1.5
            });
        }
        return pts;
    }

    function generateTriangle(count, size) {
        var pts = [];
        // Three edges of a triangle
        var verts = [
            { x: 0, y: size * 0.8 },
            { x: -size * 0.7, y: -size * 0.5 },
            { x: size * 0.7, y: -size * 0.5 }
        ];
        for (var i = 0; i < count; i++) {
            var edge = i % 3;
            var t = (Math.floor(i / 3) / Math.floor(count / 3));
            t += (Math.random() - 0.5) * 0.05;
            var next = (edge + 1) % 3;
            pts.push({
                x: verts[edge].x + (verts[next].x - verts[edge].x) * t,
                y: verts[edge].y + (verts[next].y - verts[edge].y) * t,
                z: (Math.random() - 0.5) * 1.5
            });
        }
        return pts;
    }

    function generateSquare(count, size) {
        var pts = [];
        var half = size * 0.6;
        var verts = [
            { x: -half, y: half },
            { x: half, y: half },
            { x: half, y: -half },
            { x: -half, y: -half }
        ];
        for (var i = 0; i < count; i++) {
            var edge = i % 4;
            var t = (Math.floor(i / 4) / Math.floor(count / 4));
            t += (Math.random() - 0.5) * 0.05;
            var next = (edge + 1) % 4;
            pts.push({
                x: verts[edge].x + (verts[next].x - verts[edge].x) * t,
                y: verts[edge].y + (verts[next].y - verts[edge].y) * t,
                z: (Math.random() - 0.5) * 1.5
            });
        }
        return pts;
    }

    var shapes = [generateCircle, generateTriangle, generateSquare];
    var shapeData = [];

    function buildShapeTargets() {
        shapeData = shapes.map(function(fn) { return fn(PARTICLE_COUNT, 4); });
    }

    // ========================================================================
    // SCENE INTERFACE
    // ========================================================================
    window.SceneManager.register('particles', {
        init: function(renderer, canvas) {
            var colors = SceneManager.getColors();
            inkColor = new THREE.Color(colors.ink);

            scene = new THREE.Scene();
            camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100);
            camera.position.set(0, 0, 12);
            camera.lookAt(0, 0, 0);

            buildShapeTargets();

            // Initialize particle positions to first shape
            positions = new Float32Array(PARTICLE_COUNT * 3);
            targets = new Float32Array(PARTICLE_COUNT * 3);
            velocities = new Float32Array(PARTICLE_COUNT * 3);
            basePositions = new Float32Array(PARTICLE_COUNT * 3);

            var firstShape = shapeData[0];
            for (var i = 0; i < PARTICLE_COUNT; i++) {
                var i3 = i * 3;
                positions[i3] = firstShape[i].x;
                positions[i3 + 1] = firstShape[i].y;
                positions[i3 + 2] = firstShape[i].z;
                targets[i3] = firstShape[i].x;
                targets[i3 + 1] = firstShape[i].y;
                targets[i3 + 2] = firstShape[i].z;
                basePositions[i3] = firstShape[i].x;
                basePositions[i3 + 1] = firstShape[i].y;
                basePositions[i3 + 2] = firstShape[i].z;
            }

            var geometry = new THREE.BufferGeometry();
            geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

            var material = new THREE.PointsMaterial({
                color: inkColor,
                size: 0.06,
                sizeAttenuation: true
            });

            points = new THREE.Points(geometry, material);
            scene.add(points);

            currentShape = 0;
            shapeTime = 0;
        },

        animate: function(elapsed) {
            if (!points) return;

            shapeTime += 0.016;

            // Determine current and next shape
            var cyclePos = shapeTime % (CYCLE_TIME * shapes.length);
            var shapeIndex = Math.floor(cyclePos / CYCLE_TIME);
            var timeInCycle = cyclePos - shapeIndex * CYCLE_TIME;
            var nextIndex = (shapeIndex + 1) % shapes.length;

            // Compute morph progress (0 = current shape, 1 = next shape)
            var morphProgress = 0;
            if (timeInCycle > SHAPE_HOLD) {
                morphProgress = (timeInCycle - SHAPE_HOLD) / SHAPE_TRANSITION;
                morphProgress = morphProgress * morphProgress * (3 - 2 * morphProgress); // smoothstep
            }

            var currentData = shapeData[shapeIndex];
            var nextData = shapeData[nextIndex];

            // Update target positions (morph between shapes)
            for (var i = 0; i < PARTICLE_COUNT; i++) {
                var i3 = i * 3;
                targets[i3] = currentData[i].x + (nextData[i].x - currentData[i].x) * morphProgress;
                targets[i3 + 1] = currentData[i].y + (nextData[i].y - currentData[i].y) * morphProgress;
                targets[i3 + 2] = currentData[i].z + (nextData[i].z - currentData[i].z) * morphProgress;
            }

            // Project mouse into 3D space for split effect
            var mouseWorld = new THREE.Vector3(mouse.x * 6, -mouse.y * 4, 0);

            // Update positions — lerp toward targets + split from mouse + float
            for (var j = 0; j < PARTICLE_COUNT; j++) {
                var j3 = j * 3;

                // Target with floating
                var floatX = Math.sin(elapsed * 0.5 + j * 0.1) * FLOAT_AMPLITUDE * 0.3;
                var floatY = Math.cos(elapsed * 0.3 + j * 0.07) * FLOAT_AMPLITUDE * 0.3;

                var tx = targets[j3] + floatX;
                var ty = targets[j3 + 1] + floatY;
                var tz = targets[j3 + 2];

                // Mouse split force
                var dx = positions[j3] - mouseWorld.x;
                var dy = positions[j3 + 1] - mouseWorld.y;
                var dist = Math.sqrt(dx * dx + dy * dy);
                var splitRange = SPLIT_RADIUS * 12; // scale to world units

                if (dist < splitRange && dist > 0.01) {
                    var force = (1 - dist / splitRange) * SPLIT_FORCE;
                    velocities[j3] += (dx / dist) * force * 0.016;
                    velocities[j3 + 1] += (dy / dist) * force * 0.016;
                }

                // Apply velocity with damping
                velocities[j3] *= 0.92;
                velocities[j3 + 1] *= 0.92;
                velocities[j3 + 2] *= 0.92;

                // Lerp to target + velocity
                positions[j3] = THREE.MathUtils.lerp(positions[j3], tx, 0.04) + velocities[j3];
                positions[j3 + 1] = THREE.MathUtils.lerp(positions[j3 + 1], ty, 0.04) + velocities[j3 + 1];
                positions[j3 + 2] = THREE.MathUtils.lerp(positions[j3 + 2], tz, 0.04) + velocities[j3 + 2];
            }

            points.geometry.attributes.position.needsUpdate = true;

            // Subtle camera shift from scroll
            camera.position.y = -scrollOffset * 2;
            camera.lookAt(0, -scrollOffset * 2, 0);
        },

        onMouseMove: function(x, y) {
            mouse.x = x;
            mouse.y = y;
        },

        onScroll: function(offset) {
            scrollOffset = offset;
        },

        onClick: function(x, y) {
            // Burst — push all particles outward briefly
            for (var i = 0; i < PARTICLE_COUNT; i++) {
                var i3 = i * 3;
                var dx = positions[i3] - x * 6;
                var dy = positions[i3 + 1] + y * 4;
                var dist = Math.sqrt(dx * dx + dy * dy) || 1;
                velocities[i3] += (dx / dist) * 0.5;
                velocities[i3 + 1] += (dy / dist) * 0.5;
            }
        },

        resize: function(w, h) {
            if (camera) { camera.aspect = w / h; camera.updateProjectionMatrix(); }
        },

        getScene: function() { return scene; },
        getCamera: function() { return camera; },

        updateColors: function(c) {
            inkColor = new THREE.Color(c.ink);
            if (points) points.material.color.set(inkColor);
        },

        destroy: function() {
            scene = null; camera = null; points = null;
            positions = null; targets = null; velocities = null;
        }
    });
})();
