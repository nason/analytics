<a href="https://getanalytics.io">
  <img src="https://user-images.githubusercontent.com/532272/61419845-ab1e9a80-a8b4-11e9-8fd1-18b9e743bb6f.png" width="450" />
</a>

A lightweight analytics abstraction library for tracking page views, custom events, & identify visitors. Designed to work with any [third-party analytics tool](https://getanalytics.io/plugins/).

[Read the docs](https://getanalytics.io/) or view the [live demo app](https://analytics-demo.netlify.com)

## Table of Contents
<!-- AUTO-GENERATED-CONTENT:START (TOC:collapse=true&collapseText=Click to expand) -->
<details>
<summary>Click to expand</summary>

- [Features](#features)
- [Why](#why)
- [Install](#install)
- [Usage](#usage)
- [Demo](#demo)
- [API](#api)
  * [Configuration](#configuration)
  * [analytics.identify](#analyticsidentify)
  * [analytics.track](#analyticstrack)
  * [analytics.page](#analyticspage)
  * [analytics.user](#analyticsuser)
  * [analytics.reset](#analyticsreset)
  * [analytics.ready](#analyticsready)
  * [analytics.on](#analyticson)
  * [analytics.once](#analyticsonce)
  * [analytics.getState](#analyticsgetstate)
  * [analytics.enablePlugin](#analyticsenableplugin)
  * [analytics.disablePlugin](#analyticsdisableplugin)
  * [analytics.storage](#analyticsstorage)
  * [analytics.storage.getItem](#analyticsstoragegetitem)
  * [analytics.storage.setItem](#analyticsstoragesetitem)
  * [analytics.storage.removeItem](#analyticsstorageremoveitem)
- [Events](#events)
- [Analytic plugins](#analytic-plugins)
- [Creating analytics plugins](#creating-analytics-plugins)
  * [React to any event](#react-to-any-event)
  * [Optional - Using middleware](#optional---using-middleware)
  * [Opt out example plugin](#opt-out-example-plugin)
- [Plugin Naming Conventions](#plugin-naming-conventions)
- [Debugging analytics](#debugging-analytics)
- [Contributing](#contributing)
- [Setup & Install dependencies](#setup--install-dependencies)
- [Development](#development)

</details>
<!-- AUTO-GENERATED-CONTENT:END -->

## Features

- [x] [Extendable](#analytic-plugins) - Bring your own third-party tool & plugins
- [x] Test & debug analytics integrations with time travel & offline mode
- [x] Add functionality/modify tracking calls with baked in lifecycle hooks
- [x] Isomorphic. Works in browser & on server
- [x] Queues events to send when analytic libraries are loaded
- [x] Works offline

##  Why

Companies frequently change analytics requirements based on evolving needs. This results in a lot of complexity, maintenance, & extra code when adding/removing analytic services to a site or application.

This library aims to solves that with a simple pluggable abstraction layer.

**Driving philosophy:**

- You should never be locked into a analytics tool
- DX is paramount. Adding & removing analytic tools from your application should be easy
- Respecting visitor privacy settings & allowing for opt out mechanisms is crucial
- A pluggable API makes adding new business requests easy

To add or remove an analytics provider adjust the `plugins` you load into `analytics`.

## Install

This module is distributed via [npm](https://npmjs.com/package/analytics) which is bundled with [node](https://nodejs.org/) and should be installed as one of your project's dependencies.

```bash
npm install analytics --save
```

Or as a script tag:

```html
<script src="https://unpkg.com/analytics/dist/analytics.min.js"></script>
```

## Usage

```js
import Analytics from 'analytics'
import googleAnalyticsPlugin from '@analytics/google-analytics'
import customerIOPlugin from '@analytics/customerio'

/* Initialize analytics */
const analytics = Analytics({
  app: 'my-app-name',
  version: 100,
  plugins: [
    googleAnalyticsPlugin({
      trackingId: 'UA-121991291',
    }),
    customerIOPlugin({
      siteId: '123-xyz'
    })
  ]
})

/* Track a page view */
analytics.page()

/* Track a custom event */
analytics.track('userPurchase', {
  price: 20
  item: 'pink socks'
})

/* Identify a visitor */
analytics.identify('user-id-xyz', {
  firstName: 'bill',
  lastName: 'murray',
  email: 'da-coolest@aol.com'
})
```

<details>
  <summary>Node.js usage</summary>

  For ES6/7 javascript you can `import Analytics from 'analytics'` for normal node.js usage you can import like so:

  ```js
  const { Analytics } = require('analytics')
  // or const Analytics = require('analytics').default

  const analytics = Analytics({
    app: 'my-app-name',
    version: 100,
    plugins: [
      googleAnalyticsPlugin({
        trackingId: 'UA-121991291',
      }),
      customerIOPlugin({
        siteId: '123-xyz'
      })
    ]
  })

  // Fire a page view
  analytics.page()
  ```

</details>

<details>
  <summary>Browser usage</summary>

  When importing global `analytics` into your project from a cdn the library is expose via a global `_analytics` variable.

  Call `_analytics.init` to create an analytics instance.

  ```html
  <script src="https://unpkg.com/analytics/dist/analytics.min.js"></script>
  <script>
    const Analytics = _analytics.init({
      app: 'my-app-name',
      version: 100,
      ...plugins
    })

    Analytics.track()

    // optionally expose to window
    window.Analytics = Analytics
  </script>
  ```

</details>

## Demo

See [Analytics Demo](https://analytics-demo.netlify.com/) for a site example.

## API

The core `analytics` API is exposed once the library is initialized with [configuration](#configuration).

Typical usage:

1. Initialize with [configuration](#configuration)
2. Export the analytics instance with third-party providers (Google Analytics, HubSpot, etc)
3. Use [`page`](#analyticspage), [`identify`](#analyticsidentify), [`track`](#analyticstrack) in your app
4. [Plugin custom business logic](#creating-analytics-plugins)

<!-- AUTO-GENERATED-CONTENT:START (API_DOCS) -->
### Configuration

Analytics library configuration

After the library is initialized with config, the core API is exposed and ready for use in the application.

**Arguments**

- **config** <code>object</code> - analytics core config
- **[config.app]** (optional) <code>string</code> - Name of site / app
- **[config.version]** (optional) <code>string</code> - Version of your app
- **[config.plugins]** (optional) <code>Array</code>.&lt;<code>Object</code>&gt; - Array of analytics plugins

**Example**

```js
import Analytics from 'analytics'
import pluginABC from 'analytics-plugin-abc'
import pluginXYZ from 'analytics-plugin-xyz'

// initialize analytics
const analytics = Analytics({
  app: 'my-awesome-app',
  plugins: [
    pluginABC,
    pluginXYZ
  ]
})
```

### analytics.identify

Identify a user. This will trigger `identify` calls in any installed plugins and will set user data in localStorage

**Arguments**

- **userId** <code>String</code> - Unique ID of user
- **[traits]** (optional) <code>Object</code> - Object of user traits
- **[options]** (optional) <code>Object</code> - Options to pass to identify call
- **[callback]** (optional) <code>Function</code> - Callback function after identify completes

**Example**

```js
// Basic user id identify
analytics.identify('xyz-123')

// Identify with additional traits
analytics.identify('xyz-123', {
  name: 'steve',
  company: 'hello-clicky'
})

// Disable identify for specific plugin
analytics.identify('xyz-123', {}, {
 plugins: {
   // disable for segment plugin
   segment: false
 }
})

// Fire callback with 2nd or 3rd argument
analytics.identify('xyz-123', () => {
  console.log('do this after identify')
})
```

### analytics.track

Track an analytics event. This will trigger `track` calls in any installed plugins

**Arguments**

- **eventName** <code>String</code> - Event name
- **[payload]** (optional) <code>Object</code> - Event payload
- **[options]** (optional) <code>Object</code> - Event options
- **[callback]** (optional) <code>Function</code> - Callback to fire after tracking completes

**Example**

```js
// Basic event tracking
analytics.track('buttonClicked')

// Event tracking with payload
analytics.track('itemPurchased', {
  price: 11,
  sku: '1234'
})

// Disable specific plugin on track
analytics.track('cartAbandoned', {
  items: ['xyz', 'abc']
}, {
 plugins: {
   // disable track event for segment
   segment: false
 }
})

// Fire callback with 2nd or 3rd argument
analytics.track('newsletterSubscribed', () => {
  console.log('do this after track')
})
```

### analytics.page

Trigger page view. This will trigger `page` calls in any installed plugins

**Arguments**

- **[data]** (optional) <a href="https://github.com/DavidWells/analytics/blob/master/packages/analytics-core/src/modules/page.js#L33">PageData</a> - Page data overrides.
- **[options]** (optional) <code>Object</code> - Page tracking options
- **[callback]** (optional) <code>Function</code> - Callback to fire after page view call completes

**Example**

```js
// Basic page tracking
analytics.page()

// Page tracking with page data overides
analytics.page({
  url: 'https://google.com'
})

// Disable specific plugin page tracking
analytics.page({}, {
 plugins: {
   // disable page tracking event for segment
   segment: false
 }
})

// Fire callback with 1st, 2nd or 3rd argument
analytics.page(() => {
  console.log('do this after page')
})
```

### analytics.user

Get user data

**Arguments**

- **[key]** (optional) <code>string</code> - dot.prop.path of user data. Example: 'traits.company.name'

**Example**

```js
// Get all user data
const userData = analytics.user()

// Get user id
const userId = analytics.user('userId')

// Get user company name
const companyName = analytics.user('traits.company.name')
```

### analytics.reset

Clear all information about the visitor & reset analytic state.

**Arguments**

- **[callback]** (optional) <code>Function</code> - Handler to run after reset

**Example**

```js
// Reset current visitor
analytics.reset()
```

### analytics.ready

Fire callback on analytics ready event

**Arguments**

- **callback** <code>Function</code> - function to trigger when all providers have loaded

**Example**

```js
analytics.ready() => {
  console.log('all plugins have loaded or were skipped', payload)
})
```

### analytics.on

Attach an event handler function for analytics lifecycle events.

**Arguments**

- **name** <code>String</code> - Name of event to listen to
- **callback** <code>Function</code> - function to fire on event

**Example**

```js
// Fire function when 'track' calls happen
analytics.on('track', ({ payload }) => {
  console.log('track call just happened. Do stuff')
})

// Remove listener before it is called
const removeListener = analytics.on('track', ({ payload }) => {
  console.log('This will never get called')
})

// cleanup .on listener
removeListener()
```

### analytics.once

Attach a handler function to an event and only trigger it only once.

**Arguments**

- **name** <code>String</code> - Name of event to listen to
- **callback** <code>Function</code> - function to fire on event

**Example**

```js
// Fire function only once 'track'
analytics.once('track', ({ payload }) => {
  console.log('This will only triggered once when analytics.track() fires')
})

// Remove listener before it is called
const listener = analytics.once('track', ({ payload }) => {
  console.log('This will never get called b/c listener() is called')
})

// cleanup .once listener before it fires
listener()
```

### analytics.getState

Get data about user, activity, or context. Access sub-keys of state with `dot.prop` syntax.

**Arguments**

- **[key]** (optional) <code>string</code> - dot.prop.path value of state

**Example**

```js
// Get the current state of analytics
analytics.getState()

// Get a subpath of state
analytics.getState('context.offline')
```

### analytics.enablePlugin

Enable analytics plugin

**Arguments**

- **plugins** <code>String</code>|<code>Array</code> - name of plugins(s) to disable
- **[callback]** (optional) <code>Function</code> - callback after enable runs

**Example**

```js
analytics.enablePlugin('google')

// Enable multiple plugins at once
analytics.enablePlugin(['google', 'segment'])
```

### analytics.disablePlugin

Disable analytics plugin

**Arguments**

- **name** <code>String</code>|<code>Array</code> - name of integration(s) to disable
- **callback** <code>Function</code> - callback after disable runs

**Example**

```js
analytics.disablePlugin('google')

analytics.disablePlugin(['google', 'segment'])
```

### analytics.storage

Storage utilities for persisting data.
These methods will allow you to save data in localStorage, cookies, or to the window.

**Example**

```js
// Pull storage off analytics instance
const { storage } = analytics

// Get value
storage.getItem('storage_key')

// Set value
storage.setItem('storage_key', 'value')

// Remove value
storage.removeItem('storage_key')
```

### analytics.storage.getItem

Get value from storage

**Arguments**

- **key** <code>String</code> - storage key
- **[options]** (optional) <code>Object</code> - storage options

**Example**

```js
analytics.storage.getItem('storage_key')
```

### analytics.storage.setItem

Set storage value

**Arguments**

- **key** <code>String</code> - storage key
- **value** <a href="any.html">any</a> - storage value
- **[options]** (optional) <code>Object</code> - storage options

**Example**

```js
analytics.storage.setItem('storage_key', 'value')
```

### analytics.storage.removeItem

Remove storage value

**Arguments**

- **key** <code>String</code> - storage key
- **[options]** (optional) <code>Object</code> - storage options

**Example**

```js
analytics.storage.removeItem('storage_key')
```
<!-- AUTO-GENERATED-CONTENT:END -->

## Events

The `analytics` library comes with a large variety of event listeners that can be used to fire custom functionality when a specific lifecycle event occurs.

These listeners can be fired using `analytics.on` & `analytics.once`

```js
const eventName = 'pageEnd'
analytics.on(eventName, ({ payload }) => {
  console.log('payload', payload)
})
```

Below is a list of the current available events

<!-- AUTO-GENERATED-CONTENT:START (EVENT_DOCS) -->
| Event | Description |
|:------|:-------|
| **`bootstrap`** | Fires when analytics library starts up.<br/>This is the first event fired. '.on/once' listeners are not allowed on bootstrap<br/>Plugins can attach logic to this event |
| **`params`** | Fires when analytics parses URL parameters |
| **`campaign`** | Fires if params contain "utm" parameters |
| **`initializeStart`** | Fires before 'initialize', allows for plugins to cancel loading of other plugins |
| **`initialize`** | Fires when analytics loads plugins |
| **`initializeEnd`** | Fires after initialize, allows for plugins to run logic after initialization methods run |
| **`ready`** | Fires when all analytic providers are fully loaded. This waits for 'initialize' and 'loaded' to return true |
| **`resetStart`** | Fires if analytic.reset() is called.<br/>Use this event to cancel reset based on a specific condition |
| **`reset`** | Fires if analytic.reset() is called.<br/>Use this event to run custom cleanup logic (if needed) |
| **`resetEnd`** | Fires after analytic.reset() is called.<br/>Use this event to run a callback after user data is reset |
| **`pageStart`** | Fires before 'page' events fire.<br/> This allows for dynamic page view cancellation based on current state of user or options passed in. |
| **`page`** | Core analytics hook for page views.<br/> If your plugin or integration tracks page views, this is the event to fire on. |
| **`pageEnd`** | Fires after all registered 'page' methods fire. |
| **`pageAborted`** | Fires if 'page' call is cancelled by a plugin |
| **`trackStart`** | Called before the 'track' events fires.<br/> This allows for dynamic page view cancellation based on current state of user or options passed in. |
| **`track`** | Core analytics hook for event tracking.<br/> If your plugin or integration tracks custom events, this is the event to fire on. |
| **`trackEnd`** | Fires after all registered 'track' events fire from plugins. |
| **`trackAborted`** | Fires if 'track' call is cancelled by a plugin |
| **`identifyStart`** | Called before the 'identify' events fires.<br/>This allows for dynamic page view cancellation based on current state of user or options passed in. |
| **`identify`** | Core analytics hook for user identification.<br/> If your plugin or integration identifies users or user traits, this is the event to fire on. |
| **`identifyEnd`** | Fires after all registered 'identify' events fire from plugins. |
| **`identifyAborted`** | Fires if 'track' call is cancelled by a plugin |
| **`userIdChanged`** | Fires when a user id is updated |
| **`registerPlugins`** | Fires when analytics is registering plugins |
| **`enablePlugin`** | Fires when 'analytics.enablePlugin()' is called |
| **`disablePlugin`** | Fires when 'analytics.disablePlugin()' is called |
| **`loadPlugin`** | Fires when 'analytics.loadPlugin()' is called |
| **`online`** | Fires when browser network goes online.<br/>This fires only when coming back online from an offline state. |
| **`offline`** | Fires when browser network goes offline. |
| **`setItemStart`** | Fires when analytics.storage.setItem is initialized.<br/>This event gives plugins the ability to intercept keys & values and alter them before they are persisted. |
| **`setItem`** | Fires when analytics.storage.setItem is called.<br/>This event gives plugins the ability to intercept keys & values and alter them before they are persisted. |
| **`setItemEnd`** | Fires when setItem storage is complete. |
| **`setItemAborted`** | Fires when setItem storage is cancelled by a plugin. |
| **`removeItemStart`** | Fires when analytics.storage.removeItem is initialized.<br/>This event gives plugins the ability to intercept removeItem calls and abort / alter them. |
| **`removeItem`** | Fires when analytics.storage.removeItem is called.<br/>This event gives plugins the ability to intercept removeItem calls and abort / alter them. |
| **`removeItemEnd`** | Fires when removeItem storage is complete. |
| **`removeItemAborted`** | Fires when removeItem storage is cancelled by a plugin. |
<!-- AUTO-GENERATED-CONTENT:END (EVENT_DOCS) -->

## Analytic plugins

The `analytics` has a robust plugin system. Here is a list of currently available plugins:

<!-- AUTO-GENERATED-CONTENT:START (PLUGINS) -->
- [analytics-cli](https://github.com/DavidWells/analytics/tree/master/packages/analytics-cli) CLI for `analytics` pkg [npm link](https://www.npmjs.com/package/analytics-cli).
- [@analytics/crazy-egg](https://github.com/DavidWells/analytics/tree/master/packages/analytics-plugin-crazy-egg) Crazy Egg integration for 'analytics' module [npm link](https://www.npmjs.com/package/@analytics/crazy-egg).
- [@analytics/customerio](https://github.com/DavidWells/analytics/tree/master/packages/analytics-plugin-customerio) Customer.io integration for 'analytics' module [npm link](https://www.npmjs.com/package/@analytics/customerio).
- [analytics-plugin-do-not-track](https://github.com/DavidWells/analytics/tree/master/packages/analytics-plugin-do-not-track) Disable tracking for opted out visitors plugin for 'analytics' module [npm link](https://www.npmjs.com/package/analytics-plugin-do-not-track).
- [analytics-plugin-event-validation](https://github.com/DavidWells/analytics/tree/master/packages/analytics-plugin-event-validation) Event validation plugin for analytics [npm link](https://www.npmjs.com/package/analytics-plugin-event-validation).
- [@analytics/fullstory](https://github.com/DavidWells/analytics/tree/master/packages/analytics-plugin-fullstory) FullStory plugin for 'analytics' module [npm link](https://www.npmjs.com/package/@analytics/fullstory).
- [@analytics/google-analytics](https://github.com/DavidWells/analytics/tree/master/packages/analytics-plugin-google-analytics) Google analytics plugin for 'analytics' module [npm link](https://www.npmjs.com/package/@analytics/google-analytics).
- [@analytics/google-tag-manager](https://github.com/DavidWells/analytics/tree/master/packages/analytics-plugin-google-tag-manager) Google tag manager plugin for 'analytics' module [npm link](https://www.npmjs.com/package/@analytics/google-tag-manager).
- [@analytics/hubspot](https://github.com/DavidWells/analytics/tree/master/packages/analytics-plugin-hubspot) HubSpot plugin for 'analytics' module [npm link](https://www.npmjs.com/package/@analytics/hubspot).
- [analytics-plugin-lifecycle-example](https://github.com/DavidWells/analytics/tree/master/packages/analytics-plugin-lifecycle-example) Example plugin with lifecycle methods for 'analytics' module [npm link](https://www.npmjs.com/package/analytics-plugin-lifecycle-example).
- [analytics-plugin-original-source](https://github.com/DavidWells/analytics/tree/master/packages/analytics-plugin-original-source) Save original referral source of visitor plugin for 'analytics' module [npm link](https://www.npmjs.com/package/analytics-plugin-original-source).
- [@analytics/segment](https://github.com/DavidWells/analytics/tree/master/packages/analytics-plugin-segment) Segment integration for 'analytics' module for browser & node [npm link](https://www.npmjs.com/package/@analytics/segment).
- [@analytics/simple-analytics](https://github.com/DavidWells/analytics/tree/master/packages/analytics-plugin-simple-analytics) Simple analytics plugin for 'analytics' module for browser [npm link](https://www.npmjs.com/package/@analytics/simple-analytics).
- [analytics-plugin-tab-events](https://github.com/DavidWells/analytics/tree/master/packages/analytics-plugin-tab-events) Expose tab visibility events plugin for 'analytics' module [npm link](https://www.npmjs.com/package/analytics-plugin-tab-events).
- [analytics-plugin-window-events](https://github.com/DavidWells/analytics/tree/master/packages/analytics-plugin-window-events) Expose window events plugin for 'analytics' module [npm link](https://www.npmjs.com/package/analytics-plugin-window-events).
- [@analytics/cookie-utils](https://github.com/DavidWells/analytics/tree/master/packages/analytics-util-cookie) Cookie helper functions [npm link](https://www.npmjs.com/package/@analytics/cookie-utils).
- [@analytics/form-utils](https://github.com/DavidWells/analytics/tree/master/packages/analytics-util-forms) Form utility library for managing HTML form submissions & values [npm link](https://www.npmjs.com/package/@analytics/form-utils).
- [analytics-util-params](https://github.com/DavidWells/analytics/tree/master/packages/analytics-util-params) Url Parameter helper functions [npm link](https://www.npmjs.com/package/analytics-util-params).
- [@analytics/storage-utils](https://github.com/DavidWells/analytics/tree/master/packages/analytics-util-storage) Storage utilities for saving values in browser [npm link](https://www.npmjs.com/package/@analytics/storage-utils).
- [analytics-utils](https://github.com/DavidWells/analytics/tree/master/packages/analytics-utils) Analytics utility functions used by 'analytics' module [npm link](https://www.npmjs.com/package/analytics-utils).
- [gatsby-plugin-analytics](https://github.com/DavidWells/analytics/tree/master/packages/gatsby-plugin-analytics) Easily add analytics to your Gatsby site [npm link](https://www.npmjs.com/package/gatsby-plugin-analytics).
- Add yours! 👇
<!-- AUTO-GENERATED-CONTENT:END -->

## Creating analytics plugins

The library is designed to work with any third-party analytics tool.

Plugins are just plain javascript objects that expose methods for `analytics` to register and call.

Here is a quick example of a plugin:

```js
// plugin-example.js
export default function pluginExample(userConfig) {
  // return object for analytics to use
  return {
    /* All plugins require a NAMESPACE */
    NAMESPACE: 'my-example-plugin',
    /* Everything else below this is optional depending on your plugin requirements */
    config: {
      whatEver: userConfig.whatEver,
      elseYouNeed: userConfig.elseYouNeed
    },
    initialize: ({ config }) => {
      // load provider script to page
    },
    page: ({ payload }) => {
      // call provider specific page tracking
    },
    track: ({ payload }) => {
      // call provider specific event tracking
    },
    identify: ({ payload }) => {
      // call provider specific user identify method
    },
    loaded: () => {
      // return boolean so analytics knows when it can send data to third-party
      return !!window.myPluginLoaded
    }
  }
}
```

`NAMESPACE` is required for all plugins. All other methods are optional.

If you don't need to hook into `page` tracking, just omit the `page` key from your plugin object.

To use a plugin, import it and pass it into the `plugins` array when you bootstrap `analytics`.

```js
import Analytics from 'analytics'
import pluginExample from './plugin-example.js'

const analytics = Analytics({
  app: 'my-app-name',
  plugins: [
    pluginExample({
      whatEver: 'hello',
      elseYouNeed: 'there'
    }),
    ...otherPlugins
  ]
})
```

### React to any event

Plugins can react to any event flowing through the `analytics` library.

For example, if you wanted to trigger custom logic when `analytics` bootstraps you can attach a function handler to the `bootstrap` event.

For a full list of core events, checkout [`events.js`](https://github.com/DavidWells/analytics/blob/master/packages/analytics-core/events.js).

```js
// Example Plugin plugin.js
export default function myPlugin(userConfig) {
  return {
    NAMESPACE: 'my-plugin',
    bootstrap: ({ payload, config, instance }) => {
      // Do whatever on `bootstrap` event
    },
    pageStart: ({ payload, config, instance }) => {
      // Fire custom logic before analytics.page() calls
    },
    pageEnd: ({ payload, config, instance }) => {
      // Fire custom logic after analytics.page() calls
    },
    trackStart: ({ payload, config, instance }) => {
      // Fire custom logic before analytics.track() calls
    },
    'track:customerio': ({ payload, config, instance }) => {
      // Fire custom logic before customer.io plugin runs.
      // Here you can customize the data sent to individual analytics providers
    },
    trackEnd: ({ payload, config, instance }) => {
      // Fire custom logic after analytics.track() calls
    },
    // ... hook into other events
  }
}
```

Using this plugin is the same as any other.

```js
import Analytics from 'analytics'
import customerIoPlugin from '@analytics/customerio'
import myPlugin from './plugin.js'

const analytics = Analytics({
  app: 'my-app-name',
  plugins: [
    // include myPlugin
    myPlugin(),
    customerIoPlugin({
      trackingId: '1234'
    })
    ...otherPlugins
  ]
})
```

### Optional - Using middleware

Alternatively, you can also attach any middleware functionality you'd like from the `redux` ecosystem.

```js
// logger-plugin.js redux middleware
const logger = store => next => action => {
  if (action.type) {
    console.log(`>> analytics dispatching ${action.type}`, JSON.stringify(action))
  }
  return next(action)
}

export default logger
```

Using this plugin is the same as any other.

```js
import Analytics from 'analytics'
import loggerPlugin from './logger-plugin.js'

const analytics = Analytics({
  app: 'my-app-name',
  plugins: [
    ...otherPlugins,
    loggerPlugin
  ]
})
```

### Opt out example plugin

This is a vanilla redux middleware that will opt out users from tracking. There are **many** ways to implement this type of functionality using `analytics`

```js
const optOutMiddleware = store => next => action => {
  const { type } = action
  if (type === 'trackStart' || type === 'pageStart' || type === 'trackStart') {
    // Check cookie/localStorage/Whatever to see if visitor opts out

    // Here I am checking user traits persisted to localStorage
    const { user } = store.getState()

    // user has optOut trait cancel action
    if (user && user.traits.optOut) {
      return next({
        ...action,
        ...{
          abort: true,
          reason: 'User opted out'
        },
      })
    }
  }
  return next(finalAction)
}

export default optOutMiddleware
```

##  Plugin Naming Conventions

Plugins should follow this naming convention before being published to npm

```bash
analytics-plugin-{your-plugin-name}
```

E.g. An analytics plugin that does `awesome-stuff` should be named

```bash
npm install analytics-plugin-awesome-stuff
```

Then submit to the [list above](#analytic-plugins)

## Debugging analytics

During development you can turn on `debug` mode. This will connect redux dev tools for you to visually see the analytics events passing through your application.

![analytics-debug-tools](https://user-images.githubusercontent.com/532272/61163639-21da2300-a4c4-11e9-8743-b45d3a570271.gif)

```js
import Analytics from 'analytics'

const analytics = Analytics({
  app: 'my-app',
  debug: true
})
```

# Contributing

Contributions are always welcome, no matter how large or small. Before contributing,
please read the [code of conduct](CODE_OF_CONDUCT.md).

## Setup & Install dependencies

Clone the repo and run

```sh
$ git clone https://github.com/davidwells/analytics
$ cd analytics
$ npm install && npm run setup
```

This will setup all the packages and their dependencies.

## Development

You can watch and rebuild packages with the `npm run watch` command.

```sh
npm run watch
```
