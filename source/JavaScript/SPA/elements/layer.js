export default class Layer extends HTMLElement {
    static #container_selector = "body > layers";
    static #container = null;
    static #id = 0;

    // Distance between stacked layers
    static #stacked_layers_spacing = 40;
    static #layer_base_scale = 1;
    static #layers_shrink = 0.05;

    // Tracking active layers for each clicked button
    static #active_layers = new Map(); 

    static #build_layer(DOM, trigger_element) { 
        // Prevent duplicate layer on button click
        if (Layer.#active_layers.has(trigger_element)) return; 

		// Create layer
        const layer = document.createElement("layer");
        layer.innerHTML = `
            <column class="gap-2 padding-2">
                <x-svg class="btn btn-primary btn-s" for="layer_close" name="x" color="ffffff"></x-svg>
                Layer ${Layer.#id}
            </column>
        `;
        layer.id = `layer_${Layer.#id++}`;
       
        Layer.#container.appendChild(layer);

        // Store the active layer for this button
        Layer.#active_layers.set(trigger_element, layer);

        // Manage layer visibility
        Layer.#on_show_update_layers();

        // Manage layer invisibility on click close button
        layer.querySelector("x-svg[for=layer_close]").onclick = () => Layer.#on_hide_update_layers(layer, trigger_element);
    }

    static #on_hide_update_layers(layer, trigger_element){
        Layer.#id--;
        Layer.#active_layers.delete(trigger_element);
        
        // Stacked layers appearance
        layer.style.bottom = "0";
        layer.style.transform = "translate(-50%, 100%) scale(1)";
        layer.style.transition = "bottom 0.4s ease-in-out, transform 0.4s ease-in-out";

        setTimeout(() => {
            layer.remove();
            Layer.#render_layers();
        }, 200);
    }
    
    static #on_show_update_layers() {
        // Set the position transition smoothly from bottom to center
        // Small timeout ensures transition applies after style changes
        setTimeout(() => { Layer.#render_layers();}, 10); 
    }

    static #render_layers(){
        // Keep only the last 3 layers visible
        const layers = [...Layer.#container.querySelectorAll("layer")];
        const visible_layers = layers.slice(-3);

        for (const index in visible_layers) {
            visible_layers[index].classList.add("show");
            if (index === visible_layers.length - 1) visible_layers[index].style.bottom = "0";
            else visible_layers[index].style.bottom = `calc(${(visible_layers.length - 1 - index) * Layer.#stacked_layers_spacing}px)`;
    
            // Apply scaling effect for depth illusion
            const scale_value = Layer.#layer_base_scale - ((visible_layers.length - 1 - index) * Layer.#layers_shrink);
            visible_layers[index].style.transform = `translate(-50%, 0) scale(${scale_value})`;
    
            // Set stacking order
            visible_layers[index].style.zIndex = 10 + index;
    
            // Smooth transition effect
            visible_layers[index].style.transition = "bottom 0.4s ease-in-out, transform 0.4s ease-in-out";
        }
    }

    #DOM = null;

    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'closed' });
        this.#DOM = this.innerHTML;
        Layer.#container = document.querySelector(Layer.#container_selector);
        this.replaceChildren();

        Layer.#id++;

        this.#handle_trigger_click();
    }

    #handle_trigger_click = ()=> {
        const trigger_elements = document.querySelectorAll(this.getAttribute("trigger_selector"));
        if (!!trigger_elements === false) return;

        for (const element of trigger_elements) element.onclick = () => Layer.#build_layer(this.#DOM, element);
    };
}

window.customElements.define('x-layer', Layer);
window.Layer = Layer;
