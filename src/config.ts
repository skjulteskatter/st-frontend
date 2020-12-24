let basePath = '/'

if (process.env.NODE_ENV == "development") {
    basePath = 'https://localhost:44301/' // 'https://dmb-app.azurewebsites.net/'
}

export default {
    api: {
        basePath: basePath
    }
}
