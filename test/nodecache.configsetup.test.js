const NodeCache = require("../index")

describe("NodeCache.js Configuration Setup Suit", () => {
    let cache;
    afterEach(() => {
        cache.close()
    })

    test("NodeCache.js with no configuration options to be defined", () => {
        cache = new NodeCache();

        expect(cache).toBeDefined()
        expect(cache.getLogConfig()).toBeDefined()
        expect(cache.getLogConfig()).toStrictEqual(expect.any(Object))

        expect(cache.getCacheConfig()).toBeDefined()
        expect(cache.getCacheConfig()).toStrictEqual({
            forceString: true,
            valueOnly: true,
            maxKeys: -1,
            stdTTL: 0,
            cacheHit: 0,
            cacheMiss: 0,
            keyCount: 0,
        })
    })

    test("NodeCache.js with explicit null configuration options to be defined", () => {
        cache = new NodeCache({
            forceString: null,
            valueOnly: null,
            maxKeys: null,
            stdTTL: null
        });

        expect(cache).toBeDefined()
        expect(cache.getLogConfig()).toBeDefined()
        expect(cache.getLogConfig()).toStrictEqual(expect.any(Object))

        expect(cache.getCacheConfig()).toBeDefined()
        expect(cache.getCacheConfig()).toStrictEqual({
            forceString: true,
            valueOnly: true,
            maxKeys: -1,
            stdTTL: 0,
            cacheHit: 0,
            cacheMiss: 0,
            keyCount: 0,
        })
    })

    test("NodeCache.js with valueOnly false configuration options to be defined", () => {
        cache = new NodeCache({
            valueOnly: false
        });

        expect(cache).toBeDefined()
        const loggerConfiguration = cache.getLogConfig()
        const configuration = cache.getCacheConfig()

        expect(loggerConfiguration).toBeDefined()
        expect(loggerConfiguration).toStrictEqual(expect.any(Object))
        expect(configuration).toStrictEqual(expect.any(Object))

        expect(configuration).toBeDefined()
        expect(configuration).toStrictEqual({
            forceString: true,
            valueOnly: false,
            maxKeys: -1,
            stdTTL: 0,
            cacheHit: 0,
            cacheMiss: 0,
            keyCount: 0,
        })

        cache.set("config-1", 707301, 60 * 60 * 1000)
        expect(cache.get("config-1")).toStrictEqual({
            value: expect.any(String),
            ttl: expect.any(Number)
        })
    })

    test("NodeCache.js with forceString false configuration options to be defined", () => {
        cache = new NodeCache({
            forceString: false
            //valueOnly: true by default
        });

        expect(cache).toBeDefined()
        const loggerConfiguration = cache.getLogConfig()
        const configuration = cache.getCacheConfig()

        expect(loggerConfiguration).toBeDefined()
        expect(loggerConfiguration).toStrictEqual(expect.any(Object))

        expect(configuration).toBeDefined()
        expect(configuration).toStrictEqual({
            forceString: false,
            valueOnly: true,
            maxKeys: -1,
            stdTTL: 0,
            cacheHit: 0,
            cacheMiss: 0,
            keyCount: 0,
        })
        cache.set("config-1", 707301, 60 * 60 * 1000)
        expect(cache.get("config-1")).toStrictEqual(707301)
    })

    test("NodeCache.js with all valid configuration options to be defined", () => {
        cache = new NodeCache({
            forceString: false,
            valueOnly: false,
            maxKeys: 3,
            stdTTL: 2 * 60 * 60 * 1000
        });

        expect(cache).toBeDefined()
        const loggerConfiguration = cache.getLogConfig()
        const configuration = cache.getCacheConfig()

        expect(loggerConfiguration).toBeDefined()
        expect(loggerConfiguration).toStrictEqual(expect.any(Object))

        expect(configuration).toBeDefined()
        expect(configuration).toStrictEqual({
            forceString: false,
            valueOnly: false,
            maxKeys: 3,
            stdTTL: 2 * 60 * 60 * 1000,
            cacheHit: 0,
            cacheMiss: 0,
            keyCount: 0,
        })
        cache.set("config-1", 707301)
        expect(cache.get("config-1")).toStrictEqual({
            value: 707301,
            ttl: expect.any(Number)
        })

        cache.setM([
            { key: 1, value: { data: 7073011 } },
            { key: 2, value: { data: 7073012 } }
        ])

        expect(cache.get(1)).toStrictEqual({
            value: { data: 7073011 },
            ttl: expect.any(Number)
        })
    })
})