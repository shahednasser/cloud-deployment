import { loadEnv, defineConfig } from '@medusajs/framework/utils'

loadEnv(process.env.NODE_ENV || 'development', process.cwd())

module.exports = defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    http: {
      storeCors: process.env.STORE_CORS!,
      adminCors: process.env.ADMIN_CORS!,
      authCors: process.env.AUTH_CORS!,
      jwtSecret: process.env.JWT_SECRET || "supersecret",
      cookieSecret: process.env.COOKIE_SECRET || "supersecret",
    }
  },
  modules: [
    {
      resolve: "@medusajs/medusa/file",
      options: {
        providers: [
          {
            resolve: "@medusajs/medusa/file-s3",
            id: "s3",
            options: {
              authentication_method: "s3-iam-role",
              // prefix: process.env.S3_PREFIX,
              // file_url: process.env.S3_FILE_URL,
              // region: process.env.S3_REGION,
              // bucket: process.env.S3_BUCKET,
              // endpoint: process.env.S3_ENDPOINT,
            },
          },
        ],
      },
    },
  ],
  plugins: [
    {
      resolve: "@medusajs/loyalty-plugin",
      options: {},
    },
    {
      resolve: "@medusajs/draft-order",
      options: {},
    },
  ],
})
