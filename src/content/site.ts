export const site = {
  name: "Tri-Shail",
  fullName: "Tri-Shail Performance Coaching",
  coach: "Shreeshail Janagond",
  description:
    "Triathlon and running coaching with Shreeshail Janagond, certified triathlon coach and two-time Ironman finisher. Build towards your next finish line.",
};
export const credentials = [
  { value: "2×", label: "Ironman finisher" },
  { value: "SUB 12", label: "Ironman personal best" },
  { value: "1×", label: "Ironman 70.3 finisher" },
];
export const coachProfile = {
  biography:
    "Based in Sangli, Maharashtra, Shreeshail balances a full-time career with endurance sport. He brings that understanding to personalised coaching for athletes fitting training around work and everyday life—from a first triathlon to the demands of Ironman.",
  formats: "Online & in person",
  location: "Sangli, Maharashtra",
  languages: "Marathi · English · Hindi",
  focus: "Personalised training · Strength and conditioning",
  source: "https://runorbit.in/runorbit_services/shreeshail/",
  raceResults: [
    { event: "Ironman Copenhagen", time: "11:54:33" },
    { event: "Ironman Gurye, Korea", time: "13:46:12" },
    { event: "Ironman 70.3 Goa", time: "6:33:46" },
    { event: "Tata Mumbai Marathon", time: "3:58:47" },
  ],
};
export const programmes = [
  {
    number: "01",
    name: "Your first triathlon",
    tag: "THE STARTING LINE",
    description:
      "Turn “one day” into a starting line. Build a foundation across swimming, cycling, and running.",
    detail: "For athletes finding their feet in three sports.",
    image: "swim",
    goal: "First triathlon",
  },
  {
    number: "02",
    name: "Ironman 70.3",
    tag: "GO THE DISTANCE",
    description:
      "Three disciplines. One purposeful build. Bring your training together for the half-distance challenge.",
    detail: "For your first 70.3 or your next personal goal.",
    image: "bike",
    goal: "Ironman 70.3",
  },
  {
    number: "03",
    name: "Full Ironman",
    tag: "THE BIG AMBITION",
    description:
      "Give a big ambition a clear direction. Build the consistency and confidence to take on long-course racing.",
    detail: "For athletes ready to explore full-distance preparation.",
    image: "hero",
    goal: "Full Ironman",
  },
  {
    number: "04",
    name: "Run with purpose",
    tag: "FIND YOUR STRIDE",
    description:
      "From your next half marathon to a full marathon, make every training week part of a bigger journey.",
    detail: "For runners with a finish line in mind.",
    image: "run",
    goal: "Half marathon / marathon",
  },
];
export const chapters = [
  {
    id: "swim",
    number: "01",
    name: "Swim",
    title: ["FIND YOUR", "FLOW."],
    phrase: "Confidence starts in the water.",
    description:
      "Settle into a rhythm. Build your technique, find your confidence, and make the first discipline your foundation.",
    meta: "TECHNIQUE · CONFIDENCE · CONSISTENCY",
    alt: "Shreeshail Janagond swimming in open water with a bright orange safety buoy",
  },
  {
    id: "bike",
    number: "02",
    name: "Bike",
    title: ["BUILD YOUR", "ENGINE."],
    phrase: "Go further, with purpose.",
    description:
      "Endurance grows with consistency. Bring intention to your riding and learn to keep something in reserve for the road ahead.",
    meta: "ENDURANCE · PACING · PROGRESSION",
    alt: "Shreeshail Janagond training on his road bike",
  },
  {
    id: "run",
    number: "03",
    name: "Run",
    title: ["FINISH", "STRONG."],
    phrase: "One stride closer to your goal.",
    description:
      "Find the rhythm that carries you forward. Prepare for the run, the race, and the feeling of crossing your next finish line.",
    meta: "RHYTHM · RESILIENCE · RACE PREPARATION",
    alt: "Shreeshail Janagond running during an Ironman race in his Tri-Shail kit",
  },
] as const;
export const faqs = [
  {
    question: "Where can I train with Shreeshail?",
    answer:
      "Coaching is available online and in person in Sangli, with communication in Marathi, English, or Hindi. Share your location and preferred language in your enquiry.",
  },
  {
    question: "Do I need to be an experienced triathlete?",
    answer:
      "You can start with a first-triathlon goal or bring experience from running, swimming, or cycling. Tell Shreeshail where you are now so you can discuss a suitable starting point.",
  },
  {
    question: "Can I discuss a running goal instead?",
    answer:
      "Yes. The enquiry form includes half-marathon and marathon goals, alongside triathlon and Ironman distances.",
  },
  {
    question: "How much time will I need for training?",
    answer:
      "That depends on your event, current fitness, and the time you have available. Share your target and schedule in your enquiry so the conversation starts with your actual circumstances.",
  },
  {
    question: "How do I find out about fees and coaching options?",
    answer:
      "Send an enquiry with your goal. You can discuss the programme, availability, communication, and fees with Shreeshail before choosing how to proceed.",
  },
];
