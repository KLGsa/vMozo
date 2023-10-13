const { addKeyword } = require('@bot-whatsapp/bot')

const {pedirCuenta,fotoCuenta} = require('./auxPedidos.js')

const {respuesta} = require('./auxMensajes.js')

const flujoCuenta = addKeyword('5')
.addAnswer('A la brevedad el mozo llevará la cuenta a la mesa',
{
},
async (ctx,{provider}) => {

    await pedirCuenta(ctx.from,provider)

})
.addAnswer('Si además desea recibir una foto de la misma envie *foto*\nDe lo contrario envie *salir*',
{
    capture:true
},
async (ctx,{provider}) => {

    if(ctx.body.toLowerCase() === "foto"){

        await fotoCuenta(ctx.from,provider)

        await respuesta(ctx.from,provider,'En instantes recibirá una foto de la cuenta\nEscriba *vMozo* para volver a comenzar')

    }else{

        await respuesta(ctx.from,provider,'Escriba *vMozo* para volver a comenzar')

    }

})



module.exports = flujoCuenta