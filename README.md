# Single SPA Aurelia Framework v1

A Single SPA adapter for Aurelia framework v1. The module manually bootstraps the aurelia instance when the Single SPA bootstrap lifecycle method is called and will call instance.start() and instance.setRoot() when the application is mounted.

Due to a non existant Aurelia teardown API the root component is removed, detached and unbound manually [as suggested by the author](https://github.com/aurelia/framework/issues/714#issuecomment-279605202).

## Install

```
npm i single-spa-aurelia-framework
```

## Options

```typescript
{
    // Aurelia configure method provided in main.ts
    configure: configure,
    // Method to get the active aurelia instance from 'aurelia-dependency-injection'
    getInstance: () => Container.instance.get(Aurelia),
    // Manual bootstrap method from 'aurelia-bootstrapper'
    bootstrap: aureliaBootstrap,
    // Your root component, required by setRoot() the called in mount() lifecycle method.
    component: PLATFORM.moduleName('app'),
    // Logs single-spa lifecycle methods when invoked. Default false.
    debug: true,
}
```

## Example integration

This example demonstrates how to expose the Single SPA lifecycle methods with an existing `configure()` method in your main.ts file.

_./src/main.single-spa.ts_

```typescript
import singleSpaAureliaFramework from 'single-spa-aurelia-framework';

// Rename the imported manual bootrap method due to a naming conflict with the
// exposed Single SPA lifecycle method
import { bootstrap as aureliaBootstrap } from 'aurelia-bootstrapper';
import { Container } from 'aurelia-dependency-injection';
import { Aurelia } from 'aurelia-framework';

export async function configure(aurelia: Aurelia) {
    // ... your Aurelia configuration
    /*
     * Make sure to not call `aurelia.start()` and `aurelia.setRoot()` on the aurelia instance
     * in this configure method. This will be handled when the single-spa mount
     * lifecycle method is called.
     */
}

const lifecycles = singleSpaAureliaFramework({
    configure,
    getInstance: () => Container.instance.get(Aurelia),
    bootstrap: aureliaBootstrap,
    component: PLATFORM.moduleName('app'),
    debug: true,
});

export const bootstrap = lifecycles.bootstrap;
export const mount = lifecycles.mount;
export const unmount = lifecycles.unmount;
```

## Example Webpack configuration

If your project is running webpack, make sure to adjust them to the single-spa [recommended confguration](https://single-spa.js.org/docs/recommended-setup#build-tools-webpack--rollup). This is an example of a seperate `remote` build environment.

_./src/config/environment.remote.json_

```json
{
    "debug": true,
    "testing": true,
    "remote": true
}
```

**Important: This configuration should extend and not replace your current configuration.**

_./webpack.config.js_

```typescript
module.exports = ({ remote } = {}, { port } = {}) => ({
    // A separate `main.single-spa.ts` entrypoint exposed with `au run --env.remote`.
    entry: remote ? './src/main.single-spa.ts' : './src/main.ts',
    // As per Single SPA's recommended setup you should pack for System.register() format.
    output: {
        libraryTarget: 'system',
        publicPath: `https://localhost:${port}`,
    },
    // As per Single SPA's recommended setup all optimization should be disabled.
    optimization: {
        runtimeChunk: false,
    },
    // Your dev server should allow access from your Single SPA root app.
    devServer: {
        headers: {
            'Access-Control-Allow-Origin': '*',
        },
    }
};
```
