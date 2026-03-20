// 50+ Zomato-style edgy/funny push notification messages for Natak TV
// Each message has a title and body. {video} gets replaced with an actual video title.

export type NotificationTemplate = {
  title: string;
  body: string;
};

export const NOTIFICATION_MESSAGES: NotificationTemplate[] = [
  // Curiosity hooks
  { title: "Kuch toh hua hai... 👀", body: "New drama dropped on Natak TV. First 2 minutes will shock you." },
  { title: "Plot twist alert 🔄", body: "Everyone is talking about {video}. Have you watched it yet?" },
  { title: "Yeh kya ho gaya?!", body: "The ending of {video} broke the internet. Watch now." },
  { title: "Spoiler incoming in 3... 2...", body: "Better watch {video} before someone ruins it for you 😏" },
  { title: "Tuesday ko kon kaam karta hai? 🤷", body: "Smart log Natak TV dekhte hain. Just saying." },

  // FOMO
  { title: "83 reasons to skip work today 🎬", body: "Your coworker already watched 3 shows. Catch up!" },
  { title: "Everyone watched it except you 💀", body: "{video} is trending #1 on Natak TV right now." },
  { title: "You're missing out fr fr", body: "While you were busy, {video} got 1000+ views. Join the party!" },
  { title: "Your watchlist is crying 😢", body: "3 new shows added since you last opened Natak TV." },
  { title: "Bhai dekh le yaar", body: "{video} is the kind of drama your life is missing." },

  // Boss/Work humor
  { title: "Boss meeting mein hai 🤫", body: "Perfect time for a 2-minute drama break on Natak TV." },
  { title: "Lunch break ka asli maza", body: "Skip the canteen gossip. Watch {video} instead 🍿" },
  { title: "Office boring? Same.", body: "But {video} isn't. Quick 5-min escape on Natak TV." },
  { title: "WFH ka best part 🏠", body: "Camera off. Natak TV on. Nobody will know." },
  { title: "Pretend you're working 💻", body: "...while watching {video}. We won't tell." },

  // Nighttime
  { title: "Can't sleep? 🌙", body: "Neither can the characters in {video}. Watch their story." },
  { title: "Netflix kaun dekhta hai? 🙄", body: "Real ones watch Natak TV. {video} is waiting." },
  { title: "Raat ko drama dekhne ka maza hi alag hai", body: "Try {video} — perfect for late-night binge." },
  { title: "One more episode? 👀", body: "You know the answer. {video} has a killer cliffhanger." },
  { title: "Neend nahi aa rahi?", body: "Good. {video} just dropped. Perfect timing." },

  // Direct & punchy
  { title: "New drop 🔥", body: "{video} just landed on Natak TV. Be the first to watch!" },
  { title: "Binge-worthy alert 🚨", body: "{video} — once you start, you can't stop." },
  { title: "Free entertainment > Paid entertainment", body: "Watch {video} on Natak TV. Zero paisa, full drama." },
  { title: "Drama? Yes please.", body: "{video} has everything — love, betrayal, and plot twists 🎭" },
  { title: "Content itna accha hai ki...", body: "...you'll forget to eat dinner. Try {video}." },

  // Emotional hooks
  { title: "This one hit different 💔", body: "{video} will make you feel things. Fair warning." },
  { title: "Warning: tissues needed 🥺", body: "{video} is an emotional rollercoaster. Watch at your own risk." },
  { title: "Goosebumps guaranteed", body: "The climax of {video} is absolutely insane. Don't miss it." },
  { title: "Dil toot jayega 💔", body: "But in the best way. {video} is a masterpiece." },
  { title: "Ek baar dekh, phir bol", body: "{video} changed how 1000+ people think about love." },

  // Competitive/Social
  { title: "Your friend just finished {video} 👀", body: "Don't be the last one. Start watching now!" },
  { title: "10,000+ people watched this today", body: "{video} is the most popular show this week 📈" },
  { title: "Rating: ⭐⭐⭐⭐⭐", body: "{video} is getting 5-star reviews. See what the hype is about." },
  { title: "Trending for 3 days straight 🔥", body: "{video} refuses to leave the top spot. Watch why." },
  { title: "Sabse zyada dekha gaya", body: "{video} is Natak TV's #1 show this week!" },

  // Weekend vibes
  { title: "Weekend plans? Sorted. 🎉", body: "Natak TV has 80+ shows ready for your binge session." },
  { title: "Saturday night sorted 🍿", body: "Grab snacks. Open Natak TV. Start {video}. Thank us later." },
  { title: "Sunday funday = Drama day", body: "Spend your Sunday with {video}. Way better than Instagram." },
  { title: "Long weekend ka plan", body: "Step 1: Open Natak TV. Step 2: Start {video}. Step 3: Enjoy." },
  { title: "Bahar jaane ka mann nahi? 🏠", body: "Stay in. Watch {video}. Best decision you'll make today." },

  // Hindi-heavy
  { title: "Arre yaar, yeh toh must-watch hai!", body: "{video} mein aisa twist hai ki muh khula reh jayega 😱" },
  { title: "Paisa vasool content 💰", body: "{video} dekho — free mein itna entertainment kahin nahi milega." },
  { title: "Kya mast show hai! 🤩", body: "{video} start karo aur khud dekhlo. Hum kya batayein." },
  { title: "Drama hi drama 🎭", body: "Natak TV pe naya content aaya hai. Miss mat karo!" },
  { title: "Tension mat lo 😌", body: "Sab kuch chhodo aur {video} dekho. Mood fix ho jayega." },

  // Short & snappy
  { title: "2 min. That's all.", body: "Watch {video}'s first episode. If you're not hooked, we'll shut up." },
  { title: "Bored?", body: "Not for long. Tap here → {video} 🎬" },
  { title: "Quick break? ☕", body: "Watch a 3-min episode of {video} with your chai." },
  { title: "👆 Tap. Watch. Repeat.", body: "{video} on Natak TV. You're welcome." },
  { title: "1 notification. 1 great show.", body: "{video}. That's it. That's the message." },
];
