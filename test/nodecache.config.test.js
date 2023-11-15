const NodeCache = require("../index")


describe("NodeCache params for instance config", () => {

    describe("NodeCache params - all invalid", () => {

        let cache
        afterEach(() => {
            cache.close()
        })

        test("When all config values are null ", () => {
            cache = new NodeCache({
                forceString: null,
                stdTTL: null,
                maxKeys: null,
            })
            cache.set(1, 12345)
            expect(cache.cache[1]).toStrictEqual({
                value: expect.any(String), //since forceString will be enabled by default
                ttl: expect.any(Number)
            })

            expect(cache.cache[1]?.ttl).toBeLessThanOrEqual(Date.now())
            expect(cache.cache[1]?.value).toStrictEqual("12345")
        })

        test("When all config values are negative", () => {

            cache = new NodeCache({
                forceString: -1,
                stdTTL: -1,
                maxKeys: -1,
            })
            cache.set(2, 678910)
            expect(cache.cache[2]).toStrictEqual({
                value: expect.any(String), //since forceString will be enabled by default
                ttl: expect.any(Number)
            })

            expect(cache.cache[2]?.ttl).toBeLessThanOrEqual(Date.now())
            expect(cache.cache[2]?.value).toStrictEqual("678910")
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
                cache = new NodeCache()
                cache.set("no-std-ttl", "test-value")
                expect(cache.cache["no-std-ttl"]).toStrictEqual({
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
                    stdTTL: 100
                })

                cache.set("std-100", "test-value")
                expect(cache.cache["std-100"]).toStrictEqual({
                    value: expect.any(String),
                    ttl: expect.any(Number)
                })
                setTimeout(() => {
                    cache.get("std-100")
                    expect(cache.cache["std-100"]).toBeUndefined()
                }, 150)

                expect(cache.cache["std-100"]?.ttl).toBeGreaterThanOrEqual(Date.now())
            } catch (error) {
                console.warn(error.message)
            }
        })

        test("When valid, very large stdTTL value configured", () => {
            cache = new NodeCache({
                stdTTL: 30 * 24 * 60 * 60 * 1000 // 30 days
            })

            cache.set("std-large", "test-value-largeStd")
            expect(cache.cache["std-large"]).toStrictEqual({
                value: expect.anything(),
                ttl: expect.any(Number)
            })
            expect(cache.cache["std-large"].ttl).toBeGreaterThanOrEqual(Date.now())
            expect(cache.cache["std-large"].value).toStrictEqual("test-value-largeStd")
        })

        test("When boolean stdTTL value is configured", () => {
            cache = new NodeCache({
                stdTTL: true
            })
            // expect the stdTTL to be 0 => Infinite.
            cache.set("std-boolean", "boolean-ttl-check")
            expect(cache.cache["std-boolean"]).toStrictEqual({
                value: expect.any(String),
                ttl: expect.any(Number)
            })
            expect(cache.cache["std-boolean"]?.ttl).toBeGreaterThanOrEqual(Date.now())
        })

        test("When string stdTTL value is configured", () => {
            cache = new NodeCache({
                stdTTL: "15000" // 15seconds
            })
            // expect the stdTTL to be 0 => Infinite.

            cache.set("std-boolean", "string-ttl-check")
            expect(cache.cache["std-boolean"]).toStrictEqual({
                value: expect.any(String),
                ttl: expect.any(Number)
            })
            expect(cache.cache["std-boolean"]?.ttl).toBeGreaterThanOrEqual(Date.now())
        })

        test("When falsy (NaN) stdTTL value is configured", () => {
            cache = new NodeCache({
                stdTTL: NaN // falsy values: 0, false, null, undefined, NaN, ''
            })
            // expect the stdTTL to be 0 => Infinite.
            cache.set("std-falsy", "falsy-check")
            expect(cache.cache["std-falsy"]).toStrictEqual({
                value: expect.any(String),
                ttl: expect.any(Number)
            })
            expect(cache.cache["std-falsy"].ttl).toBeGreaterThanOrEqual(Date.now())
        })

        test("When falsy (null) stdTTL value is configured", () => {
            cache = new NodeCache({
                stdTTL: null
            })
            // expect the stdTTL to be 0 => Infinite.
            cache.set("std-falsy-2", "falsy-check-2")
            expect(cache.cache["std-falsy-2"]).toStrictEqual({
                value: expect.any(String),
                ttl: expect.any(Number)
            })
            expect(cache.cache["std-falsy-2"].ttl).toBeGreaterThanOrEqual(Date.now())
            expect(cache.cache["std-falsy-2"].value).toStrictEqual("falsy-check-2")
        })

        test("When falsy (undefined) stdTTL value is configured", () => {
            cache = new NodeCache({
                stdTTL: undefined
            })
            // expect the stdTTL to be 0 => Infinite.
            cache.set("std-falsy-2", "falsy-check-2")
            expect(cache.cache["std-falsy-2"]).toStrictEqual({
                value: expect.any(String),
                ttl: expect.any(Number)
            })
            expect(cache.cache["std-falsy-2"].ttl).toBeGreaterThanOrEqual(Date.now())
            expect(cache.cache["std-falsy-2"].value).toStrictEqual("falsy-check-2")
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

            let { value } = cache.cache["key1"]

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

            let { value } = cache.cache["key2"]

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
            expect(cache.cache[6]).not.toBeUndefined()
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

            expect(cache.cache[5]).not.toBeUndefined()
            expect(cache.cache[6]).toBeUndefined()
        })
    })
    describe("NodeCache valueOnly configurations: Default (true) case", () => {
        let cache
        beforeEach(() => {
            cache = new NodeCache({
                //    valueOnly: true // By default valueOnly is set to true -> backward compatibility with older npm versions.
            })
        })
        afterEach(() => {
            cache.close()
        })

        test("When not valueOnly flag with the instance", () => {
            expect(cache.config["valueOnly"]).toEqual(true)
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
                valueOnly: false
            })
        })
        afterEach(() => {
            cache.close()
        })

        test("When not valueOnly flag with the instance", () => {
            expect(cache.config["valueOnly"]).toEqual(false)
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
            expect(cache.logger.mode).toEqual("none")
        })
        test("NodeCache instance with Logger::type as Custom", () => {
            expect(cache.logger.type).toEqual("Custom")
        })
        test("NodeCache instance with Logger::path as none", () => {
            expect(cache.logger.path).toEqual("none")
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
            expect(cache.logger.mode).toEqual("std")
        })
        test("NodeCache instance with Logger::type as Custom", () => {
            expect(cache.logger.type).toEqual("Custom")
        })
        test("NodeCache instance with Logger::path as none", () => {
            expect(cache.logger.path).toEqual("none")
        })
    })

    describe("NodeCache Falsy mode and path config for the instance", () => {
        let cache
        beforeAll(() => {
            cache = new NodeCache({
                mode: null,
                type: "xyz",
                path: undefined
            })
        })
        afterAll(() => {
            cache.close()
        })

        test("When valid instance uses default params for logger", () => {
            expect(cache).not.toBe(null)
            expect(cache.logger.mode).toEqual("none")
            expect(cache.logger.type).toEqual("xyz")
            expect(cache.logger.path).toEqual("none")
        })
    })
})