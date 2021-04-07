import { Aurelia, Controller } from 'aurelia-framework';
import { LifeCycleFn, LifeCycles } from 'single-spa';

type Merge<M, N> = Omit<M, Extract<keyof M, keyof N>> & N;

export type SingleSpaProps = {
    name: string;
    payload: unknown;
};

export type SingleSpaAureliaFrameworkOptions = {
    getInstance: () => AureliaInstance;
    configure: (aurelia: AureliaInstance) => Promise<void>;
    bootstrap: (configure: (aurelia: AureliaInstance) => Promise<void>) => Promise<void>;
    component: string;
    debug: boolean;
};

export type AureliaInstance = Merge<
    Aurelia,
    {
        root: Controller;
        host: Element | null;
        hostConfigured: boolean;
    }
>;

export class SingleSpaCustomProps {
    name: string;
    payload: unknown;

    constructor(props: { name: string; payload: unknown }) {
        this.name = props.name;
        this.payload = props.payload;
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

const mount = async (options: SingleSpaAureliaFrameworkOptions, props: SingleSpaProps): Promise<void> => {
    const aurelia = options.getInstance();

    aurelia.container.registerSingleton(SingleSpaCustomProps, function () {
        return props.payload;
    });

    await aurelia.start();
    await aurelia.setRoot(options.component, createContainerElement(props.name));

    log(`${props.name} has been mounted!`, options.debug);

    return Promise.resolve();
};

const unmount = async (options: SingleSpaAureliaFrameworkOptions, props: SingleSpaProps): Promise<void> => {
    const aurelia: AureliaInstance = options.getInstance();

    aurelia.root.view.removeNodes();
    aurelia.root.detached();
    aurelia.root.unbind();

    aurelia.host = null;
    aurelia.hostConfigured = false;

    log(`${props.name} has been unmounted!`, options.debug);

    return Promise.resolve();
};

export default function singleSpaAureliaFramework(options: SingleSpaAureliaFrameworkOptions): LifeCycles {
    log('The registered application has been loaded!', options.debug);

    if (typeof options !== 'object') {
        throw new Error('single-spa-aurelia-framework requires a configuration object');
    }

    if (typeof options.configure !== 'function') {
        throw new Error('single-spa-aurelia-framework should be passed the configure method');
    }

    if (typeof options.bootstrap !== 'function') {
        throw new Error('single-spa-aurelia-framework should be passed the aurelia-bootstrapper bootstrap method');
    }

    return {
        bootstrap: bootstrap.bind(null, options) as LifeCycleFn<any>,
        mount: mount.bind(null, options) as LifeCycleFn<any>,
        unmount: unmount.bind(null, options) as LifeCycleFn<any>,
    };
}
