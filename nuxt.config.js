/* eslint-disable */ /* eslint-disable prettier/prettier */
require('dotenv').config();

export default {
    // Global page headers (https://go.nuxtjs.dev/config-head)
    head: {
        title: 'e-commerce',
        meta: [
            { charset: 'utf-8' },
            { name: 'viewport', content: 'width=device-width, initial-scale=1' },
            { hid: 'description', name: 'description', content: '' },
        ],
        link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
    },

    // Global CSS (https://go.nuxtjs.dev/config-css)
    css: [],

    // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
    plugins: ['~/plugins/vue-swal'],

    // Auto import components (https://go.nuxtjs.dev/config-components)
    components: true,

    // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
    buildModules: [
        // https://go.nuxtjs.dev/eslint
        '@nuxtjs/eslint-module',
        // https://go.nuxtjs.dev/tailwindcss
        '@nuxtjs/tailwindcss',
        // https://go.nuxtjs.dev/pwa
        '@nuxtjs/pwa',
    ],

    // Modules (https://go.nuxtjs.dev/config-modules)
    modules: [
        // https://go.nuxtjs.dev/axios
        '@nuxtjs/axios',
        // https://go.nuxtjs.dev/pwa
        '@nuxtjs/pwa',
        // strapi for nuxt
        '@nuxtjs/strapi',
        '@nuxtjs/auth',
        '@nuxtjs/cloudinary',
        '@nuxtjs/dotenv',
    ],

    strapi: {
        url: process.env.API_AUTH_URL || 'http://localhost:1337',
        entities: [
            'global',
            'homepage',
            'categories',
            'users',
            'users_permissions_user',
            'users_permissions_roles',
            'products',
            'orders',
            'subscribers'
        ],
    },
    // Axios module configuration (https://go.nuxtjs.dev/config-axios)
    axios: {},

    auth: {
        strategies: {
            local: {
                endpoints: {
                    login: {
                        url: `${process.env.API_AUTH_URL}/auth/local`,
                        method: 'post',
                        propertyName: 'jwt'
                    },
                    uuser: {
                        url: `${process.env.API_AUTH_URL}/users/me`,
                        method: 'get',
                        propertyName: false
                    },
                    logout: false
                },
                autoFetchUser: true
            }
        }
    },

    cloudinary: {
        cloudName: `${process.env.CLOUD_NAME}` || 'dc6apsdtu',
        apiKey: process.env.API_KEY || '137939413133749',
        apiSecret: process.env.API_SECRET || '8hFdOpghWmm208SxHFubOX8ZcfE',
        upload_preset: true
    },

    hooks: {
        async upload(e, { store }) {
            const fs = require('fs');
            const { $axios } = require('@nuxtjs/axios');
            const { $cloudinary } = require('@nuxtjs/cloudinary');

            const user = store.state.auth.user;
            const file = e.target.files[0];

            const readData = (f) => new Promise((resolve) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result);
                reader.readAsDataURL(f);
            });

            const data = await readData(file);

            const options = {
                timestamp: Date.now(),
                cloud_name: `${process.env.CLOUD_NAME}`,
                api_key: `${process.env.API_KEY}`,
                public_id: `users/user-${user.id}/${data.file.name}`,
                resouce_type: 'image',
                tags: ['auto_upload'],
                api_secret: `${process.env.API_SECRET}`
            };

            const signature = await $axios.post('generate_signature', `${data}`, {
                ...options,
                api_secret: `${process.env.API_SECRET}`
            });

            if (signature) {
                const instance = await $cloudinary.upload(`user/${data}`, {
                    ...options,
                    signature,
                }, function(error, result) {
                    console.log(result);
                });

                return fs.readFileSync(`/upload/${instance}`);
            }
        }
    },

    // Build Configuration (https://go.nuxtjs.dev/config-build)
    build: {
        postcss: {
            preset: {
                features: {
                    customProperties: false
                }
            }
        },
        /*
         ** Run ESLint on save
         */
        extend(config, ctx) {
            if (ctx.dev && ctx.isClient) {
                config.module.rules.push({
                    enforce: 'pre',
                    test: /\.(js|vue)$/,
                    loader: 'eslint-loader',
                    exclude: /(node_modules)/,
                })
            }
        },
        /*
         ** Add vue-swal
         */
        vendor: ['vue-swal'],
    },

    env: {
        STRAPI_URL: process.env.API_AUTH_URL,
    },
}