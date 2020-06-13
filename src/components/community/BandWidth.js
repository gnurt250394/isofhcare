import React, { useEffect, useRef, useState } from 'react'
import { Text, View } from 'react-native'
const BandWidth = ({ localPc }) => {
    const [bitrate, setBitrate] = useState()
    const timestampPrev = useRef()
    const bytesPrev = useRef()
    const interval = useRef()
    useEffect(() => {
        interval.current = setInterval(() => {
            if (!localPc) {
                debugger
                return;
            }
            if (localPc.getRemoteStreams()[0] && localPc.getRemoteStreams()[0].getAudioTracks()[0]) {
                const track = localPc.getRemoteStreams()[0].getAudioTracks()[0];
                let callback = res => {

                    res.forEach(report => {
                        const now = report.timestamp;

                        let bitrate2;
                        if (report.type === 'googCandidatePair' && report.values.find(e => e['googActiveConnection'])?.googActiveConnection == "true") {
                            const bytes = report.values.find(e => e['bytesReceived'])?.bytesReceived;

                            if (timestampPrev.current) {
                                bitrate2 = 8 * (bytes - bytesPrev.current) / (now - timestampPrev.current);
                                bitrate2 = Math.floor(bitrate2);
                            }
                            bytesPrev.current = bytes;
                            timestampPrev.current = now;
                        }
                        if (bitrate2) {
                            setBitrate(bitrate2)
                        }

                    });
                }

                //

                localPc.getStats(null).then(callback).catch((err) => {

                });
            }
        }, 1000);
        return () => {
            if (interval.current) {
                clearInterval(interval.current)
            }
        }
    }, [])

    return (
        <View>
            {bitrate ?
                <Text style={{
                    padding: 10,
                    alignSelf: 'flex-end',
                    color: bitrate < 100 ? 'red' : bitrate < 700 ? "orange" : 'green'
                }}>{bitrate} kbits/sec</Text>
                : null
            }
        </View>
    )
}

export default BandWidth
