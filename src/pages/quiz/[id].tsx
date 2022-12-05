import { useQuery } from '@tanstack/react-query';
import { GetServerSideProps, NextPage } from 'next';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import DangerButton from '../../components/DangerButton';
import GifDoneQuiz from '../../components/GifDoneQuiz';
import Loading from '../../components/Loading';
import Modal from '../../components/Modal';
import MyHead from '../../components/MyHead';
import PrimaryButton from '../../components/PrimaryButton';
import Score from '../../components/Score';
import useTimer from '../../hooks/useTimer';
import useUnload from '../../hooks/useUnload';
import { AnswerQuestionModel } from '../../models/answerQuestion.model';
import { BaseResponse } from '../../models/baseResponse.model';
import { QuestionModel } from '../../models/question.model';
import { TypeQuestionModel } from '../../models/typeQuestion.model';
import { fetchTypeQuestionsById } from '../../services/typeQuestion.service';
import { Constants } from '../../utils/constants';
import fetcher from '../../utils/fetcher';
import { getDeadLineTimer } from '../../utils/getDeadlineTimer';

const Quiz: NextPage<{
  headers: Partial<{
    [key: string]: string;
  }>;
}> = ({ headers }) => {
  const router = useRouter();
  const [startModal, setStartModal] = useState(true);
  const { id } = router.query;
  const intervalRef = useRef<NodeJS.Timer | null>(null);
  const intervalRefEachQuestion = useRef<NodeJS.Timer | null>(null);

  const [doneModal, setDoneModal] = useState<boolean>(false);

  const [totalCorrectAnswers, setTotalCorrectAnswers] = useState<number>(0);
  const [totalScore, setTotalScore] = useState<number>(0);

  const [answers, setAnswers] = useState<AnswerQuestionModel[] | []>([]);

  const [answerQuestion, setAnswerQuestion] =
    useState<AnswerQuestionModel | null>(null);
  const [question, setQuestion] = useState<QuestionModel | null>(null);
  const [indexQuestion, setIndexQuestion] = useState<number>(
    Constants.apps.minQuestions
  );
  const [questionTimer, setQuestionTimer] = useState('00:00:00');
  const [timer, setTimer] = useState('00:00:00');
  const defualtTimeDisplayEachQuestion = '00:01:00';
  const defualtTimeDisplay = '00:20:00';
  const {
    isTimeOut: isEachQuestionTimeOut,
    clearTimer: clearTimerEacherQuestion,
    total: totalEachQuestion,
  } = useTimer(setQuestionTimer, intervalRefEachQuestion);
  const { isTimeOut, clearTimer, total } = useTimer(setTimer, intervalRef);

  useUnload((e: any) => {
    e.preventDefault();
    e.returnValue = '';
  });

  const questionQuery = useQuery(
    [Constants.queries.typeQuestion],
    async () => await fetchTypeQuestionsById(Number(id), headers)
  );

  const getQuestionRandomly = (data: QuestionModel[]) => {
    const min = Math.ceil(0);
    const max = Math.floor(data.length - 1);
    const index = Math.floor(Math.random() * (max - min + 1)) + min;
    const _data = data.filter((_, i) => i === index);
    setQuestion(_data[0]);
  };
  const nextQuestion = () => {
    if (!answerQuestion && !isEachQuestionTimeOut) return;
    setAnswers([...answers, answerQuestion!]);
    const questions = questionQuery.data?.data as TypeQuestionModel;
    if (questions && Constants.apps.maxQuestions > indexQuestion) {
      getQuestionRandomly(questions.questions);
      clearTimerEacherQuestion(
        getDeadLineTimer({ mins: 1 }),
        defualtTimeDisplayEachQuestion
      );
      setIndexQuestion((prev) => (prev += 1));
      setAnswerQuestion(null);
    } else {
      //setIndexQuestion((prev) => (prev += 1));
      const totalAnswer = answers.filter((val) => val && val.iscorrect).length;
      const totalScore = (totalAnswer / indexQuestion) * 100;
      setTotalScore(totalScore);
      setTotalCorrectAnswers(totalAnswer);
      setDoneModal(true);
    }
  };
  useEffect(() => {
    if (isEachQuestionTimeOut) nextQuestion();
  }, [isEachQuestionTimeOut, nextQuestion]);

  // useEffect(() => {
  //   if (indexQuestion === Constants.apps.maxQuestions + 1) console.log('Done');
  // }, [indexQuestion]);

  return (
    <>
      <div className="md:max-w-[80%] w-[100%] lg:max-w-[60%] m-auto items-center justify-center flex flex-col">
        <MyHead title="Happy Quizy - Quiz" />
        {questionQuery.isError && (
          <p className="text-2xl text-red-500">Error fetching type question</p>
        )}
        {questionQuery.isLoading && <Loading size="small" />}
        <div className="flex justify-center items-center w-full gap-5">
          {questionQuery.isSuccess && questionQuery.data?.success && (
            <>
              <div className="w-12 h-12 col-span-1">
                <Image
                  src={
                    (questionQuery.data.data as TypeQuestionModel)?.photo ??
                    '/assets/images/no_image_available.png'
                  }
                  alt={(questionQuery.data.data as TypeQuestionModel)?.type}
                  className="w-full h-full rounded-full shadow-md"
                  priority
                  object-fit="contain"
                  width={50}
                  height={50}
                />
              </div>
              <p className="font-bold text-green-500 text-2xl">
                {(questionQuery.data.data as TypeQuestionModel)?.type}
              </p>
            </>
          )}
        </div>
        <div className="flex items-center w-full p-5 justify-between">
          <div className="flex items-center gap-3">
            <p className="text-white font-semibold">Total Time: </p>
            <p
              className={`${
                total > 0 && total < 60000 ? 'text-red-500' : 'text-white'
              } font-bold`}
            >
              {timer}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <p className="text-white font-semibold">Question Time: </p>
            <p
              className={`${
                totalEachQuestion > 0 && totalEachQuestion < 10000
                  ? 'text-red-500'
                  : 'text-white'
              } font-bold`}
            >
              {questionTimer}
            </p>
          </div>
        </div>
        <hr className="w-full border-t-1 border-gray-400" />
        <div className="p-5 w-full mt-1">
          <p className="text-white">
            <span className="font-semibold">{indexQuestion}. </span>
            {question?.content}
          </p>
        </div>
        <div className="flex flex-col pl-10">
          {question?.answerQuestions.map((answer, aindex) => (
            <div
              key={`${answer.id}-${aindex}`}
              className={`${
                answer.id === answerQuestion?.id
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-600 text-white hover:bg-gray-700'
              } grid grid-cols-4 mt-2 mb-2 p-2 font-medium text-xs leading-tight rounded shadow-md hover:shadow-lg focus:bg-gray-700 focus:shadow-lg focus:outline-none focus:ring-0 transition duration-150 ease-in-out cursor-pointer gap-3`}
              onClick={() => {
                setAnswerQuestion(answer);
              }}
            >
              <h1 className="h-full flex items-center justify-center">
                {aindex + 1}.
              </h1>
              {answer.answer.includes('/') ? (
                <div className="flex flex-col gap-1 col-span-2">
                  {answer.answer.split('/').map((ansSplit, ansIndex) => (
                    <p key={`answer_split_${ansIndex}`} className="break-words">
                      {ansSplit}
                    </p>
                  ))}
                </div>
              ) : (
                <p className="break-words col-span-2">{answer.answer}</p>
              )}
            </div>
          ))}
        </div>
        <div className="mt-5 md:w-full w-[100%] flex justify-center items-center">
          <PrimaryButton text="Next" type="button" onClick={nextQuestion} />
        </div>
      </div>
      <Modal
        child={
          <div className="h-full p-5">
            <div className="h-[70%] md:h-[80%] flex items-center p-3">
              <div className="text-lg text-gray-100 font-thin">
                <li>
                  You have <b className="text-yellow-500">20</b> mins to
                  complete the <b className="text-yellow-500">20</b> questions.
                </li>
                <li>
                  You have <b className="text-yellow-500">1</b> min for each
                  question.
                </li>
              </div>
            </div>

            <div className="flex gap-5 px-4 flex-col md:flex-row">
              <DangerButton
                text="No, Not yet"
                type="button"
                onClick={() => {
                  router.back();
                  // setStartModal(false);
                }}
                // isLoading={mutationDelete.isLoading}
              />
              <PrimaryButton
                text="Start The Quiz"
                type="button"
                onClick={() => {
                  const questions = questionQuery.data
                    ?.data as TypeQuestionModel;

                  getQuestionRandomly(questions.questions);
                  setStartModal(false);
                  if (intervalRefEachQuestion.current)
                    clearInterval(intervalRefEachQuestion.current);
                  clearTimerEacherQuestion(
                    getDeadLineTimer({ mins: 1 }),
                    defualtTimeDisplayEachQuestion
                  );
                  if (intervalRef.current) clearInterval(intervalRef.current);
                  clearTimer(
                    getDeadLineTimer({ mins: 20 }),
                    defualtTimeDisplay
                  );
                }}
                isLoading={questionQuery.isLoading}
              />
            </div>
          </div>
        }
        onClose={() => setStartModal(false)}
        visible={startModal}
        width="auto"
        height="auto"
        backgroundColor="bg-gray-500"
        notCloseOutsideClick={true}
      />

      <Modal
        child={
          <div className="h-full p-5">
            <div className="h-[70%] md:h-[80%] flex items-center p-3">
              <GifDoneQuiz score={totalScore} />
            </div>

            <div className="flex flex-col items-center justify-center p-3">
              <Score score={totalScore} />
              <p className="mt-5 text-xl font-semibold">
                Quiz completed successfully.
              </p>
              <br />
              <p className="font-semibold text-xl">
                You attempt{' '}
                <span className="text-green-500">
                  {indexQuestion} questions
                </span>{' '}
                and
              </p>
              <p className="font-semibold text-xl mb-3">
                from that{' '}
                <span className="text-green-300">
                  {totalCorrectAnswers} answers
                </span>{' '}
                is correct.
              </p>
            </div>

            <div className="flex items-center justify-center">
              <PrimaryButton
                text="Done"
                type="button"
                onClick={() => router.back()}
              />
            </div>
          </div>
        }
        onClose={() => setDoneModal(false)}
        visible={doneModal}
        width="auto"
        height="auto"
        backgroundColor="bg-gray-500"
        notCloseOutsideClick={true}
      />
    </>
  );
};

export default Quiz;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const data = await fetcher<BaseResponse<object>>(`/api/v1/user`, {
    cookie: context.req.headers.cookie,
  });
  if (!data?.success) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }
  return {
    props: { userData: data, headers: context.req.cookies },
  };
};
