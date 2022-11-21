import { useQuery } from '@tanstack/react-query';
import { GetServerSideProps, NextPage } from 'next';
import MyHead from '../components/MyHead';
import TypeQuestion from '../components/TypeQuestion';
import { BaseResponse } from '../models/baseResponse.model';
import { fetchOnlyTypeQuestions } from '../services/typeQuestion.service';
import { Constants } from '../utils/constants';
import fetcher from '../utils/fetcher';

const Home: NextPage<{
  headers: Partial<{
    [key: string]: string;
  }>;
}> = ({ headers }) => {
  const { data, isError, isLoading, isSuccess } = useQuery(
    [Constants.queries.typeQuestion],
    async () => await fetchOnlyTypeQuestions(headers)
  );
  return (
    <div className="md:max-w-[80%] w-[100%] lg:max-w-[60%] m-auto">
      <MyHead title="Happy Quizy Admin" />
      <div className="p-5 flex items-center justify-center">
        <p className="font-thin text-gray-200 text-lg">
          Choose your favorite category to{' '}
          <span className="text-green-500 font-bold tracking-[3px]">PLAY</span>
        </p>
      </div>
      <TypeQuestion
        data={data}
        isError={isError}
        isLoading={isLoading}
        isSuccess={isSuccess}
      />
    </div>
  );
};

export default Home;

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
