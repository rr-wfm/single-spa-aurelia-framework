import singleSpaAureliaFramework from '../src/index';

test('Function return type', () => {
    const lifecycles = singleSpaAureliaFramework({
        getInstance: function () {},
        configure: function () {},
        bootstrap: function () {},
        component: '',
        debug: true,
    });
    expect(typeof lifecycles.bootstrap === 'function').toBe(true);
    expect(typeof lifecycles.mount === 'function').toBe(true);
    expect(typeof lifecycles.unmount === 'function').toBe(true);
});
