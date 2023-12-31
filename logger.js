const winston = require('winston');

// Definir niveles de prioridad
const levels = {
  debug: 0,
  http: 1,
  info: 2,
  warning: 3,
  error: 4,
  fatal: 5
};

// Configurar colores para cada nivel
const colors = {
  debug: 'blue',
  http: 'green',
  info: 'cyan',
  warning: 'yellow',
  error: 'red',
  fatal: 'magenta'
};

// Crear instancia de logger para desarrollo
const developmentLogger = winston.createLogger({
  levels,
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.simple()
  ),
  transports: [
    new winston.transports.Console()
  ]
});

// Crear instancia de logger para producción
const productionLogger = winston.createLogger({
  levels,
  format: winston.format.combine(
    winston.format.simple()
  ),
  transports: [
    new winston.transports.File({ filename: 'errors.log', level: 'error' })
  ]
});

// Definir nivel actual del logger
const currentLogLevel = process.env.NODE_ENV === 'production' ? 'info' : 'debug';

// Función para obtener el logger correspondiente según el entorno
function getLogger() {
  return process.env.NODE_ENV === 'production' ? productionLogger : developmentLogger;
}

// Función para loggear un mensaje
function log(level, message) {
  const logger = getLogger();
  if (levels[level] >= levels[currentLogLevel]) {
    logger.log({
      level: level,
      message: message
    });
  }
}

// Modificar los console.log() habituales para utilizar el logger
console.log = (message) => {
  log('debug', message);
};

console.error = (message) => {
  log('error', message);
};

// Ejemplo de uso del logger
log('debug', 'Este es un mensaje de nivel debug');
log('info', 'Este es un mensaje de nivel info');
log('error', 'Este es un mensaje de nivel error');

// Endpoint para probar los logs
app.get('/loggerTest', (req, res) => {
  log('debug', 'Mensaje de prueba: debug');
  log('http', 'Mensaje de prueba: http');
  log('info', 'Mensaje de prueba: info');
  log('warning', 'Mensaje de prueba: warning');
  log('error', 'Mensaje de prueba: error');
  log('fatal', 'Mensaje de prueba: fatal');
  
  res.send('Logs generados en la consola');
});
