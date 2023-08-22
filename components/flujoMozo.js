const { addKeyword } = require('@bot-whatsapp/bot')

const {llamarMozo} = require('./auxPedidos.js')

const flujoMozo = addKeyword('4')
.addAnswer('El mozo ya fue notificado, a la brevedad se acercara a la mesa',
{
},
async (ctx,{provider}) => {

    await llamarMozo(ctx.from,provider)

    const prov = provider.getInstance()

    const telefono = ctx.from + '@s.whatsapp.net'

    await prov.sendMessage(telefono,{text: "Escriba vMozo para volver a comenzar"})

})

module.exports = flujoMozo