/** @type {import('next').NextConfig} */


const isGithubActions = process.env.GITHUB_ACTIONS || false
let assetPrefix = '/route53-to-cloudflare.github.io'
let basePath = '/route53-to-cloudflare.github.io'

if (isGithubActions) {
  // trim off `<owner>/`
  const repo = process.env.GITHUB_REPOSITORY.replace(/.*?\//, '')

  assetPrefix = `/${repo}/`
  basePath = `/${repo}`
}

const nextConfig = {
  
  reactStrictMode: true,
  assetPrefix: assetPrefix,
  basePath: basePath
}

module.exports = nextConfig
