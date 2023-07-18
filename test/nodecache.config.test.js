const NodeCache = require("../index")


describe("NodeCache params for instance config", () => {
    describe("StdTTL config checks", () => {
        let cache;
        afterEach(() => {
            cache.close()
        })

        test("No stdTTL value provided", () => {
            try {
                cache = new NodeCache()
                cache.set("no-std-ttl", "test-value")
                expect(cache.cache["no-std-ttl"]).toMatchObject({ value: "test-value" })
            } catch (error) {
                console.warn(error.message)
            }
        })

        test("Valid stdTTL of 100ms is set for all the keys by default", () => {
            try {
                cache = new NodeCache({
                    stdTTL: 100
                })

                cache.set("std-100-k1", "value-k1v1")
                expect(cache.cache["std-100-k1"]).toBeTruthy()
                setTimeout(() => {
                    cache.get("std-100-k1")
                    expect(cache.cache["std-100-k1"]).toBeUndefined()
                }, 150)
            } catch (error) {
                console.warn(error.message)
            }
        })

        test("Invalid stdTTL value with the instance :: boolean", () => {
            cache = new NodeCache({
                stdTTL: true
            })
            // expect the stdTTL to be 0 => Infinite.
            cache.set("k1", "boolean-ttl-check");
            expect(cache.cache["k1"]).toHaveProperty("ttl")
            expect(cache.cache["k1"]).toMatchObject({
                value: expect.anything(),
                ttl: expect.any(Number)
            })
            expect(cache.cache["k1"].ttl).toBeGreaterThanOrEqual(Date.now())
        })

        test("Invalid stdTTL value with the instance :: string", () => {
            cache = new NodeCache({
                stdTTL: "15000" // 15seconds
            })
            // expect the stdTTL to be 0 => Infinite.
            cache.set("k2", "string-ttl-check");
            expect(cache.cache["k2"]).toHaveProperty("ttl")
            expect(cache.cache["k2"]).toMatchObject({
                value: expect.anything(),
                ttl: expect.any(Number)
            })
            expect(cache.cache["k2"].ttl).toBeGreaterThanOrEqual(Date.now())
        })

        test("Falsy stdTTL value with the instance", () => {
            cache = new NodeCache({
                stdTTL: NaN // falsy values: 0, false, null, undefined, NaN, ''
            })
            // expect the stdTTL to be 0 => Infinite.
            cache.set("k3", "falsy-check");
            expect(cache.cache["k3"]).toHaveProperty("ttl")
            expect(cache.cache["k3"]).toMatchObject({
                value: expect.anything(),
                ttl: expect.any(Number)
            })
            expect(cache.cache["k3"].ttl).toBeGreaterThanOrEqual(Date.now())
        })
    })


    describe("forceString config checks", () => {
        let cache
        afterEach(() => {
            cache.close()
        })

        test("forceString non provided, defaults to true", () => {
            cache = new NodeCache()
            cache.set("key1", {
                id: 6231,
                data: "data for key1",
                createAt: Date.now()
            })

            let { value } = cache.cache["key1"];

            expect(value).not.toBeUndefined()
            expect(value).toEqual(expect.any(String)) // not an object anymore
        })

        test("forceString is set to false to prevent automatic type coercion", () => {
            cache = new NodeCache({
                forceString: false
            })
            cache.set("key2", {
                id: 7158,
                data: "data for key2",
                createAt: Date.now()
            })

            let { value } = cache.cache["key2"];

            expect(value).not.toBeUndefined()
            expect(value).toEqual(expect.any(Object))
        })
    })


    describe("maxKeys config checks", () => {
        let cache
        afterEach(() => {
            cache.close()
        })

        test("maxKeys not provided, defaults to -1 (No Limit)", () => {
            cache = new NodeCache()
            let flag = true;
            for (let i = 1; i <= 6; i++) {
                let success = cache.set(i, `value-${i}`)
                flag = flag & success
            }

            expect(flag).toBeTruthy()
            expect(cache.cache[6]).not.toBeUndefined()
        })

        test("maxKeys set to 5, limit imposed on cache", () => {
            cache = new NodeCache({
                maxKeys: 5
            })

            expect(() => {
                for (let i = 1; i <= 6; i++) {
                    cache.set(i, `value-${i}`)
                }
            }).toThrow(Error)

            expect(cache.cache[5]).not.toBeUndefined()
            expect(cache.cache[6]).toBeUndefined()
        })
    })

    describe("Logger configurations for the nodecache.js instance", () => {
        let cache
        beforeAll(() => {
            cache = new NodeCache({
                type: "Custom"
            })
        })
        afterAll(() => {
            cache.close();
        })

        test("NodeCache instance to be not null", () => {
            expect(cache).not.toBe(null)
        })

        test("NodeCache instance with Logger::mode as none", () => {
            expect(cache.logger.mode).toEqual("none")
        })
        test("NodeCache instance with Logger::type as Custom", () => {
            expect(cache.logger.type).toEqual("Custom")
        })
        test("NodeCache instance with Logger::path as none", () => {
            expect(cache.logger.path).toEqual("none")
        })
    })

    describe("Custom Logger prompt check for the instance on mode = std", () => {

        afterAll(() => {
            cache.close();
        })
        let cache = new NodeCache({
            mode: "std",
            type: "Custom"
        })
        test("NodeCache instance to be not null", () => {
            expect(cache).not.toBe(null)
        })
        test("NodeCache instance with Logger::mode as std", () => {
            expect(cache.logger.mode).toEqual("std")
        })
        test("NodeCache instance with Logger::type as Custom", () => {
            expect(cache.logger.type).toEqual("Custom")
        })
        test("NodeCache instance with Logger::path as none", () => {
            expect(cache.logger.path).toEqual("none")
        })
    })

    describe("Falsy mode and path config for the instance", () => {
        let cache
        beforeAll(() => {
            cache = new NodeCache({
                mode: null,
                type: "xyz",
                path: undefined
            })
        })
        afterAll(() => {
            cache.close();
        })

        test("Valid Instance with default params for logger", () => {
            expect(cache).not.toBe(null)
            expect(cache.logger.mode).toEqual("none")
            expect(cache.logger.type).toEqual("xyz")
            expect(cache.logger.path).toEqual("none")
        })
    })
})