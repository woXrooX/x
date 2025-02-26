export default class Layer extends HTMLElement {
    static #container_selector = "body > layers";
    static #container = null;
    static #id = 0;
    
    // Tracking active layers for each clicked button
    static #active_layers = new Map(); 

    static { Layer.#container = document.querySelector(Layer.#container_selector); }

    static show(DOM, trigger_element) {
        // Prevent duplicate layer
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
        Layer.#on_show_update_layers("show");

        // Hide on click close button
        layer.querySelector("x-svg[for=layer_close]").onclick = () => Layer.#on_hide_update_layers(layer, trigger_element);
    }

    #DOM = null;

    constructor() {
        super();
        Layer.#id++;

        this.shadow = this.attachShadow({ mode: 'closed' });

        this.#DOM = this.innerHTML;
        this.replaceChildren();

        this.#handle_trigger_click();
    }

    static #on_hide_update_layers(layer, trigger_element){
        Layer.#id--;
        Layer.#active_layers.delete(trigger_element);
        

        layer.style.bottom = "0";
        layer.style.transform = "translate(-50%, 100%) scale(1)";
        layer.style.transition = "bottom 0.4s ease-in-out, transform 0.4s ease-in-out";

        setTimeout(() => {
            layer.remove();

            const layers = [...Layer.#container.querySelectorAll("layer")];
        
            // Keep only the last 3 layers visible
            const visible_layers = layers.slice(-3);
        
            // Distance between stacked layers
            const stacked_layers_spacing = 30;
            const layer_base_scale = 1;
            const layers_shrink = 0.05;

            visible_layers.forEach((layer, index) => {
                layer.classList.add("show");
                
                if (index === visible_layers.length - 1) layer.style.bottom = "0";
                else layer.style.bottom = `calc(${(visible_layers.length - 1 - index) * stacked_layers_spacing}px)`;
    
                // Apply scaling effect for depth illusion
                const scale_value = layer_base_scale - ((visible_layers.length - 1 - index) * layers_shrink);
                layer.style.transform = `translate(-50%, 0) scale(${scale_value})`;
    
                // Set stacking order
                layer.style.zIndex = 10 + index;
    
                // Smooth transition effect
                layer.style.transition = "bottom 0.2s ease-in-out, transform 0.2s ease-in-out";
            });
        }, 200);
    }
    
    static #on_show_update_layers() {
        const layers = [...Layer.#container.querySelectorAll("layer")];
    
        // Keep only the last 3 layers visible
        const visible_layers = layers.slice(-3);
    
        // Distance between stacked layers
        const stacked_layers_spacing = 30;
        const layer_base_scale = 1;
        const layers_shrink = 0.05;
    
        // Loop through all layers, setting initial hidden state for non-visible ones
        layers.forEach(layer => {
            if (!visible_layers.includes(layer)) {
                layer.style.bottom = "0"; // Start below the screen
                layer.style.transform = "translate(-50%, 100%) scale(0.2)";
                layer.classList.remove("show");
            }
        });
    
        visible_layers.forEach((layer, index) => {
            layer.classList.add("show");
            
            // Set the position transition smoothly from bottom to center
            setTimeout(() => {
                if (index === visible_layers.length - 1) layer.style.bottom = "0";
                else layer.style.bottom = `calc(${(visible_layers.length - 1 - index) * stacked_layers_spacing}px)`;
    
                // Apply scaling effect for depth illusion
                const scale_value = layer_base_scale - ((visible_layers.length - 1 - index) * layers_shrink);
                layer.style.transform = `translate(-50%, 0) scale(${scale_value})`;
    
                // Set stacking order
                layer.style.zIndex = 10 + index;
    
                // Smooth transition effect
                layer.style.transition = "bottom 0.4s ease-in-out, transform 0.4s ease-in-out";
            }, 10); // Small timeout ensures transition applies after style changes
        });
    }
    

    #handle_trigger_click = () => {
        const trigger_elements = document.querySelectorAll(this.getAttribute("trigger_selector"));
        if (!!trigger_elements === false) return;

        for (const element of trigger_elements) element.onclick = () => Layer.show(this.#DOM, element);
    };
}

window.customElements.define('x-layer', Layer);
window.Layer = Layer;
