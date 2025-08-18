// Next.js expects PostCSS plugins to be specified by package name (keys) in
// the config so it can manage loading. Provide the simple object form.
export default {
  plugins: {
  "@tailwindcss/postcss": {},
    autoprefixer: {},
  },
};
