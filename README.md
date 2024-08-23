# Hacer Pruebas

Antes de intentar cualquier prueba, asegúrate de:

1. Instalar [Ollama](https://ollama.com/),
2. Instalar las dependencias del proyecto con npm
3. Instalar el modelo que desees utilizar con ollama
4. Configurar el nombre del modelo elegido en el archivo **_constants.ts_**
5. Ejecutar el script "**_dev_**" descrito en el archivo **_package.json_** con npm

```sh
npm run dev
```

## Generar Modelo Personalizado a partir del ModelFile

1. Crea un modelfile siguiendo la [documentación](https://github.com/ollama/ollama/blob/main/docs/modelfile.md) de ollama
2. Abre una terminal, ubícate en la carpeta donde se encuentre el archivo `modelfile` y ejecuta el siguiente comando:
      ```sh
      ollama create tyche -f modelfile
      ```
3. Si deseas hacer pruebas al modelo directamente en la terminal, ejecuta el siguiente comando:
      ```sh
      ollama run tyche
      ```

## Probar la API

### Probar la API en Local utilizando un Archivo JSON

1. Asegúrate de que la función `src/tools/validations.ts -> isSecureRequest` retorne `true` inmediatamente. De lo contrario, la prueba fallará debido al cálculo del hash.
2. Abre una terminal y ubícate dentro de la carpeta donde se encuentre el archivo **_test.webhook.json_**
3. Edita el archivo **_test.webhook.json_** para cambiar el texto _%MENSAJE DE PRUEBA%_ por el mensaje que desees enviar al modelo.
4. Ejecuta el siguiente comando:
      ```sh
      curl -X POST -H "Content-Type: application/json" -d @test.webhook.json http://localhost:3000/webhooks/messenger/webhook
      ```

### Probar la API con Facebook Messenger

Para poder hacer pruebas con una página de Facebook, primero debes crear una "página" y seguir los pasos de la [documentación de Meta](https://developers.facebook.com/docs/messenger-platform/overview) para configurar adecuadamente el webhook.
