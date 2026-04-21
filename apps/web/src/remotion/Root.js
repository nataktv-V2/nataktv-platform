import { jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import { Composition } from "remotion";
import { SoftStoryAd } from "./compositions/SoftStoryAd";
const scripts = [
    { id: "01", hookLine1: "Jija ne Sali ke kaan mein", hookLine2: "dheere se bola... Aaj dekhe?", image: "thumbnails/ads/scene-01.jpg", title: "Natak TV" },
    { id: "02", hookLine1: "Padosan ne secretly phone mein", hookLine2: "kuch dikhaya... aur boli, yeh toh dekho!", image: "thumbnails/ads/scene-02.jpg", title: "Natak TV" },
    { id: "03", hookLine1: "Bhabhi ne devar ko WhatsApp pe", hookLine2: "bheja... raat ko zaroor dekhna!", image: "thumbnails/ads/scene-03.jpg", title: "Natak TV" },
    { id: "04", hookLine1: "Office mein sabne chhup ke dekha", hookLine2: "boss bola, mujhe bhi batao!", image: "thumbnails/ads/scene-04.jpg", title: "Natak TV" },
    { id: "05", hookLine1: "Boyfriend ne girlfriend ko bola", hookLine2: "chal aaj kuch spicy dekhte hain!", image: "thumbnails/ads/scene-05.jpg", title: "Natak TV" },
    { id: "06", hookLine1: "Saasu maa ne secretly", hookLine2: "phone lock kiya... kya dekh rahi thi?", image: "thumbnails/ads/scene-06.jpg", title: "Natak TV" },
    { id: "07", hookLine1: "Train mein ladki itna has rahi thi", hookLine2: "sab soch rahe, phone mein kya hai?", image: "thumbnails/ads/scene-07.jpg", title: "Natak TV" },
    { id: "08", hookLine1: "Raat ko pati so gaya...", hookLine2: "biwi ne dheere se headphone lagaye!", image: "thumbnails/ads/scene-08.jpg", title: "Natak TV" },
    { id: "09", hookLine1: "Hostel mein sab ek phone pe", hookLine2: "chipak gaye... binge karna padega!", image: "thumbnails/ads/scene-09.jpg", title: "Natak TV" },
    { id: "10", hookLine1: "Didi ne chhoti behen ko bola", hookLine2: "Netflix se bhi zyada mast hai, try kar!", image: "thumbnails/ads/scene-10.jpg", title: "Natak TV" },
];
export const RemotionRoot = () => {
    return (_jsx(_Fragment, { children: scripts.map((s) => {
            const hookNum = s.id;
            const props = {
                hookLine1: s.hookLine1,
                hookLine2: s.hookLine2,
                showTitle: s.title,
                showImage: s.image,
                ctaLine1: "2 Rupaye mein 100+ Natak",
                ctaLine2: "Download karo Natak TV aaj hi!",
                ctaButton: "Download Natak TV",
                hookAudio: `audio/ads/hook-v2-${hookNum}.mp3`,
                ctaAudio: `audio/ads/cta-v2.mp3`,
            };
            return (_jsx(Composition, { id: `Ad${s.id}`, component: SoftStoryAd, durationInFrames: 450, fps: 30, width: 1080, height: 1920, defaultProps: props }, s.id));
        }) }));
};
