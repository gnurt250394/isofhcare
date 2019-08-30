@import PayooSDK;
#import <React/RCTLog.h>
#import <React/RCTConvert.h>
#import "PayooModule.h"

@implementation PayooModule

// To export a module named Payoo
RCT_EXPORT_MODULE();

RCT_REMAP_METHOD(initialize,
                 merchanId:(NSString *)merchanId
                 secretKey:(NSString *)secretKey
                 payWithResolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject)
{
  [PayooSDKConfiguration setWithMerchantId:merchanId secretKey:secretKey];
    NSArray *arr = [[NSArray alloc] init];
    resolve(arr);
  }


RCT_REMAP_METHOD(test,
                 payWithResolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject)
{
  resolve(@"1");
}

RCT_REMAP_METHOD(pay,
                 type: (NSInteger)type
                 orderResponse:(NSDictionary *)orderResponse
                 paymentConfig:(NSDictionary *)paymentConfig
                 payWithResolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject)
{
  NSString *email = [RCTConvert NSString:paymentConfig[@"customerEmail"]];
  NSString *phone = [RCTConvert NSString:paymentConfig[@"customerPhone"]];

  NSNumber *cashAmount = [RCTConvert NSNumber:orderResponse[@"cashAmount"]];
  NSString *orderInfo = [RCTConvert NSString:orderResponse[@"orderInfo"]];
  NSString *checksum = [RCTConvert NSString:orderResponse[@"checksum"]];
 
  [PayooSDKConfiguration setLanguage:LanguageVietnamese];
  [PayooSDKConfiguration setEnvironment:EnvironmentDevelopment];

  
  PayooSDKPaymentConfig *_paymentConfig = [PayooSDKPaymentConfig makeWithBuilder:^(PayooSDKPaymentConfigBuilder *builder) {
    builder.defaultCustomerEmail =email;
    builder.defaultCustomerPhone = phone;
    builder.supportedPaymentMethods=[NSNumber numberWithInteger:type==0?7:32];
    
  }];
  
  OrderRequest *order = [[OrderRequest alloc] initWithOrderInfo:orderInfo checksum:checksum cashAmount:[cashAmount doubleValue]];
  
  [Payoo payWithOrderRequest:order paymentConfig:_paymentConfig completionHandler:^(enum GroupType status, ResponseObject * _Nullable data) { //data.data

    if(status==GroupTypeSuccess)
    {
      // gio toi luon pass casi data kia vao cai text nay
      // data nao. ko hieu lam.
      //cai resolve la 1 ham de tra ve ben react native
      // no cho phep ben native truyen vao 1 data text. ma gio toi co 1 cai nsobject ma toi ko
      //      resolve(@"{tenbien: giatri}");
      //day roi thay, toi vua them vao. ma chay ko dc. =)) print ra dung json string chua
      //      @property (nonatomic, readonly, copy) NSString * _Nullable orderId;
      //      @property (nonatomic, readonly, copy) NSString * _Nullable customerEmail;
      //      @property (nonatomic, readonly, copy) NSString * _Nullable orderXml;
      //      @property (nonatomic, readonly, copy) NSString * _Nullable paymentCode;
      //      @property (nonatomic, readonly, copy) NSString * _Nullable authToken;
      NSMutableDictionary *dic = [[NSMutableDictionary alloc] init];
      [dic setValue:data.data.orderId forKey:@"orderId"];
      [dic setValue:data.data.customerEmail forKey:@"customerEmail"];
      [dic setValue:data.data.orderXml forKey:@"orderXml"];
      [dic setValue:data.data.paymentCode forKey:@"paymentCode"];
      [dic setValue:data.data.authToken forKey:@"authToken"];
      [dic setValue:[NSNumber numberWithDouble:data.data.totalAmount] forKey:@"totalAmount"];
      [dic setValue:[NSNumber numberWithDouble:data.data.paymentFee] forKey:@"paymentFee"];
      NSError *writeError = nil;
      NSData *jsonData = [NSJSONSerialization dataWithJSONObject:dic options:NSJSONWritingPrettyPrinted error:&writeError];
//      chạy den day la loi a hay den dau
      NSString *jsonString = [[NSString alloc] initWithData:jsonData encoding:NSUTF8StringEncoding];
      NSLog(@"JSON Output: %@", jsonString);
      
//      2019-07-02 20:37:37.481 [info][tid:com.facebook.react.JavaScript] active
//      2019-07-02 20:37:37.480738+0700 APP[1366:205847] active
//      2019-07-02 20:37:37.523586+0700 APP[1366:205617] *** Terminating app due to uncaught exception 'NSUnknownKeyException', reason: '[<__NSDictionary0 0x28090c080> setValue:forUndefinedKey:]: this class is not key value coding-compliant for the key orderId.'
//      *** First throw call stack:
//      (0x2206e527c 0x21f8bf9f8 0x220602700 0x22106a9d0 0x100c38cd0 0x105731e8c 0x1057332bc 0x24c82af88 0x24c833934 0x24c82ec04 0x24c926cc8 0x24d2ff96c 0x24d2ff604 0x24d3016a8 0x24d3097d4 0x24d309da8 0x24d309e48 0x224bab188 0x105b34c74 0x105b426fc 0x220676c1c 0x220671b54 0x2206710b0 0x22287179c 0x24cea7978 0x100c3a110 0x2201368e0)
//      libc++abi.dylib: terminating with uncaught exception of type NSException
      
      resolve(jsonString);
//      resolve([NSString stringWithFormat:@"%@", data]);
    }
//      else{
//      NSError *err = [[NSError alloc] init];
//      reject(@"",@"",err);
//    }
  }];
  
//     resolve(email);
//  reject("no_events","",email);
}
@end
