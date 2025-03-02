export default class Layer extends HTMLElement {
    static #container_selector = "body > layers";
    static #container = null;

    // Distance between stacked layers
    static #stacked_layers_spacing = 40;
    static #layer_base_scale = 1;
    static #layers_shrink = 0.05;

    // Tracking active layers for each clicked button
    static #active_layers = new Map(); 

    static #init_layers(DOM, trigger_element) {
        // Prevent duplicate layer on button click
        if (Layer.#active_layers.has(trigger_element)) return;
        
        // Create the new layer
        const layer = document.createElement("layer");
        layer.innerHTML = `
            <column class="gap-2 padding-2">
                <x-svg class="btn btn-primary btn-s" for="layer_close" name="x" color="ffffff"></x-svg>
                ${DOM}
            </column>
        `;

        // Append
        Layer.#container.appendChild(layer);

        // Store the active layer for this button
        Layer.#active_layers.set(trigger_element, layer);

        // Update layers and handle close button
        Layer.#on_show_update_layers();
        Layer.#on_hide_update_layers(layer, trigger_element);

        // Initialize triggers inside the newly added layer
        Layer.#init_nested_triggers(layer);
    }

    static #on_show_update_layers(){
        // Manage layer visibility on click
        setTimeout(() => { Layer.#render_layers();}, 10); 
    }

    static #on_hide_update_layers(layer, trigger_element){
        // Manage layer invisibility on close button click
        layer.querySelector("x-svg[for=layer_close]").onclick = () => {
            Layer.#active_layers.delete(trigger_element);
            
            // Stacked layers appearance
            layer.style.bottom = "0";
            layer.style.transform = "translate(-50%, 100%) scale(1)";
            layer.style.transition = "bottom 0.4s ease-in-out, transform 0.4s ease-in-out";
        
            setTimeout(() => {
                layer.remove();
                Layer.#render_layers();
            }, 200);
        };
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

    static #init_nested_triggers(layer) {
        const triggers = layer.querySelectorAll("[trigger_selector]");
        for (const trigger of triggers) {
            const selector = trigger.getAttribute("trigger_selector");
            const nested_triggers = layer.querySelectorAll(selector);
    
            for (const nested_trigger of nested_triggers) {
                nested_trigger.onclick = (event) => {
                    // Prevent triggering parent layers
                    event.stopPropagation(); 
                    
                    // Find the corresponding x-layer inside the current layer
                    const nested_layer = layer.querySelector(`x-layer[trigger_selector="${selector}"]`);
                    if (!nested_layer) return;
                    
                    // Use the getContent method to get the original content
                    const nested_content = nested_layer.getContent ? nested_layer.getContent() : "";
                    
                    Layer.#init_layers(nested_content, nested_trigger);
                };
            }
        }
    }

    // Add this instance method to your Layer class
    getContent() { return this.#DOM; }
        
    #DOM = null;

    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'closed' });
        this.#DOM = this.innerHTML;
        Layer.#container = document.querySelector(Layer.#container_selector);
        this.replaceChildren();

        this.#handle_trigger_click();
    }

    #handle_trigger_click = ()=> {
        const triggers = document.querySelectorAll(this.getAttribute("trigger_selector"));
        if (!triggers.length) return;

        for (const trigger of triggers) {
            trigger.onclick = (event) => {
                // Prevent triggering parent layers
                event.stopPropagation();
                Layer.#init_layers(this.#DOM, trigger);
            };
        }
    };
}

window.customElements.define('x-layer', Layer);
window.Layer = Layer;
