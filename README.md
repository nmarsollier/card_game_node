# Juego de Cartas

Backend en node para el [proyecto card_game_node](https://github.com/nmarsollier/card_game_node)

Abrir ventana de comandos en el folder node y ejecutar :

```bash
npm install
npm start
```

El backend expone la documentación de las api abriendo [localhost:3000](http://localhost:3000/)

[Documentación de API](./README-API.md)

## Entorno de Desarrollo

El proyecto se desarrollo con [Visual Studio Code](https://code.visualstudio.com/download), Si bien podrían utilizarse alternativas como [Atom](https://atom.io/), [Sublime](https://www.sublimetext.com/download).

Algunos plugins interesantes para VSCode que facilitan el desarrollo :

- **JavasScript (ES6) code snippets** by charlampos karypidis
- **ESLint** by egamma
- Typescript React code snippets
- React Native Tools
- ES7 React/Redux/GraphQL/React-native snippets

Existe un Workspace configurado para VSCode en la raíz del proyecto :

```bash
Microservicios.code-workspace
```

## Dependencias

Ademas vamos a necesitar lo siguiente :

### Node con npm versión 12+

Seguir la guía de instalación desde el sitio oficial [nodejs.org](https://nodejs.org/)

### MongoDB

Es la base de datos principal.

Seguir las guías de instalación [Card Game](https://github.com/nmarsollier/card_game)

Podemos usar docker

```bash
docker run -d --name card_game_mongo -d -p 27017:27017 mongo:4.0.18-xenial
```

O seguir las guiás de instalación de mongo desde el sitio oficial: [mongodb.com](https://www.mongodb.com/download-center#community)

Sugiero instalar Mongodb Compass para poder navegar la base de datos en forma visual [Compass](https://www.mongodb.com/products/compass)

### Redis

Redis es una segunda opción de almacenamiento de datos. Para almacenamiento de imágenes hace uso de Redis.

Ver la guía en la pagina del proyecto : [Card Game](https://github.com/nmarsollier/card_game)

Podemos usar docker

```bash
docker run -d --name card_game_redis -d -p 6379:6379 redis:5.0.9-buster
```

### Node 16+

Seguir los pasos de instalación del sitio oficial [nodejs.org](https://nodejs.org/en/)

## Ejecución

Abrir ventana de comandos en la carpeta del microservicio y ejecutar :

```bash
npm install
npm start
```

## Archivo .env

Este archivo permite configurar diversas variables de entorno de la app, ver ejemplos en .env.example

Todas estas variable pueden definirse como variables de entorno del sistema operativo también.

## Apidoc

Apidoc es una herramienta que genera documentación de apis para proyectos node (ver [Apidoc](http://apidocjs.com/)).

El microservicio muestra la documentación como archivos estáticos si se abre en un browser la raíz del servidor [localhost:3000](http://localhost:3000/)

Ademas se genera la documentación en formato markdown.

## Docker

Esta es una version de docker para producción :

```bash
docker build --no-cache -t card_game_node https://raw.githubusercontent.com/nmarsollier/card_game_node/master/Dockerfile

# Mac || Windows
docker run -it -d --name card_game_node -p 3000:3000 card_game_node

# Linux
docker run --add-host host.docker.internal:172.17.0.1 -it -d --name card_game_node -p 3000:3000 card_game_node
```

[Test](http://localhost:3000/)
