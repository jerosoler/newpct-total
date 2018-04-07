# newpct-total

Descargas de newpct a transmission
* Configuración de autodescargas ( Busca en el [Feed Newpct](www.newpct.com/feed))
* Configuración de avisos de telegram (Para autodescargas)
* Configuración de directorio de streaming (Función para copiar el link al vlc ya que html5 no reproduce todos los videos) (Requiere reiniciar servidor una vez puesta la ruta)
* Configuración de transmission con authentificación
* Configuración de ruta privada. (Experimental)


## Instalación

Requiere tener instalado nodejs [Nodejs](https://nodejs.org) >= 8

``` bash
# Download project
git clone https://github.com/jerosoler/newpct-total.git
# Entrar al directorio
cd newpct-total
# install dependencies
npm install # Or yarn install
# Montando proyecto
npm run build
# Lanzando servidor
npm start # Or pm2 start npm --name="newpct" -- start
```

## Puertos
Utiliza los puertos 3000 (servidor web) y 3001 (servidor BBDD)

## Backup
Descargar desde el aparatado config


## Imagenes:
![imagen1](https://github.com/jerosoler/newpct-total/blob/master/docs/inicio.png)
![imagen2](https://github.com/jerosoler/newpct-total/blob/master/docs/configuracion.png)

## Changelog
07-04-2018
* Añadido nuevo sistema de búsqueda automatica
* Añadido Torrentrapid

04-03-2018
* Listado de sitios
* Corregido copiar link de Streaming
* Añadido boton para descargar el Backup
* Corregido formulario de añadir nueva series
* Bugs menores
