/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import "AppDelegate.h"
#import <CodePush/CodePush.h>
#import <AppCenterReactNativeShared/AppCenterReactNativeShared.h>
#import <AppCenterReactNative.h>
#import <AppCenterReactNativeAnalytics.h>
#import <AppCenterReactNativeCrashes.h>
#import <Firebase.h>

#import <React/RCTBridge.h>
#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>
#import "RNFirebaseNotifications.h"
#import "RNFirebaseMessaging.h"
@import GoogleMaps;
@import GooglePlaces;

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
[AppCenterReactNative register]; // Initialize AppCenter
[AppCenterReactNativeAnalytics registerWithInitiallyEnabled:true]; // Initialize AppCenter analytics
[AppCenterReactNativeCrashes registerWithAutomaticProcessing]; // Initialize AppCenter crashes

//  [Configuration setMerchantId:<#(nonnull NSString *)#> andScretKey:<#(nonnull NSString *)#>];

  //firebase
  [FIRApp configure];
  [GMSPlacesClient provideAPIKey:@"AIzaSyAuxCg_cGhru90abVUxnkTVVdsLzyr4sQ4"];
  [GMSServices provideAPIKey:@"AIzaSyAuxCg_cGhru90abVUxnkTVVdsLzyr4sQ4"];
  [RNFirebaseNotifications configure];

 
  //=============================

  RCTBridge *bridge = [[RCTBridge alloc] initWithDelegate:self launchOptions:launchOptions];
  RCTRootView *rootView = [[RCTRootView alloc] initWithBridge:bridge
                                                   moduleName:@"APP"
                                            initialProperties:nil];

  rootView.backgroundColor = [[UIColor alloc] initWithRed:1.0f green:1.0f blue:1.0f alpha:1];

  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [UIViewController new];
  rootViewController.view = rootView;
  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];
  return YES;
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index" fallbackResource:nil];
#else
  return [CodePush bundleURL];
#endif
}




- (void)application:(UIApplication *)application didReceiveLocalNotification:(UILocalNotification *)notification {
  [[RNFirebaseNotifications instance] didReceiveLocalNotification:notification];
}

- (void)application:(UIApplication *)application didReceiveRemoteNotification:(nonnull NSDictionary *)userInfo
fetchCompletionHandler:(nonnull void (^)(UIBackgroundFetchResult))completionHandler{
  [[RNFirebaseNotifications instance] didReceiveRemoteNotification:userInfo fetchCompletionHandler:completionHandler];
}

- (void)application:(UIApplication *)application didRegisterUserNotificationSettings:(UIUserNotificationSettings *)notificationSettings {
  [[RNFirebaseMessaging instance] didRegisterUserNotificationSettings:notificationSettings];
}

@end
