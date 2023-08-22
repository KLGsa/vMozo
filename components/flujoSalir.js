const { addKeyword } = require('@bot-whatsapp/bot')

const {sendEmail,addProps} = require('./auxPedidos.js')

const flujoSalir = addKeyword('6')
.addAnswer(['Gracias por comer en Pizzeria Popular y usar vMozo.','Espero que disfrutaras la experiencia.','Tu opinion nos importa muchisimo para mejorar el servicio y seguir creciendo','Si deseas dejarnos un comentario y contestar unas breves preguntas escribe "SI" para continuar.'],
{
    capture:true
},
async (ctx,{provider,endFlow}) => {

    if(ctx.body.toLowerCase() !== "si"){

    const prov = provider.getInstance()

    const telefono = ctx.from + '@s.whatsapp.net'

    await prov.sendMessage(telefono,{text: "Escriba vMozo para volver a comenzar"})

    return endFlow()

    }

})
.addAnswer('¿Como calificarías de 1 a 10 tu experiencia en Pizzeria Popular ?',
{
    capture:true
},
async (ctx) => {

    addProps(ctx.from,{q1: ctx.body})

})
.addAnswer('¿Como calificarías de 1 a 10 la atención de vMozo ?',
{
    capture:true
},
async (ctx) => {

    addProps(ctx.from,{q2: ctx.body})

})
.addAnswer('Dejanos un comentario sobre que cambiarias para mejorar tu experiencia',
{
    capture:true
},
async (ctx) => {

    addProps(ctx.from,{q3: ctx.body})

})
.addAnswer(['Si te gustaria recibir informacion de Pizzeria Popular como promociones, descuentos o eventos especiales, dejanos un correo. ','De lo contrario envia "NO"'],
{
    capture:true
},
async (ctx) => {

    addProps(ctx.from,{q4: ctx.body})
    await sendEmail(ctx.from);

})
.addAnswer(['Muchas gracias por tu devolucion','Esperamos poder atenderte nuevamente pronto','Escriba vMozo para volver a comenzar'])

module.exports = flujoSalir