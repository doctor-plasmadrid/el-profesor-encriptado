# El Profesor Encriptado

Este proyecto es el repositorio base del juego de lógica y deducción "El Profesor Encriptado". Este motor fue desarrollado como parte de un proyecto de ingeniería de software para explorar estructuras de datos dinámicas y lógica de resolución de puzzles.

## Enlace al proyecto original

Puedes jugar a la versión pública aquí: El Profesor Encriptado en itch.io

## Especificaciones técnicas

El juego está construido sobre un stack moderno orientado a la optimización y la escalabilidad del estado:

- Framework: React (Vite).

- Lenguaje: TypeScript.

- Gestión de Estado: Arquitectura basada en estados inmutables para manejar la resolución de incógnitas.

- Sistema de Cifrado: El motor procesa una matriz de 25 alumnos, donde cada nota se calcula dinámicamente combinando una "Base" (F, R, O, Y, S) y un "Modificador" (exponente: ?, |, ·, :).

- Deducción: El sistema permite el encadenamiento de queries: consultar alumnos, interrogar al cuerpo docente o fijar valores mediante deducción lógica.

- Escalabilidad: El sistema está diseñado para que la lógica de las bases y los modificadores pueda ser extendida o reconfigurada sin alterar la interfaz.

## Licencia

Este proyecto se distribuye bajo la Licencia MIT. Eres libre de utilizar, modificar y distribuir esta infraestructura para tus propios proyectos, siempre que se mantenga el crédito al autor original: Dr. Plasmadrid.

## Instalación

```
1. Clona el repositorio: `git clone https://github.com/doctor-plasmadrid/el-profesor-encriptado`
2. Instala dependencias: `npm install`
3. Inicia el servidor de desarrollo: `npm run dev`
```