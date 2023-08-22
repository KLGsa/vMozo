const fs = require('fs');
const path = require('path');

const enviarCartas = async (from,provider) => {
  const cartasPath = path.join(__dirname, '../media/cartas'); // Ruta a la carpeta cartas
  const cartaFiles = fs.readdirSync(cartasPath); // Leer los nombres de los archivos en la carpeta
  
  const cartaObjects = cartaFiles.map(filename => {
    const filePath = path.join(cartasPath, filename);
    const nameWithoutExtension = path.parse(filename).name;
    return { path: filePath, name: nameWithoutExtension };
  });

  let prov = provider.getInstance();

  for (let i = 0; i < cartaObjects.length; i++) {
    await prov.sendMessage(`${from}@s.whatsapp.net`, {
        image: { url: cartaObjects[i].path },
        fileName: cartaObjects[i].name,
      }); 
  }
  }

module.exports = {enviarCartas}