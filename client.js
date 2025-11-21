const net = require('net');
const readline = require('readline');

const HOST = '127.0.0.1';
const PORT = 8000;

// Creamos el objeto socket
const socket = net.createConnection(PORT, HOST, () => {
  console.log(`[🔌] Connected to server at ${HOST}:${PORT}`);
});

socket.setEncoding('utf8');

// Funcion para imprimir los mensajes sin que sean interrumpidos
function safeLog(message) {
  readline.clearLine(process.stdout, 0);
  readline.cursorTo(process.stdout, 0);
  console.log(message);
  rl.prompt(true);
}

// Interfaz para manejar inputs en la terminal
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: '> '
});

rl.prompt();

// Evento para cuando el cliente manda mensajes
rl.on('line', line => {
  const msg = line.trim();

  if (!msg) {
    rl.prompt();
    return;
  }

  if (msg.toLowerCase() === 'exit') {
    console.log('[🔚] Disconnecting...');
    socket.end();
    rl.close();
    return;
  }

  // Mandamos datos al servidor para que maneje en su evento
  socket.write(msg);
  rl.prompt();
});

// Evento para cuando el servidor manda mensajes
socket.on('data', data => {
  const msg = data.toString().trim();
  safeLog(msg)
});

// Evento para cuando el servidor se cierra
socket.on('end', () => {
  console.log('[❌] Disconnected from server.');
  rl.close();
});

// Manejar errores con el cliente
socket.on('error', err => {
  console.error(`[⚠️] Connection error: ${err.message}`);
  rl.close();
});
