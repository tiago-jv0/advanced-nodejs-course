
export const env = {
  facebookApi: {
    clientId: process.env.FB_CLIENT_ID ?? '1808335502689939',
    clientSecret: process.env.FB_CLIENT_SECRET ?? '293cbdfa8abfc1a31d895810ffe3e3ed'
  },
  port: process.env.PORT ?? 3000,
  jwtSecret: process.env.JWT_SECRET ?? '324io3243ij'

}
