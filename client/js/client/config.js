(() => {
    SystemJS.config({
        paths: {
            app: 'js'
        },
        packages: {
            app: {
                main: 'client/default',
                defaultExtension: 'js'
            }
        },
        transpiler: false
    });
})();

//# sourceMappingURL=config.js.map
