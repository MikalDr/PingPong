function getRandomMessage(messages: string[]): string {
  return messages[Math.floor(Math.random() * messages.length)];
}

export function getMotivationalMessage(winnerScore: number, loserScore: number): string {
  const diff = winnerScore - loserScore;

  const messagesBlowout = [
    "Under bordet med deg!",
    "Er kanskje litt støvete under der?",
    "Patrick? E d deg?",
  ];

  const messagesBigLoss = [
    "Trist for deg, men kjekt for motspiller!",
    "Bruker du feil bordtennisrekkert?",
    "Washed",
  ];

  const messagesCloseLoss = [
    "Nærme, men ikkje nok nærme nok!",
    "Så nært, nesten der!",
    "Kunne vore værre, men og betre!",
  ];

  const messagesTinyLoss = [
    "No nærme det seg!",
    "Nesten det, vinner neste!",
    "Ein kopp kaffi og du har det der!",
  ];

  if (loserScore === 0 && winnerScore === 11) {
    return getRandomMessage(messagesBlowout);
  } else if (diff >= 8) {
    return getRandomMessage(messagesBigLoss);
  } else if (diff >= 4) {
    return getRandomMessage(messagesCloseLoss);
  } else {
    return getRandomMessage(messagesTinyLoss);
  }
}
