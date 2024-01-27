const NodeCache = require("../index")
const { Validator } = require("../src/utils/validator")

describe("NodeCache Utilities Test Suite", () => {

    describe("NodeCache Logger validate input options", () => {
        let cache
        afterEach(() => {
            cache.close()
        })
        test("when no options are provided, validate must assign to defaults", () => {
            cache = new NodeCache()
            const logger = cache.getLogConfig()

            expect(logger).toBeDefined()
            expect(logger.log).toStrictEqual(expect.any(Function))
            expect(logger.formatOptions).toStrictEqual({
                dateStyle: "short",
                timeStyle: "short",
                hour12: true,
            })

            expect(logger.mode).toStrictEqual("none")
            expect(logger.type).toStrictEqual("info")
            expect(logger.path).toStrictEqual("none")
        })

        test("When invalid options are provided, validate() must assign defaults", () => {
            cache = new NodeCache({
                mode: null,
                type: NaN,
                path: undefined
            })
            const logger = cache.getLogConfig()
            expect(logger.mode).toStrictEqual("none")
            expect(logger.type).toStrictEqual("info")
            expect(logger.path).toStrictEqual("none")
        })

        test("When partial options are provided, validate() must assign defaults to others", () => {
            cache = new NodeCache({
                mode: "exp",
                type: "cache-instance-1",
                path: undefined
            })
            const logger = cache.getLogConfig()
            expect(logger.mode).toStrictEqual("exp")
            expect(logger.type).toStrictEqual("cache-instance-1")
            expect(logger.path).toBeUndefined()
        })
    })

    describe("NodeCache Utils :: validate()", () => {
        let validator
        beforeAll(() => {
            validator = new Validator()
        })

        test("validate() must be a defined method", () => {
            expect(validator).toBeDefined()
            expect(validator.validate).toStrictEqual(expect.any(Function))
        })

        test("validate() with no params must validate to false", () => {
            expect(validator.validate()).toStrictEqual(false)
        })
        test("validate() with empty object must validate to false", () => {
            expect(validator.validate({})).toStrictEqual(false)
        })

        test("validate with all falsy values must validate to false", () => {
            expect(validator.validate({ path: undefined, mode: NaN, type: null })).toStrictEqual(false)
        })
        test("validate with null object must validate to false", () => {
            expect(validator.validate({ path: null, mode: null })).toStrictEqual(false)
        })

        test("validate with valid object must validate to true", () => {
            expect(validator.validate({ path: "console", mode: "std" })).toStrictEqual(true)
        })
    })
})