# Diseño del Formulario Inteligente y Dinámico

### Componente Padre:

- Este componente contiene el formulario controlador y los componentes hijos sujetos a este formulario.

### Form Controller:

- Controlador principal del formulario que maneja los estados de todos los componentes usados para generar los inputs y dropdown de países.
- Gestiona la comunicación entre componentes.
- Determina qué campos estarán visibles y cuáles estarán ocultos.
- Maneja todos los errores en los componentes.

### Campo de Dropdown:

- Componente global y dinámico para toda la aplicación.
- Gatilla un evento cada vez que se selecciona un país con la información del país seleccionado.
- Tiene un booleano para mostrar un loader que puede ser ajustado desde el componente padre.
- Recibe un menú de items con una estructura específica para generar el menú de selección (ej. { label: value, value: value }).
- Recibe una función que determina el estado de validez del componente.
- Tiene una propiedad activable que, en caso de estar en estado inválido, cambia el CSS del componente para mostrar dicho estado, cambiando los bordes y colores a rojo.

### Campo de Texto:

- Componente global y dinámico para toda la aplicación.
- Gatilla un evento con retraso de 300ms cada vez que el valor del componente cambia.
- Recibe una función que determina el estado de validez del componente.
- Tiene una propiedad activable que, en caso de estar en estado inválido, cambia el CSS del componente para mostrar dicho estado, cambiando los bordes y colores a rojo.

### Estructura del Formulario
- Dropdown de Países: Recibe un menú de items (lista de países organizados por nombre y abreviación).
- Campo de Dirección: Componente de texto.
- Campo de Código Postal: Componente de texto.
- Dropdown de Ciudades: Recibe un menú de items (lista de ciudades organizadas por país seleccionado y abreviación).

### Carga Inicial

- El componente padre inicia una carga inicial haciendo una petición de la lista de países.

### Flujo de Comunicación

- Componentes Hijos al Formulario Padre: Mediante eventos.
- Formulario a Componentes Hijos: Mediante actualización de propiedades.

### Ejemplo de Comunicación entre el Formulario Controlador y los Componentes Hijos

- Campo Loading de Dirección: Activado hasta que la carga inicial termine y la lista de países sea cargada en el componente.
- Petición de Ciudades: Iniciada al seleccionar un país, activando el loader del campo ciudad hasta que se carguen las ciudades en el componente de ciudad.
- Campo de Código Postal: Al finalizar la escritura, se llama a una API para determinar la ciudad y autocompletar el campo de ciudad.

### Manejo de Errores

- Error en Petición de Países o Ciudades: El formulario controlador avisará al usuario del problema, recomendando recargar la página, intentar más tarde, o comunicarse con soporte. El mensaje puede estar representado en toasts o en la cabeza del formulario.

### Validaciones

- Todos los componentes reciben una función que determina si tienen un valor asignado.

### Manejo de Validaciones

- Al hacer submit con campos inválidos, se activa la visibilidad del campo erróneo en cada componente individualmente.
- Si los campos fueron inválidos y se toca algún campo, restaurar las validaciones de ese campo.