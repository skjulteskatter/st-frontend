let basePath = '/'

if (process.env.NODE_ENV == "development") {
    basePath = 'https://dmb-app.azurewebsites.net/' // 'https://dmb-app.azurewebsites.net/'
}

export default {
    api: {
        basePath: basePath
    }
}
