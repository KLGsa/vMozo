const dotenv = require("dotenv");
dotenv.config();

const nodemailer = require("nodemailer")

let pedidos = {}

let cuentas = {}

const addProps = (from,props) => {
    if(pedidos.hasOwnProperty(from)){
      Object.assign(pedidos[from], props);
    }
    else{
        pedidos[from] = {}
      Object.assign(pedidos[from], props);
    }
  }

const deletePedidosData = (from) => {
    pedidos[from] = {}
  }

const getProp = (from,prop) => {
    return pedidos[from][prop]
}

const enviarPedido = async (from,provider,respuesta) => {

  const telefono = process.env.OWNER_PHONE
 
  await respuesta(telefono,provider,pedidos[from].pedidoCompleto)

}

const agregarItems = async (from,provider) => {

const pedido = pedidos[from];
const { mesa, agregar } = pedido;

  let agregarString = `Agregar a pedido\n\nMesa: ${mesa}\nAgregar: ${agregar}`;

  const prov = provider.getInstance()

  const telefono = from + '@s.whatsapp.net'
  const owner = process.env.OWNER_PHONE + '@s.whatsapp.net'
  await prov.sendMessage(telefono,{text: "A la brevedad el mozo llevará los productos a la mesa. Muchas gracias."})
  await prov.sendMessage(owner,{text: agregarString})
  await prov.sendMessage(telefono,{text: "Escriba vMozo para volver a comenzar"})

  pedidos[from] = { mesa };

}

const esNumeroPositivo = (str) => {
  const numero = Number(str);

  if (!isNaN(numero) && numero > 0) {
    return true; 
  } else {
    return false; 
  }
}

const verificarMesa = (body,from) => {

  const regex = /^\( (\d+) \)/;
  const match = body.match(regex);

  if(!match && pedidos.hasOwnProperty(from) && pedidos[from].hasOwnProperty('mesa')) return pedidos[from].mesa  // segundo ingreso con mesa ya asignada

  if (match && match[1]) {

    const mesa = parseInt(match[1]);

    if(pedidos.hasOwnProperty(from)){

      if(pedidos[from].hasOwnProperty('mesa') && pedidos[from].mesa === mesa){
        return pedidos[from].mesa                                                 // ingreso escaneando QR y ya tenia mesa asignada y era igual
      }
      else{
      deletePedidosData(from)
      pedidos[from] = {}
      Object.assign(pedidos[from], {mesa: mesa});
      Object.assign(pedidos[from], {hora: new Date()});
      return pedidos[from].mesa                                                   // ingreso escaneando QR pero con otro numero de mesa
      }
    
    }else{
      pedidos[from] = {}
      Object.assign(pedidos[from], {mesa: mesa});                                 // ingreso escaneando QR por primera vez
      Object.assign(pedidos[from], {hora: new Date()});
      return pedidos[from].mesa
    }
  }
  else{
    return false                                                                  // ingreso x primera vez sin escanear el QR
  }

}

const llamarMozo = async (from,provider) => {

  const prov = provider.getInstance()

  const telefono = process.env.OWNER_PHONE + '@s.whatsapp.net'

  await prov.sendMessage(telefono,{text: `La mesa ${pedidos[from].mesa} solicita que su mozo se acerque`})

}

const pedirCuenta = async (from,provider) => {

  const prov = provider.getInstance()

  const telefono = process.env.OWNER_PHONE + '@s.whatsapp.net'

  await prov.sendMessage(telefono,{text: `La mesa *${pedidos[from].mesa}* solicito la cuenta`})

}

const fotoCuenta = async (from,provider) => {

  const prov = provider.getInstance()

  const telefono = process.env.OWNER_PHONE + '@s.whatsapp.net'

  await prov.sendMessage(telefono,{text: `La mesa *${pedidos[from].mesa}* solicito FOTO de la cuenta.\nPara enviarle al cliente una foto envie la frase *enviar cuenta*. Le brindaremos el telefono del cliente que le vamos a solicitar para que lo copie y pegue`})

  await prov.sendMessage(telefono,{text: from.substring(3)})

}

const verificarTiempo = (from) => {
  const pedido = pedidos[from];
  
  if (pedido && pedido.hora) {
    const horaGuardada = new Date(pedido.hora);
    const horaActual = new Date();

    // Calcula la diferencia en milisegundos entre la hora actual y la hora guardada
    const diferenciaMilisegundos = horaActual - horaGuardada;

    // Calcula la diferencia en horas
    const diferenciaHoras = diferenciaMilisegundos / (1000 * 60 * 60);

    // Verifica si la diferencia en horas es mayor a 3
    if (diferenciaHoras > 3) {
      pedidos[from] = {}
      return true;
    } else {
      return false;
    }
  }

  return false; // Si no hay pedido o no se encuentra la hora guardada
};

const sendEmail = async (from) => {

  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: process.env.KLG_MAIL, // generated ethereal user
      pass: process.env.GMAIL_PASS, // generated ethereal password
    },
  });

  let data = {
    from: `Encuesta vMozo <${process.env.SENDER}>`, // sender address
    to: process.env.OWNER_MAIL, // list of receivers
    subject: `Encuesta vMozo`, // Subject line
    text: `Encuesta vMozo`, // plain text body
  }

  data.html = `
    <div>
    <p>Encuesta de vMozo</p>
    <p>Cliente que respondio la encuesta: ${from}</p>
    <p>Calificacion del restaurante: ${pedidos[from].q1}</p>
    <p>Calificacion de vMozo: ${pedidos[from].q2}</p>
    <p>Comentario para mejorar: ${pedidos[from].q3}</p>
    <p>Correo del cliente para promociones: ${pedidos[from].q4}</p>
    
    </div>
    ` // html body
  
  await transporter.sendMail(data);

  if (pedidos[from]) {
    delete pedidos[from].q1;
    delete pedidos[from].q2;
    delete pedidos[from].q3;
    delete pedidos[from].q4;
  }
};

const incPregunta = (from) => {

  pedidos[from].pregunta = pedidos[from].pregunta + 1

}

const pedidoCompleto = (from) => {
  const pedido = pedidos[from];
  const { mesa, comensales, ...comidasYBebidas } = pedido;

  let pedidoString = `Nuevo Pedido\n\nMesa: ${mesa}\nComensales: ${comensales}`;

  for (const [key, value] of Object.entries(comidasYBebidas)) {
    if (key.includes("comida")) {
      const comensalNum = key.slice(-1);
      pedidoString += `\nPedido Comensal N° ${comensalNum}: ${value}`;
    }
  }

  addProps(from,{pedidoCompleto: pedidoString})

  return pedidoString
}


module.exports = {fotoCuenta,pedidoCompleto,incPregunta,sendEmail,verificarTiempo,pedirCuenta,llamarMozo,verificarMesa,esNumeroPositivo,addProps,deletePedidosData,getProp,enviarPedido,agregarItems}