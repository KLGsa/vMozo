const { addKeyword } = require('@bot-whatsapp/bot')

const flujoPedido =require('./flujoPedido.js') 

const flujoCarta = addKeyword('1')
.addAnswer('Aca te dejo la carta',
{
    media:"https://enlacocina.b-cdn.net/wp-content/uploads/2021/02/carta2.jpg"
}   
)
.addAnswer('Si desea realizar el pedido de su mesa envie "pedir" o para salir envie "salir"',
{
    capture: true
},
async (ctx,{provider,endFlow}) => {

     if(ctx.body === "salir"){
        const prov = provider.getInstance()
        const telefono = ctx.from + '@s.whatsapp.net'
        await prov.sendMessage(telefono,{text: "Escribe vMozo para volver a comenzar."})
        return endFlow()
    } 
},[flujoPedido])

module.exports = flujoCarta