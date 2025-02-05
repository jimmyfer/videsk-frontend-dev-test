import { componentDefinitions as uiComponents } from "./ui/ui-component";
import { componentDefinitions as appComponents } from "./app/app-component";

/**
 * Función para definir listas de componentes.
 */
function componentDefinition(componentDefinitions) {
    componentDefinitions.forEach(({name, component}) => {
        customElements.define(name, component);
    });
}

// Definimos los componentes UI
componentDefinition(appComponents);

// Definimos los componentes de la APP
componentDefinition(uiComponents);