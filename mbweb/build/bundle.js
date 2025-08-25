
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
var app = (function () {
    'use strict';

    function noop() { }
    function is_promise(value) {
        return value && typeof value === 'object' && typeof value.then === 'function';
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function validate_store(store, name) {
        if (store != null && typeof store.subscribe !== 'function') {
            throw new Error(`'${name}' is not a store with a 'subscribe' method`);
        }
    }
    function subscribe(store, ...callbacks) {
        if (store == null) {
            return noop;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function component_subscribe(component, store, callback) {
        component.$$.on_destroy.push(subscribe(store, callback));
    }
    function set_store_value(store, ret, value = ret) {
        store.set(value);
        return ret;
    }

    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_style(node, key, value, important) {
        node.style.setProperty(key, value, important ? 'important' : '');
    }
    function custom_event(type, detail) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, false, false, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    let flushing = false;
    const seen_callbacks = new Set();
    function flush() {
        if (flushing)
            return;
        flushing = true;
        do {
            // first, call beforeUpdate functions
            // and update components
            for (let i = 0; i < dirty_components.length; i += 1) {
                const component = dirty_components[i];
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        flushing = false;
        seen_callbacks.clear();
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }

    function handle_promise(promise, info) {
        const token = info.token = {};
        function update(type, index, key, value) {
            if (info.token !== token)
                return;
            info.resolved = value;
            let child_ctx = info.ctx;
            if (key !== undefined) {
                child_ctx = child_ctx.slice();
                child_ctx[key] = value;
            }
            const block = type && (info.current = type)(child_ctx);
            let needs_flush = false;
            if (info.block) {
                if (info.blocks) {
                    info.blocks.forEach((block, i) => {
                        if (i !== index && block) {
                            group_outros();
                            transition_out(block, 1, 1, () => {
                                info.blocks[i] = null;
                            });
                            check_outros();
                        }
                    });
                }
                else {
                    info.block.d(1);
                }
                block.c();
                transition_in(block, 1);
                block.m(info.mount(), info.anchor);
                needs_flush = true;
            }
            info.block = block;
            if (info.blocks)
                info.blocks[index] = block;
            if (needs_flush) {
                flush();
            }
        }
        if (is_promise(promise)) {
            const current_component = get_current_component();
            promise.then(value => {
                set_current_component(current_component);
                update(info.then, 1, info.value, value);
                set_current_component(null);
            }, error => {
                set_current_component(current_component);
                update(info.catch, 2, info.error, error);
                set_current_component(null);
                if (!info.hasCatch) {
                    throw error;
                }
            });
            // if we previously had a then/catch block, destroy it
            if (info.current !== info.pending) {
                update(info.pending, 0);
                return true;
            }
        }
        else {
            if (info.current !== info.then) {
                update(info.then, 1, info.value, promise);
                return true;
            }
            info.resolved = promise;
        }
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        // onMount happens before the initial afterUpdate
        add_render_callback(() => {
            const new_on_destroy = on_mount.map(run).filter(is_function);
            if (on_destroy) {
                on_destroy.push(...new_on_destroy);
            }
            else {
                // Edge case - component was destroyed immediately,
                // most likely as a result of a binding initialising
                run_all(new_on_destroy);
            }
            component.$$.on_mount = [];
        });
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const prop_values = options.props || {};
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            before_update: [],
            after_update: [],
            context: new Map(parent_component ? parent_component.$$.context : []),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false
        };
        let ready = false;
        $$.ctx = instance
            ? instance(component, prop_values, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.31.0' }, detail)));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function prop_dev(node, property, value) {
        node[property] = value;
        dispatch_dev('SvelteDOMSetProperty', { node, property, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    const subscriber_queue = [];
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = [];
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (let i = 0; i < subscribers.length; i += 1) {
                        const s = subscribers[i];
                        s[1]();
                        subscriber_queue.push(s, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.push(subscriber);
            if (subscribers.length === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                const index = subscribers.indexOf(subscriber);
                if (index !== -1) {
                    subscribers.splice(index, 1);
                }
                if (subscribers.length === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }

    const appStore = writable({});

    /* src/Navbar.svelte generated by Svelte v3.31.0 */
    const file = "src/Navbar.svelte";

    function create_fragment(ctx) {
    	let nav;
    	let div;
    	let button0;
    	let t0;
    	let button0_disabled_value;
    	let t1;
    	let button1;
    	let t2;
    	let button1_disabled_value;
    	let t3;
    	let button2;
    	let t4;
    	let button2_disabled_value;
    	let t5;
    	let button3;
    	let t6;
    	let button3_disabled_value;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			nav = element("nav");
    			div = element("div");
    			button0 = element("button");
    			t0 = text("Inicio");
    			t1 = space();
    			button1 = element("button");
    			t2 = text("Ingresar");
    			t3 = space();
    			button2 = element("button");
    			t4 = text("Registro");
    			t5 = space();
    			button3 = element("button");
    			t6 = text("Salir");
    			attr_dev(button0, "class", "btn btn-light");
    			button0.disabled = button0_disabled_value = /*$appStore*/ ctx[0].route == "home";
    			add_location(button0, file, 22, 8, 481);
    			attr_dev(button1, "class", "btn btn-light");
    			button1.disabled = button1_disabled_value = /*$appStore*/ ctx[0].route == "login";
    			add_location(button1, file, 23, 8, 593);
    			attr_dev(button2, "class", "btn btn-light");
    			button2.disabled = button2_disabled_value = /*$appStore*/ ctx[0].route == "signin";
    			add_location(button2, file, 24, 8, 709);
    			attr_dev(button3, "class", "btn btn-light");
    			button3.disabled = button3_disabled_value = /*$appStore*/ ctx[0].route == "logout";
    			add_location(button3, file, 25, 8, 827);
    			attr_dev(div, "class", "btn-group btn-group-lg");
    			attr_dev(div, "role", "group");
    			attr_dev(div, "aria-label", "Navigation");
    			add_location(div, file, 21, 4, 399);
    			attr_dev(nav, "class", "navbar navbar-light");
    			add_location(nav, file, 20, 0, 361);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, nav, anchor);
    			append_dev(nav, div);
    			append_dev(div, button0);
    			append_dev(button0, t0);
    			append_dev(div, t1);
    			append_dev(div, button1);
    			append_dev(button1, t2);
    			append_dev(div, t3);
    			append_dev(div, button2);
    			append_dev(button2, t4);
    			append_dev(div, t5);
    			append_dev(div, button3);
    			append_dev(button3, t6);

    			if (!mounted) {
    				dispose = [
    					listen_dev(button0, "click", /*homeRoute*/ ctx[1], false, false, false),
    					listen_dev(button1, "click", /*loginRoute*/ ctx[2], false, false, false),
    					listen_dev(button2, "click", /*signinRoute*/ ctx[3], false, false, false),
    					listen_dev(button3, "click", /*logoutRoute*/ ctx[4], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*$appStore*/ 1 && button0_disabled_value !== (button0_disabled_value = /*$appStore*/ ctx[0].route == "home")) {
    				prop_dev(button0, "disabled", button0_disabled_value);
    			}

    			if (dirty & /*$appStore*/ 1 && button1_disabled_value !== (button1_disabled_value = /*$appStore*/ ctx[0].route == "login")) {
    				prop_dev(button1, "disabled", button1_disabled_value);
    			}

    			if (dirty & /*$appStore*/ 1 && button2_disabled_value !== (button2_disabled_value = /*$appStore*/ ctx[0].route == "signin")) {
    				prop_dev(button2, "disabled", button2_disabled_value);
    			}

    			if (dirty & /*$appStore*/ 1 && button3_disabled_value !== (button3_disabled_value = /*$appStore*/ ctx[0].route == "logout")) {
    				prop_dev(button3, "disabled", button3_disabled_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(nav);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let $appStore;
    	validate_store(appStore, "appStore");
    	component_subscribe($$self, appStore, $$value => $$invalidate(0, $appStore = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Navbar", slots, []);

    	function homeRoute(event) {
    		set_store_value(appStore, $appStore.route = "home", $appStore);
    	}

    	function loginRoute(event) {
    		set_store_value(appStore, $appStore.route = "login", $appStore);
    	}

    	function signinRoute(event) {
    		set_store_value(appStore, $appStore.route = "signin", $appStore);
    	}

    	function logoutRoute(event) {
    		set_store_value(appStore, $appStore.route = "logout", $appStore);
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Navbar> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		appStore,
    		homeRoute,
    		loginRoute,
    		signinRoute,
    		logoutRoute,
    		$appStore
    	});

    	return [$appStore, homeRoute, loginRoute, signinRoute, logoutRoute];
    }

    class Navbar extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Navbar",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    /* src/Header.svelte generated by Svelte v3.31.0 */
    const file$1 = "src/Header.svelte";

    function create_fragment$1(ctx) {
    	let header;
    	let t0;
    	let div3;
    	let div2;
    	let div0;
    	let img;
    	let img_src_value;
    	let t1;
    	let div1;
    	let navbar;
    	let current;
    	navbar = new Navbar({ $$inline: true });

    	const block = {
    		c: function create() {
    			header = element("header");
    			t0 = space();
    			div3 = element("div");
    			div2 = element("div");
    			div0 = element("div");
    			img = element("img");
    			t1 = space();
    			div1 = element("div");
    			create_component(navbar.$$.fragment);
    			attr_dev(header, "class", "row_container centered");
    			add_location(header, file$1, 4, 0, 64);
    			attr_dev(img, "alt", "Logo");
    			if (img.src !== (img_src_value = "img/logo-horizontal2-mb.png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "class", "logo");
    			add_location(img, file$1, 10, 6, 190);
    			attr_dev(div0, "class", "col-sm");
    			add_location(div0, file$1, 9, 4, 163);
    			attr_dev(div1, "class", "col-sm");
    			add_location(div1, file$1, 12, 4, 269);
    			attr_dev(div2, "class", "row");
    			add_location(div2, file$1, 8, 2, 141);
    			attr_dev(div3, "class", "container");
    			add_location(div3, file$1, 7, 0, 115);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, header, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, div3, anchor);
    			append_dev(div3, div2);
    			append_dev(div2, div0);
    			append_dev(div0, img);
    			append_dev(div2, t1);
    			append_dev(div2, div1);
    			mount_component(navbar, div1, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(navbar.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(navbar.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(header);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div3);
    			destroy_component(navbar);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Header", slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Header> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ Navbar });
    	return [];
    }

    class Header extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Header",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    /* src/Footer.svelte generated by Svelte v3.31.0 */
    const file$2 = "src/Footer.svelte";

    function create_fragment$2(ctx) {
    	let footer;
    	let h5;
    	let t1;
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			footer = element("footer");
    			h5 = element("h5");
    			h5.textContent = "Copyright(c) 2020 - MyBill";
    			t1 = space();
    			button = element("button");
    			button.textContent = "Ir al Inicio";
    			add_location(h5, file$2, 9, 4, 201);
    			add_location(button, file$2, 11, 5, 243);
    			attr_dev(footer, "class", "row_container  align-items-center space_between");
    			add_location(footer, file$2, 8, 0, 132);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, footer, anchor);
    			append_dev(footer, h5);
    			append_dev(footer, t1);
    			append_dev(footer, button);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*homeRoute*/ ctx[0], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(footer);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let $appStore;
    	validate_store(appStore, "appStore");
    	component_subscribe($$self, appStore, $$value => $$invalidate(1, $appStore = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Footer", slots, []);

    	function homeRoute(event) {
    		set_store_value(appStore, $appStore.route = "home", $appStore);
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Footer> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ appStore, homeRoute, $appStore });
    	return [homeRoute];
    }

    class Footer extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Footer",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    /* src/CompanyRole.svelte generated by Svelte v3.31.0 */
    const file$3 = "src/CompanyRole.svelte";

    // (64:8) {:else}
    function create_else_block(ctx) {
    	let p;
    	let t_value = /*role*/ ctx[0].code + "";
    	let t;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t = text(t_value);
    			add_location(p, file$3, 64, 12, 2449);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*role*/ 1 && t_value !== (t_value = /*role*/ ctx[0].code + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(64:8) {:else}",
    		ctx
    	});

    	return block;
    }

    // (50:41) 
    function create_if_block_2(ctx) {
    	let img;
    	let img_src_value;
    	let t0;
    	let div;
    	let t1;
    	let ul;
    	let li0;
    	let t3;
    	let li1;
    	let t5;
    	let li2;
    	let t7;
    	let li3;
    	let t9;
    	let button;

    	const block = {
    		c: function create() {
    			img = element("img");
    			t0 = space();
    			div = element("div");
    			t1 = text("Lorem ipsum dolor sit amet consectetur, adipisicing elit.\n                 quis.\n                ");
    			ul = element("ul");
    			li0 = element("li");
    			li0.textContent = "Numquam dicta ex molestiae voluptatem alias atque";
    			t3 = space();
    			li1 = element("li");
    			li1.textContent = "erum ipsum eaque et vero quas?";
    			t5 = space();
    			li2 = element("li");
    			li2.textContent = "Eius exercitationem, temporibus tempora";
    			t7 = space();
    			li3 = element("li");
    			li3.textContent = "Ex repudiandae veniam necessitatibus";
    			t9 = space();
    			button = element("button");
    			button.textContent = "Pagar Facturas";
    			if (img.src !== (img_src_value = "img/icons/price_tag.svg")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "class", "big_icon");
    			attr_dev(img, "alt", "Pagador");
    			add_location(img, file$3, 50, 12, 1834);
    			add_location(li0, file$3, 55, 20, 2059);
    			add_location(li1, file$3, 56, 20, 2138);
    			add_location(li2, file$3, 57, 20, 2198);
    			add_location(li3, file$3, 58, 20, 2267);
    			add_location(ul, file$3, 54, 16, 2034);
    			attr_dev(button, "class", "btn_first");
    			add_location(button, file$3, 60, 16, 2351);
    			add_location(div, file$3, 51, 12, 1915);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, div, anchor);
    			append_dev(div, t1);
    			append_dev(div, ul);
    			append_dev(ul, li0);
    			append_dev(ul, t3);
    			append_dev(ul, li1);
    			append_dev(ul, t5);
    			append_dev(ul, li2);
    			append_dev(ul, t7);
    			append_dev(ul, li3);
    			append_dev(div, t9);
    			append_dev(div, button);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(img);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(50:41) ",
    		ctx
    	});

    	return block;
    }

    // (34:42) 
    function create_if_block_1(ctx) {
    	let div;
    	let t0;
    	let ul;
    	let li0;
    	let t2;
    	let li1;
    	let t4;
    	let li2;
    	let t6;
    	let li3;
    	let t8;
    	let li4;
    	let t10;
    	let button0;
    	let t12;
    	let button1;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t0 = text("Descuenta tus facturas de forma ágil y oportuna a un costo\n                razonable.\n                ");
    			ul = element("ul");
    			li0 = element("li");
    			li0.textContent = "Rápida financiación";
    			t2 = space();
    			li1 = element("li");
    			li1.textContent = "Alivia el flujo de caja";
    			t4 = space();
    			li2 = element("li");
    			li2.textContent = "Mantiene la operatividad";
    			t6 = space();
    			li3 = element("li");
    			li3.textContent = "Genera nuevos negocios";
    			t8 = space();
    			li4 = element("li");
    			li4.textContent = "Permite crecimiento";
    			t10 = space();
    			button0 = element("button");
    			button0.textContent = "Solicitar Registro";
    			t12 = text("\n                ¿Ya estás registrado? \n                ");
    			button1 = element("button");
    			button1.textContent = "Ingresar";
    			add_location(li0, file$3, 38, 20, 1278);
    			add_location(li1, file$3, 39, 20, 1327);
    			add_location(li2, file$3, 40, 20, 1380);
    			add_location(li3, file$3, 41, 20, 1434);
    			add_location(li4, file$3, 42, 20, 1486);
    			add_location(ul, file$3, 37, 16, 1253);
    			attr_dev(button0, "class", "btn btn-primary");
    			add_location(button0, file$3, 44, 16, 1553);
    			attr_dev(button1, "class", "btn btn-link");
    			add_location(button1, file$3, 46, 16, 1691);
    			add_location(div, file$3, 34, 12, 1129);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t0);
    			append_dev(div, ul);
    			append_dev(ul, li0);
    			append_dev(ul, t2);
    			append_dev(ul, li1);
    			append_dev(ul, t4);
    			append_dev(ul, li2);
    			append_dev(ul, t6);
    			append_dev(ul, li3);
    			append_dev(ul, t8);
    			append_dev(ul, li4);
    			append_dev(div, t10);
    			append_dev(div, button0);
    			append_dev(div, t12);
    			append_dev(div, button1);

    			if (!mounted) {
    				dispose = [
    					listen_dev(button0, "click", /*signinRoute*/ ctx[1], false, false, false),
    					listen_dev(button1, "click", /*loginRoute*/ ctx[2], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(34:42) ",
    		ctx
    	});

    	return block;
    }

    // (18:8) {#if role.code == 'Comprador'}
    function create_if_block(ctx) {
    	let div;
    	let t0;
    	let ul;
    	let li0;
    	let t2;
    	let li1;
    	let t4;
    	let li2;
    	let t6;
    	let li3;
    	let t8;
    	let li4;
    	let t10;
    	let button0;
    	let t12;
    	let button1;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t0 = text("Invierta en facturas aceptadas de emisores y pagadores\n                previamente evaluados\n                ");
    			ul = element("ul");
    			li0 = element("li");
    			li0.textContent = "Minimiza riesgos operativos";
    			t2 = space();
    			li1 = element("li");
    			li1.textContent = "Mejor rentabilidad vs mercado tradicional";
    			t4 = space();
    			li2 = element("li");
    			li2.textContent = "Operaciones de corto plazo";
    			t6 = space();
    			li3 = element("li");
    			li3.textContent = "Alta rotación del capital";
    			t8 = space();
    			li4 = element("li");
    			li4.textContent = "Capitaliza la inversión inicial";
    			t10 = space();
    			button0 = element("button");
    			button0.textContent = "Solicitar Registro";
    			t12 = text("\n                ¿Ya estás registrado? \n                ");
    			button1 = element("button");
    			button1.textContent = "Ingresar";
    			add_location(li0, file$3, 22, 20, 513);
    			add_location(li1, file$3, 23, 20, 570);
    			add_location(li2, file$3, 24, 20, 641);
    			add_location(li3, file$3, 25, 20, 697);
    			add_location(li4, file$3, 26, 20, 752);
    			add_location(ul, file$3, 21, 16, 488);
    			attr_dev(button0, "class", "btn btn-primary");
    			add_location(button0, file$3, 28, 16, 831);
    			attr_dev(button1, "class", "btn btn-link");
    			add_location(button1, file$3, 30, 16, 969);
    			add_location(div, file$3, 18, 12, 357);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t0);
    			append_dev(div, ul);
    			append_dev(ul, li0);
    			append_dev(ul, t2);
    			append_dev(ul, li1);
    			append_dev(ul, t4);
    			append_dev(ul, li2);
    			append_dev(ul, t6);
    			append_dev(ul, li3);
    			append_dev(ul, t8);
    			append_dev(ul, li4);
    			append_dev(div, t10);
    			append_dev(div, button0);
    			append_dev(div, t12);
    			append_dev(div, button1);

    			if (!mounted) {
    				dispose = [
    					listen_dev(button0, "click", /*signinRoute*/ ctx[1], false, false, false),
    					listen_dev(button1, "click", /*loginRoute*/ ctx[2], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(18:8) {#if role.code == 'Comprador'}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let div1;
    	let h2;
    	let t0_value = /*role*/ ctx[0].name + "";
    	let t0;
    	let t1;
    	let div0;

    	function select_block_type(ctx, dirty) {
    		if (/*role*/ ctx[0].code == "Comprador") return create_if_block;
    		if (/*role*/ ctx[0].code == "Vendedor") return create_if_block_1;
    		if (/*role*/ ctx[0].code == "Pagador") return create_if_block_2;
    		return create_else_block;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			h2 = element("h2");
    			t0 = text(t0_value);
    			t1 = space();
    			div0 = element("div");
    			if_block.c();
    			add_location(h2, file$3, 15, 4, 256);
    			attr_dev(div0, "class", "jumbotron");
    			add_location(div0, file$3, 16, 4, 282);
    			attr_dev(div1, "class", "card");
    			add_location(div1, file$3, 14, 0, 233);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, h2);
    			append_dev(h2, t0);
    			append_dev(div1, t1);
    			append_dev(div1, div0);
    			if_block.m(div0, null);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*role*/ 1 && t0_value !== (t0_value = /*role*/ ctx[0].name + "")) set_data_dev(t0, t0_value);

    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(div0, null);
    				}
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let $appStore;
    	validate_store(appStore, "appStore");
    	component_subscribe($$self, appStore, $$value => $$invalidate(3, $appStore = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("CompanyRole", slots, []);
    	let { role } = $$props;

    	function signinRoute(event) {
    		set_store_value(appStore, $appStore.route = "signin", $appStore);
    	}

    	function loginRoute(event) {
    		set_store_value(appStore, $appStore.route = "login", $appStore);
    	}

    	const writable_props = ["role"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<CompanyRole> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("role" in $$props) $$invalidate(0, role = $$props.role);
    	};

    	$$self.$capture_state = () => ({
    		appStore,
    		role,
    		signinRoute,
    		loginRoute,
    		$appStore
    	});

    	$$self.$inject_state = $$props => {
    		if ("role" in $$props) $$invalidate(0, role = $$props.role);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [role, signinRoute, loginRoute];
    }

    class CompanyRole extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, { role: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "CompanyRole",
    			options,
    			id: create_fragment$3.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*role*/ ctx[0] === undefined && !("role" in props)) {
    			console.warn("<CompanyRole> was created without expected prop 'role'");
    		}
    	}

    	get role() {
    		throw new Error("<CompanyRole>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set role(value) {
    		throw new Error("<CompanyRole>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/CompanyRoleList.svelte generated by Svelte v3.31.0 */
    const file$4 = "src/CompanyRoleList.svelte";

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[6] = list[i];
    	return child_ctx;
    }

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[6] = list[i];
    	return child_ctx;
    }

    // (39:4) {:else}
    function create_else_block_1(ctx) {
    	let each_1_anchor;
    	let current;
    	let each_value_1 = /*defaultRoles*/ ctx[1].data;
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	let each_1_else_1 = null;

    	if (!each_value_1.length) {
    		each_1_else_1 = create_else_block_2(ctx);
    	}

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();

    			if (each_1_else_1) {
    				each_1_else_1.c();
    			}
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);

    			if (each_1_else_1) {
    				each_1_else_1.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*defaultRoles*/ 2) {
    				each_value_1 = /*defaultRoles*/ ctx[1].data;
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block_1(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				group_outros();

    				for (i = each_value_1.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();

    				if (each_value_1.length) {
    					if (each_1_else_1) {
    						each_1_else_1.d(1);
    						each_1_else_1 = null;
    					}
    				} else if (!each_1_else_1) {
    					each_1_else_1 = create_else_block_2(ctx);
    					each_1_else_1.c();
    					each_1_else_1.m(each_1_anchor.parentNode, each_1_anchor);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value_1.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    			if (each_1_else_1) each_1_else_1.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_1.name,
    		type: "else",
    		source: "(39:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (27:4) {#if callAPI }
    function create_if_block$1(ctx) {
    	let await_block_anchor;
    	let promise;
    	let current;

    	let info = {
    		ctx,
    		current: null,
    		token: null,
    		hasCatch: true,
    		pending: create_pending_block,
    		then: create_then_block,
    		catch: create_catch_block,
    		value: 5,
    		error: 9,
    		blocks: [,,,]
    	};

    	handle_promise(promise = /*rolesPromise*/ ctx[2], info);

    	const block = {
    		c: function create() {
    			await_block_anchor = empty();
    			info.block.c();
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, await_block_anchor, anchor);
    			info.block.m(target, info.anchor = anchor);
    			info.mount = () => await_block_anchor.parentNode;
    			info.anchor = await_block_anchor;
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			{
    				const child_ctx = ctx.slice();
    				child_ctx[5] = child_ctx[9] = info.resolved;
    				info.block.p(child_ctx, dirty);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(info.block);
    			current = true;
    		},
    		o: function outro(local) {
    			for (let i = 0; i < 3; i += 1) {
    				const block = info.blocks[i];
    				transition_out(block);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(await_block_anchor);
    			info.block.d(detaching);
    			info.token = null;
    			info = null;
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(27:4) {#if callAPI }",
    		ctx
    	});

    	return block;
    }

    // (42:8) {:else}
    function create_else_block_2(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			div.textContent = "No encontré roles";
    			add_location(div, file$4, 42, 12, 1264);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_2.name,
    		type: "else",
    		source: "(42:8) {:else}",
    		ctx
    	});

    	return block;
    }

    // (40:8) {#each defaultRoles.data as role}
    function create_each_block_1(ctx) {
    	let companyrole;
    	let current;

    	companyrole = new CompanyRole({
    			props: { role: /*role*/ ctx[6] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(companyrole.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(companyrole, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(companyrole.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(companyrole.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(companyrole, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(40:8) {#each defaultRoles.data as role}",
    		ctx
    	});

    	return block;
    }

    // (36:8) {:catch error}
    function create_catch_block(ctx) {
    	let div;
    	let t0;
    	let t1_value = /*error*/ ctx[9].message + "";
    	let t1;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t0 = text("Error: ");
    			t1 = text(t1_value);
    			add_location(div, file$4, 36, 12, 1092);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t0);
    			append_dev(div, t1);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_catch_block.name,
    		type: "catch",
    		source: "(36:8) {:catch error}",
    		ctx
    	});

    	return block;
    }

    // (30:8) {:then roles}
    function create_then_block(ctx) {
    	let each_1_anchor;
    	let current;
    	let each_value = /*roles*/ ctx[5].data;
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	let each_1_else = null;

    	if (!each_value.length) {
    		each_1_else = create_else_block$1(ctx);
    	}

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();

    			if (each_1_else) {
    				each_1_else.c();
    			}
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);

    			if (each_1_else) {
    				each_1_else.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*rolesPromise*/ 4) {
    				each_value = /*roles*/ ctx[5].data;
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();

    				if (each_value.length) {
    					if (each_1_else) {
    						each_1_else.d(1);
    						each_1_else = null;
    					}
    				} else if (!each_1_else) {
    					each_1_else = create_else_block$1(ctx);
    					each_1_else.c();
    					each_1_else.m(each_1_anchor.parentNode, each_1_anchor);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    			if (each_1_else) each_1_else.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_then_block.name,
    		type: "then",
    		source: "(30:8) {:then roles}",
    		ctx
    	});

    	return block;
    }

    // (33:12) {:else}
    function create_else_block$1(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			div.textContent = "No encontré roles";
    			add_location(div, file$4, 33, 16, 1008);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$1.name,
    		type: "else",
    		source: "(33:12) {:else}",
    		ctx
    	});

    	return block;
    }

    // (31:12) {#each roles.data as role}
    function create_each_block(ctx) {
    	let companyrole;
    	let current;

    	companyrole = new CompanyRole({
    			props: { role: /*role*/ ctx[6] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(companyrole.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(companyrole, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(companyrole.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(companyrole.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(companyrole, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(31:12) {#each roles.data as role}",
    		ctx
    	});

    	return block;
    }

    // (28:29)              <div>Procesando ...</div>         {:then roles}
    function create_pending_block(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			div.textContent = "Procesando ...";
    			add_location(div, file$4, 28, 12, 842);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_pending_block.name,
    		type: "pending",
    		source: "(28:29)              <div>Procesando ...</div>         {:then roles}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$4(ctx) {
    	let div;
    	let current_block_type_index;
    	let if_block;
    	let current;
    	const if_block_creators = [create_if_block$1, create_else_block_1];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*callAPI*/ ctx[0]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if_block.c();
    			attr_dev(div, "class", "row_container centered");
    			add_location(div, file$4, 25, 0, 744);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if_blocks[current_block_type_index].m(div, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if_block.p(ctx, dirty);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if_blocks[current_block_type_index].d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("CompanyRoleList", slots, []);
    	let callAPI = false;
    	let jsonData = [];

    	const defaultRoles = {
    		data: [
    			{
    				rowStatus: "A",
    				code: "Vendedor",
    				name: "Vender facturas"
    			},
    			{
    				rowStatus: "A",
    				code: "Comprador",
    				name: "Comprar facturas"
    			}
    		]
    	};

    	async function getCompanyRoles() {
    		const url = "http://localhost:8080/api/companyRoles";
    		const res = await fetch(url);

    		//if (!res.ok || res.status === 404) return []; 
    		if (!res.ok || res.status === 404) return defaultRoles;

    		jsonData = await res.json();

    		//console.log('jsonData:', jsonData);
    		return jsonData;
    	}

    	let rolesPromise = getCompanyRoles();
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<CompanyRoleList> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		CompanyRole,
    		callAPI,
    		jsonData,
    		defaultRoles,
    		getCompanyRoles,
    		rolesPromise
    	});

    	$$self.$inject_state = $$props => {
    		if ("callAPI" in $$props) $$invalidate(0, callAPI = $$props.callAPI);
    		if ("jsonData" in $$props) jsonData = $$props.jsonData;
    		if ("rolesPromise" in $$props) $$invalidate(2, rolesPromise = $$props.rolesPromise);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [callAPI, defaultRoles, rolesPromise];
    }

    class CompanyRoleList extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "CompanyRoleList",
    			options,
    			id: create_fragment$4.name
    		});
    	}
    }

    /* src/Login.svelte generated by Svelte v3.31.0 */
    const file$5 = "src/Login.svelte";

    function create_fragment$5(ctx) {
    	let div3;
    	let form;
    	let div0;
    	let label0;
    	let t1;
    	let input0;
    	let t2;
    	let small;
    	let t4;
    	let div1;
    	let label1;
    	let t6;
    	let input1;
    	let t7;
    	let div2;
    	let input2;
    	let t8;
    	let label2;
    	let t10;
    	let button;

    	const block = {
    		c: function create() {
    			div3 = element("div");
    			form = element("form");
    			div0 = element("div");
    			label0 = element("label");
    			label0.textContent = "Email address";
    			t1 = space();
    			input0 = element("input");
    			t2 = space();
    			small = element("small");
    			small.textContent = "We'll never share your email with anyone else.";
    			t4 = space();
    			div1 = element("div");
    			label1 = element("label");
    			label1.textContent = "Password";
    			t6 = space();
    			input1 = element("input");
    			t7 = space();
    			div2 = element("div");
    			input2 = element("input");
    			t8 = space();
    			label2 = element("label");
    			label2.textContent = "Check me out";
    			t10 = space();
    			button = element("button");
    			button.textContent = "Ingresar";
    			attr_dev(label0, "for", "exampleInputEmail1");
    			add_location(label0, file$5, 11, 10, 223);
    			attr_dev(input0, "type", "email");
    			attr_dev(input0, "class", "form-control");
    			attr_dev(input0, "id", "exampleInputEmail1");
    			attr_dev(input0, "aria-describedby", "emailHelp");
    			add_location(input0, file$5, 12, 10, 287);
    			attr_dev(small, "id", "emailHelp");
    			attr_dev(small, "class", "form-text text-muted");
    			add_location(small, file$5, 13, 10, 392);
    			attr_dev(div0, "class", "form-group");
    			add_location(div0, file$5, 10, 8, 188);
    			attr_dev(label1, "for", "exampleInputPassword1");
    			add_location(label1, file$5, 16, 10, 556);
    			attr_dev(input1, "type", "password");
    			attr_dev(input1, "class", "form-control");
    			attr_dev(input1, "id", "exampleInputPassword1");
    			add_location(input1, file$5, 17, 10, 618);
    			attr_dev(div1, "class", "form-group");
    			add_location(div1, file$5, 15, 8, 521);
    			attr_dev(input2, "type", "checkbox");
    			attr_dev(input2, "class", "form-check-input");
    			attr_dev(input2, "id", "exampleCheck1");
    			add_location(input2, file$5, 20, 10, 759);
    			attr_dev(label2, "class", "form-check-label");
    			attr_dev(label2, "for", "exampleCheck1");
    			add_location(label2, file$5, 21, 10, 837);
    			attr_dev(div2, "class", "form-group form-check");
    			add_location(div2, file$5, 19, 8, 713);
    			attr_dev(button, "type", "submit");
    			attr_dev(button, "class", "btn btn-primary");
    			add_location(button, file$5, 23, 8, 933);
    			add_location(form, file$5, 9, 4, 173);
    			attr_dev(div3, "class", "row_container centered");
    			add_location(div3, file$5, 8, 0, 132);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div3, anchor);
    			append_dev(div3, form);
    			append_dev(form, div0);
    			append_dev(div0, label0);
    			append_dev(div0, t1);
    			append_dev(div0, input0);
    			append_dev(div0, t2);
    			append_dev(div0, small);
    			append_dev(form, t4);
    			append_dev(form, div1);
    			append_dev(div1, label1);
    			append_dev(div1, t6);
    			append_dev(div1, input1);
    			append_dev(form, t7);
    			append_dev(form, div2);
    			append_dev(div2, input2);
    			append_dev(div2, t8);
    			append_dev(div2, label2);
    			append_dev(form, t10);
    			append_dev(form, button);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div3);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let $appStore;
    	validate_store(appStore, "appStore");
    	component_subscribe($$self, appStore, $$value => $$invalidate(0, $appStore = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Login", slots, []);

    	function homeRoute(event) {
    		set_store_value(appStore, $appStore.route = "home", $appStore);
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Login> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ appStore, homeRoute, $appStore });
    	return [];
    }

    class Login extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Login",
    			options,
    			id: create_fragment$5.name
    		});
    	}
    }

    /* src/Logout.svelte generated by Svelte v3.31.0 */
    const file$6 = "src/Logout.svelte";

    function create_fragment$6(ctx) {
    	let div1;
    	let form;
    	let div0;
    	let input;
    	let t0;
    	let label;
    	let t2;
    	let button;

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			form = element("form");
    			div0 = element("div");
    			input = element("input");
    			t0 = space();
    			label = element("label");
    			label.textContent = "Deseo Terminar mi Sesión";
    			t2 = space();
    			button = element("button");
    			button.textContent = "Salir";
    			attr_dev(input, "type", "checkbox");
    			attr_dev(input, "class", "form-check-input");
    			attr_dev(input, "id", "exampleCheck1");
    			add_location(input, file$6, 11, 10, 234);
    			attr_dev(label, "class", "form-check-label");
    			attr_dev(label, "for", "exampleCheck1");
    			add_location(label, file$6, 12, 10, 312);
    			attr_dev(div0, "class", "form-group form-check");
    			add_location(div0, file$6, 10, 8, 188);
    			attr_dev(button, "type", "submit");
    			attr_dev(button, "class", "btn btn-primary");
    			add_location(button, file$6, 14, 8, 420);
    			add_location(form, file$6, 9, 4, 173);
    			attr_dev(div1, "class", "row_container centered");
    			add_location(div1, file$6, 8, 0, 132);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, form);
    			append_dev(form, div0);
    			append_dev(div0, input);
    			append_dev(div0, t0);
    			append_dev(div0, label);
    			append_dev(form, t2);
    			append_dev(form, button);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let $appStore;
    	validate_store(appStore, "appStore");
    	component_subscribe($$self, appStore, $$value => $$invalidate(0, $appStore = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Logout", slots, []);

    	function homeRoute(event) {
    		set_store_value(appStore, $appStore.route = "home", $appStore);
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Logout> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ appStore, homeRoute, $appStore });
    	return [];
    }

    class Logout extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Logout",
    			options,
    			id: create_fragment$6.name
    		});
    	}
    }

    /* src/Signin.svelte generated by Svelte v3.31.0 */
    const file$7 = "src/Signin.svelte";

    function create_fragment$7(ctx) {
    	let div8;
    	let div1;
    	let div0;
    	let t1;
    	let div2;
    	let ul;
    	let li0;
    	let a0;
    	let t3;
    	let li1;
    	let a1;
    	let t5;
    	let li2;
    	let a2;
    	let t7;
    	let div7;
    	let div6;
    	let form;
    	let div3;
    	let label0;
    	let t9;
    	let input0;
    	let t10;
    	let small;
    	let t12;
    	let div4;
    	let label1;
    	let t14;
    	let input1;
    	let t15;
    	let div5;
    	let input2;
    	let t16;
    	let label2;
    	let t18;
    	let button;

    	const block = {
    		c: function create() {
    			div8 = element("div");
    			div1 = element("div");
    			div0 = element("div");
    			div0.textContent = "15%";
    			t1 = space();
    			div2 = element("div");
    			ul = element("ul");
    			li0 = element("li");
    			a0 = element("a");
    			a0.textContent = "Active";
    			t3 = space();
    			li1 = element("li");
    			a1 = element("a");
    			a1.textContent = "Link";
    			t5 = space();
    			li2 = element("li");
    			a2 = element("a");
    			a2.textContent = "Disabled";
    			t7 = space();
    			div7 = element("div");
    			div6 = element("div");
    			form = element("form");
    			div3 = element("div");
    			label0 = element("label");
    			label0.textContent = "New Email address";
    			t9 = space();
    			input0 = element("input");
    			t10 = space();
    			small = element("small");
    			small.textContent = "We'll never share your email with anyone else.";
    			t12 = space();
    			div4 = element("div");
    			label1 = element("label");
    			label1.textContent = "Password";
    			t14 = space();
    			input1 = element("input");
    			t15 = space();
    			div5 = element("div");
    			input2 = element("input");
    			t16 = space();
    			label2 = element("label");
    			label2.textContent = "Check me out";
    			t18 = space();
    			button = element("button");
    			button.textContent = "Next";
    			attr_dev(div0, "class", "progress-bar");
    			attr_dev(div0, "role", "progressbar");
    			set_style(div0, "width", "15%");
    			attr_dev(div0, "aria-valuenow", "15");
    			attr_dev(div0, "aria-valuemin", "0");
    			attr_dev(div0, "aria-valuemax", "100");
    			add_location(div0, file$7, 10, 8, 200);
    			attr_dev(div1, "class", "progress");
    			add_location(div1, file$7, 9, 4, 169);
    			attr_dev(a0, "class", "nav-link active");
    			attr_dev(a0, "href", "#");
    			add_location(a0, file$7, 16, 10, 471);
    			attr_dev(li0, "class", "nav-item");
    			add_location(li0, file$7, 15, 8, 439);
    			attr_dev(a1, "class", "nav-link");
    			attr_dev(a1, "href", "#");
    			add_location(a1, file$7, 19, 10, 572);
    			attr_dev(li1, "class", "nav-item");
    			add_location(li1, file$7, 18, 8, 540);
    			attr_dev(a2, "class", "nav-link disabled");
    			attr_dev(a2, "href", "#");
    			add_location(a2, file$7, 22, 10, 664);
    			attr_dev(li2, "class", "nav-item");
    			add_location(li2, file$7, 21, 8, 632);
    			attr_dev(ul, "class", "nav nav-pills card-header-pills");
    			add_location(ul, file$7, 14, 6, 386);
    			attr_dev(div2, "class", "card-header");
    			add_location(div2, file$7, 13, 4, 354);
    			attr_dev(label0, "for", "exampleInputEmail1");
    			add_location(label0, file$7, 31, 18, 904);
    			attr_dev(input0, "type", "email");
    			attr_dev(input0, "class", "form-control");
    			attr_dev(input0, "id", "exampleInputEmail1");
    			attr_dev(input0, "aria-describedby", "emailHelp");
    			add_location(input0, file$7, 32, 18, 980);
    			attr_dev(small, "id", "emailHelp");
    			attr_dev(small, "class", "form-text text-muted");
    			add_location(small, file$7, 33, 18, 1093);
    			attr_dev(div3, "class", "form-group");
    			add_location(div3, file$7, 30, 16, 861);
    			attr_dev(label1, "for", "exampleInputPassword1");
    			add_location(label1, file$7, 36, 18, 1281);
    			attr_dev(input1, "type", "password");
    			attr_dev(input1, "class", "form-control");
    			attr_dev(input1, "id", "exampleInputPassword1");
    			add_location(input1, file$7, 37, 18, 1351);
    			attr_dev(div4, "class", "form-group");
    			add_location(div4, file$7, 35, 16, 1238);
    			attr_dev(input2, "type", "checkbox");
    			attr_dev(input2, "class", "form-check-input");
    			attr_dev(input2, "id", "exampleCheck1");
    			add_location(input2, file$7, 40, 18, 1516);
    			attr_dev(label2, "class", "form-check-label");
    			attr_dev(label2, "for", "exampleCheck1");
    			add_location(label2, file$7, 41, 18, 1602);
    			attr_dev(div5, "class", "form-group form-check");
    			add_location(div5, file$7, 39, 16, 1462);
    			attr_dev(button, "type", "submit");
    			attr_dev(button, "class", "btn btn-primary");
    			add_location(button, file$7, 43, 16, 1714);
    			add_location(form, file$7, 29, 12, 838);
    			attr_dev(div6, "class", "row_container centered");
    			add_location(div6, file$7, 28, 8, 789);
    			attr_dev(div7, "class", "card-body");
    			add_location(div7, file$7, 26, 4, 756);
    			attr_dev(div8, "class", "card text-center");
    			add_location(div8, file$7, 8, 2, 134);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div8, anchor);
    			append_dev(div8, div1);
    			append_dev(div1, div0);
    			append_dev(div8, t1);
    			append_dev(div8, div2);
    			append_dev(div2, ul);
    			append_dev(ul, li0);
    			append_dev(li0, a0);
    			append_dev(ul, t3);
    			append_dev(ul, li1);
    			append_dev(li1, a1);
    			append_dev(ul, t5);
    			append_dev(ul, li2);
    			append_dev(li2, a2);
    			append_dev(div8, t7);
    			append_dev(div8, div7);
    			append_dev(div7, div6);
    			append_dev(div6, form);
    			append_dev(form, div3);
    			append_dev(div3, label0);
    			append_dev(div3, t9);
    			append_dev(div3, input0);
    			append_dev(div3, t10);
    			append_dev(div3, small);
    			append_dev(form, t12);
    			append_dev(form, div4);
    			append_dev(div4, label1);
    			append_dev(div4, t14);
    			append_dev(div4, input1);
    			append_dev(form, t15);
    			append_dev(form, div5);
    			append_dev(div5, input2);
    			append_dev(div5, t16);
    			append_dev(div5, label2);
    			append_dev(form, t18);
    			append_dev(form, button);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div8);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props, $$invalidate) {
    	let $appStore;
    	validate_store(appStore, "appStore");
    	component_subscribe($$self, appStore, $$value => $$invalidate(0, $appStore = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Signin", slots, []);

    	function homeRoute(event) {
    		set_store_value(appStore, $appStore.route = "home", $appStore);
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Signin> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ appStore, homeRoute, $appStore });
    	return [];
    }

    class Signin extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Signin",
    			options,
    			id: create_fragment$7.name
    		});
    	}
    }

    /* src/MarketList.svelte generated by Svelte v3.31.0 */

    const file$8 = "src/MarketList.svelte";

    function create_fragment$8(ctx) {
    	let div1;
    	let div0;

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			div0.textContent = "Lista en Construcción";
    			add_location(div0, file$8, 2, 4, 42);
    			attr_dev(div1, "class", "row_container centered");
    			add_location(div1, file$8, 1, 0, 1);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$8($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("MarketList", slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<MarketList> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class MarketList extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$8, create_fragment$8, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "MarketList",
    			options,
    			id: create_fragment$8.name
    		});
    	}
    }

    /* src/App.svelte generated by Svelte v3.31.0 */
    const file$9 = "src/App.svelte";

    // (25:4) {:else}
    function create_else_block$2(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			div.textContent = "En construcción.";
    			add_location(div, file$9, 25, 8, 751);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$2.name,
    		type: "else",
    		source: "(25:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (23:42) 
    function create_if_block_4(ctx) {
    	let marketlist;
    	let current;
    	marketlist = new MarketList({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(marketlist.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(marketlist, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(marketlist.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(marketlist.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(marketlist, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4.name,
    		type: "if",
    		source: "(23:42) ",
    		ctx
    	});

    	return block;
    }

    // (21:42) 
    function create_if_block_3(ctx) {
    	let signin;
    	let current;
    	signin = new Signin({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(signin.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(signin, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(signin.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(signin.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(signin, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3.name,
    		type: "if",
    		source: "(21:42) ",
    		ctx
    	});

    	return block;
    }

    // (19:42) 
    function create_if_block_2$1(ctx) {
    	let logout;
    	let current;
    	logout = new Logout({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(logout.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(logout, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(logout.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(logout.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(logout, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$1.name,
    		type: "if",
    		source: "(19:42) ",
    		ctx
    	});

    	return block;
    }

    // (17:41) 
    function create_if_block_1$1(ctx) {
    	let login;
    	let current;
    	login = new Login({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(login.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(login, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(login.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(login.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(login, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$1.name,
    		type: "if",
    		source: "(17:41) ",
    		ctx
    	});

    	return block;
    }

    // (15:4) {#if $appStore.route == 'home'}
    function create_if_block$2(ctx) {
    	let companyrolelist;
    	let current;
    	companyrolelist = new CompanyRoleList({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(companyrolelist.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(companyrolelist, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(companyrolelist.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(companyrolelist.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(companyrolelist, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(15:4) {#if $appStore.route == 'home'}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$9(ctx) {
    	let header;
    	let t0;
    	let current_block_type_index;
    	let if_block;
    	let t1;
    	let footer;
    	let current;
    	header = new Header({ $$inline: true });

    	const if_block_creators = [
    		create_if_block$2,
    		create_if_block_1$1,
    		create_if_block_2$1,
    		create_if_block_3,
    		create_if_block_4,
    		create_else_block$2
    	];

    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*$appStore*/ ctx[0].route == "home") return 0;
    		if (/*$appStore*/ ctx[0].route == "login") return 1;
    		if (/*$appStore*/ ctx[0].route == "logout") return 2;
    		if (/*$appStore*/ ctx[0].route == "signin") return 3;
    		if (/*$appStore*/ ctx[0].route == "market") return 4;
    		return 5;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	footer = new Footer({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(header.$$.fragment);
    			t0 = space();
    			if_block.c();
    			t1 = space();
    			create_component(footer.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(header, target, anchor);
    			insert_dev(target, t0, anchor);
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(footer, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index !== previous_block_index) {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(t1.parentNode, t1);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(header.$$.fragment, local);
    			transition_in(if_block);
    			transition_in(footer.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(header.$$.fragment, local);
    			transition_out(if_block);
    			transition_out(footer.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(header, detaching);
    			if (detaching) detach_dev(t0);
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(footer, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$9.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$9($$self, $$props, $$invalidate) {
    	let $appStore;
    	validate_store(appStore, "appStore");
    	component_subscribe($$self, appStore, $$value => $$invalidate(0, $appStore = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("App", slots, []);
    	set_store_value(appStore, $appStore = { route: "home" }, $appStore);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		appStore,
    		Header,
    		Footer,
    		CompanyRoleList,
    		Login,
    		Logout,
    		Signin,
    		MarketList,
    		$appStore
    	});

    	return [$appStore];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$9, create_fragment$9, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment$9.name
    		});
    	}
    }

    const app = new App({
    	target: document.body
    });

    return app;

}());
//# sourceMappingURL=bundle.js.map
