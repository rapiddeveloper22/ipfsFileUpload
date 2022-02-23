module.exports = {
    port: process.env.PORT || 3000,
    files: ['.home/**/*.{html,htm,css,js,ejs}'],
    server: {
        baseDir: ["./views"]
    }
};