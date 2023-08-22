const { addKeyword } = require('@bot-whatsapp/bot')

const {pedirCuenta} = require('./auxPedidos.js')

const flujoCuenta = addKeyword('5')
.addAnswer('El mozo ya fue notificado, a la brevedad le llevara la cuenta a la mesa',
{
},
async (ctx,{provider}) => {

    await pedirCuenta(ctx.from,provider)

    const prov = provider.getInstance()

    const telefono = ctx.from + '@s.whatsapp.net'

    await prov.sendMessage(telefono,{text: "Escriba vMozo para volver a comenzar"})

})

module.exports = flujoCuenta