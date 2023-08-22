const fs = require('fs');
const path = require('path');

const enviarQrs = async (from,provider) => {
  const qrsPath = path.join(__dirname, '../media/qrs'); // Ruta a la carpeta qrs
  const qrFiles = fs.readdirSync(qrsPath); // Leer los nombres de los archivos en la carpeta
  
  const qrObjects = qrFiles.map(filename => {
    const filePath = path.join(qrsPath, filename);
    const nameWithoutExtension = path.parse(filename).name;
    return { path: filePath, name: nameWithoutExtension };
  });

  let prov = provider.getInstance();

  for (let i = 0; i < qrObjects.length; i++) {
    await prov.sendMessage(`${from}@s.whatsapp.net`, {
        image: { url: qrObjects[i].path },
        fileName: qrObjects[i].name,
      }); 
  }
}

module.exports = { enviarQrs };