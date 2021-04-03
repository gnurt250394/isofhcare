# run: appcenter codepush release-react -a isofhvn/ISOFHCARE-ANDROID-USER-TEST -d Production -m 
# nếu bản update là bắt buộc phải cập nhật đến người dùng ngay khi mở app.
# 
echo deploy to ISOFHCARE-ANDROID-USER-TEST
appcenter codepush release-react -a isofhvn/ISOFHCARE-ANDROID-USER-TEST -d Production

# run: appcenter codepush release-react -a isofhvn/ISOFHCARE-IOS-USER-TEST -d Production -m 
echo deploy to ISOFHCARE-IOS-USER-TEST
appcenter codepush release-react -a isofhvn/ISOFHCARE-IOS-USER-TEST -d Production
