/**
 * Scene Manager
 * Handles canvas, renderer, and switching between background scenes.
 * Each scene registers itself via window.SceneManager.register(name, sceneObj).
 *
 * Scene interface:
 *   init(renderer, canvas)  — set up scene, camera, objects
 *   animate(elapsed)        — called each frame
 *   onMouseMove(x, y)       — normalized mouse coords (-1 to 1)
 *   onScroll(offset)        — 0 to 1 scroll progress
 *   onClick(x, y)           — normalized click coords
 *   resize(w, h)            — window resized
 *   getScene()              — return THREE.Scene
 *   getCamera()             — return THREE.Camera
 *   destroy()               — cleanup
 */
(function() {
    'use strict';

    if (typeof THREE === 'undefined') return;
    try {
        var c = document.createElement('canvas');
        if (!(c.getContext('webgl') || c.getContext('experimental-webgl'))) return;
    } catch (e) { return; }

    var scenes = {};
    var activeScene = null;
    var activeSceneName = null;
    var canvas, renderer;
    var animationId = null;
    var isRunning = false;
    var elapsed = 0;
    var mouse = { x: 0, y: 0 };
    var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // ========================================================================
    // CANVAS & RENDERER
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

        canvas.addEventListener('webglcontextlost', function(e) {
            e.preventDefault();
            if (animationId) cancelAnimationFrame(animationId);
        });
        canvas.addEventListener('webglcontextrestored', function() {
            if (isRunning) animate();
        });
    }

    // ========================================================================
    // ANIMATION LOOP
    // ========================================================================
    function animate() {
        animationId = requestAnimationFrame(animate);
        elapsed += 0.016;

        if (!activeScene) return;

        if (reducedMotion) {
            renderer.render(activeScene.getScene(), activeScene.getCamera());
            cancelAnimationFrame(animationId);
            return;
        }

        activeScene.animate(elapsed);
        renderer.render(activeScene.getScene(), activeScene.getCamera());
    }

    // ========================================================================
    // SCENE SWITCHING
    // ========================================================================
    function switchScene(name) {
        if (!scenes[name]) return;

        if (activeScene && activeScene.destroy) {
            activeScene.destroy();
        }

        activeSceneName = name;
        activeScene = scenes[name];
        activeScene.init(renderer, canvas);
        activeScene.resize(window.innerWidth, window.innerHeight);
        localStorage.setItem('scene-active', name);
    }

    function getSceneNames() {
        return Object.keys(scenes);
    }

    // ========================================================================
    // EVENT LISTENERS
    // ========================================================================
    function onMouseMove(e) {
        mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
        mouse.y = (e.clientY / window.innerHeight) * 2 - 1;
        if (activeScene && activeScene.onMouseMove) {
            activeScene.onMouseMove(mouse.x, mouse.y);
        }
    }

    function onScroll() {
        var offset = window.scrollY / (document.body.scrollHeight - window.innerHeight || 1);
        if (activeScene && activeScene.onScroll) {
            activeScene.onScroll(offset);
        }
    }

    function onClick(e) {
        var x = (e.clientX / window.innerWidth) * 2 - 1;
        var y = -(e.clientY / window.innerHeight) * 2 + 1;
        if (activeScene && activeScene.onClick) {
            activeScene.onClick(x, y);
        }
    }

    var resizeTimer;
    function onResize() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            if (!renderer) return;
            renderer.setSize(window.innerWidth, window.innerHeight);
            if (activeScene && activeScene.resize) {
                activeScene.resize(window.innerWidth, window.innerHeight);
            }
        }, 250);
    }

    // ========================================================================
    // TOGGLE / SWITCHER BUTTON
    // ========================================================================
    function createToggle() {
        var btn = document.createElement('button');
        btn.className = 'village-toggle';
        btn.setAttribute('aria-label', 'Cycle background scene');
        document.body.appendChild(btn);

        function updateLabel() {
            if (!isRunning) {
                btn.textContent = '3D [OFF]';
            } else {
                btn.textContent = (activeSceneName || '').toUpperCase() + ' [ON]';
            }
        }

        btn.addEventListener('click', function() {
            if (!isRunning) {
                // Turn on — resume current scene
                startScene();
                updateLabel();
                return;
            }

            // Cycle to next scene, or turn off after last
            var names = getSceneNames();
            var idx = names.indexOf(activeSceneName);
            var next = idx + 1;

            if (next >= names.length) {
                // Cycled through all — turn off
                stopScene();
                localStorage.setItem('scene-active', 'off');
                updateLabel();
            } else {
                switchScene(names[next]);
                updateLabel();
            }
        });

        updateLabel();
        return { btn: btn, updateLabel: updateLabel };
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
    // THEME INTEGRATION
    // ========================================================================
    function getColors() {
        var style = getComputedStyle(document.documentElement);
        return {
            ink: style.getPropertyValue('--c-ink').trim() || '#121212',
            bg: style.getPropertyValue('--c-bg').trim() || '#f4f1de'
        };
    }

    function onThemeChange() {
        if (activeScene && activeScene.updateColors) {
            activeScene.updateColors(getColors());
        }
    }

    // ========================================================================
    // INIT
    // ========================================================================
    function init() {
        var saved = localStorage.getItem('scene-active');

        initRenderer();
        var toggle = createToggle();

        // Wait for scenes to register (they load via defer too)
        setTimeout(function() {
            var names = getSceneNames();
            if (names.length === 0) return;

            if (saved === 'off') {
                // Start with first scene but paused
                switchScene(names[0]);
                stopScene();
                toggle.updateLabel();
                return;
            }

            // Restore saved scene or default to first
            var startWith = (saved && scenes[saved]) ? saved : names[0];
            switchScene(startWith);

            window.addEventListener('mousemove', onMouseMove);
            window.addEventListener('scroll', onScroll);
            canvas.addEventListener('click', onClick);
            window.addEventListener('resize', onResize);
            window.addEventListener('themechange', onThemeChange);
            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', onThemeChange);
            window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', function(e) {
                reducedMotion = e.matches;
            });

            startScene();
            toggle.updateLabel();
        }, 50);
    }

    // ========================================================================
    // PUBLIC API
    // ========================================================================
    window.SceneManager = {
        register: function(name, sceneObj) {
            scenes[name] = sceneObj;
        },
        getColors: getColors
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
