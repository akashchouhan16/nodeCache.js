const NodeCache = require("../index")

describe("NodeCache Initialization Tests", () => {
    describe("NodeCache instance with no parameters", () => {

        afterAll(() => {
            cache.close();
        })
        let cache = new NodeCache()
        test("NodeCache instance to be not null", () => {
            expect(cache).not.toBe(null)
        })

        test("NodeCache instance with Logger::mode as none", () => {
            expect(cache.logger.mode).toEqual("none")
        })
        test("NodeCache instance with Logger::type as info", () => {
            expect(cache.logger.type).toEqual("info")
        })
        test("NodeCache instance with Logger::path as none", () => {
            expect(cache.logger.path).toEqual("none")
        })
    })

    describe("NodeCache instance with custom type parameters", () => {

        afterAll(() => {
            cache.close();
        })
        let cache = new NodeCache({
            type: "Custom"
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

    describe("NodeCache instance with std mode parameters", () => {

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

    describe("NodeCache instance with invalid parameters", () => {

        afterAll(() => {
            cache.close();
        })
        let cache = new NodeCache({
            mode: null,
            type: "xyz",
            path: undefined
        })
        test("NodeCache instance to be not null", () => {
            expect(cache).not.toBe(null)
        })

        test("NodeCache instance with Logger::mode as none from null", () => {
            expect(cache.logger.mode).toEqual("none")
        })
        test("NodeCache instance with Logger::type as info from xyz", () => {
            expect(cache.logger.type).toEqual("xyz")
        })
        test("NodeCache instance with Logger::path as none from undefined", () => {
            expect(cache.logger.path).toEqual("none")
        })
    })
})

describe("NodeCache services", () => {
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
        expect(cache.global()).toEqual({ cacheHit: 2, cacheMiss: 1, keyCount: 2 })
        cache.flush();
        expect(cache.global()).toEqual({ cacheHit: 0, cacheMiss: 0, keyCount: 0 })
    })

    test("NodeCache::refresh revolve/reject promise on cache refresh", async () => {
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
})