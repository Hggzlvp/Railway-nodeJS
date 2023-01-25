import express from 'express';
import * as dotenv from 'dotenv';
import { args } from "./config/procs.config.js";
import cluster from "cluster"
import os from "os"

import compression from "compression";
import { infoProcess } from "./controllers/infoProcess.js";
import { randoms } from "./controllers/randomsProcess.js";
import { logger } from './utils/logger.js';
import { isPrime } from './utils/Prime.js';


dotenv.config();

const app = express();
const {modo,puerto} = args;

const numsCPUs=os.cpus().length;

if (modo === "cluster" && cluster.isPrimary) {
  console.log(`Cantidad de nucleos del sistema: ${numsCPUs}`);
  console.log(`PID MASTER: ${process.pid}`);
  for (let i = 0; i < numsCPUs; i++) {
    cluster.fork();
  }
  cluster.on("exit", (worker, code) => {
    console.log(`Worker ${worker.process.pid} with code ${code}`);
    cluster.fork();
  });
} else {

  app.get("/",(req,res) =>{
    res.status(200).send("Bienvenido al deploy de Railway")
  });

  app.get('/api/randoms',randoms, (req, res) => {
    logger.info(`${req.route} - ${req.method}`)
  });

  app.get("/info", infoProcess, (req,res) =>{
    logger.info(`${req.route} - ${req.method}`)
  });

  app.get("/infocompressed", compression(), infoProcess, (req,res) =>{
    logger.info(`${req.route} - ${req.method}`)
  })
  
  app.get('/prime', (req, res) => {
    const primes = [];
    const max = Number(req.query.max) || 1000;
    for (let i = 1; i <= max; i++) {
      if (isPrime(i)) primes.push(i);
      // una vez que hace la verificacion los guarda en un array
    }
    res.json(primes);
  });



  const PORT = puerto || 8080;
  
  app.listen(PORT, () =>
    logger.info(
      `Servidor express escuchando en el puerto ${PORT} - PID WORKER ${process.pid}`
    )
  );

  app.use((req, res) =>{
    logger.warn(`${req.url}`)
    logger.info(`${req.route} - ${req.method}`)
    return res.status(404).json({
      message: `No existe la ruta: ${req.url}`
    })
  })

};