First demonstration of RuntimeTypeInspector.js in combination with this PR:

https://pc.runtimetypeinspector.org/#/animation/blend-trees-2d-cartesian

If you enter code in Monaco or F12/DevTools like this:

```js
    new pc.Vec3("this", "should", "warn");
```

It warns like:

![image](https://github.com/playcanvas/engine/assets/5236548/f5c504b4-34ef-41e7-8a28-0c15ad969214)

And in console:

![image](https://github.com/playcanvas/engine/assets/5236548/0246d25b-8e01-4a8c-8d4e-5ae8286139d9)

The signal/noise ratio is still quite high to find "real" issues in the engine, but I hope we can get there with some PR's improving some type definitions here and there. Ideal case would be running every example with only a few errors here and there, but not in the thousands.
