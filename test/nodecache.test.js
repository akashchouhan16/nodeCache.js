const NodeCache = require("../index")

describe("NodeCache Initialization Tests", () => {

    describe("NodeCache instance with no parameters", () => {
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