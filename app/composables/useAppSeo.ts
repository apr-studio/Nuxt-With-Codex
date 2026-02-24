// Shared SEO defaults for the entire app.
export const useAppSeo = () => {
  useHead({
    htmlAttrs: { lang: 'en' },
    meta: [{ name: 'viewport', content: 'width=device-width, initial-scale=1' }],
    link: [{ rel: 'icon', href: '/favicon.ico' }]
  })

  const title = 'Nuxt UI Showcase'
  const description = 'Nuxt.js + Nuxt UI route navigation and component gallery'

  useSeoMeta({
    title,
    description,
    ogTitle: title,
    ogDescription: description
  })
}
