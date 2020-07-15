# run: appcenter codepush release-react -a isofhvn/ISOFHCARE-ANDROID-USER-STABLE -d Production -m 
# nếu bản update là bắt buộc phải cập nhật đến người dùng ngay khi mở app.
# 
echo deploy to ISOFHCARE-ANDROID-USER-STABLE
appcenter codepush release-react -a isofhvn/ISOFHCARE-ANDROID-USER-STABLE -d Production

# run: appcenter codepush release-react -a isofhvn/ISOFHCARE-IOS-USER-STABLE -d Production -m 
echo deploy to ISOFHCARE-IOS-USER-STABLE
appcenter codepush release-react -a isofhvn/ISOFHCARE-IOS-USER-STABLE -d Production
