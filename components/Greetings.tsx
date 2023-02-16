import React from 'react';

interface GreetingsProps {
  // Make the greetings prop optional, with a default array of greetings
  greetings?: string[];
}

const GREETINGS = [
  "What's happening",
  "How's it going?",
  "Good evening",
  "Hey, boo",
  "How are you?",
  "Nice to meet you!",
  "Long time no see",
  "What's the good word?",
  "What's new?",
  "Look who it is!",
  "How have you been?",
  "Nice to see you again.",
  "Greetings and salutations!",
  "How are you doing today?",
  "What have you been up to?",
  "How are you feeling today?",
  "Look what the cat dragged in!",
  "Good afternoon, sir, how are you today?"
];

const Greetings: React.FC<GreetingsProps> = ({ greetings = GREETINGS }) => {
  const randomGreeting = greetings[Math.floor(Math.random() * greetings.length)];

  return <span>{randomGreeting}</span>;
};

export default Greetings;
