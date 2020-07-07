/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
#import <React/RCTLinkingManager.h>
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
#import "RNCallKeep.h"
#import <PushKit/PushKit.h>                    /* <------ add this line */
#import "RNVoipPushNotificationManager.h"
#import <React/RCTLinkingManager.h>
/* config momo sdk**/
#import "RNMomosdk.h"

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

/* config momo sdk **/
/*iOS 9 or newest*/
-(BOOL)application:(UIApplication *)application openURL:(nonnull NSURL *)url options:(nonnull NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options{
    [RNMomosdk handleOpenUrl:url];
    return YES;
}

/*iOS 8 or lower*/
-(BOOL)application:(UIApplication *)application
             openURL:(NSURL *)url
   sourceApplication:(NSString *)sourceApplication
          annotation:(id)annotation;{
    [RNMomosdk handleOpenUrl:url];
    return YES;
}

- (BOOL)application:(UIApplication *)application openURL:(NSURL *)url
  sourceApplication:(NSString *)sourceApplication annotation:(id)annotation
{
  return [RCTLinkingManager application:application openURL:url
                      sourceApplication:sourceApplication annotation:annotation];
}

// Only if your app is using [Universal Links](https://developer.apple.com/library/prerelease/ios/documentation/General/Conceptual/AppSearch/UniversalLinks.html).
- (BOOL)application:(UIApplication *)application continueUserActivity:(NSUserActivity *)userActivity
 restorationHandler:(void (^)(NSArray * _Nullable))restorationHandler
{
 return [RCTLinkingManager application:application
                  continueUserActivity:userActivity
                    restorationHandler:restorationHandler];
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


/* Add PushKit delegate method */

// --- Handle updated push credentials
- (void)pushRegistry:(PKPushRegistry *)registry didUpdatePushCredentials:(PKPushCredentials *)credentials forType:(PKPushType)type {
  // Register VoIP push token (a property of PKPushCredentials) with server
  [RNVoipPushNotificationManager didUpdatePushCredentials:credentials forType:(NSString *)type];
}

// --- Handle incoming pushes (for ios <= 10)
- (void)pushRegistry:(PKPushRegistry *)registry didReceiveIncomingPushWithPayload:(PKPushPayload *)payload forType:(PKPushType)type {
  NSLog(@"didReceiveIncomingPushWithPayload không complete");
  [RNVoipPushNotificationManager didReceiveIncomingPushWithPayload:payload forType:(NSString *)type];
}

// --- Handle incoming pushes (for ios >= 11)
- (void)pushRegistry:(PKPushRegistry *)registry didReceiveIncomingPushWithPayload:(PKPushPayload *)payload forType:(PKPushType)type withCompletionHandler:(void (^)(void))completion {
  if([[UIApplication sharedApplication] applicationState] != UIApplicationStateActive)
  {
      //App is in foreground. Act on it.
    NSLog(@" didReceiveIncomingPushWithPayload có complete %@",payload.dictionaryPayload[@"data"][@"name"]);
        NSString *uuid =payload.dictionaryPayload[@"data"][@"UUID"];
        NSString *callerName = payload.dictionaryPayload[@"data"][@"name"];
        NSMutableDictionary *dict = [[NSMutableDictionary alloc] init];
        [dict setObject:uuid forKey:@"uuid"];
      
    //       NSString *callerName = @"Người dùng iSofHcare";
           NSString *handle = @"";
            
      if ([[CXCallObserver alloc] init].calls.count == 0) {
        // --- Process the received push
        [[NSNotificationCenter defaultCenter] postNotificationName:@"voipRemoteNotificationReceived" object:self userInfo:dict];
        
        // --- You should make sure to report to callkit BEFORE execute `completion()`
        [RNCallKeep reportNewIncomingCall:uuid handle:handle handleType:@"generic" hasVideo:true localizedCallerName:callerName fromPushKit: YES payload:payload.dictionaryPayload[@"data"]];
        NSLog(@" didReceiveIncomingPushWithPayload có Gọi nhé");
      } else {
        // Show fake call
        NSLog(@" show fake call");
       [RNCallKeep reportNewIncomingCall:uuid handle:handle handleType:@"generic" hasVideo:true localizedCallerName:callerName fromPushKit: YES payload:nil];
        [RNCallKeep endCallWithUUID:uuid reason:1];
      }
      
  }
  
  completion();
}

@end
