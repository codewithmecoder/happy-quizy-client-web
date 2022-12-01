import { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import { useRef, useState } from 'react';
import DangerButton from '../../components/DangerButton';
import Modal from '../../components/Modal';
import MyHead from '../../components/MyHead';
import PrimaryButton from '../../components/PrimaryButton';
import useTimer from '../../hooks/useTimer';
import useUnload from '../../hooks/useUnload';
import { BaseResponse } from '../../models/baseResponse.model';
import fetcher from '../../utils/fetcher';
import { getDeadLineTimer } from '../../utils/getDeadlineTimer';

const Quiz: NextPage<{
  headers: Partial<{
    [key: string]: string;
  }>;
}> = () => {
  const router = useRouter();
  const [startModal, setStartModal] = useState(true);
  const { id } = router.query;
  const intervalRef = useRef<NodeJS.Timer | null>(null);
  const intervalRefEachQuestion = useRef<NodeJS.Timer | null>(null);
  const [questionTimer, setQuestionTimer] = useState('00:00:00');
  const [timer, setTimer] = useState('00:00:00');
  const defualtTimeDisplayEachQuestion = '00:00:20';
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

  // useEffect(() => {
  //   router.beforePopState(((e: any) => {
  //     console.log(e);
  //     e.as = '/quiz/' + id;
  //     e.url = '/quiz/' + id;
  //   }) as any);
  // }, []);

  return (
    <>
      <div className="md:max-w-[80%] w-[100%] lg:max-w-[60%] m-auto items-center justify-center flex flex-col">
        <MyHead title="Happy Quizy - Quiz" />
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
                  setStartModal(false);
                  if (intervalRefEachQuestion.current)
                    clearInterval(intervalRefEachQuestion.current);
                  clearTimerEacherQuestion(
                    getDeadLineTimer({ seconds: 20 }),
                    defualtTimeDisplayEachQuestion
                  );
                  if (intervalRef.current) clearInterval(intervalRef.current);
                  clearTimer(
                    getDeadLineTimer({ mins: 20 }),
                    defualtTimeDisplay
                  );
                }}
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
