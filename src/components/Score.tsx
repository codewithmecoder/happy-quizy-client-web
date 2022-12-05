interface Props {
  score: number;
}
const Score = ({ score }: Props) => {
  return (
    <div>
      {score >= 50 && (
        <>
          <h1 className="font-bold text-5xl mb-3 text-center">Congrats!</h1>
          <h1 className="text-green-500 text-6xl font-bold">{score}% Score</h1>
        </>
      )}
      {score < 50 && (
        <>
          <h1 className="font-bold text-5xl mb-3 text-center">Failed!</h1>
          <h1 className="text-red-500 text-6xl font-bold">{score}% Score</h1>
        </>
      )}
    </div>
  );
};

export default Score;
