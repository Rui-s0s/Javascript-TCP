// Importamos net y readline
const net = require('net');
const readline = require('readline');

//bash connects 200 every 0.01 seconds for five minutes
//for i in $(seq 1 200); do   ( sleep 300; ) | nc 127.0.0.1 8000 &   sleep 0.01; done

// Definimos el host (ubicacion) y port (numero de casa)
const PORT = 8000;
const HOST = '127.0.0.1';
const MAX_CLIENTS = 100;
let clients = [];
let clientIdCounter = 1;

// Interfaz para manejar inputs en la terminal
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Funcion para darle un numero de usuario a cada cliente
function formatId(num) {
  return String(num).padStart(4, '0');
}

// Funcion para imprimir los mensajes sin que sean interrumpidos
function safeLog(message) {
  readline.clearLine(process.stdout, 0);
  readline.cursorTo(process.stdout, 0);
  console.log(message);
  rl.prompt(true);
}


// Funcion para enviar los los mensajes a todos lo clientes
function broadcast(message, exceptSocket = null) {
  clients.forEach(client => {
    if (client.socket !== exceptSocket) {
      try {
        client.socket.write(message + '\n');
      } catch (err) {
        safeLog(`[⚠️] Failed to send to ${client.id}: ${err.message}`);
        client.socket.destroy();
        clients = clients.filter(c => c !== client);
      }
    }
  });
}

// Creacion del server
const server = net.createServer(socket => {
  socket.setEncoding('utf8'); 

  // Limitamos el maximo de clientes para evitar sobrecargas en la maquina
  if (clients.length >= MAX_CLIENTS) {
    socket.write('❌ Server is full. Try again later.\n');
    socket.end();
    return;
  }

  // Formateamos el numero de cliente, creamos un mapa que relaciona el numero de cliente con su socket y lo agregamos a la lista de clientes
  const clientId = formatId(clientIdCounter++);
  const client = { id: clientId, socket };
  clients.push(client);

  // Mostramos cuando se une un cliente
  safeLog(`[+] Client ${clientId} connected from ${socket.remoteAddress}:${socket.remotePort}`);
  socket.write(`[👋] Welcome! You are User ${clientId}\n`);
  broadcast(`[📢] User ${clientId} has joined the chat.`, socket);

  // Evento para cuando el servidor recibe datos
  socket.on('data', data => {
    const msg = data.toString().trim();

    if (!msg) return;
    if (msg.length > 300) {
      socket.write('⚠️ Message too long (max 300 characters).\n');
      return;
    }

    safeLog(`[${clientId}] ${msg}`);
    broadcast(`[${clientId}] ${msg}`, socket);
  });

  // Evento para cuando el cliente se desconecta
  socket.on('end', () => {
    safeLog(`[!] Client ${clientId} disconnected`);
    clients = clients.filter(c => c !== client);
    broadcast(`[❌] User ${clientId} left the chat.`);
  });

  // Evento para atrapar errores
  socket.on('error', err => {
    safeLog(`[⚠️] Error with client ${clientId}: ${err.message}`);
    clients = clients.filter(c => c !== client);
    socket.destroy()
  });

});

// Evento para cuando el servidor manda mensajes
rl.on('line', input => {
  const trimmed = input.trim();
  if (!trimmed) return;

  // Si el input fue "exit" intenta destruir los sockets de cliente y cierra el socket de servidor
  if (trimmed.toLowerCase() === 'exit') {
    safeLog('[🔚] Server shutting down...');

    clients.forEach(c => {
      try {
        c.socket.write('🔌 Server is shutting down.\n');
        c.socket.destroy();
      } catch (e) {}
    });

    // Close server and readline interface
    server.close(() => {
      safeLog('[✅] Server closed.');
      process.exit();
    });

    rl.close();
  
  // Si el imput fue otra cosa se lo muestra a cada cliente
  } else {
    // Broadcast a server message to all clients
    broadcast(`[SERVER]: ${trimmed}\n`);
  }
});

// Manejo de errores al crear el servidor
server.on('error', err => {
  if (err.code === 'EADDRINUSE') {
    safeLog(`[❌] Port ${PORT} is already in use.`);
  } else {
    safeLog(`[❌] Server error: ${err.message}`);
  }
  process.exit(1);
});

// Inicia el server y empieza a escuchar conexiones
server.listen(PORT, HOST, () => {
  safeLog(`[🎧] Server listening on ${HOST}:${PORT}`);
  rl.prompt();
});
