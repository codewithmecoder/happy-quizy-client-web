import { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import { useState } from 'react';
import DangerButton from '../../components/DangerButton';
import Modal from '../../components/Modal';
import MyHead from '../../components/MyHead';
import PrimaryButton from '../../components/PrimaryButton';
import { BaseResponse } from '../../models/baseResponse.model';
import fetcher from '../../utils/fetcher';

const Quiz: NextPage<{
  headers: Partial<{
    [key: string]: string;
  }>;
}> = () => {
  const router = useRouter();
  const [startModal, setStartModal] = useState(true);
  const { id } = router.query;
  return (
    <>
      <div className="md:max-w-[80%] w-[100%] lg:max-w-[60%] m-auto items-center justify-center flex flex-col">
        <MyHead title="Happy Quizy - Quiz" />
        <div>
          Quiz {`=>`} {id}
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
                onClick={() => setStartModal(false)}
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
