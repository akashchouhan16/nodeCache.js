![nodecache.js](https://github.com/akashchouhan16/nodeCache.js/assets/56465610/2b208713-bd6b-4a74-b63a-9ee197f1773f)

![Travis Build Status](https://img.shields.io/travis/com/akashchouhan16/nodecache.js?label=Travis+CI+build&color=F2ECAC)
![GitHub Workflow Status (with branch)](https://img.shields.io/github/actions/workflow/status/akashchouhan16/nodeCache.js/package-unit-tests.yml?&label=%20Node.js%20CI)
[![Maintenance](https://img.shields.io/badge/Maintained%3F-Yes-1dbf73.svg)](https://github.com/akashchouhan16/nodeCache.js "nodeCache.js is actively Maintained")
[![made-for-Developers](https://img.shields.io/badge/Made%20for-Developers-238636.svg)](https://github.com/akashchouhan16/nodeCache.js "nodeCache.js")

A Simple and Intuitive in-memory cache with TTL support for node.js applications.
## ⛩️ About

Discover an elegant and efficient in-memory cache module for Node.js. This package incorporates time-to-live (**ttl**) functionality, asynchronously evicting expired keys from the cache.

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
- Set a default TTL value for all set() calls with standard ttl configuration value.
  - ```js
    let myCache = new NodeCache({
      stdTTL: 5 * 60 * 1000 // every key saved for ttl: 5mins 
    })
    ```
- Cache instance by default only logs errors. To Configure params for **cache logs**:
  - Cache log params: **`mode`**, **`type`** and **`path`**
  - ```js
    let myCache = new NodeCache({
        mode: "std" 
        // std debug mode for std output stream. Defaults to none.
    })
    ```
  - Allowed **`mode`** values include: `none`, `std`, `exp`
  - ```js
    let myCache = new NodeCache({
        type: "dev env logs" 
        // sets a custom debugger msg type. Defaults to info.
    })
    ```
    **Console output:**
     ```shell
     [🍁 Custom Err] 6/2/23, 4:51 PM: nodeCache.js initialized
     ```
  - To configure cache log output stream to a specific file path: `wip`
  - ```js
    let myCache = new NodeCache({
        path: "file://mycache.log" 
        // sets log output stream, default is set to none.
    })
    ```
---

## 💽 APIs
### Access a key: get()
  - Accepts a valid key of type: **`number` or `string`**.
  - If not found or the **key** has expired: Returns **`undefined`**.
  - If found: returns the **`value`** of type: **`number`, `string`, or `object`**.
  - ```js
      let value = myCache.get("key")
    ``` 
### Access multiple keys: getM()
  - Accepts an Array of valid keys. **`Array<key>`**
  - Returns an Array of **`objects`** corresponding to each key. **`Array<{value, ttl?}>`**
  - ```js
     let values = myCache.getM(["key1", "key2", ...])
     for(let value of values) {
        //access all the value objects. {value, ttl}
     }
    ``` 
### Store a key: set()
  - Accepts valid key, value and optional ttl.
  - Allowed value types: **`number`, `string`, or `object`**.
  - Allowed ttl type: **`number`** in milliseconds.
  - Returns a **`boolean`**. True is set was success, else false.
  - ```js
    let isSet = myCache.set("key", "value", 1200) // key->value set for 1.2s
    ```
### Store multiple keys: setM()
  - Accepts an Array of valid set() inputs. **`Array<{key, value, ttl?}>`**
  - Returns an Array of boolean flags indicating set status. **`Array<boolean>`**
  - ```js
    let isSetResponses = myCache.setM([{"k1", "v1", 2500}, {"k2", 15}...])
    ```

### Retrieve TTL for a key: getTTL()
  - Accepts a valid key: **`number` or `string`**.
  - Returns **`undefined`** to key is missing, else the ttl value: **`number`**.
  - ```js
    let ttl = myCache.getTTL("key1")
    ```
### Update TTL for a key: setTTL()
  - Accepts a valid key and ttl in ms: **`number`**.
  - Returns **`boolean`** response. **true** if set was a success else **false**.
  - ```js
    let success = myCache.setTTL("key1", 12000) // key1 for a ttl: 12sec
    ```
### Refresh cache instance: refresh()
  - Accepts void. Returns a Promise.
  - Refresh runs on the main thread, looping over all the keys in the cache, and evicting the expired once.
  - This is a **blocking code**. Recommendated when consistency in the cache is a high priority.
  - ```js
      const importantTask = async () => {
        try {
          await cache.refresh();
          // code ...
        } catch(err) { ... }
      }
    ```
### Close the cache instance: close()
- Accepts **`void`** and returns **`void`**.
- It is **mandatory** to invoke **close()** method when cache is no longer needed.
- ```js
    let myCache = new NodeCache({...options})
    /** 
     * work with cache instance..
    */

    myCache.close(); // close worker thread, & free up memory.
  ```

### Retrieve Stats on the cache: global()
  - Returns an **object** with cacheHit, cacheMiss and keyCount.
  - ```js
      let stats = myCache.global()
      // stats: { cacheHit, cacheMiss, keyCount }
    ```
### Flush Cache stats: flush()
  - Returns **void**. To clear the current global stats for the cache instance.
  - ```js
     myCache.flush()
     let stats = myCache.global() //stats: { 0, 0, 0}
    ```

### ⚗️ To Do (`wip`)
- Node.js Events: **on(`event_type`)**: Support for **initialize**, **close**,  **get**, **set**, **delete**, **flush**, and **refresh**.
- Optimizations on existing ttl implementation and the cache eviction policy.
---

## 🔖 Contributing
If you're interested to contribute or brain storm ideas, Contributions are most welcomed! </br>
Reach out to: **[akash.c1500@gmail.com](mailto:akash.c1500@gmail.com "Akash's Gmail")**  
## 📜 License
Copyright (c) **[Akash Chouhan](https://github.com/akashchouhan16 "Akash Chouhan")**. All rights reserved. Released under the **[MIT License](https://github.com/akashchouhan16/nodeCache.js/blob/master/LICENSE "nodeCache.js License")**.
