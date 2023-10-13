const { addKeyword } = require('@bot-whatsapp/bot')

const {addProps,getProp,enviarPedido,esNumeroPositivo,incPregunta,pedidoCompleto} = require('./auxPedidos.js')

const {respuesta,respuestaConDelay} = require('./auxMensajes.js')

const flujoPedido = addKeyword(['2','pedir'])
.addAnswer('¿Cuántas personas van a ordenar ?',{capture:true}, async (ctx,{fallBack,provider}) => {

    const i = getProp(ctx.from,'pregunta')

    const inc = await funcionPregunta(i,provider,ctx)
 
    inc === true && incPregunta(ctx.from);

    const pregunta = sigPregunta(getProp(ctx.from,'pregunta'))

    if(pregunta) fallBack(pregunta)

})
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


const sigPregunta = (orden) => {

    switch (orden) {

        case 1: return "¿Cuántas personas van a ordenar ?"

        case 2: return 'A continuación tomaremos su pedido por comensal.\nIndique comida y bebida'

        case 3: return 'Verificando'

        case 4: return "Verifique que su pedido sea correcto"
    
        default:
            break;
    }

}

const funcionPregunta = async (orden,provider,ctx) => {

    switch (orden) {
        case 1:

        const bool = esNumeroPositivo(ctx.body)
        if(bool){

            if(Number(ctx.body) > 0 && Number(ctx.body) < 11){
                addProps(ctx.from,{comensales: ctx.body})
                addProps(ctx.from,{orden: 1})
                respuestaConDelay(ctx.from,provider,'Comensal N° 1')
                return true
            }else{
                await respuesta(ctx.from,provider,'El maximo de comensales es 10')
                return false
            }
        }
        else{
            await respuesta(ctx.from,provider,'Esta opcion solo admite numeros positivos')
            return false
        }

        case 2:

            if(!ctx.message.hasOwnProperty('extendedTextMessage') && !ctx.message.hasOwnProperty('conversation')){
                await respuesta(ctx.from,provider,'Esta opcion solo admite texto')
                respuestaConDelay(ctx.from,provider,'Comensal N° 1')
                return false
            }

            addProps(ctx.from,{comida1: ctx.body})

            const orden = getProp(ctx.from,'orden')

            const comensales = getProp(ctx.from,'comensales')

            if(orden >= comensales){
                let pedido = pedidoCompleto(ctx.from);
                pedido = pedido + "\n\nIndique la opcion correcta\n1. Confirmar pedido\n2. Cancelar pedido"
                await respuestaConDelay(ctx.from, provider, pedido);
                addProps(ctx.from,{pregunta: 3})
                return true
            }

            addProps(ctx.from,{orden: orden + 1})

            respuestaConDelay(ctx.from,provider,`Comensal N° ${orden+1}`)

            return true

        case 3:
            const orden2 = getProp(ctx.from, 'orden');
            const totalComensales = getProp(ctx.from, 'comensales');

            if(!ctx.message.hasOwnProperty('extendedTextMessage') && !ctx.message.hasOwnProperty('conversation')){
                respuestaConDelay(ctx.from,provider,`Esta opcion solo admite texto. Ingrese nuevamente\nComensal N° ${orden2}`)
                return false
            }
            
            // Genera el nombre de la propiedad dinámicamente
            const comidaPropName = `comida${orden2}`;
            
            // Crea un objeto para agregar la propiedad dinámica
            const dynamicProps = {};
            dynamicProps[comidaPropName] = ctx.body;
            
            // Agrega las propiedades dinámicas al objeto
            addProps(ctx.from, dynamicProps);
            
            // Incrementa el valor de la propiedad 'orden'
            addProps(ctx.from, { orden: orden2 + 1 });

            if (orden2 >= totalComensales) {
                let pedido = pedidoCompleto(ctx.from);
                pedido = pedido + "\n\nIndique la opcion correcta\n1. Confirmar pedido\n2. Cancelar pedido"
                await respuestaConDelay(ctx.from, provider, pedido);
                return true;
            }
            
            respuestaConDelay(ctx.from, provider, `Comensal N° ${orden2 + 1}`);
            
            return false;

        case 4:

            if(ctx.body === "1"){
                await enviarPedido(ctx.from,provider,respuesta)
                await respuesta(ctx.from,provider,"Pedido realizado! Si necesita agregar algo al pedido o solicitar algo mas adelante lo puede realizar en la Opcion 3 del menu inicial\nEscriba *vMozo* para volver a comenzar")
            }
            else if(ctx.body === "2"){
                await respuesta(ctx.from,provider,"Pedido cancelado!\nEscriba *vMozo* para volver a comenzar")
            }
            else{
                await respuesta(ctx.from,provider,"Pedido cancelado!\nEscriba *vMozo* para volver a comenzar")
            }

            return true
            
        
        default:
            break;
    }

}

module.exports = flujoPedido