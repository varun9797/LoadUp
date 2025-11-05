export const calculateAnswerScores = (correctAnswers: string[], answer: string[], scoring: number): number => {
    if (!Array.isArray(correctAnswers)) return 0;
    let answerKeywordInSet = new Set(answer.map((ans) => ans.toLowerCase()));
    let matches = correctAnswers.filter((q) => answerKeywordInSet.has(q.toLowerCase()));
    return (scoring * (matches.length / correctAnswers.length));
};

export const calculateMatchedkeywordScores = (text: string, correctAnswers: string[], scoring: number): number => {
    let matchedSubstringsCount: number = 0;
    const lowerText = text.toLowerCase();
    correctAnswers.forEach((keyword) => {
        if (lowerText.includes(keyword.toLowerCase())) {
            matchedSubstringsCount++;
        }
    });
    return (scoring * (matchedSubstringsCount / correctAnswers.length));
}