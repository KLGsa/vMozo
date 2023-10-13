const { addKeyword } = require('@bot-whatsapp/bot')

const flujoPedido =require('./flujoPedido.js') 

const {enviarCartas} = require('./auxCartas.js')

const flujoCarta = addKeyword('1')
.addAnswer('Aca te dejo la carta',
{
},
async (ctx, {provider}) => {

    await enviarCartas(ctx.from,provider)

}
)
.addAnswer('Si desea realizar el pedido de su mesa envie "pedir" o para salir envie "salir"',
{
    capture: true
},
async (ctx,{provider,endFlow}) => {

    if(ctx.body.toLowerCase() !== "pedir"){
        const prov = provider.getInstance()
        const telefono = ctx.from + '@s.whatsapp.net'
        await prov.sendMessage(telefono,{text: "Escribe *vMozo* para volver a comenzar."})
        return endFlow()
    }

},[flujoPedido])

module.exports = flujoCarta