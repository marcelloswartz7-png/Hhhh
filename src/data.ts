import { Question } from "./types";

export const SAMPLE_QUESTIONS: Question[] = [
  {
    id: "1",
    category: "road-signs",
    text: "What does this sign indicate?",
    options: [
      "No entry for motor vehicles",
      "Stop sign",
      "Yield sign",
      "No parking"
    ],
    correctAnswer: 1,
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Stop_sign_Namibia.svg/600px-Stop_sign_Namibia.svg.png"
  },
  {
    id: "2",
    category: "rules",
    text: "What is the general speed limit on public roads in Namibia, unless otherwise indicated?",
    options: [
      "60 km/h",
      "100 km/h",
      "120 km/h",
      "80 km/h"
    ],
    correctAnswer: 1
  },
  {
    id: "3",
    category: "rules",
    text: "When should you use your hooter in Namibia?",
    options: [
      "To greet friends",
      "To express anger at other drivers",
      "Only in an emergency to avoid a collision",
      "When the traffic light turns green"
    ],
    correctAnswer: 2
  },
  {
    id: "4",
    category: "general",
    text: "Who has the absolute right of way at any intersection?",
    options: [
      "Pedestrians",
      "Emergency vehicles with sirens",
      "Drivers turning right",
      "No one has absolute right of way; safety first"
    ],
    correctAnswer: 3
  },
  {
    id: "5",
    category: "road-signs",
    text: "What does a circular sign with a red border and a bicycle inside mean?",
    options: [
      "Bicycle path ahead",
      "Bicycles only",
      "No entry for bicycles",
      "Bicycle parking"
    ],
    correctAnswer: 2
  },
  {
    id: "6",
    category: "general",
    text: "What is the legal blood alcohol limit for drivers in Namibia?",
    options: [
      "0.00% g/100ml",
      "0.05% g/100ml",
      "0.08% g/100ml",
      "0.02% g/100ml"
    ],
    correctAnswer: 1
  },
  {
    id: "7",
    category: "road-signs",
    text: "What does a triangular sign with a red border and a person with a shovel indicate?",
    options: [
      "Children crossing",
      "Road works ahead",
      "Farm workers ahead",
      "No pedestrians allowed"
    ],
    correctAnswer: 1
  },
  {
    id: "8",
    category: "rules",
    text: "When are you allowed to pass a vehicle on the left in Namibia?",
    options: [
      "Whenever you are in a hurry",
      "When the vehicle ahead is turning right and there is enough space",
      "Never, it is strictly forbidden",
      "Only on gravel roads"
    ],
    correctAnswer: 1
  },
  {
    id: "9",
    category: "general",
    text: "What should you do if your vehicle breaks down on a national road at night?",
    options: [
      "Leave the vehicle and walk for help",
      "Switch on hazard lights and place warning triangles at least 45m behind and in front",
      "Sleep in the car until morning",
      "Push the car onto the road to be visible"
    ],
    correctAnswer: 1
  },
  {
    id: "10",
    category: "road-signs",
    text: "What does a rectangular blue sign with a white 'P' and a bus silhouette indicate?",
    options: [
      "Parking for buses only",
      "Bus stop ahead",
      "No buses allowed",
      "Bus lane"
    ],
    correctAnswer: 0
  }
];
