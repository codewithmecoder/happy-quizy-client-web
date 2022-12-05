import Image from 'next/image';
interface Props {
  score: number;
}

const GifDoneQuiz = ({ score }: Props) => {
  return (
    <div>
      {score >= 50 && (
        <div className="w-[80%] !h-[50%] mx-auto col-span-1">
          <Image
            src={'/assets/images/congrats.gif'}
            alt={'Contrats'}
            className="w-full shadow-md rounded"
            priority
            object-fit="contain"
            width={50}
            height={50}
          />
        </div>
      )}
      {score <= 50 && (
        <div className="w-[80%] !h-[50%] mx-auto col-span-1">
          <Image
            src={'/assets/images/fail.gif'}
            alt={'Contrats'}
            className="w-full shadow-md rounded"
            priority
            object-fit="contain"
            width={50}
            height={50}
          />
        </div>
      )}
    </div>
  );
};

export default GifDoneQuiz;
