# run: appcenter codepush release-react -a isofhvn/ISOFHCARE-ANDROID-USER-RELEASE -d Production -m 
# nếu bản update là bắt buộc phải cập nhật đến người dùng ngay khi mở app.
# 
echo deploy to ISOFHCARE-ANDROID-USER-RELEASE
appcenter codepush release-react -a isofhvn/ISOFHCARE-ANDROID-USER-RELEASE -d Production

# run: appcenter codepush release-react -a isofhvn/ISOFHCARE-IOS-USER-RELEASE -d Production -m 
echo deploy to ISOFHCARE-IOS-USER-RELEASE
appcenter codepush release-react -a isofhvn/ISOFHCARE-IOS-USER-RELEASE -d Production
