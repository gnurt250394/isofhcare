#  Changelog
All notable changes to this project will be documented in this file.

## [Unreleased]
### Changed
- Improvement SDK

## [2.2.0] - 2019-04-04
### Changed
- Convert to Swift 5

## [2.1.1] - 2019-02-14
### Fixed
- Open webview in case a URL string was encoded or not.

## [2.1.0] - 2019-01-25
### Changed
- Update `GetPaymentFee` api.

### Fixed
- Fix bugs related to payment via the card because the webview doesn't enable cookies in the production environment. 
- Fixed missing query items in the URL when open a browser.

### Added
- Supported to looking for the nearest stores. 

## [2.0.2] - 2018-12-12
### Fixed
- Fix webview continue to load URL after received response data.

## [2.0.1] - 2018-11-28
### Changed, Fixed
- Fixed some UI bugs.
- Show a loading view instead of a hub when calling to SDK.
- Changed `Int` to `PaymentMethodOption` type of `supportedPaymentMethods` parameter in `PaymentConfig`
- Changed `Int` to `NSNumber` type of  `supportedPaymentMethods` parameter in `Payoo.pay(orderRequest:paymentConfig:completionHandler:)` function.

## [2.0.0] - 2018-09-12
### Changed
- Added `bankCode` parameter to `PaymentConfig` class to payment with the specified bank. 

## [2.0.0] - 2018-06-14
### Changed
- Added `totalAmount` and `paymentFee` parameters in `ResponseObject` class.

## [2.0.0] - 2018-05-04
### Security, Fixed
- Verify received data to be sure that it can not be changed in the connection.
- Update UI and fix issues.

## [1.0.1] - 2018-01-29
### Changed
- Update API

## [1.0.0] - 2017-11-17
### Added
- Support payment via Domestic card, International card, eWallet and Pay at store. 

