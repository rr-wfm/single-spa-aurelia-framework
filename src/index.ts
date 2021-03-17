import { LifeCycles } from 'single-spa';

export class SingleSpaCustomProps {
    constructor(props: any) {
        for (const key in props) {
            (this as any)[key] = props[key];
        }
    }
}

function log(message: string, debug: boolean) {
    if (debug) {
        console.log(message);
    }
}

function createContainerElement(name: string) {
    const id = `single-spa-application:${name}`;
    let domElement: Element | null = document.getElementById(id);

    if (!domElement) {
        domElement = document.createElement('div');
        domElement.id = id;
        document.body.appendChild(domElement);
    }

    return domElement;
}

const bootstrap = async (options: SingleSpaAureliaFrameworkOptions, props: SingleSpaProps): Promise<void> => {
    await options.bootstrap(options.configure);

    log(`${props.name} has been bootstrapped!`, options.debug);

    return Promise.resolve();
};

const mount = async (options: SingleSpaAureliaFrameworkOptions, props: SingleSpaProps): Promise<unknown> => {
    const aurelia = options.getInstance();

    aurelia.container.registerSingleton(SingleSpaCustomProps, () => props);

    await aurelia.start();
    await aurelia.setRoot(options.component, createContainerElement(props.name));

    log(`${props.name} has been mounted!`, options.debug);

    return Promise.resolve();
};

const unmount = async (options: SingleSpaAureliaFrameworkOptions, props: SingleSpaProps): Promise<unknown> => {
    const aurelia = options.getInstance();

    aurelia['root'].view.removeNodes();
    aurelia['root'].detached();
    aurelia['root'].unbind();

    log(`${props.name} has been unmounted!`, options.debug);

    return Promise.resolve();
};

export default function singleSpaAureliaFramework(options: SingleSpaAureliaFrameworkOptions): LifeCycles {
    log('The registered application has been loaded!', options.debug);

    if (typeof options !== 'object') {
        throw Error('single-spa-aurelia requires a configuration object');
    }

    if (typeof options.configure !== 'function') {
        throw new Error('single-spa-aurelia-framework should be passed the configure method');
    }

    if (typeof options.bootstrap !== 'function') {
        throw new Error('single-spa-aurelia-framework should be passed the aurelia-bootstrapper bootstrap method');
    }

    return {
        bootstrap: bootstrap.bind(null, options),
        mount: mount.bind(null, options),
        unmount: unmount.bind(null, options),
    };
}
