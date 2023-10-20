const { createBot, createProvider, createFlow, addKeyword } = require('@bot-whatsapp/bot')

const QRPortalWeb = require('@bot-whatsapp/portal')
const BaileysProvider = require('@bot-whatsapp/provider/baileys')
const JsonFileAdapter = require('@bot-whatsapp/database/json')

const flujoAgregar = require("./components/flujoAgregar.js")
const flujoCarta = require("./components/flujoCarta.js")
const flujoCuenta = require("./components/flujoCuenta.js")
const flujoMozo = require("./components/flujoMozo.js")
const flujoPedido = require("./components/flujoPedido.js")
const flujoSalir = require("./components/flujoSalir.js")

const {verificarMesa,verificarTiempo} = require("./components/auxPedidos.js")
const {addProps} = require('./components/auxPedidos.js')

const fs = require('fs');

const { downloadMediaMessage } = require('@adiwajshing/baileys')

const flowPrincipal = addKeyword(['vMozo'])
    .addAnswer(['Hola bienvenido a Pizzeria Popular','Soy vMozo su mozo virtual.'],{},
    async (ctx,{flowDynamic,endFlow}) => {

        const validator = verificarMesa(ctx.body,ctx.from)

        if(!validator){
            return endFlow('No se detecto una mesa. Por favor escanee el QR de la mesa para volver a comenzar')
        }

        const expired = verificarTiempo(ctx.from)

        if(expired){
            return endFlow('Se vencio la sesion. Por favor escanee el QR de la mesa para volver a comenzar')
        }

            setTimeout(()=> {
                flowDynamic([
                    '1. Ver el Menú\n2. Ordenar\n3. Agregar algo a mi pedido\n4. Llamar al mozo\n5. Pedir la cuenta\n6. Salir'])
                },500)

    })
    .addAnswer(
        [
            'Elija la opción deseada'
        ],
        {
            capture:true
        },
        async (ctx,{fallBack}) => {

            addProps(ctx.from,{pregunta: 1})

            const valoresPermitidos = ["1", "2", "3", "4", "5", "6"];

            if(!valoresPermitidos.includes(ctx.body)){
                return fallBack("Ingrese una opción valida")
            }
        
        },
        [flujoCarta,flujoPedido,flujoAgregar,flujoMozo,flujoCuenta,flujoSalir]
    )


let telCliente = ""

const flowEnviarFoto = addKeyword(['enviar cuenta'])
.addAnswer('Indique a que telefono va a enviar la foto de la cuenta')
.addAnswer('Este fue enviado anteriormente por un mensaje',{capture:true}, async (ctx,{fallBack}) => {

    const isValidPhoneNumber = /^\d{10}$/.test(ctx.body);

    if (isValidPhoneNumber) {
        telCliente = "549" + ctx.body
    }
    else{
        return fallBack("Numero invalido, ingrese un numero de telefono sin 0 y sin 15")
    }

    

})
.addAnswer('Adjunte la foto de la cuenta',{capture:true}, async (ctx,{provider,fallBack}) => {

    if(ctx.message.hasOwnProperty('imageMessage')){

    const buffer = await downloadMediaMessage(ctx, 'buffer');

    const filename = 'cuenta.jpg';

    // Guardar la foto en el sistema de archivos local
    fs.writeFileSync(filename, Buffer.from(buffer, 'base64'));

    // Obtener la URL local del archivo
    const localFilePath = `./${filename}`;

    const telefono = telCliente + '@s.whatsapp.net';

    // Utilizar la URL local en la función sendMedia
    await provider.sendMedia(telefono, localFilePath, 'Aqui tiene la cuenta, a la brevedad el mozo le acercara su comprobante fisico\nGracias por comer en Pizzeria Popular y usar vMozo.');

    // Eliminar el archivo local después de enviarlo
    fs.unlinkSync(localFilePath);

    }
    else{
        return fallBack("Este campo admite solo fotos")
    }

})

const main = async () => {
    const adapterDB = new JsonFileAdapter()
    const adapterFlow = createFlow([flowPrincipal,flowEnviarFoto])
    const adapterProvider = createProvider(BaileysProvider)

    createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    })

    QRPortalWeb()
}

main()
