import singleSpaAureliaFramework from '../src/index';

test('Function return types', () => {
    const lifecycles = singleSpaAureliaFramework({
        getInstance: new Function(),
        configure: new Function(),
        bootstrap: new Function(),
        component: '',
        debug: true,
    });

    expect(typeof lifecycles.bootstrap === 'function').toBe(true);
    expect(typeof lifecycles.mount === 'function').toBe(true);
    expect(typeof lifecycles.unmount === 'function').toBe(true);
});
