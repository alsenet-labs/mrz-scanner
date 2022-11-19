# Changelog

### [5.2.1](https://www.github.com/image-js/iobuffer/compare/v5.2.0...v5.2.1) (2022-10-07)


### Bug Fixes

* remap browser version of text decoder ([4531fa9](https://www.github.com/image-js/iobuffer/commit/4531fa94120f8984029dbe37574c64986f172469))

## [5.2.0](https://www.github.com/image-js/iobuffer/compare/v5.1.0...v5.2.0) (2022-10-04)


### Features

* add IOBuffer.back() ([#52](https://www.github.com/image-js/iobuffer/issues/52)) ([49a2df9](https://www.github.com/image-js/iobuffer/commit/49a2df924ac512d96d394eecb7fe24fdd2469ead))
* decode text ([616b1a5](https://www.github.com/image-js/iobuffer/commit/616b1a5e841ceb1174a86c6eb87bcffe571aca2f))

## [5.1.0](https://www.github.com/image-js/iobuffer/compare/v5.0.4...v5.1.0) (2021-12-17)


### Features

* add int64 support ([3a306c0](https://www.github.com/image-js/iobuffer/commit/3a306c0d3fb62f88be7ad59ea1d202a623907426))

### [5.0.4](https://www.github.com/image-js/iobuffer/compare/v5.0.3...v5.0.4) (2021-10-12)


### Bug Fixes

* set TypeScript target to ES2020 ([4f4b412](https://www.github.com/image-js/iobuffer/commit/4f4b4120b90d0fcd67e6c36f9bd81ea7cbcd8c3d))

### [5.0.3](https://github.com/image-js/iobuffer/compare/v5.0.2...v5.0.3) (2021-02-26)


### Bug Fixes

* add browser field for lib/ version too ([#43](https://github.com/image-js/iobuffer/issues/43)) ([508083f](https://github.com/image-js/iobuffer/commit/508083f9ea2288df57992d1659cfe78e0b751a38))

## [5.0.2](https://github.com/image-js/iobuffer/compare/v5.0.1...v5.0.2) (2019-11-12)


### Bug Fixes

* include js file in the build ([3be165a](https://github.com/image-js/iobuffer/commit/3be165a05da7c7287c87cd17da87e2ab9549baf8))



## [5.0.1](https://github.com/image-js/iobuffer/compare/v5.0.0...v5.0.1) (2019-11-12)



# [5.0.0](https://github.com/image-js/iobuffer/compare/v4.0.1...v5.0.0) (2019-11-12)


### chore

* update dependencies ([b7f51b8](https://github.com/image-js/iobuffer/commit/b7f51b8b5ca82f6d16e91273e0198f9650207acb))


### BREAKING CHANGES

* Node.js 6 and 8 are no longer supported.



## [4.0.1](https://github.com/image-js/iobuffer/compare/v4.0.0...v4.0.1) (2019-03-27)



<a name="4.0.0"></a>
# [4.0.0](https://github.com/image-js/iobuffer/compare/v3.2.0...v4.0.0) (2018-08-22)


### Bug Fixes

* fix test-travis script ([fd74496](https://github.com/image-js/iobuffer/commit/fd74496))
* remove implied undefined type from InputData ([0040962](https://github.com/image-js/iobuffer/commit/0040962))


### Chores

* remove support for Node 4 ([feabb42](https://github.com/image-js/iobuffer/commit/feabb42))


### Features

* convert to TypeScript ([b73c748](https://github.com/image-js/iobuffer/commit/b73c748))
* remove getBuffer method ([39dbc89](https://github.com/image-js/iobuffer/commit/39dbc89))


### BREAKING CHANGES

* The `getBuffer` method has been removed. Use `toArray` instead.
* The IOBuffer constructor is now a named export. Access it with
`require('iobuffer').IOBuffer` or `import { IOBuffer } from 'iobuffer'`.
* Removed support for Node 4



<a name="3.2.0"></a>
# [3.2.0](https://github.com/image-js/iobuffer/compare/v3.1.0...v3.2.0) (2016-12-27)


### Features

* add readUtf8 and writeUtf8 ([6118a54](https://github.com/image-js/iobuffer/commit/6118a54)), closes [#31](https://github.com/image-js/iobuffer/issues/31)



<a name="3.1.0"></a>
# [3.1.0](https://github.com/image-js/iobuffer/compare/v3.0.0...v3.1.0) (2016-12-15)


### Features

* add getBuffer method ([c798093](https://github.com/image-js/iobuffer/commit/c798093))



<a name="3.0.0"></a>
# [3.0.0](https://github.com/image-js/iobuffer/compare/v2.1.0...v3.0.0) (2016-12-13)


### Bug Fixes

* **iobuffer:** fix an edge case with ensureAvailable ([501dc48](https://github.com/image-js/iobuffer/commit/501dc48))


### Features

* **iobuffer:** add chainability ([bbac001](https://github.com/image-js/iobuffer/commit/bbac001))
* **iobuffer:** add pushMark and popMark API ([a69e228](https://github.com/image-js/iobuffer/commit/a69e228)), closes [#28](https://github.com/image-js/iobuffer/issues/28)



<a name="2.1.0"></a>
# [2.1.0](https://github.com/image-js/iobuffer/compare/v2.0.0...v2.1.0) (2016-09-20)


### Features

* add support for offset option ([ffedd73](https://github.com/image-js/iobuffer/commit/ffedd73))



<a name="2.0.0"></a>
# [2.0.0](https://github.com/image-js/iobuffer/compare/v2.0.0-1...v2.0.0) (2015-11-23)



<a name="2.0.0-1"></a>
# [2.0.0-1](https://github.com/image-js/iobuffer/compare/v2.0.0-0...v2.0.0-1) (2015-10-16)



<a name="2.0.0-0"></a>
# [2.0.0-0](https://github.com/image-js/iobuffer/compare/v1.1.0-0...v2.0.0-0) (2015-10-16)



<a name="1.1.0-0"></a>
# [1.1.0-0](https://github.com/image-js/iobuffer/compare/v1.0.4...v1.1.0-0) (2015-10-02)



<a name="1.0.4"></a>
## [1.0.4](https://github.com/image-js/iobuffer/compare/v1.0.3...v1.0.4) (2015-09-26)



<a name="1.0.3"></a>
## [1.0.3](https://github.com/image-js/iobuffer/compare/v1.0.2...v1.0.3) (2015-09-24)



<a name="1.0.2"></a>
## [1.0.2](https://github.com/image-js/iobuffer/compare/v1.0.1...v1.0.2) (2015-09-24)



<a name="1.0.1"></a>
## [1.0.1](https://github.com/image-js/iobuffer/compare/v1.0.0...v1.0.1) (2015-09-24)



<a name="1.0.0"></a>
# 1.0.0 (2015-09-23)
