/* Vercel serverless entry point.
   Vercel looks for functions in /api; this one hands every request to the
   Express app in server/server.js (views, CMS pages, admin API). */
module.exports = require("../server/server");
