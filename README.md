#Instalación

1.	Descargar y/o clonar proyecto delilah-resto el cual se encuentra en el repositorio público de GitHub en el siguiente enlace https://github.com/camora1990/Delilah-Resto.git, ejecutar el siguiente comando en la carpeta donde desea alojar el proyecto.
Git clone https://github.com/camora1990/Delilah-Resto.git

2.	Una vez clonado el proyecto ejecutar el comando para instalación de paquetes y dependencias dentro de la carpeta del proyecto.

Npm install

3.	Crear base de datos en MySQL o SQL server el que sea de su preferencia, solo es necesario crear la base de datos pues el programa creara automáticamente las tablas que serán usadas. A continuación, se sugiere crear la base con el nombre OnlineOrderingSystem si desea este puede ser cambiado.

CREATE DATABASE OnlineOrderingSystem


#Creación variables de entorno

1.	En la carpeta raíz del proyecto crear un archivo llamado. env en el cual se configurarán los aspectos necesarios como la base de datos, puertos y el token code (private key) para desencriptar el token.

2.	En el archivo. env deben ir las siguientes variables

# DataBase
BD_NAME
BD_USER
BD_PASSWORD
BD_DIALECT
BD_PORT
BD_HOST

#PORT
PORT

#TOKEN CODE
PRIVATE_KEY

Correcta declaración y ejemplo

#BD_NAME
Es el nombre de la base de datos que suministramos en la instalación numeral 3
Ejemplo:
BD_NAME=OnlineOrderingSystem

# BD_USER
Usuario de base de datos
Ejemplo:
BD_USER=Usuario1


# BD_PASSWORD
Contraseña del ingreso a base de datos del usuario, en este paso si el usuario no tiene contraseña de ingreso de deja vacío
Ejemplo:
BD_PASSWORD=1245214521 o BD_PASSWORD

# BD_DIALECT
Es el dialecto que se usara de acuerdo a la base de datos que estemos utilizando sea MySQL(mysql) o SQL server(mssql),
Ejemplo:
BD_DIALECT= mssql

# BD_PORT
Es el puerto de la base de datos localmente MySQL usa el puerto 3306 y SQL server 1443
Ejemplo
BD_PORT=1443

# BD_HOST
Es el host de la base de datos, en este caso localmente es localhost
Ejemplo: 
BD_HOST= localhost

# PORT
Puerto donde se ejecutará el aplicativo 
Ejemplo:
PORT=5000

# PRIVATE_KEY
Llave secreta para validar token de seguridad 
Ejemplo:
PRIVATE_KEY=3j3mpl0Pr1V4t3

# OpenAPI Specification 3.0.0

La especificación OpenAPI (anteriormente Swagger Specification) es un formato de descripción de API para API REST. Un archivo OpenAPI le permite describir toda su API, que incluye:
•	Endpoints disponibles (/users) y operaciones en cada punto final (GET /users, POST /users)
•	Parámetros de operación Entrada y salida para cada operación
•	Métodos de autenticación
•	Información de contacto, licencia, condiciones de uso y otra información.

La especificación se encuentra en el archivo spec.yam en este se evidenciará todos los endpoints y requerimientos.

# Paths

# Users
http://localhost:5000/apiv1/users/
http://localhost:5000/apiv1/users/registerUser/
http://localhost:5000/apiv1/users/login/

# Dishes
http://localhost:5000/apiv1/dishes/
http://localhost:5000/apiv1/dishes/createDish
http://localhost:5000/apiv1/dishes/deleteDish/
http://localhost:5000/apiv1/dishes/updateDish/

# Oders
http://localhost:5000/apiv1/orders/newOrder/
http://localhost:5000/apiv1/orders/updateOrder/
http://localhost:5000/apiv1/orders/
http://localhost:5000/apiv1/orders/deleteOrder/


# Postman
El archivo OnlineOrdeingSystem.postman_collection.json es una colección creada que puede importar en postman donde están todos los endpoints para ejecutar el aplicativo desde esta herramienta.

# Ejecicion

Lugo de realizados todos los pasos puede ejecutar el siguiente comando para iniciar el aplicativo

Npm start








