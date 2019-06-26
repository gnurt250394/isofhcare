@import PayooSDK;
#import <React/RCTLog.h>
#import <React/RCTConvert.h>
#import "PayooModule.h"
@implementation PayooModule

// To export a module named Payoo
RCT_EXPORT_MODULE();

RCT_REMAP_METHOD(pay,
                 orderResponse:(NSDictionary *)orderResponse
                 paymentConfig:(NSDictionary *)paymentConfig
                 payWithResolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject)
{
  NSString *email = [RCTConvert NSString:paymentConfig[@"customerEmail"]];
  NSString *phone = [RCTConvert NSString:paymentConfig[@"customerPhone"]];

  NSNumber *cast = [RCTConvert NSNumber:orderResponse[@"cashAmount"]];
  NSString *orderInfo = [RCTConvert NSString:orderResponse[@"orderInfo"]];
  NSString *checksum = [RCTConvert NSString:orderResponse[@"checksum"]];
 
  
  [PayooSDKConfiguration setLanguage:LanguageVietnamese];

  
  PayooSDKPaymentConfig *_paymentConfig = [PayooSDKPaymentConfig makeWithBuilder:^(PayooSDKPaymentConfigBuilder *builder) {
    builder.defaultCustomerEmail =email;
    builder.defaultCustomerPhone = phone;
  }];
  
  OrderRequest *order = [[OrderRequest alloc] initWithOrderInfo:orderInfo checksum:checksum cashAmount:[cast doubleValue]];
  
  [Payoo payWithOrderRequest:order paymentConfig:_paymentConfig completionHandler:^(enum GroupType status, ResponseObject * _Nullable data) {
    if(status==GroupTypeSuccess)
    {
      NSArray *arr = [[NSArray alloc] initWithArray:data.data];
      resolve(arr);
    }else{
      NSError *err = [[NSError alloc] init];
      reject(@"",@"",err);
    }
  }];
  
//     resolve(email);
//  reject("no_events","",email);
}
@end
