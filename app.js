const { createBot, createProvider, createFlow, addKeyword } = require('@bot-whatsapp/bot')

const QRPortalWeb = require('@bot-whatsapp/portal')
const BaileysProvider = require('@bot-whatsapp/provider/baileys')
const JsonFileAdapter = require('@bot-whatsapp/database/json')

const flujoAgregar = require("./components/flujoAgregar.js")
const flujoCarta = require("./components/flujoCarta.js")
const flujoCuenta = require("./components/flujoCuenta.js")
const flujoMozo = require("./components/flujoMozo.js")
const flujoPedido = require("./components/flujoPedido.js")

const {verificarMesa,verificarTiempo} = require("./components/auxPedidos.js")
const {isOwner} = require("./components/auxClientes.js")
const {enviarQrs} = require("./components/auxQrs.js")

const flowPrincipal = addKeyword(['vMozo'])
    .addAnswer('Hola bienvenido a vMozo',{},
    async (ctx,{flowDynamic,endFlow}) => {

        const validator = verificarMesa(ctx.body,ctx.from)

        if(!validator){
            return endFlow('No se detecto una mesa. Por favor escanee el QR de la mesa para volver a comenzar')
        }

        const expired = verificarTiempo(ctx.from)

        if(expired){
            return endFlow('Se vencio la sesion. Por favor escanee el QR de la mesa para volver a comenzar')
        }

        const flag = isOwner(ctx.from)

        if(flag){
            setTimeout(()=> {
                flowDynamic([
                    '1. Ver la carta\n2. Realizar un pedido\n3. Agregar algo a un pedido\n4. Llamar al mozo\n5. Pedir la cuenta\n6. Descargar QRs\n7. Salir'])
                },500)
        }else{
            setTimeout(()=> {
                flowDynamic([
                    '1. Ver la carta\n2. Realizar un pedido\n3. Agregar algo a un pedido\n4. Llamar al mozo\n5. Pedir la cuenta\n6. Salir'])
                },500)
        }
       
    })
    .addAnswer(
        [
            'Elija la opción deseada'
        ],
        {
            capture:true
        },
        async (ctx, {flowDynamic,endFlow,provider}) => {
            
            if(!isOwner(ctx.from) && ctx.body === "6"){
                await flowDynamic(['Gracias por utilizar este servicio','Escriba vMozo para volver a comenzar'])
                return endFlow()
            }
            if(isOwner(ctx.from) && ctx.body === "7"){
                await flowDynamic(['Gracias por utilizar este servicio','Escriba vMozo para volver a comenzar'])
                return endFlow()
            }
            if(isOwner(ctx.from) && ctx.body === "6"){
                await enviarQrs(ctx.from,provider);
                return endFlow()
            }
        
        },
        [flujoCarta,flujoPedido,flujoAgregar,flujoMozo,flujoCuenta]
    )

const main = async () => {
    const adapterDB = new JsonFileAdapter()
    const adapterFlow = createFlow([flowPrincipal])
    const adapterProvider = createProvider(BaileysProvider)

    createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    })

    QRPortalWeb()
}

main()
