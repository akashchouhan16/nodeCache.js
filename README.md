# 🍁 nodeCache.js
![GitHub Workflow Status (with branch)](https://img.shields.io/github/actions/workflow/status/akashchouhan16/nodeCache.js/package-unit-tests.yml?&label=%20Node.js%20CI%20build)
[![Maintenance](https://img.shields.io/badge/Maintained%3F-Yes-1dbf73.svg)](https://github.com/akashchouhan16/nodeCache.js "nodeCache.js is actively Maintained")
[![made-for-Developers](https://img.shields.io/badge/Made%20for-Developers-238636.svg)](https://github.com/akashchouhan16/nodeCache.js "nodeCache.js")

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
  - Cache log params: **`mode`**, **`type`** and **`path`**
  - ```js
    let myCache = new NodeCache({
        mode: "std" // standard mode allows logs on the std out stream
                    // by default, the mode is set to none.
    })
    ```
  - Allowed **`mode`** values include: `none`, `std`, `exp`
  - ```js
    let myCache = new NodeCache({
        type: "Custom Err" // sets a custom log type on all std out stream
              // defaults to error for exceptions, else as info.
    })
    ```
    **Console output:**
     ```shell
     [🍁 Custom Err] 6/2/23, 4:51 PM: nodeCache.js initialized
     ```
  - To configure cache log output stream to a specific file path: `wip`
  - ```js
    let myCache = new NodeCache({
        path: "file://mycache.log" // sets log output stream
                                  // by default, the path is set to none.
    })
    ```
---

## 💽 APIs
### Access a key: (**get()**)
  - Accepts a valid key of type: **`number` or `string`**.
  - If not found or the **key** has expired: Returns **`undefined`**.
  - If found: returns the **`value`** of type: **`number`, `string`, or `object`**.
  - ```js
      let value = myCache.get("key")
    ``` 
### Access multiple keys: (**getM()**) 
  - Accepts an Array of valid keys. **`Array<key>`**
  - Returns an Array of **`objects`** corresponding to each key. **`Array<{value, ttl?}>`**
  - ```js
     let values = myCache.getM(["key1", "key2", ...])
     for(let value of values) {
        //access all the value objects. {value, ttl}
     }
    ``` 
### Store a key: (**set()**)
  - Accepts valid key, value and optional ttl.
  - Allowed value types: **`number`, `string`, or `object`**.
  - Allowed ttl type: **`number`** in milliseconds.
  - Returns a **`boolean`**. True is set was success, else false.
  - ```js
    let isSet = myCache.set("key", "value", 1200) // key->value set for 1.2s
    ```
### Store multiple keys: (**setM()**)
  - Accepts an Array of valid set() inputs. **`Array<{key, value, ttl?}>`**
  - Returns an Array of boolean flags indicating set status. **`Array<boolean>`**
  - ```js
    let isSetResponses = myCache.setM([{"k1", "v1", 2500}, {"k2", 15}...])
    ```
### Close the cache instance: (**close()**)
- Accepts **`void`** and returns **`void`**.
- It is mandatory to invoke **close()** method when cache is no longer needed.
- ```js
    let cache = new NodeCache({...options})
    /** 
     * work with cache instance..
    */

    cache.close(); // close worker thread, & free up memory.
  ```

### ⚗️ To be included (`wip`)
- Methods: **getTtl()**, **setTttl()**, **flush()**, **global()**
- Events: **on(`event_type`)**
---

## 🔖 Contributions
🔍 Open to ideas and contributions! 
### License
**[MIT License](https://github.com/akashchouhan16/nodeCache.js/blob/master/LICENSE "nodeCache.js License")**

### Maintainer
**[Akash Chouhan](https://github.com/akashchouhan16 "Akash Chouhan")**
