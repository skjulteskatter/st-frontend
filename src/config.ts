let basePath = '/'

console.log(process.env);

if (process.env.NODE_ENV == "development") {
    basePath = 'https://dmb-app.azurewebsites.net/'
}

export default {
    api: {
        basePath: basePath
    }
}
