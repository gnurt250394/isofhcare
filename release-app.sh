# run: appcenter codepush release-react -a isofhvn/ISOFHCARE-ANDROID-USER-PRODUCTION -d Production -m 
# nếu bản update là bắt buộc phải cập nhật đến người dùng ngay khi mở app.
# 
echo deploy to ISOFHCARE-ANDROID-USER-PRODUCTION
appcenter codepush release-react -a isofhvn/ISOFHCARE-ANDROID-USER-PRODUCTION -d Production

# run: appcenter codepush release-react -a isofhvn/ISOFHCARE-IOS-USER-PRODUCTION -d Production -m 
echo deploy to ISOFHCARE-IOS-USER-PRODUCTION
appcenter codepush release-react -a isofhvn/ISOFHCARE-IOS-USER-PRODUCTION -d Production
