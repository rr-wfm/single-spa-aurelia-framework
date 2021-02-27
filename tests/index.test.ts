import singleSpaAureliaFramework from '../src/index';

test('Function return type', () => {
    const lifecycles = singleSpaAureliaFramework({
        getInstance: function () {
            return;
        },
        configure: function () {
            return;
        },
        bootstrap: function () {
            return;
        },
        component: '',
        debug: true,
    });
    expect(typeof lifecycles.bootstrap === 'function').toBe(true);
    expect(typeof lifecycles.mount === 'function').toBe(true);
    expect(typeof lifecycles.unmount === 'function').toBe(true);
});
