module.exports = {
  apps : [{
    name   : "backend",
    cwd    : "./backend",
    script : "pnpm",
    args   : "start:dev"
  }, {
    name   : "frontend",
    cwd    : "./frontend",
    script : "pnpm",
    args   : "dev"
  }]
}
