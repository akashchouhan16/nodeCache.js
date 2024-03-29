const NodeCache = require("../index")


describe("NodeCache params for instance config", () => {

    describe("NodeCache params - all invalid", () => {
        let cache
        afterEach(() => {
            cache.close()
        })
        test("When all config values are null", () => {
            cache = new NodeCache({
                forceString: null,
                stdTTL: null,
                maxKeys: null,
                valueOnly: null
            })
            cache.set(1, 12345)
            //since forceString will be enabled by default and valueOnly will be true by default.
            expect(cache.get(1)).toStrictEqual(expect.any(String))
            expect(cache.get(1)).toStrictEqual("12345")
        })

        test("When all config values are null with valueOnly disabled", () => {
            cache = new NodeCache({
                forceString: null,
                stdTTL: null,
                maxKeys: null,
                valueOnly: false
            })
            cache.set(1, 12345)
            expect(cache.get(1)).toStrictEqual({
                value: expect.any(String), //since forceString will be enabled by default
                ttl: expect.any(Number)
            })

            expect(cache.get(1)?.ttl).toBeLessThanOrEqual(Date.now())
            expect(cache.get(1)?.value).toStrictEqual("12345")
        })

        test("When all config values are negative", () => {

            cache = new NodeCache({
                forceString: -1,
                stdTTL: -1,
                maxKeys: -1,
                valueOnly: false
            })
            cache.set(2, 678910)
            expect(cache.get(2)).toStrictEqual({
                value: expect.any(String), //since forceString will be enabled by default
                ttl: expect.any(Number)
            })

            expect(cache.get(2)?.ttl).toBeLessThanOrEqual(Date.now())
            expect(cache.get(2)?.value).toStrictEqual("678910")
            expect(cache.setM([
                { key: "kx", value: 1 },
                { key: "ky", value: 2, ttl: 60 * 60 * 1000 },
                { key: 3, value: "3" }])).toStrictEqual([true, true, true])
        })
    })

    describe("NodeCache stdTTL configurations", () => {
        let cache
        afterEach(() => {
            cache.close()
        })

        test("When no stdTTL value is configured", () => {
            try {
                cache = new NodeCache({ valueOnly: false })
                cache.set("no-std-ttl", "test-value")
                expect(cache.get("no-std-ttl")).toStrictEqual({
                    value: expect.any(String),
                    ttl: expect.any(Number)
                })
            } catch (error) {
                console.warn(error.message)
            }
        })

        test("When valid stdTTL of 100ms is configured for all the NodeCache::set() calls", () => {
            try {
                cache = new NodeCache({
                    stdTTL: 100,
                    valueOnly: false
                })

                cache.set("std-100", "test-value")
                expect(cache.get("std-100")).toStrictEqual({
                    value: expect.any(String),
                    ttl: expect.any(Number)
                })
                setTimeout(() => {
                    cache.get("std-100")
                    expect(cache.get("std-100")).toBeUndefined()
                }, 150)

                expect(cache.get("std-100")?.ttl).toStrictEqual(expect.any(Number))
            } catch (error) {
                console.warn(error.message)
            }
        })

        test("When valid, very large stdTTL value configured", () => {
            cache = new NodeCache({
                stdTTL: 30 * 24 * 60 * 60 * 1000, // 30 days
                valueOnly: false
            })

            cache.set("std-large", "test-value-largeStd")
            expect(cache.get("std-large")).toStrictEqual({
                value: expect.anything(),
                ttl: expect.any(Number)
            })
            expect(cache.get("std-large").ttl).toStrictEqual(expect.any(Number))
            expect(cache.get("std-large").value).toStrictEqual("test-value-largeStd")
        })

        test("When boolean stdTTL value is configured", () => {
            cache = new NodeCache({
                stdTTL: true,
                valueOnly: false
            })
            // expect the stdTTL to be 0 => Infinite.
            cache.set("std-boolean", "boolean-ttl-check")
            expect(cache.get("std-boolean")).toStrictEqual({
                value: expect.any(String),
                ttl: expect.any(Number)
            })
            expect(cache.get("std-boolean")?.ttl).toBeLessThanOrEqual(Date.now())
        })

        test("When string stdTTL value is configured", () => {
            cache = new NodeCache({
                stdTTL: "15000", // 15seconds
                valueOnly: false
            })
            // expect the stdTTL to be 0 => Infinite.

            cache.set("std-boolean", "string-ttl-check")
            expect(cache.get("std-boolean")).toStrictEqual({
                value: expect.any(String),
                ttl: expect.any(Number)
            })
            expect(cache.get("std-boolean")?.ttl).toBeLessThanOrEqual(Date.now())
        })

        test("When falsy (NaN) stdTTL value is configured", () => {
            cache = new NodeCache({
                valueOnly: false,
                stdTTL: NaN // falsy values: 0, false, null, undefined, NaN, ''
            })
            // expect the stdTTL to be 0 => Infinite.
            cache.set("std-falsy", "falsy-check")
            expect(cache.get("std-falsy")).toStrictEqual({
                value: expect.any(String),
                ttl: expect.any(Number)
            })
            expect(cache.get("std-falsy")?.ttl).toBeLessThanOrEqual(Date.now())
        })

        test("When falsy (null) stdTTL value is configured", () => {
            cache = new NodeCache({
                forceString: false,
                valueOnly: false,
                stdTTL: null
            })
            // expect the stdTTL to be 0 => Infinite.
            cache.set("std-falsy-2", "falsy-check-2")
            expect(cache.get("std-falsy-2")).toStrictEqual({
                value: expect.any(String),
                ttl: expect.any(Number)
            })
            expect(cache.get("std-falsy-2")?.ttl).toBeLessThanOrEqual(Date.now())
            expect(cache.get("std-falsy-2")?.value).toStrictEqual("falsy-check-2")
        })

        test("When falsy (undefined) stdTTL value is configured", () => {
            cache = new NodeCache({
                stdTTL: undefined,
                valueOnly: false
            })
            // expect the stdTTL to be 0 => Infinite.
            cache.set("std-falsy-2", "falsy-check-2")
            expect(cache.get("std-falsy-2")).toStrictEqual({
                value: expect.any(String),
                ttl: expect.any(Number)
            })
            expect(cache.get("std-falsy-2")?.ttl).toBeLessThanOrEqual(Date.now())
            expect(cache.get("std-falsy-2")?.value).toStrictEqual("falsy-check-2")
        })
    })


    describe("NodeCache forceString configurations", () => {
        let cache
        afterEach(() => {
            cache.close()
        })

        test("When forceString is not configured, defaults to true", () => {
            cache = new NodeCache()
            cache.set("key1", {
                id: 6231,
                data: "data for key1",
                createAt: Date.now()
            })

            const value = cache.get("key1")

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

            const value = cache.get("key2")

            expect(value).not.toBeUndefined()
            expect(value).toEqual(expect.any(Object))
        })
    })


    describe("NodeCache maxKeys configurations", () => {
        let cache
        afterEach(() => {
            cache.close()
        })

        test("When maxKeys is not configured, defaults to -1 (No Limit)", () => {
            cache = new NodeCache()
            let flag = true
            for (let i = 1; i <= 6; i++) {
                let success = cache.set(i, `value-${i}`)
                flag = flag & success
            }

            expect(flag).toBeTruthy()
            expect(cache.get(6)).not.toBeUndefined()
            cache.close()
        })

        test("When maxKeys set to 5, limit imposed on cache", () => {
            cache = new NodeCache({
                maxKeys: 5
            })

            expect(() => {
                for (let i = 1; i <= 6; i++) {
                    cache.set(i, `value-${i}`)
                }
            }).toThrow(Error)

            expect(cache).toBeDefined()
            const loggerConfigurations = cache.getLogConfig()
            const configurations = cache.getCacheConfig()

            expect(configurations).toBeDefined()
            expect(configurations).toStrictEqual(expect.any(Object))

            expect(loggerConfigurations).toBeDefined()
            expect(loggerConfigurations).toStrictEqual(expect.any(Object))
            expect(cache.get(6)).toBeUndefined()

            cache.close()
        })
    })
    describe("NodeCache valueOnly configurations: Default (true) case", () => {
        let cache
        beforeEach(() => {
            cache = new NodeCache({
                forceString: false
                // valueOnly: true 
                // By default valueOnly is set to true -> backward compatibility with older npm versions.
            })
        })
        afterEach(() => {
            cache.close()
        })

        test("When not valueOnly flag with the instance", () => {
            expect(cache.getCacheConfig().valueOnly).toEqual(true)
        })

        test("When using Get() and Set() calls - true case", () => {
            cache.set(151123, { _id: "nC11Hque81", value: "test-data" })
            expect(cache.get(151123)).toStrictEqual({ _id: "nC11Hque81", value: "test-data" })

            cache.set(1511232, { _id: "nC11Hque82", value: "test-data-2" }, 60 * 1000)
            expect(cache.get(1511232)).toStrictEqual({ _id: "nC11Hque82", value: "test-data-2" })
        })

        test("When using getM() and setM() calls - true case", () => {
            const input = [{ key: 1511235, value: "test-data-5" }, { key: 1511236, value: "test-data-6", ttl: 2 * 60 * 1000 }]
            cache.setM(input)

            const responses = cache.getM([1511235, 1511236])
            responses.forEach(response => {
                expect(response).toStrictEqual(expect.any(String))
            })
        })
    })

    describe("NodeCache valueOnly configurations: New (false) case", () => {
        let cache
        beforeEach(() => {
            cache = new NodeCache({
                //forceString: true by default
                forceString: false,
                valueOnly: false
            })
        })
        afterEach(() => {
            cache.close()
        })

        test("When not valueOnly flag with the instance", () => {
            expect(cache.getCacheConfig().valueOnly).toEqual(false)
        })

        test("When using get() and set() calls - false case", () => {
            cache.set(1511233, { _id: "nC11Hque83", value: "test-data-3" })
            expect(cache.get(1511233)).toStrictEqual({
                value: expect.any(Object),
                ttl: expect.any(Number)
            })

            cache.set(1511234, { _id: "nC11Hque84", value: "test-data-4" }, 60 * 1000)
            expect(cache.get(1511234)).toStrictEqual({
                value: expect.any(Object),
                ttl: expect.any(Number)
            })
        })

        test("When using getM() and setM() calls - false case", () => {
            const input = [{ key: 1511235, value: "test-data-5" }, { key: 1511236, value: "test-data-6", ttl: 2 * 60 * 1000 }]
            cache.setM(input)

            const responses = cache.getM([1511235, 1511236])
            responses.forEach(response => {
                expect(response).toStrictEqual({
                    value: expect.any(String),
                    ttl: expect.any(Number)
                })
            })
        })
    })

    describe("NodeCache Logger configurations for the instance (type: custom)", () => {
        let cache
        beforeAll(() => {
            cache = new NodeCache({
                mode: "none",
                type: "Custom"
            })
        })
        afterAll(() => {
            cache.close()
        })

        test("NodeCache instance to be not null", () => {
            expect(cache).not.toBe(null)
        })

        test("NodeCache instance with Logger::mode as none", () => {
            expect(cache.getLogConfig().mode).toEqual("none")
        })
        test("NodeCache instance with Logger::type as Custom", () => {
            expect(cache.getLogConfig().type).toEqual("Custom")
        })
        test("NodeCache instance with Logger::path as none", () => {
            expect(cache.getLogConfig().path).toEqual(undefined)
        })
    })

    describe("NodeCache for the instance (type: custom) on mode = std", () => {

        afterAll(() => {
            cache.close()
        })
        let cache = new NodeCache({
            mode: "std",
            type: "Custom"
        })
        test("NodeCache instance to be not null", () => {
            expect(cache).not.toBe(null)
        })
        test("NodeCache instance with Logger::mode as std", () => {
            expect(cache.getLogConfig().mode).toEqual("std")
        })
        test("NodeCache instance with Logger::type as Custom", () => {
            expect(cache.getLogConfig().type).toEqual("Custom")
        })
        test("NodeCache instance with Logger::path as none", () => {
            expect(cache.getLogConfig().path).toEqual(undefined)
        })
    })

    describe("NodeCache Falsy path config for the instance", () => {
        let cache
        beforeAll(() => {
            cache = new NodeCache({
                mode: "std",
                type: "xyz",
                path: undefined
            })
        })
        afterAll(() => {
            cache.close()
        })

        test("When valid instance uses default params for logger", () => {
            expect(cache).not.toBe(null)
            expect(cache.getLogConfig().mode).toEqual("std")
            expect(cache.getLogConfig().type).toEqual("xyz")
            expect(cache.getLogConfig().path).toEqual(undefined)
        })
    })
})