const { addKeyword } = require('@bot-whatsapp/bot')

const {agregarItems,addProps} = require('./auxPedidos.js')

const flujoAgregar = addKeyword('3')
.addAnswer('En un solo mensaje, indique que desea agregar a tu mesa',
{
    capture: true
},
async (ctx,{provider,fallBack}) => {

    if(!ctx.message.hasOwnProperty('extendedTextMessage') && !ctx.message.hasOwnProperty('conversation')){
        
        return fallBack("Este campo admite solo texto")
    }

    addProps(ctx.from,{agregar: ctx.body})
    await agregarItems(ctx.from,provider)

})

module.exports = flujoAgregar