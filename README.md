# 🍁 nodeCache.js

A Simple, lightweight in-memory cache with TTL support for node.js applications. 
## ⛩️ About

Discover an elegant and efficient in-memory cache module for Node.js. This module incorporates a time-to-live (**ttl**) functionality, asynchronously evicting expired keys from the cache.

- Support for **up to 1 million keys** that are stored in a single object.

- Leverages **worker_threads**, to optimize cache expiration checks, freeing the main thread for other critical tasks.


## 📜 Installation
- You can install nodecache via npm:
    ```shell
    npm i nodecache.js
    ```
- Alternatively, you can save the latest dependency:
    ```shell
    npm i nodecache.js@latest --save
    ```


## 📒 Getting Started

To start using **nodecache.js** with your applications, import and create an instane as follows:
```js
const NodeCache = require("nodecache.js")

let myCache = new NodeCache()
```

#### **Working with custom params**
- Values in the cache are stored as `string` type by default. To prevent forced string types:
  - ```js
    let myCache = new NodeCache({
        forceString: false // this will disable default type coercion.
    }) 
    ```
- By default, there is no limit set on the keys for the cache. To limit the max number of keys for your cache instance:
  - ```js
    let myCache = new NodeCache({
        maxKeys: 5000 // Default is -1 to disable the limit.
    }) 
    ```
- Cache instance by default only logs errors. To Configure params for **cache logs**:
  - ```js
    let myCache = new NodeCache({
        mode: "std" // standard mode allows logs on the std out stream
                    // by default, the mode is set to none.
    })
    ```
  - Allowed **`mode`** values include: `none`, `std`, `exp`
  - ```js
    let myCache = new NodeCache({
        type: "Custom Err" // standard mode allows logs on the std out stream
              // by default, the type is set to error for exceptions, info for rest.
    })
    ```
    **Console output:**
     ```shell
     [🍁 Custom Err] 6/2/23, 4:51 PM: nodeCache.js initialized
     ```
  - To configure cache log out stream to a specific file path: `wip`
  - ```js
    let myCache = new NodeCache({
        path: "file://mycache.log" // Currently WIP
                                  // by default, the path is set to none.
    })
    ```
---

### 💽 **Methods / APIs**
- **get(`key: <string, number, object>`) return <`type`>** 
- **getM(`keys?: Array <{key <number, string>, value <number, string, object>, ttl? number}>`)
   return `Array<Object{value, ttl}>`**
- **set(`key: <string, number, object>`) //returns `boolean`**
- **setM(`values?: Array <{key: value}>`) return Array<`boolean`>**
- **ttl(key: `<number, string>`, ttl: `number`) return `boolean`**
- **getTtl(key: `<number, string>`) return `number`**
- **keys(`void`); return Array<`type`>**
- **has(`key: <string, number, object>`) return `boolean`**
- **close(`void`) return `void`**

---