module.exports = {
  apps: [
    {
      name: "App2",
      script: "./src/server.js",
      watch: true,
      autorestart: true,
      exec_mode: "cluster",
      args: "--puerto=8082",
    },
    {
      name: "App3",
      script: "./src/server.js",
      watch: true,
      autorestart: true,
      exec_mode: "cluster",
      args: "--puerto=8083",
    },
    {
      name: "App4",
      script: "./src/server.js",
      watch: true,
      autorestart: true,
      exec_mode: "cluster",
      args: "--puerto=8084",
    },
    {
      name: "App5",
      script: "./src/server.js",
      watch: true,
      autorestart: true,
      exec_mode: "cluster",
      args: "--puerto=8085",
    },
  ],
};