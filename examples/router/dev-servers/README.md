# Dev servers — fallback is built in (development only)

Bundler dev servers fall back to `index.html` automatically, because
SPA development would be impossible otherwise.

**Vite** — on by default. `appType: "spa"` is the default in
`vite.config.js`; `vite dev` and `vite preview` both do history
fallback. Nothing to configure.

**webpack-dev-server** — one flag in `webpack.config.js`:

```js
devServer: {
  historyApiFallback: true,
}
```

**This only covers development.** The day you deploy the built files
to a real host, you need that host's config — see the other folders
here.
