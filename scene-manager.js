/**
 * Scene Manager
 * Handles canvas, renderer, and switching between background scenes.
 * Each scene registers itself via window.SceneManager.register(name, sceneObj).
 *
 * Loading strategy: this file is tiny and loads with the page, but
 * Three.js (~670 KB) and the scene scripts are only fetched the first
 * time a visitor turns a scene on (or on load, if they turned one on in
 * a previous visit). The default is OFF.
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

    // Skip in headless browsers (pa11y/puppeteer). Decorative scene isn't
    // useful for a11y testing and the WebGL animation can prevent
    // networkidle0 from settling, stalling page navigation in CI.
    if (/HeadlessChrome|Headless/.test(navigator.userAgent)) return;

    // Scene scripts, in load order. Each scene file registers itself with
    // SceneManager, so this object must exist before they run.
    var ENGINE_SCRIPTS = ['vendor/three.min.js', 'village-scene.js', 'particle-scene.js'];
    var SCENE_LABELS = { village: 'Village', particles: 'Particles' };
    var STORAGE_KEY = 'scene-active';

    var scenes = {};
    var activeScene = null;
    var activeSceneName = null;
    var canvas, renderer;
    var animationId = null;
    var isRunning = false;
    var elapsed = 0;
    var mouse = { x: 0, y: 0 };
    var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var enginePromise = null;
    var focusMode = false;

    // ========================================================================
    // LAZY ENGINE LOAD
    // ========================================================================
    function loadScript(src) {
        return new Promise(function(resolve, reject) {
            var el = document.createElement('script');
            el.src = src;
            el.async = false;
            el.onload = resolve;
            el.onerror = function() { reject(new Error('Failed to load ' + src)); };
            document.head.appendChild(el);
        });
    }

    function webglAvailable() {
        try {
            var c = document.createElement('canvas');
            return !!(c.getContext('webgl') || c.getContext('experimental-webgl'));
        } catch (e) { return false; }
    }

    function loadEngine() {
        if (!enginePromise) {
            enginePromise = ENGINE_SCRIPTS.reduce(function(p, src) {
                return p.then(function() { return loadScript(src); });
            }, Promise.resolve()).then(function() {
                if (typeof THREE === 'undefined') throw new Error('Three.js did not load');
                if (!renderer) initRenderer();
            }).catch(function(err) {
                console.warn('Background scene unavailable:', err.message);
                enginePromise = null;
                throw err;
            });
        }
        return enginePromise;
    }

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

        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('scroll', onScroll);
        canvas.addEventListener('click', onClick);
        window.addEventListener('resize', onResize);
        window.addEventListener('themechange', onThemeChange);
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', onThemeChange);
        window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', function(e) {
            reducedMotion = e.matches;
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
        if (!scenes[name]) return false;

        if (activeScene && activeScene.destroy) {
            activeScene.destroy();
        }

        activeSceneName = name;
        activeScene = scenes[name];
        activeScene.init(renderer, canvas);
        activeScene.resize(window.innerWidth, window.innerHeight);
        return true;
    }

    function startScene() {
        if (canvas) canvas.style.display = 'block';
        document.body.classList.add('village-active');
        isRunning = true;
        if (animationId) cancelAnimationFrame(animationId);
        animate();
    }

    function stopScene() {
        if (animationId) cancelAnimationFrame(animationId);
        if (canvas) canvas.style.display = 'none';
        document.body.classList.remove('village-active');
        isRunning = false;
        activeSceneName = null;
    }

    function activate(name) {
        return loadEngine().then(function() {
            if (switchScene(name)) {
                startScene();
                localStorage.setItem(STORAGE_KEY, name);
            }
        }).catch(function() { /* already logged */ }).then(updateControl);
    }

    function deactivate() {
        stopScene();
        localStorage.setItem(STORAGE_KEY, 'off');
        updateControl();
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
    // SINGLE "BACKGROUND" CONTROL (bottom-right, >= 1600px only via CSS)
    //
    //   [ BACKGROUND: OFF ]  -> click ->  menu: Off / Village / Particles / Focus
    // ========================================================================
    var control = {};

    function createControl() {
        var container = document.createElement('div');
        container.className = 'scene-control';

        var menu = document.createElement('div');
        menu.className = 'scene-control__menu';
        menu.id = 'scene-control-menu';
        menu.hidden = true;

        var toggle = document.createElement('button');
        toggle.className = 'village-toggle scene-control__toggle';
        toggle.type = 'button';
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-controls', menu.id);
        toggle.setAttribute('aria-label', 'Background scene options');
        toggle.addEventListener('click', function() {
            var open = menu.hidden;
            menu.hidden = !open;
            toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
        });

        function option(label, ariaLabel, onClick) {
            var btn = document.createElement('button');
            btn.className = 'village-toggle';
            btn.type = 'button';
            btn.textContent = label;
            btn.setAttribute('aria-label', ariaLabel);
            btn.setAttribute('aria-pressed', 'false');
            btn.addEventListener('click', function() {
                onClick();
                // Choosing an option closes the menu; keeps the control small.
                menu.hidden = true;
                toggle.setAttribute('aria-expanded', 'false');
                toggle.focus();
            });
            menu.appendChild(btn);
            return btn;
        }

        control.off = option('Off', 'Turn background scene off', function() { deactivate(); });
        control.sceneButtons = {};
        Object.keys(SCENE_LABELS).forEach(function(name) {
            control.sceneButtons[name] = option(SCENE_LABELS[name], 'Show ' + SCENE_LABELS[name] + ' background', function() {
                activate(name);
            });
        });
        control.focus = option('Focus', 'Focus mode: hide content, show only the 3D scene', function() {
            focusMode = !focusMode;
            document.body.classList.toggle('scene-focus', focusMode);
            updateControl();
        });

        container.appendChild(menu);
        container.appendChild(toggle);
        document.body.appendChild(container);

        control.toggle = toggle;
        control.menu = menu;

        // Close the menu on Escape or outside click
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && !menu.hidden) {
                menu.hidden = true;
                toggle.setAttribute('aria-expanded', 'false');
                toggle.focus();
            }
        });
        document.addEventListener('click', function(e) {
            if (!menu.hidden && !container.contains(e.target)) {
                menu.hidden = true;
                toggle.setAttribute('aria-expanded', 'false');
            }
        });

        updateControl();
    }

    function updateControl() {
        if (!control.toggle) return;
        var current = isRunning && activeSceneName ? SCENE_LABELS[activeSceneName] : 'Off';
        control.toggle.textContent = 'Background: ' + current;
        control.toggle.classList.toggle('active', isRunning);

        control.off.classList.toggle('active', !isRunning);
        control.off.setAttribute('aria-pressed', isRunning ? 'false' : 'true');
        Object.keys(control.sceneButtons).forEach(function(name) {
            var on = isRunning && activeSceneName === name;
            control.sceneButtons[name].classList.toggle('active', on);
            control.sceneButtons[name].setAttribute('aria-pressed', on ? 'true' : 'false');
        });
        control.focus.classList.toggle('active', focusMode);
        control.focus.setAttribute('aria-pressed', focusMode ? 'true' : 'false');
        control.focus.disabled = !isRunning;
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
        if (!webglAvailable()) return;

        createControl();

        // Only restore a scene the visitor explicitly turned on before.
        var saved = localStorage.getItem(STORAGE_KEY);
        if (saved && SCENE_LABELS[saved]) {
            activate(saved);
        }
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
