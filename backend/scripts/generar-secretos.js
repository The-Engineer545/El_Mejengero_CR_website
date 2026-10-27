// Genera las variables de seguridad para el .env.
// Uso (desde la carpeta backend): node scripts/generar-secretos.js
const readline = require('node:readline');
const crypto = require('node:crypto');
const bcrypt = require('bcryptjs');

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

rl.question('Contraseña del administrador (mínimo 10 caracteres): ', (contrasena) => {
  rl.close();
  if (contrasena.length < 10) {
    console.error('La contraseña debe tener al menos 10 caracteres.');
    process.exit(1);
  }
  console.log('\nCopia estas dos líneas en tu .env:\n');
  console.log('ADMIN_PASSWORD_HASH=' + bcrypt.hashSync(contrasena, 12));
  console.log('JWT_SECRET=' + crypto.randomBytes(48).toString('hex'));
});
