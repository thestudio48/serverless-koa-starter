const serverless = require("serverless-http");

const Koa = require("koa");
const application = new Koa();

const cors = require("@koa/cors");
const helmet = require("koa-helmet");
const logger = require("koa-logger");

const Router = require("koa-router");
const router = new Router();

const HttpStatus = require("http-status-codes");

router
  .get("/", async ctx => {
    ctx.body = "Hello, World!";
  })
  .get(
    "/favicon.ico",
    async ctx => (ctx.response.status = HttpStatus.NO_CONTENT)
  )
  .get(
    "/robots.txt",
    async ctx => (ctx.response.status = HttpStatus.NO_CONTENT)
  );

application
  .use(async (ctx, next) => {
    try {
      await next();
    } catch (error) {
      console.error(error);
      ctx.status = error.status || HttpStatus.INTERNAL_SERVER_ERROR;
      ctx.body = error.message;
    }
  })
  .use(
    cors({
      origin: "*"
    })
  )
  .use(helmet())
  .use(logger())
  .use(bodyParser())
  .use(router.routes())
  .use(router.allowedMethods());

module.exports.handler = serverless(application);
