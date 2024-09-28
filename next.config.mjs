/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: (config, { isServer }) => {
        if (!isServer) {
          // Replace fs and encoding with empty modules when building for the browser
          config.resolve.fallback = {
            fs: false,
            encoding: false,
          };
        }
        return config;
      },
};

export default nextConfig;
