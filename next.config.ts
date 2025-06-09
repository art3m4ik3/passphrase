import type { NextConfig } from "next";
import createNextJsObfuscator from "nextjs-obfuscator";

const withNextJsObfuscator = createNextJsObfuscator(
  {
    compact: true,
    controlFlowFlattening: true,
    deadCodeInjection: true,
    debugProtection: true,
    debugProtectionInterval: 2000,
    disableConsoleOutput: true,
    identifierNamesGenerator: "hexadecimal",
    log: false,
    numbersToExpressions: true,
    renameGlobals: false,
    selfDefending: true,
    simplify: true,
    splitStrings: true,
    stringArray: true,
    stringArrayCallsTransform: true,
    stringArrayEncoding: ["rc4"],
    stringArrayIndexShift: true,
    stringArrayRotate: true,
    stringArrayShuffle: true,
    stringArrayWrappersCount: 5,
    stringArrayWrappersChainedCalls: true,
    stringArrayWrappersParametersMaxCount: 5,
    stringArrayWrappersType: "function",
    stringArrayThreshold: 1,
    transformObjectKeys: true,
    unicodeEscapeSequence: true,
    deadCodeInjectionThreshold: 1,
    controlFlowFlatteningThreshold: 1,

    domainLock: [".ll-u.ru", ".ll-u.pro", ".localhost"],
    domainLockRedirectUrl: "https://passphrase.ll-u.ru",
  },
  {
    enabled: true,
    patterns: ["./**/*.(js|jsx|ts|tsx)", "./**/**/*.(js|jsx|ts|tsx)"],
    obfuscateFiles: { buildManifest: true, ssgManifest: true, webpack: true },
  },
);

const nextConfig: NextConfig = withNextJsObfuscator({
  output: undefined,

  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  productionBrowserSourceMaps: false,

  eslint: {
    ignoreDuringBuilds: true,
  },

  typescript: {
    ignoreBuildErrors: true,
  },

  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    minimumCacheTTL: 60 * 60 * 24 * 30,
    dangerouslyAllowSVG: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "placehold.co",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "cdn.discordapp.com",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "picsum.photos",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "flagcdn.com",
        pathname: "/**",
      },
    ],
  },

  compiler: {
    styledComponents: true,
    removeConsole:
      process.env.NODE_ENV === "production"
        ? {
            exclude: ["error", "warn", "info", "debug"],
          }
        : false,
  },

  turbopack: {
    resolveAlias: {
      underscore: "lodash",
    },
    resolveExtensions: [".mdx", ".tsx", ".ts", ".jsx", ".js", ".json"],
  },

  experimental: {
    optimisticClientCache: true,
    optimizeCss: true,
  },

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains; preload",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value:
              "camera=(), microphone=(), geolocation=(), interest-cohort=()",
          },
        ],
      },
      {
        source: "/api/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "no-store",
          },
        ],
      },
      {
        source: "/_next/static/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
});

export default nextConfig;
