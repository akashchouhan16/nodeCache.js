const NodeCache = require("../index")

describe("NodeCache instance creation", () => {
    describe("Creating a NodeCache instance with all default params", () => {
        let cache
        beforeAll(() => {
            cache = new NodeCache()
        })
        afterAll(() => {
            cache.close();
        })

        test("NodeCache instance to be defined and not falsy", () => {
            expect(cache).toBeDefined()
            expect(cache).toBeTruthy()
        })

        test("NodeCache instance with default Logger::mode = none", () => {
            expect(cache.logger.mode).toEqual("none")
        })
        test("NodeCache instance with Logger::type = info", () => {
            expect(cache.logger.type).toEqual("info")
        })
        test("NodeCache instance with Logger::path = none", () => {
            expect(cache.logger.path).toEqual("none")
        })
    })


})

describe("NodeCache public APIs", () => {
    afterAll(() => {
        cache.close();
    })
    let cache = new NodeCache()


    test("NodeCache::global", () => {
        expect(cache.global()).not.toBe(undefined)
        expect(typeof cache.global()).toEqual("object")
        expect(cache.global().keyCount).toEqual(0)
        expect(cache.global().cacheHit).toEqual(0)
        expect(cache.global().cacheMiss).toEqual(0)
    })

    test("NodeCache::flush", () => {
        cache.setM([
            { key: 1, value: 'v1' },
            { key: 2, value: 'v2' }
        ])
        cache.getM([
            1, '2', 'key'
        ])
        // expect(cache.global()).toEqual({ cacheHit: 2, cacheMiss: 1, keyCount: 2 })
        cache.flush();
        expect(cache.global()).toEqual({ cacheHit: 0, cacheMiss: 0, keyCount: 0 })
    })

    test("NodeCache::refresh - revolve/reject promise on cache refresh", async () => {
        let value = await cache.refresh()
        expect(typeof value).toBe("object")
    })

    test("NodeCache::get with valid key on cache miss", () => {
        expect(cache.get(123)).toBeUndefined()
        expect(cache.get('key')).toBeUndefined()
    })
    test("NodeCache::get with valid key on cache hit", () => {
        cache.set('k1', 12345)
        expect(cache.get('k1')).toEqual('12345') // with forceString true by default
    })
    test("NodeCache::get with invalid key", () => {
        expect(cache.get(null)).toBeUndefined()
        expect(cache.get(undefined)).toBeUndefined()
        expect(cache.get(NaN)).toBeUndefined()
        expect(cache.get(false)).toBeUndefined()
        expect(cache.get([])).toBeUndefined()
        expect(cache.get(0)).toBeUndefined()
    })
    test("NodeCache::set with valid key & value", () => {
        expect(cache.set(123, 'value')).toEqual(true)
    })
    test("NodeCache::set with invalid key or value", () => {
        expect(cache.set(null, null)).toEqual(false)
    })
    test("NodeCache::set with invalid ttl", () => {
        expect(() => {
            cache.set(123, 'value', String(Date.now()))
        }).toThrow(Error)

        let success = cache.set(123, 'value', null)
        expect(success).not.toBe(undefined)

        expect(() => {
            cache.set(123, 'value', {})
        }).toThrow(Error)

        expect(() => {
            cache.set(123, 'value', [])
        }).toThrow(Error)
    })
    test("NodeCache::set with negative ttl", () => {
        expect(cache.set(123, 'value', -(Date.now()))).toEqual(true)
    })
    test("NodeCache::getM with invalid key - Object", () => {
        expect(() => {
            cache.getM({})
        }).toThrow(Error)
    })
    test("NodeCache::getM with invalid key - falsy", () => {
        expect(() => {
            cache.getM(undefined)
        }).toThrow(Error)
        expect(() => {
            cache.getM(null)
        }).toThrow(Error)
    })
    test("NodeCache::getM with empty keys array", () => {
        expect(cache.getM([])).toEqual([])
    })
    test("NodeCache::getM with valid keys array", () => {
        expect(cache.getM([{ key: 1 }, { key: 2 }, { key: 3 }])).toEqual([])
    })

    test("NodeCache::setM with invalid input", () => {
        expect(() => {
            cache.setM({})
        }).toThrow(Error)

        expect(() => {
            cache.setM(NaN)
        }).toThrow(Error)

        expect(() => {
            cache.setM(0)
        }).toThrow(Error)

        expect(() => {
            cache.setM({ key: 726384, value: 'new-value' })
        }).toThrow(Error)

        expect(() => {
            cache.setM(undef)
        }).toThrow(Error)
    })

    test("NodeCache::setM with empty array", () => {
        expect(cache.setM([])).toEqual(false)
    })

    test("NodeCache::setM with valid input", () => {
        expect(cache.setM([
            { key: 1, value: 'data1', ttl: 2000 },
            { key: 2, value: 789 },
            { key: 3, value: {}, ttl: 3000 },
            { key: 4, value: null },
            { key: '5', value: undefined },
            { key: [], value: {} },
            { key: [], value: '1234', ttl: 3400 }])).toStrictEqual([true, true, true, false, false, false, false])
    })


    test("NodeCache::getTTL with valid input", () => {
        expect(cache.getTTL("key1")).toBeUndefined()
        cache.set("key1", 1234, 1500)

        expect(cache.getTTL("key1")).toEqual(expect.any(Number))
        expect(cache.getTTL("key1")).not.toBeUndefined()
        expect(cache.getTTL("key1")).toBeGreaterThan(Date.now())
    })

    test("NodeCache::getTTL with invalid input", () => {

        cache.set("key2", null, NaN)
        expect(cache.getTTL("key2")).toBeUndefined()

        cache.set("key2", {
            id: 2,
            data: "for key2",
            createdAt: Date.now()
        }, undefined)
        expect(cache.getTTL("key2")).not.toBeUndefined()
        expect(cache.getTTL("key2")).toEqual(expect.any(Number))

        cache.set('key3', 'key3-data', -250)
        expect(cache.getTTL("key3")).toBeDefined()
        expect(cache.getTTL("key3")).toBeTruthy()
        expect(cache.getTTL("key3")).toBeGreaterThanOrEqual(Date.now())

        // TODO: nodecache.js must be updated to account for -ve ttl value as +ve.
    })

    test("NodeCache::setTTL with valid input", () => {
        expect(cache.setTTL(14, 12000)).toBeFalsy()
        cache.set("key-new", "value-new")
        expect(cache.setTTL("key-new", 12000)).toEqual(true)
        expect(cache.setTTL("key-new2", 15000)).toEqual(false)

    })

    test("NodeCache::setTTL with invalid input", () => {
        expect(() => cache.setTTL(0, 12003)).toThrow(Error)
        expect(() => cache.setTTL(13, "1500")).toThrow(Error)
        expect(() => cache.setTTL({ key: "new-key" }, 15000)).toThrow(Error)
        expect(() => cache.setTTL('', 12000)).toThrow(Error)
        expect(() => cache.setTTL("missing-key")).toThrow(Error)
        expect(() => cache.setTTL(NaN, NaN)).toThrow(Error)
        expect(() => cache.setTTL('valid-key', undefined)).toThrow(Error)
        expect(() => cache.setTTL(undefined, undefined)).toThrow(Error)
    })
})