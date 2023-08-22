const { addKeyword } = require('@bot-whatsapp/bot')

const {addProps,getProp,enviarPedido,esNumeroPositivo} = require('./auxPedidos.js')

const flujoPedido = addKeyword(['2','pedir'])
.addAnswer('Cuantos comensales son ?',
{
    capture: true
},
async (ctx,{fallBack,provider}) => {

    const bool = esNumeroPositivo(ctx.body)
    if(bool){
        if(Number(ctx.body) > 0 && Number(ctx.body) < 11){
        addProps(ctx.from,{comensales: ctx.body})
        }else{
            const prov = provider.getInstance()
            const telefono = ctx.from + '@s.whatsapp.net'
            await prov.sendMessage(telefono,{text: "El maximo de comensales es 10"})
            fallBack()
        }
    }
    else{
        const prov = provider.getInstance()
        const telefono = ctx.from + '@s.whatsapp.net'
        await prov.sendMessage(telefono,{text: "Esta opcion solo admite numeros positivos"})
        fallBack()
    }

})
.addAnswer('Que va a comer el comensal N° 1 ?',
{
    capture: true
},
(ctx) => {

    addProps(ctx.from,{comida1: ctx.body})

})
.addAnswer('Que va a tomar el comensal N° 1 ?',
{
    capture: true
},
async (ctx,{endFlow,provider}) => {

    addProps(ctx.from,{bebida1: ctx.body})
    const comensales = getProp(ctx.from,'comensales')
    if(comensales === "1"){
        await enviarPedido(ctx.from,provider)
        return endFlow()
    }
})
.addAnswer('Que va a comer el comensal N° 2 ?',
{
    capture: true
},
(ctx) => {

    addProps(ctx.from,{comida2: ctx.body})
})
.addAnswer('Que va a tomar el comensal N° 2 ?',
{
    capture: true
},
async (ctx,{endFlow,provider}) => {

    addProps(ctx.from,{bebida2: ctx.body})
    const comensales = getProp(ctx.from,'comensales')
    if(comensales === "2"){
        await enviarPedido(ctx.from,provider)
        return endFlow()
    }
})
.addAnswer('Que va a comer el comensal N° 3 ?',
{
    capture: true
},
(ctx) => {

    addProps(ctx.from,{comida3: ctx.body})
})
.addAnswer('Que va a tomar el comensal N° 3 ?',
{
    capture: true
},
async (ctx,{endFlow,provider}) => {

    addProps(ctx.from,{bebida3: ctx.body})
    const comensales = getProp(ctx.from,'comensales')
    if(comensales === "3"){
        await enviarPedido(ctx.from,provider)
        return endFlow()
    }
})
.addAnswer('Que va a comer el comensal N° 4 ?',
{
    capture: true
},
(ctx) => {

    addProps(ctx.from,{comida4: ctx.body})
})
.addAnswer('Que va a tomar el comensal N° 4 ?',
{
    capture: true
},
async (ctx,{endFlow,provider}) => {

    addProps(ctx.from,{bebida4: ctx.body})
    const comensales = getProp(ctx.from,'comensales')
    if(comensales === "4"){
        await enviarPedido(ctx.from,provider)
        return endFlow()
    }
})
.addAnswer('Que va a comer el comensal N° 5 ?',
{
    capture: true
},
(ctx) => {

    addProps(ctx.from,{comida5: ctx.body})
})
.addAnswer('Que va a tomar el comensal N° 5 ?',
{
    capture: true
},
async (ctx,{endFlow,provider}) => {

    addProps(ctx.from,{bebida5: ctx.body})
    const comensales = getProp(ctx.from,'comensales')
    if(comensales === "5"){
        await enviarPedido(ctx.from,provider)
        return endFlow()
    }
})
.addAnswer('Que va a comer el comensal N° 6 ?',
{
    capture: true
},
(ctx) => {

    addProps(ctx.from,{comida6: ctx.body})
})
.addAnswer('Que va a tomar el comensal N° 6 ?',
{
    capture: true
},
async (ctx,{endFlow,provider}) => {

    addProps(ctx.from,{bebida6: ctx.body})
    const comensales = getProp(ctx.from,'comensales')
    if(comensales === "6"){
        await enviarPedido(ctx.from,provider)
        return endFlow()
    }
})
.addAnswer('Que va a comer el comensal N° 7 ?',
{
    capture: true
},
(ctx) => {

    addProps(ctx.from,{comida7: ctx.body})
})
.addAnswer('Que va a tomar el comensal N° 7 ?',
{
    capture: true
},
async (ctx,{endFlow,provider}) => {

    addProps(ctx.from,{bebida7: ctx.body})
    const comensales = getProp(ctx.from,'comensales')
    if(comensales === "7"){
        await enviarPedido(ctx.from,provider)
        return endFlow()
    }
})
.addAnswer('Que va a comer el comensal N° 8 ?',
{
    capture: true
},
(ctx) => {

    addProps(ctx.from,{comida8: ctx.body})
})
.addAnswer('Que va a tomar el comensal N° 8 ?',
{
    capture: true
},
async (ctx,{endFlow,provider}) => {

    addProps(ctx.from,{bebida8: ctx.body})
    const comensales = getProp(ctx.from,'comensales')
    if(comensales === "8"){
        await enviarPedido(ctx.from,provider)
        return endFlow()
    }
})
.addAnswer('Que va a comer el comensal N° 9 ?',
{
    capture: true
},
(ctx) => {

    addProps(ctx.from,{comida9: ctx.body})
})
.addAnswer('Que va a tomar el comensal N° 9 ?',
{
    capture: true
},
async (ctx,{endFlow,provider}) => {

    addProps(ctx.from,{bebida9: ctx.body})
    const comensales = getProp(ctx.from,'comensales')
    if(comensales === "9"){
        await enviarPedido(ctx.from,provider)
        return endFlow()
    }
})
.addAnswer('Que va a comer el comensal N° 10 ?',
{
    capture: true
},
(ctx) => {

    addProps(ctx.from,{comida10: ctx.body})
})
.addAnswer('Que va a tomar el comensal N° 10 ?',
{
    capture: true
},
async (ctx,{endFlow,provider}) => {

    addProps(ctx.from,{bebida10: ctx.body})
    const comensales = getProp(ctx.from,'comensales')
    if(comensales === "10"){
        await enviarPedido(ctx.from,provider)
        return endFlow()
    }
})



module.exports = flujoPedido